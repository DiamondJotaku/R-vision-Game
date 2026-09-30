/* =======================================================
   OUTILS
   ======================================================= */
const $=s=>document.querySelector(s);
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const STORE="ais-nuit-de-garde-v1";
let DB={xp:0,best:{mara:0,bomb:0,duo:0,zen:0,duel:0,red:0,fw:0,port:0,osi:0,soc:0},m:{}};
try{Object.assign(DB,JSON.parse(localStorage.getItem(STORE)||"{}"))}catch(e){}
function save(){try{localStorage.setItem(STORE,JSON.stringify(DB))}catch(e){}}
function mark(id,ok){const m=DB.m[id]||{ok:0,ko:0};ok?m.ok++:m.ko++;DB.m[id]=m}
const weak=(list,key)=>{const w=list.filter(x=>{const m=DB.m[key(x)];return !m||m.ok-m.ko<2});return w.length>=5?w:list};

const RANKS=[[0,"Stagiaire","🎓"],[600,"Technicien","🔧"],[1800,"Administrateur","🖥️"],[4000,"Ingénieur sécurité","🛡️"],[8000,"RSSI","👑"]];
function rank(){let r=RANKS[0],nx=null;for(let i=0;i<RANKS.length;i++){if(DB.xp>=RANKS[i][0]){r=RANKS[i];nx=RANKS[i+1]||null}}return{r,nx}}

let PAUSED=false,pauseT0=0;
function pauseAll(){if(PAUSED)return;PAUSED=true;pauseT0=Date.now()}
function resumeAll(){
  if(!PAUSED)return;const d=Date.now()-pauseT0;PAUSED=false;
  if(typeof SO!=="undefined"&&SO&&SO.start)SO.start+=d;
  if(typeof MA!=="undefined"&&MA)MA.last=0;
  if(typeof FW!=="undefined"&&FW){FW.last=0;FW.lastSpawn=0}
  if(typeof OS!=="undefined"&&OS)OS.last=0;
  if(typeof PQ!=="undefined"&&PQ&&PQ.end)PQ.end+=d;
}
let muted=false,AC=null;
function beep(f,d,type){
  if(muted)return;
  try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();
  const o=AC.createOscillator(),g=AC.createGain();o.type=type||"triangle";o.frequency.value=f;
  g.gain.value=.05;o.connect(g);g.connect(AC.destination);o.start();
  g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d);o.stop(AC.currentTime+d)}catch(e){}
}
const sGood=()=>{beep(660,.08);setTimeout(()=>beep(990,.1),70)};
const sBad =()=>beep(150,.22,"sawtooth");
const sPop =()=>beep(420,.05);

function show(id){document.querySelectorAll(".screen").forEach(s=>s.classList.remove("on"));$("#s-"+id).classList.add("on");window.scrollTo({top:0})}
function hearts(n){return "♥".repeat(Math.max(0,n))+"♡".repeat(Math.max(0,3-n))}

