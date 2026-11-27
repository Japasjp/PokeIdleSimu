function defaultConfig(){
 return{
 version:6,
 pokemon:{name:'Venusaur',types:['GRASS','POISON'],level:1718,potency:4,quality:1.521,shiny:false,legendary:false,
  base:{hp:80,atk:82,def:83,spa:100,spd:100,spe:80},iv:{hp:15,atk:8,def:29,spa:30,spd:26,spe:9},refine:{},
  moves:[{"name": "Absorb", "type": "GRASS", "power": 25, "cd": 12.4, "cat": "S", "on": true}, {"name": "Mega Drain", "type": "GRASS", "power": 40, "cd": 15.9, "cat": "S", "on": true}, {"name": "Clear Smog", "type": "POISON", "power": 50, "cd": 18.2, "cat": "S", "on": true}, {"name": "Leaf Tornado", "type": "GRASS", "power": 65, "cd": 21.8, "cat": "S", "on": true}, {"name": "Giga Drain", "type": "GRASS", "power": 75, "cd": 24.1, "cat": "S", "on": true}, {"name": "Grass Pledge", "type": "GRASS", "power": 80, "cd": 25.3, "cat": "S", "on": true}, {"name": "Energy Ball", "type": "GRASS", "power": 90, "cd": 27.6, "cat": "S", "on": true}, {"name": "Belch", "type": "POISON", "power": 120, "cd": 31.2, "cat": "S", "on": true}, {"name": "Solar Beam", "type": "GRASS", "power": 120, "cd": 31.2, "cat": "S", "on": true}, {"name": "Chloroblast", "type": "GRASS", "power": 150, "cd": 33.0, "cat": "S", "on": true}, {"name": "Verdant Storm", "type": "GRASS", "power": 150, "cd": 33.0, "cat": "S", "on": true}, {"name": "Petal Bloom", "type": "GRASS", "power": 600, "cd": 60.0, "cat": "S", "on": true}, {"name": "Toxic Deluge", "type": "POISON", "power": 600, "cd": 60.0, "cat": "S", "on": true}]},
 trainer:{level:1718},
 hunt:{species:'Buizel',level:1000,types:['WATER'],base:{hp:55,atk:65,def:35,spa:60,spd:30,spe:85},quality:1,
  xpBase:144617,goldCurve:2282,lootBonus:342,
  waveSize:12,extraSpawns:2,packs:3,minSpawnDist:8,aggro:999,wander:0,mobStepMs:520,mapSeed:7,mapW:60,mapH:36,map:null,
  moves:[{"name": "Investida", "type": "WATER", "power": 30, "cat": "P", "basic": true}, {"name": "Aqua Cutter", "type": "WATER", "power": 70, "cd": 22.9, "cat": "P"}, {"name": "Aqua Jet", "type": "WATER", "power": 40, "cd": 15.9, "cat": "P"}, {"name": "Aqua Tail", "type": "WATER", "power": 90, "cd": 27.6, "cat": "P"}, {"name": "Cyclonic Tide", "type": "WATER", "power": 600, "cd": 60.0, "cat": "P"}, {"name": "Hydro Pump", "type": "WATER", "power": 120, "cd": 31.2, "cat": "S"}, {"name": "Liquidation", "type": "WATER", "power": 85, "cd": 26.5, "cat": "P"}, {"name": "Water Gun", "type": "WATER", "power": 50, "cd": 18.2, "cat": "S"}, {"name": "Water Pulse", "type": "WATER", "power": 60, "cd": 20.6, "cat": "S"}, {"name": "Whirlpool", "type": "WATER", "power": 35, "cd": 14.7, "cat": "S"}]},
 bonus:{xpTrainerPct:149.48,xpPokemonPct:149.48,loot:1.25,bike:0,deathLoss:0.1},
 items:{ballPrice:130,autoPotion:true,threshold:0.4,unlimited:true,autoRevive:true,reviveType:'max',reviveQty:100,autoReturn:true,
  potions:{small:{on:false,qty:0},great:{on:false,qty:0},ultra:{on:false,qty:0},hyper:{on:false,qty:0},ultimate:{on:false,qty:0},golden:{on:true,qty:500}}},
 seasonal:'',
 sim:{tickMs:50,serverMs:250,heroStepMs:260,attackGapMs:900,basicCdMs:2000,wildGapMs:1400,wildHpMult:5,wildDmgMult:1.8,waveDelayMs:2750,potionCdMs:1000,returnMs:8000,aoe:false}
 };}
if(typeof module!=='undefined')module.exports=defaultConfig;
