(function(){
  "use strict";
  const STORE_KEY = "sourdoughPlannerV3";
  const minute = 60000;
  const now = new Date();
  const today = now.toISOString().slice(0,10);
  const toLocalTime = d => d.toTimeString().slice(0,5);
  const clamp = (n,min,max) => Math.max(min,Math.min(max,n));
  const CALC = window.SourdoughCalculations;
  const RECIPES = window.SOURDOUGH_RECIPES;
  const STARTER = window.SOURDOUGH_STARTER;
  let state = loadState();
  function defaultState(){return {recipeId:"pain",variationId:"classic",yieldCount:2,startDate:today,startTime:"08:00",scheduleMode:"start",temps:{room:21,flour:21,pref:23,friction:3},waterOverrides:{pain:370},done:{},adjustments:{}}}
  function loadState(){
    try{
      const defaults=defaultState();
      const saved=JSON.parse(localStorage.getItem(STORE_KEY)||"{}");
      return Object.assign(defaults,saved,{temps:Object.assign(defaults.temps,saved.temps||{}),waterOverrides:Object.assign(defaults.waterOverrides,saved.waterOverrides||{}),done:saved.done||{},adjustments:saved.adjustments||{}});
    }catch(e){return defaultState()}
  }
  function saveState(){localStorage.setItem(STORE_KEY,JSON.stringify(state))}
  function recipe(){return RECIPES.find(r=>r.id===state.recipeId)||RECIPES[0]}
  function variation(){const r=recipe();return (r.variations||[]).find(v=>v.id===state.variationId)||r.variations[0]}
  function multiplier(){return Math.max(1,Number(state.yieldCount)||1)/recipe().baseYield}
  function scaleAmount(amount){return CALC.scaleAmount(amount,state.yieldCount,recipe().baseYield)}
  function fmtNumber(n){if(!isFinite(n)) return "0"; if(Math.abs(n)>=20) return String(Math.round(n)); if(Math.abs(n)>=2) return String(Math.round(n*10)/10).replace(/\.0$/,""); return String(Math.round(n*100)/100).replace(/\.0+$/,"")}
  function fmtIngredient(item){let amount=item.controlled?effectiveWaterBase():item.amount; if(item.name==="Water" && item.controlled && variation().waterOffset) amount+=variation().waterOffset; const scaled=scaleAmount(amount); if(item.unit==="g" && item.kind==="water") return fmtNumber(scaled)+" g / ml"; return fmtNumber(scaled)+" "+item.unit}
  function effectiveWaterBase(){const r=recipe(); return state.waterOverrides[r.id] ?? r.waterControl?.current ?? r.waterControl?.original ?? 0}
  function setEffectiveWaterBase(v){const r=recipe(); if(!r.waterControl) return; state.waterOverrides[r.id]=clamp(Number(v)||r.waterControl.current,r.waterControl.min,r.waterControl.max); saveState(); render()}
  function showToast(msg){const t=document.getElementById("toast");t.querySelector("span").textContent=msg;t.style.display="flex";clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>{t.style.display="none"},1700)}
  function byId(id){return document.getElementById(id)}
  function render(){
    const r=recipe();
    if(!r.variations.some(v=>v.id===state.variationId)) state.variationId=r.variations[0].id;
    renderHero(); renderNav(); renderPicker(); renderControls(); renderCalc(); renderWaterControl(); renderRecipe(); renderTimeline(); renderStarter(); saveState();
  }
  function renderHero(){
    const r=recipe(), m=multiplier(), v=variation();
    byId("heroStats").innerHTML = [
      [fmtNumber(state.yieldCount)+" "+r.yieldUnit,"Batch yield"],
      [r.ddtC+"\u00B0C","Target dough"],
      [v.name,"Variation"]
    ].map(s=>`<div class="stat"><b>${s[0]}</b><span>${s[1]}</span></div>`).join("");
  }
  function renderNav(){
    document.querySelectorAll(".nav button").forEach(btn=>{
      btn.onclick=()=>document.getElementById(btn.dataset.nav).scrollIntoView({behavior:"smooth",block:"start"});
      btn.classList.toggle("active",false);
    });
  }
  function renderPicker(){
    byId("recipePicker").innerHTML=RECIPES.map(r=>`<button class="recipe-button ${r.id===state.recipeId?"active":""}" data-recipe="${r.id}"><b>${r.name}</b><span>${r.short}</span><div class="pill-row"><span class="pill">${r.baseYield} ${r.yieldUnit}</span><span class="pill">${r.ddtC}\u00B0C</span></div></button>`).join("");
    document.querySelectorAll("[data-recipe]").forEach(b=>b.onclick=()=>{state.recipeId=b.dataset.recipe;state.variationId=recipe().variations[0].id;state.yieldCount=recipe().baseYield;state.done={};saveState();render()});
  }
  function renderControls(){
    byId("yieldInput").value=state.yieldCount;
    byId("yieldInput").oninput=e=>{state.yieldCount=Math.max(1,parseInt(e.target.value||"1",10));saveState();render()};
    byId("variationSelect").innerHTML=recipe().variations.map(v=>`<option value="${v.id}">${v.name}</option>`).join("");
    byId("variationSelect").value=state.variationId;
    byId("variationSelect").onchange=e=>{state.variationId=e.target.value;saveState();render()};
    byId("startDate").value=state.startDate;
    byId("startDate").onchange=e=>{state.startDate=e.target.value;saveState();render()};
    byId("startTime").value=state.startTime;
    byId("startTime").onchange=e=>{state.startTime=e.target.value;saveState();render()};
    byId("scheduleMode").value=state.scheduleMode;
    byId("scheduleMode").onchange=e=>{state.scheduleMode=e.target.value;saveState();render()};
  }
  function renderCalc(){
    const r=recipe();
    const t=state.temps;
    byId("roomTemp").value=t.room; byId("flourTemp").value=t.flour; byId("prefTemp").value=t.pref; byId("frictionTemp").value=t.friction;
    [["roomTemp","room"],["flourTemp","flour"],["prefTemp","pref"]].forEach(pair=>{byId(pair[0]).oninput=e=>{state.temps[pair[1]]=Number(e.target.value)||0;saveState();renderCalcOnly()}});
    byId("frictionTemp").onchange=e=>{state.temps.friction=Number(e.target.value)||0;saveState();renderCalcOnly()};
    byId("calcPills").innerHTML=`<span class="pill">Target ${r.ddtC}\u00B0C</span><span class="pill">Celsius only</span><span class="pill">Factor 4 with preferment</span>`;
    renderCalcOnly();
  }
  function renderCalcOnly(){
    const r=recipe(), t=state.temps;
    const strike=CALC.strikeWaterTemp({target:r.ddtC,room:t.room,flour:t.flour,preferment:t.pref,friction:t.friction,hasPreferment:true});
    byId("strikeTemp").textContent=strike.toFixed(1)+"\u00B0C";
    let note="Formula: target dough temperature x 4, minus room, flour, preferment, and friction temperatures.";
    if(strike<4) note="Very cold water is required. Use chilled water and consider lowering friction from mixing.";
    if(strike>45) note="Warm strike water is required. Recheck temperatures because this is higher than usual for sourdough.";
    byId("strikeNote").textContent=note;
  }
  function renderWaterControl(){
    const r=recipe(), box=byId("waterControl");
    if(!r.waterControl){box.style.display="none";return}
    box.style.display="block";
    const base=effectiveWaterBase();
    const v=variation();
    const adjusted=base+(v.waterOffset||0);
    box.innerHTML=`
      <h3>Final dough water</h3>
      <p class="muted">Base formula water for ${r.baseYield} ${r.yieldUnit}. Your current default is lower than the source formula.</p>
      <div class="big-water">${fmtNumber(scaleAmount(adjusted))} g / ml</div>
      <p class="muted">Base setting ${fmtNumber(base)} g${v.waterOffset?`, variation adjustment ${v.waterOffset} g`:""}. Source value ${r.waterControl.original} g.</p>
      <div class="range-row"><input id="waterRange" type="range" min="${r.waterControl.min}" max="${r.waterControl.max}" step="${r.waterControl.step}" value="${base}"><input class="input" id="waterNumber" type="number" inputmode="numeric" value="${base}"></div>
      <div class="note-box">${r.waterControl.note}</div>`;
    byId("waterRange").oninput=e=>setEffectiveWaterBase(e.target.value);
    byId("waterNumber").oninput=e=>setEffectiveWaterBase(e.target.value);
  }
  function totals(){
    let water=0, flour=0, salt=0;
    const v=variation();
    recipe().stages.forEach(stage=>stage.ingredients.forEach(item=>{
      let amount=item.controlled?effectiveWaterBase():item.amount;
      if(item.controlled && v.waterOffset) amount+=v.waterOffset;
      const scaled=scaleAmount(amount);
      if(item.kind==="water") water+=scaled;
      if(item.kind==="flour") flour+=scaled;
      if(item.kind==="salt") salt+=scaled;
      if(item.kind==="starter"){water+=scaled/2;flour+=scaled/2}
    }));
    const total=CALC.finalDoughWeight(recipe(),state.yieldCount,effectiveWaterBase(),v);
    return {water,flour,salt,total,hydration: flour?water/flour*100:0, saltPct:flour?salt/flour*100:0};
  }
  function renderRecipe(){
    const r=recipe(), v=variation(), tot=totals();
    byId("recipeTitle").textContent=r.name;
    byId("recipeDescription").textContent=r.description;
    byId("recipePills").innerHTML=`<span class="pill">${fmtNumber(state.yieldCount)} ${r.yieldUnit}</span><span class="pill">DDT ${r.ddtC}\u00B0C</span><span class="pill">Approx hydration ${fmtNumber(tot.hydration)}%</span>`;
    byId("formulaSummary").innerHTML=[
      [fmtNumber(tot.water)+" g/ml","Total water"],
      [fmtNumber(tot.flour)+" g","Total flour"],
      [fmtNumber(tot.hydration)+"%","Hydration"],
      [fmtNumber(tot.total)+" g","Approx dough"]
    ].map(x=>`<div class="summary-box"><b>${x[0]}</b><span>${x[1]}</span></div>`).join("");
    byId("ingredients").innerHTML=r.stages.map(stage=>`<div class="stage"><h3>${stage.name}</h3>${stage.ingredients.map(item=>`<div class="ingredient"><span>${item.name}</span><span class="amount">${fmtIngredient(item)}</span></div>`).join("")}</div>`).join("");
    const notes=[];
    if(v.note) notes.push(v.note);
    if(v.addins && v.addins.length){notes.push("Add-ins: "+v.addins.map(i=>`${i.name}: ${fmtNumber(scaleAmount(i.amount))} ${i.unit}`).join("; "));}
    byId("variationNote").style.display=notes.length?"block":"none";
    byId("variationNote").innerHTML=notes.join("<br>");
  }
  function baseStartDate(){
    const r=recipe();
    const chosen=new Date(state.startDate+"T"+state.startTime);
    const bakeStep=r.steps.find(step=>step.title.toLowerCase().startsWith("bake"));
    if(state.scheduleMode==="bake" && bakeStep) return new Date(chosen.getTime()-bakeStep.offset*minute);
    return chosen;
  }
  function timeline(){
    const s=baseStartDate();
    const changes=state.adjustments[stepKey()]||{};
    let cumulative=0;
    return recipe().steps.map((step,i)=>{
      const id=recipe().id+":"+i;
      cumulative+=Number(changes[id]||0);
      return Object.assign({},step,{id,at:new Date(s.getTime()+(step.offset+cumulative)*minute)});
    });
  }
  function stepKey(){return recipe().id+":"+variation().id+":"+state.yieldCount+":"+state.startDate+":"+state.startTime+":"+state.scheduleMode}
  function doneSet(){return new Set(state.done[stepKey()]||[])}
  function renderTimeline(){
    const steps=timeline(), done=doneSet(), nowTime=Date.now();
    const completed=steps.filter(s=>done.has(s.id)).length;
    const progress=Math.round(completed/steps.length*100);
    byId("progressLabel").textContent=progress+"% complete";
    byId("progressFill").style.width=progress+"%";
    const next=steps.find(s=>!done.has(s.id));
    byId("nextStepLabel").textContent=next?"Next: "+next.title:"Batch complete";
    byId("timelineList").innerHTML=steps.map((s,index)=>{
      const late=s.at.getHours()>=21 || s.at.getHours()<5;
      const past=s.at.getTime()<nowTime && !done.has(s.id);
      const cls=done.has(s.id)?"step done":"step";
      const next=steps[index+1];
      const gap=next?Math.round((next.at-s.at)/minute):null;
      const duration=gap===null?"Final step":gap===0?"Starts with the next step":gap>=60?`${fmtNumber(gap/60)} hr until next step`:`${gap} min until next step`;
      return `<div class="${cls}"><div class="time-block"><b>${toLocalTime(s.at)}</b><span>${s.at.toLocaleDateString([], {weekday:"short",day:"numeric",month:"short"})}</span></div><div class="step-main"><h3>${s.title}</h3><p>${s.detail}</p><div class="step-adjust"><span class="pill">${duration}</span><label>Adjust start <input type="datetime-local" data-adjust="${s.id}" value="${dateTimeLocalValue(s.at)}"></label></div>${late?'<span class="late">Late or overnight step</span>':""}${past?'<span class="late">Scheduled time has passed</span>':""}</div><button class="check" data-check="${s.id}" aria-label="Mark ${s.title} complete">&#10003;</button></div>`
    }).join("");
    document.querySelectorAll("[data-check]").forEach(btn=>btn.onclick=()=>toggleDone(btn.dataset.check));
    document.querySelectorAll("[data-adjust]").forEach(input=>input.onchange=()=>adjustStep(input.dataset.adjust,input.value));
  }
  function dateTimeLocalValue(date){
    const pad=value=>String(value).padStart(2,"0");
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
  function adjustStep(id,value){
    const current=timeline().find(step=>step.id===id);
    const desired=new Date(value);
    if(!current || Number.isNaN(desired.getTime())) return;
    const delta=Math.round((desired.getTime()-current.at.getTime())/minute);
    const key=stepKey();
    state.adjustments[key]=state.adjustments[key]||{};
    state.adjustments[key][id]=Number(state.adjustments[key][id]||0)+delta;
    saveState(); renderTimeline(); showToast("Step and later times shifted");
  }
  function toggleDone(id){const key=stepKey(); const arr=state.done[key]||[]; state.done[key]=arr.includes(id)?arr.filter(x=>x!==id):arr.concat(id); saveState(); renderTimeline();}
  function renderStarter(){
    byId("starterCards").innerHTML=STARTER.map(card=>`<div class="card recipe-detail"><div class="recipe-header"><div><h2>${card.title}</h2><p>${card.detail}</p></div></div><div class="ingredients"><div class="stage"><h3>Ingredients</h3>${card.items.map(x=>`<div class="ingredient"><span>${x}</span><span class="amount"></span></div>`).join("")}</div></div></div>`).join("");
  }
  function copyIngredients(){
    const r=recipe(), v=variation(), tot=totals();
    let lines=[r.name,`Yield: ${fmtNumber(state.yieldCount)} ${r.yieldUnit}`,`Target dough temperature: ${r.ddtC}\u00B0C`,`Approx hydration: ${fmtNumber(tot.hydration)}%`,""];
    r.stages.forEach(stage=>{lines.push(stage.name);stage.ingredients.forEach(item=>lines.push("- "+item.name+": "+fmtIngredient(item)));lines.push("")});
    if(v.addins){lines.push("Add-ins");v.addins.forEach(i=>lines.push("- "+i.name+": "+fmtNumber(scaleAmount(i.amount))+" "+i.unit));lines.push("")}
    if(v.note) lines.push("Note: "+v.note);
    const text=lines.join("\n");
    if(navigator.clipboard && location.protocol!=="file:") navigator.clipboard.writeText(text).then(()=>showToast("Ingredients copied"));
    else {const ta=document.createElement("textarea");ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove();showToast("Ingredients copied")}
  }
  byId("copyIngredients").onclick=copyIngredients;
  byId("resetTimes").onclick=()=>{delete state.adjustments[stepKey()];saveState();renderTimeline();showToast("Schedule times reset")};
  byId("resetChecks").onclick=()=>{delete state.done[stepKey()];saveState();renderTimeline();showToast("Checks reset")};
  if("serviceWorker" in navigator && location.protocol!=="file:") window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js"));
  render();
})();
