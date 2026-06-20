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
  function defaultState(){return {recipeId:"pain",variationId:"classic",yieldCount:2,startDate:today,startTime:"08:00",scheduleMode:"start",temps:{room:21,flour:21,pref:23,friction:3},waterOverrides:{pain:370},actualTimes:{}}}
  function loadState(){
    try{
      const defaults=defaultState();
      const saved=JSON.parse(localStorage.getItem(STORE_KEY)||"{}");
      return Object.assign(defaults,saved,{temps:Object.assign(defaults.temps,saved.temps||{}),waterOverrides:Object.assign(defaults.waterOverrides,saved.waterOverrides||{}),actualTimes:saved.actualTimes||{}});
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
    document.querySelectorAll("[data-recipe]").forEach(b=>b.onclick=()=>{state.recipeId=b.dataset.recipe;state.variationId=recipe().variations[0].id;state.yieldCount=recipe().baseYield;saveState();render()});
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
    byId("calcPills").innerHTML=`<span class="pill">Target ${r.ddtC}\u00B0C</span>`;
    renderCalcOnly();
  }
  function renderCalcOnly(){
    const r=recipe(), t=state.temps;
    const strike=CALC.strikeWaterTemp({target:r.ddtC,room:t.room,flour:t.flour,preferment:t.pref,friction:t.friction,hasPreferment:true});
    byId("strikeTemp").textContent=strike.toFixed(1)+"\u00B0C";
    let note="Check the dough temperature after mixing.";
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
      <div class="big-water">${fmtNumber(scaleAmount(adjusted))} g / ml</div>
      <p class="muted">Base ${fmtNumber(base)} g${v.waterOffset?`, variation ${v.waterOffset} g`:""}. Source ${r.waterControl.original} g.</p>
      <div class="range-row"><input id="waterRange" type="range" min="${r.waterControl.min}" max="${r.waterControl.max}" step="${r.waterControl.step}" value="${base}"><input class="input" id="waterNumber" type="number" inputmode="numeric" value="${base}"></div>
      `;
    byId("waterRange").oninput=e=>setEffectiveWaterBase(e.target.value);
    byId("waterNumber").oninput=e=>setEffectiveWaterBase(e.target.value);
  }
  function renderRecipe(){
    const r=recipe(), v=variation();
    byId("recipeTitle").textContent=r.name;
    byId("recipeDescription").textContent=r.description;
    byId("ingredients").innerHTML=r.stages.map(stage=>`<div class="stage"><h3>${stage.name==="Final dough"?"Loaf dough":stage.name}</h3>${stage.ingredients.map(item=>`<div class="ingredient"><span>${item.name}</span><span class="amount">${fmtIngredient(item)}</span></div>`).join("")}</div>`).join("");
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
  function timeline(){const s=baseStartDate();return recipe().steps.map((step,i)=>Object.assign({},step,{id:recipe().id+":"+i,at:new Date(s.getTime()+step.offset*minute)}))}
  function stepKey(){return recipe().id+":"+variation().id+":"+state.yieldCount+":"+state.startDate+":"+state.startTime+":"+state.scheduleMode}
  function batchTimes(){return state.actualTimes[stepKey()]||{}}
  function renderTimeline(){
    const steps=timeline(), times=batchTimes();
    const completed=steps.filter(step=>times[step.id]?.finish).length;
    const progress=Math.round(completed/steps.length*100);
    byId("progressLabel").textContent=progress+"% complete";
    byId("progressFill").style.width=progress+"%";
    const next=steps.find(step=>!times[step.id]?.finish);
    byId("nextStepLabel").textContent=next?(times[next.id]?.start?"In progress: ":"Next: ")+next.title:"Batch complete";
    byId("timelineList").innerHTML=steps.map((s,index)=>{
      const late=s.at.getHours()>=21 || s.at.getHours()<5;
      const actual=times[s.id]||{};
      const cls=actual.finish?"step done":actual.start?"step active":"step";
      const next=steps[index+1];
      const gap=next?Math.round((next.at-s.at)/minute):null;
      const planned=gap===null?"Final process":gap===0?"Same planned start":gap>=60?`${fmtNumber(gap/60)} hr planned`:`${gap} min planned`;
      const elapsed=elapsedLabel(actual.start,actual.finish);
      return `<div class="${cls}"><div class="time-block"><span>Plan</span><b>${toLocalTime(s.at)}</b><span>${s.at.toLocaleDateString([], {weekday:"short",day:"numeric",month:"short"})}</span></div><div class="step-main"><div class="step-title-row"><h3>${s.title}</h3>${elapsed?`<span class="elapsed">${elapsed}</span>`:""}</div><p>${s.detail}</p><div class="actual-time-grid"><label><span>Started</span><div class="time-entry"><input type="datetime-local" data-actual="start" data-step="${s.id}" value="${actual.start||""}"><button type="button" data-now="start" data-step="${s.id}">Now</button></div></label><label><span>Finished</span><div class="time-entry"><input type="datetime-local" data-actual="finish" data-step="${s.id}" value="${actual.finish||""}"><button type="button" data-now="finish" data-step="${s.id}">Now</button></div></label></div><div class="step-meta"><span>${planned}</span>${late?'<span class="late">Overnight plan</span>':""}</div></div><div class="step-status" aria-label="${actual.finish?"Finished":actual.start?"In progress":"Not started"}">${actual.finish?"&#10003;":actual.start?"...":""}</div></div>`
    }).join("");
    document.querySelectorAll("[data-actual]").forEach(input=>input.onchange=()=>setActualTime(input.dataset.step,input.dataset.actual,input.value));
    document.querySelectorAll("[data-now]").forEach(button=>button.onclick=()=>setActualTime(button.dataset.step,button.dataset.now,dateTimeLocalValue(new Date())));
  }
  function dateTimeLocalValue(date){
    const pad=value=>String(value).padStart(2,"0");
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
  function elapsedLabel(start,finish){
    if(!start||!finish) return "";
    const minutes=Math.round((new Date(finish)-new Date(start))/minute);
    if(minutes<0) return "Check times";
    if(minutes<60) return `${minutes} min`;
    const hours=Math.floor(minutes/60), remainder=minutes%60;
    return remainder?`${hours} hr ${remainder} min`:`${hours} hr`;
  }
  function setActualTime(id,field,value){
    const key=stepKey();
    state.actualTimes[key]=state.actualTimes[key]||{};
    state.actualTimes[key][id]=state.actualTimes[key][id]||{};
    const record=state.actualTimes[key][id];
    if(field==="finish"&&value&&record.start&&new Date(value)<new Date(record.start)){showToast("Finish must be after start");renderTimeline();return}
    record[field]=value;
    if(!value) delete record[field];
    if(field==="finish"&&value){
      const steps=timeline();
      const index=steps.findIndex(step=>step.id===id);
      const next=steps[index+1];
      if(next){
        state.actualTimes[key][next.id]=state.actualTimes[key][next.id]||{};
        if(!state.actualTimes[key][next.id].start) state.actualTimes[key][next.id].start=value;
      }
    }
    saveState();renderTimeline();
  }
  function renderStarter(){
    byId("starterCards").innerHTML=STARTER.map(card=>`<div class="card recipe-detail"><div class="recipe-header"><div><h2>${card.title}</h2><p>${card.detail}</p></div></div><div class="ingredients"><div class="stage"><h3>Ingredients</h3>${card.items.map(x=>`<div class="ingredient"><span>${x}</span><span class="amount"></span></div>`).join("")}</div></div></div>`).join("");
  }
  function copyIngredients(){
    const r=recipe(), v=variation();
    let lines=[r.name,`Yield: ${fmtNumber(state.yieldCount)} ${r.yieldUnit}`,""];
    r.stages.forEach(stage=>{lines.push(stage.name==="Final dough"?"Loaf dough":stage.name);stage.ingredients.forEach(item=>lines.push("- "+item.name+": "+fmtIngredient(item)));lines.push("")});
    if(v.addins){lines.push("Add-ins");v.addins.forEach(i=>lines.push("- "+i.name+": "+fmtNumber(scaleAmount(i.amount))+" "+i.unit));lines.push("")}
    if(v.note) lines.push("Note: "+v.note);
    const text=lines.join("\n");
    if(navigator.clipboard && location.protocol!=="file:") navigator.clipboard.writeText(text).then(()=>showToast("Ingredients copied"));
    else {const ta=document.createElement("textarea");ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove();showToast("Ingredients copied")}
  }
  byId("copyIngredients").onclick=copyIngredients;
  byId("clearTimes").onclick=()=>{delete state.actualTimes[stepKey()];saveState();renderTimeline();showToast("Times cleared")};
  if("serviceWorker" in navigator && location.protocol!=="file:") window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js"));
  render();
})();
