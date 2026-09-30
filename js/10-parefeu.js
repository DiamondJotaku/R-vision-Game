/* =======================================================
   JEU 1 — PARE-FEU
   ======================================================= */
let FW=null;
function startFW(){
  newSession("fw");
  const f=$("#fwField");f.querySelectorAll(".pkt").forEach(e=>e.remove());
  FW={pkts:[],last:0,spawn:4200,pool:shuffle(weak(PORTS,p=>"port:"+p.s))};
  show("fw");hudFW();
  $("#fwToast").className="toast empty";
  $("#fwToast").textContent="Tape le port du paquet le plus bas, puis OK.";
  raf=requestAnimationFrame(stepFW);
}
function hudFW(){
  $("#fwScore").innerHTML=`Score <b>${S.score}</b>`;
  $("#fwCombo").textContent="×"+S.combo;
  $("#fwCombo").className="chip"+(S.combo>1?" combo":"");
  $("#fwWave").innerHTML=`Vague <b>${S.wave}</b>`;
  $("#fwHp").textContent=hearts(S.hp);
}
function spawnFW(){
  if(!FW.pool.length)FW.pool=shuffle(PORTS);
  const p=FW.pool.pop();
  const f=$("#fwField");
  const el=document.createElement("div");
  el.className="pkt";el.style.setProperty("--c","var(--l6)");
  el.style.left=(18+Math.random()*64)+"%";el.style.top="-60px";
  const alias=p.al&&Math.random()<.4?p.al.split(",")[0].trim():null;
  const tgt=askPort(p);
  el.innerHTML=`<div class="lbl">${alias||p.s}</div>${tgt.q?`<div class="alias">${tgt.q}</div>`:alias?`<div class="alias">alias</div>`:""}<div class="typed"></div>`;
  f.appendChild(el);
  FW.pkts.push({el,y:-60,p,typed:"",alias,tgt});
}
function stepFW(ts){
  if(!S||S.kind!=="fw")return;
  if(PAUSED){FW.last=ts;FW.lastSpawn=ts;raf=requestAnimationFrame(stepFW);return}
  if(!FW.last)FW.last=ts;
  const dt=Math.min(60,ts-FW.last);FW.last=ts;
  const H=$("#fwField").clientHeight;
  const speed=(11+S.wave*2.6)/1000;
  const maxi=Math.min(3,1+Math.floor(S.wave/4));
  if(ts-(FW.lastSpawn||0)>FW.spawn&&FW.pkts.length<maxi){FW.lastSpawn=ts;spawnFW()}
  FW.pkts.forEach(k=>{
    k.y+=speed*dt;k.el.style.top=k.y+"px";
    if(k.y>H-52&&!k.dead){
      k.dead=true;k.el.classList.add("kaboom");setTimeout(()=>k.el.remove(),300);
      loseHp();mark("port:"+k.p.s,false);
      S.errors.push({q:k.p.s,a:k.p.p});
      fiche($("#fwToast"),`<b>${k.alias?k.alias+" = "+k.p.s:k.p.s}${k.tgt.q?" ("+k.tgt.q+")":""} → ${k.tgt.n}.</b> ${multi(k.p)?portLine(k.p)+". ":""}${k.p.c}`);
      $("#fwField").classList.add("hit");$("#fwFlash").classList.add("go");
      setTimeout(()=>{$("#fwField").classList.remove("hit");$("#fwFlash").classList.remove("go")},360);
    }
  });
  FW.pkts=FW.pkts.filter(k=>!k.dead);
  FW.pkts.forEach((k,i)=>k.el.classList.toggle("live",i===0));
  hudFW();
  if(S.hp<=0)return endRun();
  raf=requestAnimationFrame(stepFW);
}
function padType(d){
  const k=FW&&FW.pkts[0];if(!k)return;
  if(d==="del")k.typed=k.typed.slice(0,-1);
  else if(d==="ok")return padSend();
  else if(k.typed.length<5)k.typed+=d;
  k.el.querySelector(".typed").textContent=k.typed;sPop();
}
function padSend(){
  const k=FW&&FW.pkts[0];if(!k||!k.typed)return;
  const ok=k.typed===k.tgt.n;
  if(ok){
    k.dead=true;FW.pkts.shift();k.el.classList.add("pop");setTimeout(()=>k.el.remove(),260);
    addScore(20+(k.tgt.q?10:0));S.hits++;mark("port:"+k.p.s,true);sGood();
    fiche($("#fwToast"),`<b>${k.alias?k.alias+" = "+k.p.s:k.p.s}${k.tgt.q?" ("+k.tgt.q+")":""} → ${k.tgt.n}.</b> ${multi(k.p)?portLine(k.p)+". ":""}${k.p.c}`);
    if(S.hits%6===0){S.wave++;FW.spawn=Math.max(1900,FW.spawn-200)}
  }else{
    k.typed="";k.el.querySelector(".typed").textContent="";
    k.el.classList.add("pkt");S.combo=1;S.streak=0;sBad();
    $("#fwField").classList.add("hit");setTimeout(()=>$("#fwField").classList.remove("hit"),320);
    fiche($("#fwToast"),`Pas ce port. Indice : ${k.tgt.n.length} chiffres, commence par <b>${k.tgt.n[0]}</b>.`);
  }
  hudFW();
}
$("#pad").innerHTML=["1","2","3","4","5","6","7","8","9","del","0","ok"].map(d=>{
  if(d==="del")return `<button class="key del" data-d="del">⌫</button>`;
  if(d==="ok") return `<button class="key send" data-d="ok">OK</button>`;
  return `<button class="key" data-d="${d}">${d}</button>`;
}).join("");
$("#pad").onclick=e=>{const b=e.target.closest(".key");if(b)padType(b.dataset.d)};
$("#qFw").onclick=()=>{cancelAnimationFrame(raf);raf=null;S=null;show("hub");paintHub()};

