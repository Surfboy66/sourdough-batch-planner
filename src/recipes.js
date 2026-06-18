'use strict';
window.SOURDOUGH_RECIPES = [
    {
      id:"pain",
      name:"Pain au Levain",
      short:"Classic wheat sourdough",
      description:"Two large loaves with levain, autolyse, folds, final proof, and hot steamed bake. This app uses your adjusted final dough water by default.",
      baseYield:2,
      yieldUnit:"loaves",
      ddtC:25.6,
      baseBakeOffset:1110,
      waterControl:{stage:"Final dough", ingredient:"Water", original:400, current:370, min:320, max:430, step:1, note:"The source formula lists 400 g water. This app defaults to 370 g/ml because that is the amount you now prefer for this dough."},
      variations:[
        {id:"classic",name:"Classic",note:"Standard Pain au Levain."},
        {id:"olive",name:"Olive",note:"Exchange whole-wheat flour with whole rye flour. Add olives once the dough is developed. The olive version may be better divided into three loaves because the add-in increases dough yield.",addins:[{name:"Kalamata or mixed olives, roughly chopped",amount:400,unit:"g"}]},
        {id:"rosemary",name:"Rosemary",note:"Replace whole-wheat flour with white flour. Chop rosemary shortly before adding it at the beginning of kneading.",addins:[{name:"Fresh rosemary, chopped",amount:28,unit:"g"}]},
        {id:"onion",name:"Roasted onion",note:"Keep the whole-wheat flour. Hold back about 28 g water because the onions add hydration. Add onions near the end of kneading.",waterOffset:-28,addins:[{name:"Caramelised onions, cooked weight",amount:226,unit:"g"},{name:"Raw onions before cooking, approximate",amount:283,unit:"g"}]}
      ],
      stages:[
        {name:"Levain",ingredients:[{name:"Water",amount:227,unit:"g",kind:"water"},{name:"Liquid sourdough starter",amount:45,unit:"g",kind:"starter"},{name:"Bread flour",amount:227,unit:"g",kind:"flour"}]},
        {name:"Final dough",ingredients:[{name:"Water",amount:370,unit:"g",kind:"water",controlled:true},{name:"Bread flour",amount:457,unit:"g",kind:"flour"},{name:"Whole-wheat flour",amount:228,unit:"g",kind:"flour"},{name:"Levain",amount:454,unit:"g",kind:"preferment"},{name:"Salt",amount:17,unit:"g",kind:"salt"}]}
      ],
      steps:[
        {title:"Build levain",offset:0,detail:"Mix water, starter, and bread flour. Ferment about 8 hours at 24\u00B0C."},
        {title:"Autolyse",offset:480,detail:"Reserve 45 g levain. Mix the remaining levain with final water and flours. Hold back salt. Rest 20 to 30 minutes."},
        {title:"Final mix",offset:510,detail:"Add salt and mix by hand or mixer until incorporated and developed."},
        {title:"Bulk fermentation",offset:525,detail:"Cover and ferment for about 2.5 hours."},
        {title:"Fold 1",offset:570,detail:"First fold, about 45 minutes into bulk."},
        {title:"Fold 2",offset:615,detail:"Second fold. Add variation ingredients here if using them."},
        {title:"Divide and preshape",offset:660,detail:"Divide and preshape. Rest about 20 minutes."},
        {title:"Final shape",offset:680,detail:"Shape as boules or batards and place seam-side up in floured baskets."},
        {title:"Final proof",offset:690,detail:"Proof about 2 hours at room temperature, or retard after visible activity."},
        {title:"Bake",offset:810,detail:"Bake in a steamed 232\u00B0C oven for about 40 minutes."}
      ]
    },
    {
      id:"rye",
      name:"Rye Formula",
      short:"High rye, two 750 g loaves",
      description:"Dense high-rye bread using a rye sour, short bulk fermentation, and batard proof.",
      baseYield:2,
      yieldUnit:"loaves",
      ddtC:27.8,
      baseBakeOffset:900,
      variations:[{id:"classic",name:"Classic rye",note:"Standard rye formula."},{id:"caraway",name:"Caraway",note:"Add caraway to taste during final mixing.",addins:[{name:"Caraway seeds",amount:2,unit:"tbsp"}]}],
      stages:[
        {name:"Rye sour",ingredients:[{name:"Water",amount:182,unit:"g",kind:"water"},{name:"Liquid sourdough starter",amount:14,unit:"g",kind:"starter"},{name:"Whole rye flour",amount:225,unit:"g",kind:"flour"}]},
        {name:"Final dough",ingredients:[{name:"Whole rye flour",amount:340,unit:"g",kind:"flour"},{name:"High-gluten flour",amount:280,unit:"g",kind:"flour"},{name:"Instant active yeast",amount:3,unit:"g",kind:"yeast"},{name:"Salt",amount:17,unit:"g",kind:"salt"},{name:"Water",amount:468,unit:"g",kind:"water"},{name:"Rye sour",amount:421,unit:"g",kind:"preferment"}]}
      ],
      steps:[
        {title:"Build rye sour",offset:0,detail:"Mix water, starter, and whole rye flour. Ferment 12 to 15 hours at about 24\u00B0C."},
        {title:"Final mix",offset:810,detail:"Combine sour and final dough ingredients. Mix until sticky but developed."},
        {title:"Bulk fermentation",offset:825,detail:"Cover and ferment for 45 minutes. No folds."},
        {title:"Divide and rest",offset:870,detail:"Divide into two or three pieces. Rest about 10 minutes."},
        {title:"Shape and proof",offset:880,detail:"Shape slender batards. Proof 45 to 60 minutes."},
        {title:"Bake",offset:940,detail:"Bake in a steamed 232\u00B0C oven for about 45 minutes."}
      ]
    },
    {
      id:"sprouted",
      name:"Sprouted Wheat Berry",
      short:"Sprouted grain sourdough",
      description:"A sprouted wheat sourdough with levain and sprouted grain soaker. The timeline starts with sprouting the grains.",
      baseYield:2,
      yieldUnit:"loaves",
      ddtC:25.6,
      baseBakeOffset:3060,
      variations:[{id:"classic",name:"Classic",note:"Standard sprouted wheat berry sourdough."}],
      stages:[
        {name:"Levain",ingredients:[{name:"High-extraction flour",amount:121,unit:"g",kind:"flour"},{name:"Sprouted wheat flour",amount:121,unit:"g",kind:"flour"},{name:"Water",amount:242,unit:"g",kind:"water"},{name:"Liquid sourdough starter",amount:36,unit:"g",kind:"starter"}]},
        {name:"Sprouted soaker",ingredients:[{name:"Sprouted grains",amount:173,unit:"g",kind:"grain"}]},
        {name:"Final dough",ingredients:[{name:"Sprouted wheat flour",amount:328,unit:"g",kind:"flour"},{name:"High-extraction flour",amount:121,unit:"g",kind:"flour"},{name:"Water",amount:340,unit:"g",kind:"water"},{name:"Salt",amount:15,unit:"g",kind:"salt"},{name:"Levain",amount:484,unit:"g",kind:"preferment"},{name:"Sprouted soaker",amount:173,unit:"g",kind:"soaker"}]}
      ],
      steps:[
        {title:"Start wheat berries",offset:0,detail:"Soak wheat berries 24 to 36 hours. Drain and rinse."},
        {title:"Sprout grains",offset:1440,detail:"Allow grains to sprout another 12 to 36 hours at room temperature."},
        {title:"Build levain",offset:2520,detail:"Mix flours, water, and starter. Ferment 8 to 10 hours."},
        {title:"Autolyse",offset:3060,detail:"Mix levain, water, and flours. Hold back salt. Rest 20 to 30 minutes."},
        {title:"Final mix",offset:3090,detail:"Add salt and mix by hand or mixer."},
        {title:"Bulk fermentation",offset:3105,detail:"Ferment 2.5 hours, folding twice about every 45 minutes."},
        {title:"Divide and preshape",offset:3240,detail:"Divide in two and preshape. Rest about 20 minutes."},
        {title:"Shape and retard",offset:3260,detail:"Shape, proof about 1 hour, then refrigerate overnight if desired."},
        {title:"Bake",offset:3900,detail:"Bake in a steamed 232\u00B0C oven for about 40 minutes."}
      ]
    },
    {
      id:"rugbrod",
      name:"Rugbrod",
      short:"Pullman rye loaf",
      description:"Danish-style rye Pullman loaf using rye sour, levain, and overnight soaker. Best sliced after a 24 to 48 hour rest.",
      baseYield:1,
      yieldUnit:"Pullman loaf",
      ddtC:27,
      baseBakeOffset:825,
      variations:[{id:"classic",name:"Classic",note:"Standard Pullman loaf."}],
      stages:[
        {name:"Rye sour",ingredients:[{name:"Water",amount:245,unit:"g",kind:"water"},{name:"Liquid sourdough starter",amount:55,unit:"g",kind:"starter"},{name:"Whole rye flour",amount:300,unit:"g",kind:"flour"}]},
        {name:"Levain",ingredients:[{name:"Water",amount:103,unit:"g",kind:"water"},{name:"Liquid sourdough starter",amount:14,unit:"g",kind:"starter"},{name:"High-gluten flour",amount:103,unit:"g",kind:"flour"}]},
        {name:"Soaker",ingredients:[{name:"Rye chops",amount:75,unit:"g",kind:"grain"},{name:"Water",amount:150,unit:"g",kind:"water"}]},
        {name:"Final dough",ingredients:[{name:"High-gluten flour",amount:130,unit:"g",kind:"flour"},{name:"Whole rye flour",amount:200,unit:"g",kind:"flour"},{name:"Water",amount:180,unit:"g",kind:"water"},{name:"Instant dry yeast",amount:2.5,unit:"g",kind:"yeast"},{name:"Salt",amount:16,unit:"g",kind:"salt"},{name:"Soaker",amount:225,unit:"g",kind:"soaker"},{name:"Rye sour",amount:600,unit:"g",kind:"preferment"},{name:"Levain",amount:220,unit:"g",kind:"preferment"},{name:"Blackstrap molasses",amount:15,unit:"g",kind:"sweetener"},{name:"Whole fennel seeds, coarsely ground",amount:1.5,unit:"tbsp",kind:"spice"}]}
      ],
      steps:[
        {title:"Build rye sour",offset:0,detail:"Mix and ferment 12 to 15 hours at about 24\u00B0C."},
        {title:"Build levain",offset:0,detail:"Mix and ferment 8 to 10 hours at about 25\u00B0C, or ferment then retard."},
        {title:"Start soaker",offset:0,detail:"Combine rye chops and water. Soak overnight at about 25\u00B0C."},
        {title:"Prepare pan",offset:720,detail:"Grease a 13 inch Pullman pan and coat with whole rye flour."},
        {title:"Final mix",offset:735,detail:"Combine all ingredients. Mix slow 4 minutes, then medium 3 to 4 minutes."},
        {title:"Pan and proof",offset:745,detail:"Transfer immediately to the Pullman pan. Dust with rye flour and proof 45 to 60 minutes."},
        {title:"Bake stage 1",offset:805,detail:"Bake covered at 260\u00B0C for 15 minutes."},
        {title:"Bake stage 2",offset:820,detail:"Reduce to 204\u00B0C and bake covered for 15 minutes."},
        {title:"Bake stage 3",offset:835,detail:"Remove cover, reduce to 163\u00B0C, and bake another 45 minutes or until done."},
        {title:"Rest before slicing",offset:2880,detail:"After cooling, keep covered at room temperature for 24 to 48 hours before slicing."}
      ]
    }
  ];
window.SOURDOUGH_STARTER = [
    {title:"Day 1: initial mix",items:["96 g water at 25\u00B0C","57 g all-purpose flour","57 g whole rye flour","4 g molasses"],detail:"Mix, scrape down, cover, and ferment at about 25\u00B0C for 24 hours."},
    {title:"Day 2: refreshment",items:["108 g Day 1 starter","96 g water at 25\u00B0C","57 g whole rye flour","57 g all-purpose flour"],detail:"Discard excess starter. Mix, scrape down, cover, and ferment at about 25\u00B0C for 24 hours."},
    {title:"Days 3 to 6: twice daily feeding",items:["159 g young starter","140 g water at 25\u00B0C","167 g all-purpose flour"],detail:"Feed every 12 hours. By Day 7, the starter should be active and ready to use."},
    {title:"Room temperature maintenance",items:["100 g starter","100 g water","100 g all-purpose flour"],detail:"Feed daily when keeping the starter active at room temperature. Let ripen about 6 to 8 hours."},
    {title:"Fridge maintenance",items:["Keep 100 g starter","Add 100 g water","Add 100 g all-purpose flour"],detail:"Feed weekly. Leave at room temperature at least 2 hours before returning to the fridge."},
    {title:"Prepare refrigerated starter for baking",items:["Feed 2 to 3 days before baking","Feed twice the next day about 12 hours apart","Feed early on baking day and use when ripe"],detail:"This raises activity before building levain."}
  ];
