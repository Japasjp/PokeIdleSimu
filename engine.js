// Motor de simulação (puro, sem DOM). Roda na página, em Web Worker e no Node.
function SimEngine(){
const TYPES=['NORMAL','FIRE','WATER','GRASS','ELECTRIC','ICE','FIGHTING','POISON','GROUND','FLYING','PSYCHIC','BUG','ROCK','GHOST','DRAGON','DARK','STEEL','FAIRY'];
// golpe:{tipo defensor:mult} — tabela da wiki
const CH={NORMAL:{ROCK:.5,GHOST:0,STEEL:.5},FIRE:{FIRE:.5,WATER:.5,GRASS:2,ICE:2,BUG:2,ROCK:.5,DRAGON:.5,STEEL:2},
WATER:{FIRE:2,WATER:.5,GRASS:.5,GROUND:2,ROCK:2,DRAGON:.5},GRASS:{FIRE:.5,WATER:2,GRASS:.5,POISON:.5,GROUND:2,FLYING:.5,BUG:.5,ROCK:2,DRAGON:.5,STEEL:.5},
ELECTRIC:{WATER:2,GRASS:.5,ELECTRIC:.5,GROUND:0,FLYING:2,DRAGON:.5},ICE:{FIRE:.5,WATER:.5,GRASS:2,ICE:.5,GROUND:2,FLYING:2,DRAGON:2,STEEL:.5},
FIGHTING:{NORMAL:2,ICE:2,POISON:.5,FLYING:.5,PSYCHIC:.5,BUG:.5,ROCK:2,GHOST:0,DARK:2,STEEL:2,FAIRY:.5},POISON:{GRASS:2,POISON:.5,GROUND:.5,ROCK:.5,GHOST:.5,STEEL:0,FAIRY:2},
GROUND:{FIRE:2,GRASS:.5,ELECTRIC:2,POISON:2,FLYING:0,BUG:.5,ROCK:2,STEEL:2},FLYING:{GRASS:2,ELECTRIC:.5,FIGHTING:2,BUG:2,ROCK:.5,STEEL:.5},
PSYCHIC:{FIGHTING:2,POISON:2,PSYCHIC:.5,DARK:0,STEEL:.5},BUG:{FIRE:.5,GRASS:2,FIGHTING:.5,POISON:.5,FLYING:.5,PSYCHIC:2,GHOST:.5,DARK:2,STEEL:.5,FAIRY:.5},
ROCK:{FIRE:2,ICE:2,FIGHTING:.5,GROUND:.5,FLYING:2,BUG:2,STEEL:.5},GHOST:{NORMAL:0,PSYCHIC:2,GHOST:2,DARK:.5},DRAGON:{DRAGON:2,STEEL:.5,FAIRY:0},
DARK:{FIGHTING:.5,PSYCHIC:2,GHOST:2,DARK:.5,FAIRY:.5},STEEL:{FIRE:.5,WATER:.5,ELECTRIC:.5,ICE:2,ROCK:2,STEEL:.5,FAIRY:2},FAIRY:{FIRE:.5,FIGHTING:2,POISON:.5,DRAGON:2,DARK:2,STEEL:.5}};
const HUNT={'0':0,'0.25':.167,'0.5':.333,'1':1,'2':2.5,'4':5.5};
function effect(t,def){let m=1;for(const d of def){if(!d)continue;const v=CH[t]&&CH[t][d];if(v!==undefined)m*=v;}return HUNT[String(m)];}
const CDT=[[15,10],[40,15.9],[60,20.6],[80,25.3],[100,30],[120,31.2],[150,33],[300,42],[600,60]];
function moveCd(p){if(p<=CDT[0][0])return CDT[0][1];for(let i=1;i<CDT.length;i++){if(p<=CDT[i][0]){const[a,b]=CDT[i-1],[c,d]=CDT[i];return b+(d-b)*(p-a)/(c-a);}}return 60;}
function speedDiscount(base,iv){let pot=base<=120?base/20:6+(base-120)/40;return Math.min(7,pot)*iv/32/100;}
const POT=P=>({1:1,2:1.05,3:1.1,4:1.25,5:2})[P]||1;
function stats(p){const o={};const mult=POT(p.potency)*(p.shiny?3:1)*(p.legendary?4:1);
 for(const k of ['hp','atk','def','spa','spd','spe']){const ex=(k==='hp'||k==='spe')?.95:.8;
  o[k]=Math.floor(1e-9+(p.base[k]+((p.refine&&p.refine[k])||0)+2*p.iv[k])*p.level/100*Math.pow(p.quality,ex)*mult);}
 o.maxHp=Math.max(24,o.hp*12);return o;}
const xpTotal=L=>Math.round(50/3*(L*L*L-6*L*L+17*L-12));
const POTIONS=[{id:'small',n:'Small Potion',heal:60,price:50},{id:'great',n:'Great Potion',heal:150,price:150},{id:'ultra',n:'Ultra Potion',heal:400,price:400},{id:'hyper',n:'Hyper Potion',heal:1000,price:800},{id:'ultimate',n:'Ultimate Potion',heal:3000,price:1500},{id:'golden',n:'Golden Potion',pct:.5,price:2500}];
const REVIVES={revive:{n:'Revive',pct:.1,price:600},max:{n:'Max Revive',pct:1,price:5000}};
const GOLD=[[1,36,5],[100,572,86],[1000,2282,342],[5000,6000,900],[25000,15776,2366],[160300,15776,15905]];
function goldFor(L){for(let i=1;i<GOLD.length;i++){if(L<=GOLD[i][0]){const a=GOLD[i-1],b=GOLD[i];const t=(Math.log(Math.max(1,L))-Math.log(a[0]))/(Math.log(b[0])-Math.log(a[0]));
 const f=j=>Math.round(a[j]*Math.pow(b[j]/a[j],t));return{curve:f(1),loot:f(2)};}}return{curve:15776,loot:15905};}
function rng(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}

// Mapa completo gerado_pedra_11 (arquivo do jogo + collision.json) com os 9 pontos de spawn vistos em duas gravações
const BASE={"name":"gerado_pedra_11","box":[-30,-17,60,35],"rows":["000000000000000000011111110000000000000000011110000000000011","000000000000000000111111111000000000000000111110000000000011","000000011100000000111111111101100001110000111111000000000011","000000011110000111111111111111100001110000111111000000000111","111100011111001111111111111111100001111001111111110000001111","111100111111011111111111111111100111111111111111110000011111","111111111111111111111110111111111111111111111111111111111111","111111111111111111111110000011111111111111111111111111111110","111111111111111111111110001111111111111110000111111111110000","111111111111111100001111111111111111111111111111110111110000","111110001111111110001111111111111111111111111111100111111111","111100111111111110000011111111111111111111111111110111111111","011000111101111111101111111111111111111100111111111111111111","001100111101111111111111111111111111111100011111111111111111","001111111001111111111111111111111111111111111111111111111111","001111111111111111111111110011111111111111111111111111111111","000111111111111111111111110001111111111111111111011111100000","000011111111111111111111111111111111111111111110011111000000","000011111111111111111111111111111100111111011111111110000000","000001111111111111111111111111111100011111111111111111000000","000001111111111111111111111111111111111111111111111111000000","000011111110111111111111111111111111111111111111111111000000","001111111111111111110001111111111111111111111100111111000000","001111111111111111111001111111111111111111110000111111100000","000111111111111111111111110111111111111011100001111111100000","000111111111111111111111100000001111100011110011111111100000","001111111111111111111111000000000111000011110011111111110000","111111111111111111111110000000000111001111111011111111110000","111111111111111111111110000000000111011111111111111111110000","111111111111111111111110000000000111111111111111111111100000","111111000011111111111000000000000111111111111111111111100000","011111000011100001110000000000000111111111111111111111000000","000000000011100001100000000000001111111110011111111110000000","000000000000000000000000000000001111011100011101111100000000","000000000000000000000000000000000110001100011000111000000000"],"spawns":[[0,6],[0,4],[2,4],[43,32],[43,34],[45,33],[52,6],[54,6],[56,6]],"start":[29,9]};
// Buizel: início e spawns observados pelo jogador em 15 ondas com Prey. O desenho do mapa (paredes) ainda não é conhecido: campo aberto.
const BUIZEL={name:'Buizel (spawns observados)',W:90,H:52,start:[67,11],
 spawns:[[28,10],[28,12],[30,12],[30,14],[38,34],[40,34],[40,36],[42,34],[77,39],[77,41],[79,39],[79,41]],
 // [x, y, ondas em que apareceu um spawn extra ali]
 extras:[[30,16,8],[76,37,7],[36,34,5],[75,38,5],[44,34,3],[42,32,1],[38,36,1]]};
// onda de cada hunt: spawns fixos e extras do Prey
function huntDefaults(species){return species==='Buizel'?{waveSize:12,extraSpawns:2}:{waveSize:9,extraSpawns:0};}
// ponto de início: sempre o mesmo a cada simulação. Vale, nesta ordem, o início conhecido da hunt (Buizel),
// o gravado no mapa e, sem nenhum dos dois, o primeiro ponto de spawn (marcado como não confirmado)
function startOf(map,species){const{W,H,g}=map,free=p=>p&&p[0]>=0&&p[1]>=0&&p[0]<W&&p[1]<H&&g[p[1]*W+p[0]];
 if(species==='Buizel'){const p=[BUIZEL.start[0]-(map.ox||0),BUIZEL.start[1]-(map.oy||0)];if(free(p))return{cell:p[1]*W+p[0],known:true};}
 if(free(map.start))return{cell:map.start[1]*W+map.start[0],known:true};
 const sp=(map.spawns||[]).filter(free).sort((a,b)=>a[1]-b[1]||a[0]-b[0])[0];return{cell:sp?sp[1]*W+sp[0]:g.findIndex(v=>v),known:false};}
function genMap(species){if(species==='Buizel'){const{name,W,H,start,spawns,extras}=BUIZEL;return{name,box:null,ox:0,oy:0,W,H,g:new Array(W*H).fill(1),spawns,extras,start,fixed:true,approx:true};}
 const[W,H]=[BASE.rows[0].length,BASE.rows.length],g=new Array(W*H);for(let y=0;y<H;y++)for(let x=0;x<W;x++)g[y*W+x]=+BASE.rows[y][x];
 return{name:BASE.name,box:BASE.box,ox:0,oy:0,W,H,g,spawns:BASE.spawns,fixed:true,full:true,start:BASE.start,full:true};}
function parseCampo(text){const msgs=[];const push=(o,d=0)=>{if(!o||typeof o!=='object'||d>4)return;if((o.t==='campo'||o.t==='campo.init')&&Array.isArray(o.mobs))msgs.push(o);else Object.values(o).forEach(v=>push(v,d+1));};
 try{push(JSON.parse(text));}catch(e){for(const line of text.split('\n')){const i=line.indexOf('{'),j=line.lastIndexOf('}');if(i<0)continue;try{push(JSON.parse(line.slice(i,j+1)));}catch(_){}}}
 msgs.sort((a,b)=>a.ts-b.ts);return msgs;}
function importCampo(text){let msgs=parseCampo(text);if(!msgs.length)return null;
 // com o início da hunt (campo.init) há o nome e o tamanho do mapa: usa só as mensagens da última hunt
 let k=-1;msgs.forEach((m,i)=>{if(m.t==='campo.init')k=i;});const ini=k>=0?msgs[k]:null;if(ini)msgs=msgs.slice(k);
 const cells=[],seen=new Set(),live=new Map(),waves=[],delays=[],ms=[];let maxAlive=0,first=null,death=null;
 const see=(c,r)=>{if(c!=null)cells.push([c,r]);};
 // as mensagens trazem só o que mudou: o estado é acumulado
 for(const m of msgs){for(const h of[m.heroi,m.treinador])if(h){see(h.c,h.r);see(h.dc,h.dr);}
  const born=[];for(const b of m.mobs){if(!first&&b.n)first=b;if(b.ms)ms.push(b.ms);see(b.c,b.r);see(b.dc,b.dr);
   const dead=!(b.hp>0)||b.x;if(dead){if(live.delete(b.s))death=m.ts;}else live.set(b.s,1);
   if(!seen.has(b.s)){seen.add(b.s);if(m!==ini&&!dead&&b.hp===b.mhp)born.push([b.c,b.r]);}}
  if(born.length>1){waves.push(born);if(death)delays.push(m.ts-death);}
  for(const id of m.fora||[])live.delete(id);maxAlive=Math.max(maxAlive,live.size);}
 if(!cells.length)return null;
 let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const[c,r]of cells){x0=Math.min(x0,c);y0=Math.min(y0,r);x1=Math.max(x1,c);y1=Math.max(y1,r);}
 const box=ini&&ini.box,ox=box?0:x0-1,oy=box?0:y0-1,W=box?Math.max(box[2],x1+1):x1-x0+3,H=box?Math.max(box[3],y1+1):y1-y0+3;
 if(!(W>0&&H>0&&W*H<=90000))return{tooBig:true};
 const g=new Array(W*H).fill(0),set=(x,y)=>{if(x>=0&&y>=0&&x<W&&y<H)g[y*W+x]=1;};
 for(const[c,r]of cells)set(c-ox,r-oy);
 const sp=new Map(),hits=new Map();for(const w of waves)for(const[c,r]of w){const key=(c-ox)+','+(r-oy);sp.set(key,[c-ox,r-oy]);}
 // com 3 ondas ou mais: quem aparece em quase todas é ponto fixo; o resto é spawn extra (Prey)
 const size=waves.length?Math.max(...waves.map(w=>w.length)):0,whole=waves.filter(w=>w.length===size);
 for(const w of whole)for(const key of new Set(w.map(([c,r])=>(c-ox)+','+(r-oy))))hits.set(key,(hits.get(key)||0)+1);
 let fixedSp=[...sp.values()],extras=[],extraSpawns=null;
 if(whole.length>=3){const need=Math.ceil(whole.length*.8),f=[...sp].filter(([k])=>(hits.get(k)||0)>=need).map(e=>e[1]);
  if(f.length&&f.length<=size){fixedSp=f;extraSpawns=size-f.length;extras=[...sp].filter(([k])=>hits.has(k)&&hits.get(k)<need).map(([k,p])=>[p[0],p[1],hits.get(k)]);}}
 const h=ini&&ini.heroi;
 const map=connect({name:ini&&ini.mapa?String(ini.mapa).replace(/-[0-9a-f]+$/,''):'',ox,oy,W,H,g,spawns:fixedSp,extras,fixed:sp.size>0,box:box||null,start:h?[h.c-ox,h.r-oy]:null});
 ms.sort((a,b)=>a-b);delays.sort((a,b)=>a-b);
 return{first,map,extraSpawns,waveSize:extraSpawns!==null?size-extraSpawns:size||maxAlive,fullWaves:waves.length,waveDelayMs:delays.length?delays[delays.length>>1]:0,mobStepMs:ms.length?ms[ms.length>>1]:520,messages:msgs.length,mobs:seen.size,seconds:(msgs[msgs.length-1].ts-msgs[0].ts)/1000};}
// liga ilhas para que tudo seja alcançável
function connect(map){const{W,H,g}=map,set=(x,y)=>{if(x>=0&&y>=0&&x<W&&y<H)g[y*W+x]=1;};
 for(;;){const comp=new Int32Array(W*H).fill(-1);const comps=[];for(let i=0;i<W*H;i++){if(!g[i]||comp[i]>=0)continue;const q=[i];comp[i]=comps.length;for(let k=0;k<q.length;k++){const c=q[k],x=c%W,y=(c/W)|0;for(const[dx,dy]of DIRS){const X=x+dx,Y=y+dy,n=Y*W+X;if(X>=0&&Y>=0&&X<W&&Y<H&&g[n]&&comp[n]<0){comp[n]=comps.length;q.push(n);}}}comps.push(q);}
  if(comps.length<2)return map;let best=null;for(const a of comps[0])for(let j=1;j<comps.length;j++)for(const b of comps[j]){const d=Math.abs(a%W-b%W)+Math.abs(((a/W)|0)-((b/W)|0));if(!best||d<best.d)best={d,a,b};}
  let x=best.a%W,y=(best.a/W)|0;const tx=best.b%W,ty=(best.b/W)|0;while(x!==tx){x+=Math.sign(tx-x);set(x,y);}while(y!==ty){y+=Math.sign(ty-y);set(x,y);}}}

// Mapa completo do jogo: /assets/world/maps/<nome>.json + collision.json (formato lido por mapa.mjs).
// box = [x mínimo, y mínimo, colunas, linhas] da mensagem campo.init; as posições do socket contam a partir dele.
function importWorld(world,blocking,ref){const block=new Set(blocking),gz=(world._meta&&world._meta.groundZ)??7,floor=(world.tiles||[]).filter(t=>t[2]===gz);if(!floor.length)return null;
 let box=ref&&ref.box;if(!box){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const t of floor){x0=Math.min(x0,t[0]);y0=Math.min(y0,t[1]);x1=Math.max(x1,t[0]);y1=Math.max(y1,t[1]);}box=[x0,y0,x1-x0+1,y1-y0+1];}
 const[bx,by,W,H]=box;if(!(W>0&&H>0&&W*H<=90000))return null;const g=new Array(W*H).fill(0);
 for(const t of floor){const x=t[0]-bx,y=t[1]-by;if(x<0||y<0||x>=W||y>=H)continue;if(t[3]&&!block.has(t[3])&&!(t[4]||[]).some(i=>block.has(Array.isArray(i)?i[0]:i)))g[y*W+x]=1;}
 // confere com os quadrados em que alguém já andou e com os pontos de spawn conhecidos
 let seen=0,ok=0;const dx=ref&&ref.box?ref.ox||0:0,dy=ref&&ref.box?ref.oy||0:0;
 if(ref&&ref.box)for(let i=0;i<ref.W*ref.H;i++)if(ref.g[i]){const x=i%ref.W+dx,y=((i/ref.W)|0)+dy;seen++;if(x>=0&&y>=0&&x<W&&y<H&&g[y*W+x])ok++;}
 const inside=p=>p&&p[0]>=0&&p[1]>=0&&p[0]<W&&p[1]<H&&g[p[1]*W+p[0]];
 const spawns=ref&&ref.box?(ref.spawns||[]).map(([x,y])=>[x+dx,y+dy]).filter(inside):[];
 const start=ref&&ref.box&&ref.start?[ref.start[0]+dx,ref.start[1]+dy]:null;
 const n=g.reduce((a,b)=>a+b,0);if(!n)return null;
 const extras=ref&&ref.box?(ref.extras||[]).map(([x,y,w])=>[x+dx,y+dy,w]).filter(inside):[];
 const main=mainArea(g,W,H,spawns[0]||start);const free=main.reduce((a,b)=>a+b,0);
 return{map:{name:ref&&ref.name||'',box,ox:0,oy:0,W,H,g:main,spawns:spawns.filter(([x,y])=>main[y*W+x]),extras:extras.filter(([x,y])=>main[y*W+x]),fixed:spawns.some(([x,y])=>main[y*W+x]),start:start&&main[start[1]*W+start[0]]?start:null,full:true},cells:free,seen,match:seen?ok/seen:null};}
// área ligada que contém o ponto dado (ou a maior de todas)
function mainArea(g,W,H,from){const done=new Uint8Array(W*H);let best=[];for(let i=0;i<W*H;i++){if(!g[i]||done[i])continue;const q=[i];done[i]=1;for(let k=0;k<q.length;k++){const c=q[k],x=c%W,y=(c/W)|0;for(const[dx,dy]of DIRS){const X=x+dx,Y=y+dy,n=Y*W+X;if(X>=0&&Y>=0&&X<W&&Y<H&&g[n]&&!done[n]){done[n]=1;q.push(n);}}}
  if(from&&q.includes(from[1]*W+from[0])){best=q;break;}if(q.length>best.length)best=q;}
 const out=new Array(W*H).fill(0);for(const c of best)out[c]=1;return out;}
// o jogo anda em grade, só nas 4 direções
const DIRS=[[1,0],[-1,0],[0,1],[0,-1]];
// junta duas capturas do mesmo mapa (coordenadas do jogo preservadas por ox/oy)
function mergeMap(a,b){const ox=Math.min(a.ox,b.ox),oy=Math.min(a.oy,b.oy),W=Math.max(a.ox+a.W,b.ox+b.W)-ox,H=Math.max(a.oy+a.H,b.oy+b.H)-oy,g=new Array(W*H).fill(0),seen=new Set(),spawns=[];
 for(const m of [a,b]){const dx=m.ox-ox,dy=m.oy-oy;for(let i=0;i<m.W*m.H;i++)if(m.g[i])g[(((i/m.W)|0)+dy)*W+(i%m.W)+dx]=1;
  for(const[x,y]of m.spawns||[]){const k=(x+dx)+','+(y+dy);if(!seen.has(k)){seen.add(k);spawns.push([x+dx,y+dy]);}}}
 const shift=(m,l)=>(l||[]).map(([x,y,w])=>[x+m.ox-ox,y+m.oy-oy,w]),ex=new Map();
 for(const m of [a,b])for(const e of shift(m,m.extras))ex.set(e[0]+','+e[1],e);
 // a captura mais nova decide o que é fixo
 const newer=new Set(shift(b,b.spawns).map(p=>p[0]+','+p[1]));for(const k of newer)ex.delete(k);
 return connect({name:b.name||a.name,box:b.box||a.box||null,extras:[...ex.values()],ox,oy,W,H,g,spawns:spawns.filter(([x,y])=>!ex.has(x+','+y)),fixed:!!(a.fixed||b.fixed),start:[b,a].filter(m=>m.start).map(m=>[m.start[0]+m.ox-ox,m.start[1]+m.oy-oy])[0]||null});}
function create(cfg,seed){
 const R=rng(seed),P=cfg.pokemon,H=cfg.hunt,S=cfg.sim;
 const map=H.map?H.map:genMap(H.species);const W=map.W,Hh=map.H,g=map.g;
 const walk=[];for(let i=0;i<W*Hh;i++)if(g[i])walk.push(i);
 // o servidor resolve tudo em ciclos: cada ação só acontece no próximo ciclo depois de vencer o intervalo
 const SV=S.serverMs||250,onCycle=ms=>Math.max(1,Math.ceil(ms/SV-1e-9))*SV;
 let level=P.level,st=stats(P),pxp=xpTotal(level),txp=xpTotal(cfg.trainer.level),tlevel=cfg.trainer.level;
 const day=cfg.seasonal||'';
 const dayMult=(a,d)=>{if(!day)return 1;const x=a.includes(day),y=d.includes(day);return x&&y?.5:x?2:y?.25:1;};
 const ptypes=P.types.filter(Boolean),wtypes=H.types.filter(Boolean);
 const disc=speedDiscount(P.base.spe,P.iv.spe),gap=Math.max(400,S.attackGapMs-10*P.iv.spe),basicCd=Math.max(400,S.basicCdMs-10*P.iv.spe);
 const moves=P.moves.filter(m=>m.on!==false&&m.power>0).map(m=>({...m,cd:(m.cd||moveCd(m.power))*(1-disc)*1000,ready:0,uses:0}));
 let t=0,nid=1,mobs=[],corpses=[],waveAt=0,log=[],fx=[];
 const{cell:start,known:startKnown}=startOf(map,H.species);
 const hero={cell:start,from:start,moveStart:0,moveEnd:0,hp:st.maxHp,nextAtk:0,basicAt:0,target:0,potAt:0,wildAt:0,downUntil:0};
 const dist=new Int32Array(W*Hh),parent=new Int32Array(W*Hh),Q=new Int32Array(W*Hh);let distFor=-1;
 function bfs(src){if(distFor===src)return;distFor=src;dist.fill(-1);dist[src]=0;parent[src]=src;Q[0]=src;let h=0,n=1;
  while(h<n){const c=Q[h++],x=c%W,y=(c/W)|0;for(const[dx,dy]of DIRS){const X=x+dx,Y=y+dy;if(X<0||Y<0||X>=W||Y>=Hh)continue;const k=Y*W+X;if(!g[k]||dist[k]>=0)continue;dist[k]=dist[c]+1;parent[k]=c;Q[n++]=k;}}}
 const cheb=(a,b)=>Math.max(Math.abs(a%W-b%W),Math.abs(((a/W)|0)-((b/W)|0)));
 const M={kills:0,xp:0,txp:0,gold:0,potionCost:0,ballCost:0,balls:0,reviveCost:0,deaths:0,xpLost:0,waves:0,skills:0,basics:0,dmgTaken:0,wildHits:0,dmgDone:0,walkMs:0,fightMs:0,waitMs:0,downMs:0,used:{},stopped:false,levelUps:0};
 const stock={};for(const p of POTIONS)stock[p.id]=cfg.items.potions[p.id]&&cfg.items.potions[p.id].on?(cfg.items.potions[p.id].qty??Infinity):0;
 if(cfg.items.unlimited)for(const p of POTIONS)if(cfg.items.potions[p.id].on)stock[p.id]=Infinity;
 let revives=cfg.items.unlimited?Infinity:cfg.items.reviveQty;
 const say=s=>{log.push({t,s});if(log.length>6)log.shift();};
 // pontos fixos: a mesma onda nasce sempre nos mesmos quadrados, em ordem sorteada
 function addMob(c){if(mobs.some(m=>m.cell===c)||c===hero.cell){for(const[dx,dy]of [...DIRS,[2,0],[-2,0],[0,2],[0,-2],[1,1],[-1,-1],[1,-1],[-1,1]]){const x=c%W+dx,y=((c/W)|0)+dy,k=y*W+x;if(x>=0&&y>=0&&x<W&&y<Hh&&g[k]&&k!==hero.cell&&!mobs.some(m=>m.cell===k)){c=k;break;}}}
   const iv={};for(const k of ['hp','atk','def','spa','spd','spe'])iv[k]=1+Math.floor(R()*32);
   const s=stats({base:H.base,iv,level:H.level,quality:H.quality,potency:1});const maxHp=s.maxHp*S.wildHpMult;
   mobs.push({id:nid++,cell:c,from:c,moveStart:t,moveEnd:t,s,iv,hp:maxHp,maxHp,ready:H.moves.map(()=>0),aggro:false});}
 // spawn extra (Prey): sorteia entre as posições já observadas; sem elas, um quadrado livre a 2 ou 3 passos do ponto fixo mais próximo
 const fixedCells=(map.spawns||[]).map(([x,y])=>y*W+x);
 const seenExtras=(map.extras||[]).map(([x,y,w])=>({c:y*W+x,w:w||1})).filter(e=>g[e.c]);
 const nearCells=fixedCells.length?walk.filter(c=>{let d=1e9;for(const s of fixedCells)d=Math.min(d,Math.abs(c%W-s%W)+Math.abs(((c/W)|0)-((s/W)|0)));return d===2||d===3;}):[];
 function extraCell(used){let pool=seenExtras.filter(e=>!used.has(e.c));if(!pool.length)pool=nearCells.filter(c=>!used.has(c)).map(c=>({c,w:1}));
  if(!pool.length)return null;let r=R()*pool.reduce((a,e)=>a+e.w,0);for(const e of pool){r-=e.w;if(r<0)return e.c;}return pool[pool.length-1].c;}
 function spawnWave(){M.waves++;const n=H.waveSize,extra=Math.max(0,H.extraSpawns||0),packs=Math.max(1,H.packs);
  if(map.fixed&&fixedCells.length){const p=fixedCells.slice();for(let i=p.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[p[i],p[j]]=[p[j],p[i]];}for(let i=0;i<n;i++)addMob(p[i%p.length]);
   const used=new Set(fixedCells);for(let i=0;i<extra;i++){const c=extraCell(used);if(c===null)break;used.add(c);addMob(c);}return;}
  const pool=map.spawns&&map.spawns.length?map.spawns.map(([x,y])=>y*W+x):walk;
  const centers=[];for(let i=0;i<packs;i++){let c,k=0;do{c=pool[Math.floor(R()*pool.length)];k++;}while(k<30&&(cheb(c,hero.cell)<H.minSpawnDist||centers.some(o=>cheb(o,c)<8)));centers.push(c);}
  for(let i=0;i<n+extra;i++){const ctr=centers[i%packs];let c=ctr;for(let k=0;k<30;k++){const x=ctr%W+Math.floor(R()*7)-3,y=((ctr/W)|0)+Math.floor(R()*7)-3;if(x>=0&&y>=0&&x<W&&y<Hh&&g[y*W+x]&&!mobs.some(m=>m.cell===y*W+x)){c=y*W+x;break;}}
   addMob(c);}}
 function dmg(level,power,atk,def,stab,eff){const base=((2*level/5+2)*power*atk/def)/50+2;return base*stab*eff;}
 function expected(mv,m){const phys=mv.cat==='P';return dmg(level,mv.power,phys?st.atk:st.spa,phys?m.s.def:m.s.spd,ptypes.includes(mv.type)?1.5:1,effect(mv.type,wtypes))*dayMult(ptypes,wtypes);}
 function heroAttack(m){let best=null,bv=0;for(const mv of moves){if(mv.ready>t)continue;const e=expected(mv,m);if(e>bv){bv=e;best=mv;}}
  let name,type;
  if(!best){if(t<hero.basicAt)return;type=ptypes.find(ty=>effect(ty,wtypes)>0);if(!type)return;bv=expected({type,power:30,cat:'P'},m);name='Investida';hero.basicAt=t+basicCd;M.basics++;}
  else{best.ready=t+best.cd;best.uses++;name=best.name;type=best.type;M.skills++;}
  const d=Math.max(1,Math.round(bv*(.85+R()*.15)));m.hp-=d;M.dmgDone+=Math.min(d,d+m.hp);hero.nextAtk=t+gap;m.aggro=true;fx.push({t,cell:m.cell,d,type,mine:true});
  if(S.aoe){for(const o of mobs)if(o!==m&&cheb(o.cell,hero.cell)<=5){o.hp-=d;}}
  for(let i=mobs.length-1;i>=0;i--)if(mobs[i].hp<=0)kill(i);}
 function kill(i){const m=mobs[i];mobs.splice(i,1);corpses.push({cell:m.cell,until:t+30000});if(hero.target===m.id)hero.target=0;
  M.kills++;const gold=H.goldCurve+Math.round(H.lootBonus*cfg.bonus.loot);const xp=Math.floor((H.xpBase||0)*(1+cfg.bonus.xpPokemonPct/100)),tx=Math.floor((H.xpBase||0)*(1+cfg.bonus.xpTrainerPct/100));
  M.gold+=gold;if(cfg.items.ballPrice>0){M.ballCost+=cfg.items.ballPrice;M.balls++;}M.xp+=xp;M.txp+=tx;pxp+=xp;txp+=tx;
  while(txp>=xpTotal(tlevel+1))tlevel++;
  let up=false;while(pxp>=xpTotal(level+1)){level++;up=true;M.levelUps++;}
  if(up){st=stats({...P,level});hero.hp=st.maxHp;say('Subiu para o Nv '+level);}
  say(H.species+' derrotado! +'+xp.toLocaleString('pt-BR')+' xp, +'+gold.toLocaleString('pt-BR')+' ouro');}
 function usePotion(){if(!cfg.items.autoPotion||t<hero.potAt||hero.hp<=0||hero.hp>=st.maxHp*cfg.items.threshold)return;
  for(const p of POTIONS){if(stock[p.id]>0){stock[p.id]--;hero.hp=Math.min(st.maxHp,hero.hp+(p.pct?Math.round(st.maxHp*p.pct):p.heal));M.potionCost+=p.price;M.used[p.id]=(M.used[p.id]||0)+1;hero.potAt=t+S.potionCdMs;return;}}}
 function faint(){M.deaths++;
  if(cfg.items.autoRevive&&revives>0){const rv=REVIVES[cfg.items.reviveType];revives--;M.reviveCost+=rv.price;M.used[cfg.items.reviveType]=(M.used[cfg.items.reviveType]||0)+1;hero.hp=Math.max(1,Math.round(st.maxHp*rv.pct));say('Desmaiou — '+rv.n+' usado');hero.potAt=t;usePotion();return;}
  // só a queda do time inteiro custa XP
  const lost=Math.round((xpTotal(tlevel+1)-xpTotal(tlevel))*cfg.bonus.deathLoss);M.xpLost+=lost;txp=Math.max(0,txp-lost);while(tlevel>1&&txp<xpTotal(tlevel))tlevel--;
  const has=revives>0||Object.values(stock).some(v=>v>0);mobs=[];corpses=[];hero.target=0;
  if(cfg.items.autoReturn&&has){hero.downUntil=t+S.returnMs;say('Time caiu — voltando do Centro');}else{M.stopped=true;say('Time caiu — hunt encerrada');}}
 function walk1(tg){if(dist[tg.cell]<0)return;let c=tg.cell;while(parent[c]!==hero.cell&&c!==hero.cell)c=parent[c];if(c===hero.cell)return;
  const ms=Math.ceil(onCycle(S.heroStepMs)/(1+cfg.bonus.bike)/S.tickMs-1e-9)*S.tickMs;hero.from=hero.cell;hero.cell=c;hero.moveStart=t;hero.moveEnd=t+ms;hero.anim=ms;}
 function tick(){const dt=S.tickMs;t+=dt;
  if(M.stopped){M.downMs+=dt;return;}
  if(hero.downUntil){M.downMs+=dt;if(t<hero.downUntil||t%SV)return;hero.downUntil=0;hero.hp=st.maxHp;waveAt=t;hero.cell=hero.from=start;hero.moveEnd=t;}
  while(corpses.length&&corpses[0].until<=t)corpses.shift();
  if(fx.length&&fx[0].t<t-1500)fx.shift();
  if(t%SV){if(cfg.bonus.bike>0&&!hero.downUntil&&t>=hero.moveEnd){const tg=mobs.find(m=>m.id===hero.target);if(tg&&cheb(tg.cell,hero.cell)>1){bfs(hero.cell);walk1(tg);}}return;}
  if(!mobs.length){if(waveAt<0)waveAt=t+S.waveDelayMs;if(t>=waveAt){spawnWave();waveAt=-1;}else{M.waitMs+=SV;usePotion();return;}}
  bfs(hero.cell);
  let target=mobs.find(m=>m.id===hero.target);
  if(!target||(cheb(target.cell,hero.cell)>1&&t>=hero.moveEnd)){let bd=1e9;for(const m of mobs){const d=dist[m.cell];if(d>=0&&d<bd){bd=d;target=m;}}hero.target=target?target.id:0;}
  // selvagens andam
  for(const m of mobs){if(t<m.moveEnd)continue;const d=dist[m.cell];if(!m.aggro&&d>=0&&d<=H.aggro)m.aggro=true;
   if(cheb(m.cell,hero.cell)<=1)continue;let nx=-1;
   if(m.aggro&&d>1){const p=parent[m.cell];if(p!==hero.cell&&!mobs.some(o=>o.cell===p))nx=p;
    else{let bd=d;for(const[dx,dy]of DIRS){const x=m.cell%W+dx,y=((m.cell/W)|0)+dy,k=y*W+x;if(x>=0&&y>=0&&x<W&&y<Hh&&g[k]&&dist[k]>0&&dist[k]<=bd&&!mobs.some(o=>o.cell===k)){bd=dist[k];nx=k;}}}}
   else if(!m.aggro&&R()<H.wander*SV/1000){const[dx,dy]=DIRS[Math.floor(R()*4)];const x=m.cell%W+dx,y=((m.cell/W)|0)+dy,k=y*W+x;if(x>=0&&y>=0&&x<W&&y<Hh&&g[k]&&k!==hero.cell&&!mobs.some(o=>o.cell===k))nx=k;}
   if(nx>=0){m.from=m.cell;m.cell=nx;m.moveStart=t;m.moveEnd=t+onCycle(H.mobStepMs);m.anim=H.mobStepMs;}}
  // meu pokemon
  let engaged=false;
  if(target){if(cheb(target.cell,hero.cell)<=1){if(t>=hero.moveEnd){engaged=true;M.fightMs+=SV;if(t>=hero.nextAtk)heroAttack(target);}else M.walkMs+=SV;}
   else{M.walkMs+=SV;if(t>=hero.moveEnd)walk1(target);}}
  // só o selvagem que está sendo atacado revida, num ritmo único (média de 1,4 s)
  if(engaged&&target.hp>0&&t>=target.moveEnd&&t>=hero.wildAt){const m=target;
   let bi=-1,bv=0,raw=0;for(let i=0;i<H.moves.length;i++){const mv=H.moves[i];if(m.ready[i]>t)continue;const basic=mv.basic;const phys=basic||mv.cat==='P';
    const v=dmg(H.level,mv.power,phys?m.s.atk:m.s.spa,phys?st.def:st.spd,wtypes.includes(mv.type)?1.5:1,effect(mv.type,ptypes))*dayMult(wtypes,ptypes);
    const rank=basic?v*1e-9:v;if(rank>bv){bv=rank;bi=i;raw=v;}}
   if(bi>=0){const mv=H.moves[bi];const w=speedDiscount(H.base.spe,m.iv.spe);m.ready[bi]=t+(mv.basic?S.basicCdMs-10*m.iv.spe:(mv.cd||moveCd(mv.power))*1000*(1-w));
    hero.wildAt=(t-hero.wildAt<SV?hero.wildAt:t)+S.wildGapMs;const d=Math.max(1,Math.round(raw*S.wildDmgMult*(.85+R()*.15)));hero.hp-=d;M.dmgTaken+=d;M.wildHits++;fx.push({t,cell:hero.cell,d,type:mv.type,mine:false});
    if(hero.hp<=0){hero.hp=0;faint();return;}}}
  usePotion();}
 return{tick,map,start,startKnown,hero,get mobs(){return mobs;},get corpses(){return corpses;},get t(){return t;},get level(){return level;},get tlevel(){return tlevel;},get st(){return st;},M,log,fx,moves,stock,
  run(ms){const end=t+ms;while(t<end)tick();}};
}
function snapshot(s){return JSON.parse(JSON.stringify(s.M));}
// roda uma repetição e devolve taxas por hora (descontando o aquecimento)
function evaluate(cfg,seed,hours,warmMs){const s=create(cfg,seed);s.run(warmMs);const a=snapshot(s);s.run(hours*3600000);const b=s.M,h=hours;
 const d=k=>(b[k]-a[k])/h;const cost=d('potionCost')+d('reviveCost')+d('ballCost');const tot=h*3600000;
 return{dmg:d('dmgTaken'),xp:d('xp'),txpNet:d('txp')-d('xpLost'),gold:d('gold'),cost,profit:d('gold')-cost,kills:d('kills'),deaths:d('deaths'),skills:d('skills'),basics:d('basics'),
  pots:POTIONS.reduce((n,p)=>n+((b.used[p.id]||0)-(a.used[p.id]||0)),0)/h,walk:(b.walkMs-a.walkMs)/tot,fight:(b.fightMs-a.fightMs)/tot,stopped:b.stopped};}
return{TYPES,POTIONS,REVIVES,effect,moveCd,speedDiscount,stats,xpTotal,goldFor,genMap,huntDefaults,parseCampo,importCampo,importWorld,mergeMap,create,evaluate};
}
if(typeof module!=='undefined')module.exports=SimEngine;
