/* =======================================================
   JEU 3 — CELLULE DE CRISE
   ======================================================= */
let SO=null;
function startSOC(){
  newSession("soc");
  SO={pool:shuffle(weak(ACROS,a=>"acro:"+a.s)),thp:6,tmax:6,t:0,dur:11000,ti:null,cur:null};
  SO.threat=THREATS[0];
  show("soc");newThreat(true);hudSOC();
  $("#socToast").className="toast empty";
  $("#socToast").textContent="Choisis l'outil ou le concept qui répond au symptôme.";
}
function hudSOC(){
  $("#socScore").innerHTML=`Score <b>${S.score}</b>`;
  $("#socCombo").textContent="×"+S.combo;
  $("#socCombo").className="chip"+(S.combo>1?" combo":"");
  $("#socHp").textContent=hearts(S.hp);
}
function newThreat(first){
  SO.threat=THREATS[(S.wave-1)%THREATS.length];
  SO.tmax=5+S.wave;SO.thp=SO.tmax;
  $("#thName").textContent=SO.threat.i+"  "+SO.threat.n;
  nextSOC();
}
function nextSOC(){
  clearInterval(SO.ti);
  if(!SO.pool.length)SO.pool=shuffle(ACROS);
  const a=SO.pool.pop();
  const same=ACROS.filter(x=>x.t===a.t&&x!==a);
  const pool=same.length>=4?same:ACROS.filter(x=>x!==a);
  const hand=shuffle([a,...shuffle(pool).slice(0,4)]);
  SO.cur={a,hand};
  $("#socPrompt").textContent=a.sym;
  $("#hand").innerHTML=hand.map((h,i)=>
    `<button class="hcard" data-s="${h.s}"><span class="k">${i+1}</span><span>${h.s}</span></button>`).join("");
  $("#thHpTxt").textContent=`${SO.thp} / ${SO.tmax}`;
  $("#thHp").style.width=(SO.thp/SO.tmax*100)+"%";
  const dur=Math.max(5000,SO.dur-S.wave*700);
  SO.t=dur;SO.start=Date.now();
  $("#socTimer").style.width="100%";
  SO.ti=setInterval(()=>{
    if(PAUSED)return;
    const left=dur-(Date.now()-SO.start);
    $("#socTimer").style.width=Math.max(0,left/dur*100)+"%";
    if(left<=0){clearInterval(SO.ti);playCard(null)}
  },90);
}
function playCard(sig){
  if(!SO.cur)return;clearInterval(SO.ti);
  const a=SO.cur.a,good=sig===a.s;
  document.querySelectorAll(".hcard").forEach(b=>{
    b.disabled=true;
    if(b.dataset.s===a.s)b.classList.add("good");
    else if(b.dataset.s===sig)b.classList.add("bad");
  });
  if(good){
    addScore(30);S.hits++;mark("acro:"+a.s,true);sGood();
    SO.thp--;$("#thHp").style.width=(SO.thp/SO.tmax*100)+"%";$("#thHpTxt").textContent=`${SO.thp} / ${SO.tmax}`;
    fiche($("#socToast"),`<b>${a.s} — ${a.d}.</b> ${a.def}`);
  }else{
    loseHp();mark("acro:"+a.s,false);
    S.errors.push({q:a.sym,a:`${a.s} — ${a.d}`});
    fiche($("#socToast"),`<b>${a.s} — ${a.d}.</b> ${a.def}`);
  }
  hudSOC();
  setTimeout(()=>{
    if(S.hp<=0)return endRun();
    if(SO.thp<=0){S.wave++;S.score+=100;newThreat()}
    else nextSOC();
  },1250);
}
$("#hand").onclick=e=>{const b=e.target.closest(".hcard");if(b&&!b.disabled)playCard(b.dataset.s)};
$("#qSoc").onclick=()=>{clearInterval(SO&&SO.ti);S=null;show("hub");paintHub()};

