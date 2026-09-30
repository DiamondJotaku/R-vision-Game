/* =======================================================
   JEU 7 — DÉSAMORÇAGE
   ======================================================= */
let BB=null,bbTi=null;
const BOMBDIF=[
 {n:3,nom:"Amorce simple",i:"🧨",s:"3 modules, 2 min 30. Pour se mettre en jambes."},
 {n:5,nom:"Charge standard",i:"💣",s:"5 modules, 4 min. Le format de référence."},
 {n:7,nom:"Cauchemar",i:"☢️",s:"7 modules, 5 min 15. Aucune place pour l'hésitation."}
];
function startBOMB(){
  newSession("bomb");decks={};TOAST="#bombToast";
  show("bomb");clearInterval(bbTi);
  $("#bTimerWrap").style.display="none";$("#bombGrid").innerHTML="";
  $("#bClock").textContent="—";$("#bMods").innerHTML="Modules <b>0/0</b>";$("#bLeds").innerHTML="";
  $("#bombBox").innerHTML=`<div class="tname">Solo ou à deux ?</div>
    <div class="tsub">Trois erreurs cumulées, ou le chrono à zéro, et elle saute.</div>
    <div class="acards">
      <button class="acard" data-duo="1" style="--c:var(--gold)">
        <span class="ei">👥</span><span><b>À deux — bombe et manuel</b><span>Un désamorceur sur cet écran, un décodeur sur un autre téléphone avec les tables. Modules Fils, Clavier chiffré, Flèches, Colorize et Couche.</span></span>
        <span class="mult"><b>2</b><br>joueurs</span></button>
      ${BOMBDIF.map((d,i)=>`<button class="acard" data-i="${i}" style="--c:${i===0?"var(--l4)":i===1?"var(--l6)":"var(--bad)"}">
      <span class="ei">${d.i}</span><span><b>${d.nom} — solo</b><span>${d.s}</span></span>
      <span class="mult"><b>${d.n}</b><br>modules</span></button>`).join("")}</div>`;
  $("#bombBox").querySelectorAll(".acard").forEach(b=>b.onclick=()=>b.dataset.duo?startDUO():armBomb(BOMBDIF[+b.dataset.i]));
}
function armBomb(d){
  const tot=d.n*45000;
  BB={n:d.n,solved:0,err:0,left:tot,total:tot,mods:shuffle(PLAYER_MG).slice(0,d.n).map(id=>({id,ok:false})),busy:false};
  $("#bTimerWrap").style.display="block";
  paintBomb();bombGrid();
  clearInterval(bbTi);
  bbTi=setInterval(()=>{
    if(PAUSED)return;
    BB.left-=100;$("#bTimer").style.width=Math.max(0,BB.left/BB.total*100)+"%";
    const s=Math.max(0,BB.left/1000);
    $("#bClock").textContent=Math.floor(s/60)+":"+String(Math.floor(s%60)).padStart(2,"0");
    if(BB.left<=0)boom("Chrono écoulé.");
  },100);
}
function paintBomb(){
  $("#bMods").innerHTML=`Modules <b>${BB.solved}/${BB.n}</b>`;
  $("#bLeds").innerHTML=[0,1,2].map(i=>`<span class="led ${i<BB.err?"on":""}"></span>`).join("");
}
function bombGrid(){
  duKey=null;BB.busy=false;
  $("#bombGrid").innerHTML=BB.mods.map((m,i)=>
    `<button class="bmod ${m.ok?"ok":""}" data-i="${i}" ${m.ok?"disabled":""}>${m.ok?"✓ ":""}${MG[m.id].nom}<small>${m.ok?"neutralisé":"à neutraliser · repart de zéro si tu le quittes"}</small></button>`).join("");
  $("#bombBox").innerHTML=`<div class="announce"><div class="big" style="color:var(--l6)">${BB.n-BB.solved} module${BB.n-BB.solved>1?"s":""} restant${BB.n-BB.solved>1?"s":""}</div>
    <div class="s">Choisis celui que tu veux traiter maintenant.</div></div>`;
  $("#bombGrid").querySelectorAll(".bmod").forEach(b=>b.onclick=()=>{
    const m=BB.mods[+b.dataset.i];if(m.ok)return;
    $("#bombGrid").querySelectorAll(".bmod").forEach(x=>x.classList.toggle("act",x===b));
    MG[m.id].run($("#bombBox"),mkApi(()=>{
      m.ok=true;BB.solved++;S.score+=120;paintBomb();
      if(BB.solved>=BB.n)return defused();
      fiche($("#bombToast"),`<b>Module neutralisé.</b> Il en reste ${BB.n-BB.solved}.`);
      setTimeout(bombGrid,900);
    },()=>{
      BB.err++;BB.left=Math.max(500,BB.left-12000);paintBomb();
      beep(120,.3,"sawtooth");
      if(BB.err>=3)boom("Trois erreurs.");
    }));
  });
}
function defused(){
  clearInterval(bbTi);
  const s=Math.round(BB.left/1000);
  S.score+=400+s*3;S.note=`désamorcée avec ${s} s d'avance`;
  $("#bombGrid").innerHTML="";$("#bTimerWrap").style.display="none";
  $("#bombBox").innerHTML=`<div class="announce"><div class="big" style="color:var(--ok)">Désamorcée ✂️</div>
    <div class="s">${BB.n} modules neutralisés, ${BB.err} erreur${BB.err>1?"s":""}, ${s} s d'avance.</div></div>`;
  beep(620,.12);setTimeout(()=>beep(920,.2),130);
  setTimeout(endRun,2200);
}
function boom(raison){
  clearInterval(bbTi);duKey=null;
  S.note=raison+" "+BB.solved+" module"+(BB.solved>1?"s":"")+" sur "+BB.n;
  $("#bombBox").innerHTML=`<div class="announce"><div class="big">💥 Explosion</div><div class="s">${raison}</div></div>`;
  sBad();setTimeout(endRun,1600);
}
$("#qBomb").onclick=()=>{clearInterval(bbTi);duKey=null;S=null;show("hub");paintHub()};

