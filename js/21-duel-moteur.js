/* =======================================================
   MOTEUR DU DUEL
   ======================================================= */
const BOSS=[
 {n:"Le Saboteur",av:"🎭",hp:150,s:"Il coupe les câbles pendant que tu révises."},
 {n:"Kryptos",av:"🔒",hp:195,s:"Rançongiciel : il chiffre tout ce qu'il touche."},
 {n:"L'Admin fantôme",av:"👻",hp:240,s:"Compte à privilèges détourné, il connaît ton annuaire."}
];
const ATK=[
 {n:"Tempête de paquets",mg:"code",t:30000,d:22,s:"Il inonde le pare-feu : retrouve les ports avant la saturation."},
 {n:"Brouillage des couches",mg:"role",t:30000,d:22,s:"Les rôles OSI sont mélangés : remets-les en place."},
 {n:"Injection de sigles",mg:"qcmInv",t:30000,d:24,s:"Des définitions défilent : nomme-les vite."},
 {n:"Chaos thématique",mg:"tri",t:40000,d:26,s:"Il vide les quatre boîtes : retrie tout."},
 {n:"Surcharge du réacteur",mg:"seq",t:26000,d:26,s:"La pile part en fusion : rétablis l'ordre."}
];
const PLAYER_MG=["dl","stack","tri","power","code","fils","qcm","qcmInv","radio","seq","role","flux","intrus","vrai","proto","memo","ordre","etage"];
const EFFETS=[
 {k:"atk",i:"⚔️",n:"Attaque",c:"var(--bad)",d:"Inflige des dégâts au boss."},
 {k:"heal",i:"✚",n:"Soin",c:"var(--ok)",d:"Restaure tes PV."},
 {k:"shield",i:"🛡️",n:"Bouclier",c:"var(--l3)",d:"Absorbe la prochaine attaque."}
];
const DIFF={
 facile:{n:"Facile",i:"🌤️",s:"PV confortables, chrono large, une erreur pardonnée par épreuve.",
   pv:130,boss:.75,dmg:1.25,soin:1.3,bouclier:1.3,temps:1.45,seuil:.35,riposte:.7,grace:1},
 normal:{n:"Normal",i:"⛅",s:"Les conditions de l'oral : pas de marge, pas de cadeau.",
   pv:100,boss:1,dmg:1,soin:1,bouclier:1,temps:1,seuil:.5,riposte:1,grace:0},
 difficile:{n:"Difficile",i:"⛈️",s:"Chrono serré, boss coriace, la moindre faute se paie.",
   pv:80,boss:1.3,dmg:.85,soin:.75,bouclier:.75,temps:.72,seuil:.65,riposte:1.4,grace:0}
};
let D=null,duTi=null,duKey=null,DF=DIFF.normal;

function startDUEL(){
  newSession("duel");decks={};TOAST="#duToast";
  D={bi:0,turn:1,pv:100,pvMax:100,shield:0,fat:{},hp:0,hpMax:0,lastUsed:null};
  show("duel");
  $("#duTimerWrap").style.display="none";
  $("#foeAv").textContent="❔";$("#foeName").textContent="Adversaire inconnu";$("#foeSub").textContent="Choisis d'abord ta difficulté.";
  $("#foeHp").style.width="100%";$("#foeNum").textContent="";$("#meNum").textContent="";$("#meTags").innerHTML="";
  $("#duBox").innerHTML=`<div class="tname">Niveau de difficulté</div>
    <div class="tsub">Elle change tes PV, ceux du boss, les dégâts, les soins, le chrono et le seuil d'esquive.</div>
    <div class="acards">${Object.keys(DIFF).map(k=>{const d=DIFF[k];
      return `<button class="acard" data-k="${k}" style="--c:${k==="facile"?"var(--l4)":k==="normal"?"var(--l6)":"var(--bad)"}">
        <span class="ei">${d.i}</span><span><b>${d.n}</b><span>${d.s}</span></span>
        <span class="mult"><b>${d.pv} PV</b><br>boss ×${d.boss}</span></button>`}).join("")}</div>`;
  $("#duBox").querySelectorAll(".acard").forEach(b=>b.onclick=()=>{
    DF=DIFF[b.dataset.k];
    D.pvMax=D.pv=DF.pv;
    loadBoss();hand();
  });
}
function loadBoss(){
  const b=BOSS[D.bi%BOSS.length],up=Math.floor(D.bi/BOSS.length)*70;
  D.hpMax=D.hp=Math.round((b.hp+up)*DF.boss);D.boss=b;
  $("#foeAv").textContent=b.av;$("#foeName").textContent=b.n;$("#foeSub").textContent=b.s;
  paintDuel();
}
function paintDuel(){
  $("#foeHp").style.width=Math.max(0,D.hp/D.hpMax*100)+"%";
  $("#foeNum").textContent=`${Math.max(0,D.hp)} / ${D.hpMax} PV`;
  $("#meHp").style.width=Math.max(0,D.pv/D.pvMax*100)+"%";
  $("#meNum").textContent=`${Math.max(0,D.pv)} / ${D.pvMax} PV`;
  $("#duScore").innerHTML=`Score <b>${S.score}</b>`;
  $("#duTurn").innerHTML=`Tour <b>${D.turn}</b>`;
  $("#meTags").innerHTML=`<span class="tag">${DF.i} ${DF.n}</span>`+(D.shield?`<span class="tag sh">bouclier ${D.shield}</span>`:"")+(DF.grace?`<span class="tag wk">1 erreur pardonnée par épreuve</span>`:"");
}
function pop(sel,txt,col){
  const p=document.createElement("div");p.className="dmg";p.textContent=txt;p.style.color=col;p.style.top="6px";
  $(sel).appendChild(p);setTimeout(()=>p.remove(),1000);
  $(sel).classList.add("hit3");setTimeout(()=>$(sel).classList.remove("hit3"),450);
}
function hand(){
  duKey=null;$("#duTimerWrap").style.display="none";
  if(D.lastUsed)PLAYER_MG.forEach(id=>{if(id!==D.lastUsed)D.fat[id]=Math.min(1,(D.fat[id]===undefined?1:D.fat[id])+.1)});
  const ids=shuffle(PLAYER_MG).slice(0,3);
  const eff=shuffle(EFFETS);
  const cards=ids.map((id,i)=>({id,e:i===0?EFFETS[0]:eff[i%eff.length]}));
  $("#meSub").textContent="Choisis ton épreuve. Une épreuve déjà usée frappe moins fort.";
  $("#duBox").innerHTML=`<div class="tname">Ton tour</div>
    <div class="tsub">Sans faute, l'effet est maximal. Chaque erreur le réduit.</div>
    <div class="acards">${cards.map((c,i)=>{
      const m=fat(c.id);
      return `<button class="acard" data-i="${i}" style="--c:${c.e.c}">
        <span class="ei">${c.e.i}</span>
        <span><b>${MG[c.id].nom}</b><span>${c.e.n} · ${MG[c.id].sub}</span></span>
        <span class="mult"><b>×${m.toFixed(2)}</b><br>${m>=1?"fraîche":m<=.4?"épuisée":"usée"}</span></button>`;
    }).join("")}</div>`;
  $("#duBox").querySelectorAll(".acard").forEach(b=>b.onclick=()=>playCardDuel(cards[+b.dataset.i]));
  paintDuel();
}
const fat=id=>D.fat[id]===undefined?1:D.fat[id];
function playCardDuel(c){
  const m=fat(c.id);
  D.fat[c.id]=Math.max(.1,m-.3);D.lastUsed=c.id;
  const api=mkApi((f,t)=>{
    const r=t?(t-f)/t:0,perfect=f===0;
    const p=(0.3+0.7*r)*(perfect?1.3:1)*m;
    if(c.e.k==="atk"){
      const dmg=Math.round(26*p*DF.dmg);D.hp-=dmg;S.score+=dmg*2;
      pop("#foePanel","−"+dmg,"var(--bad)");
      fiche($("#duToast"),`<b>${dmg} dégâts${perfect?" — sans faute, coup critique !":"."}</b>`);
    }else if(c.e.k==="heal"){
      const v=Math.round(20*p*DF.soin);D.pv=Math.min(D.pvMax,D.pv+v);S.score+=v;
      pop("#mePanel","+"+v,"var(--ok)");fiche($("#duToast"),`<b>+${v} PV.</b>`);
    }else if(c.e.k==="shield"){
      const v=Math.round(22*p*DF.bouclier);D.shield+=v;S.score+=v;
      pop("#mePanel","🛡 "+v,"var(--l3)");fiche($("#duToast"),`<b>Bouclier ${v}.</b> Il absorbe la prochaine attaque.`);
    }
    paintDuel();
    setTimeout(()=>{if(D.hp<=0)return winBoss();bossTurn()},1200);
  },null,DF.grace);
  MG[c.id].run($("#duBox"),api);
}
function bossTurn(){
  duKey=null;
  const a=ATK[(D.turn-1+D.bi)%ATK.length];
  $("#duBox").innerHTML=`<div class="announce"><div class="big">${D.boss.av} ${a.n}</div><div class="s">${a.s}</div></div>`;
  beep(180,.3,"sawtooth");
  setTimeout(()=>{
    const total=Math.max(12000,Math.round((a.t-(D.turn-1)*1200)*DF.temps));let left=total;
    $("#duTimerWrap").style.display="block";$("#duTimer").style.width="100%";
    const api=mkApi((f,t)=>{
      clearInterval(duTi);$("#duTimerWrap").style.display="none";
      const used=1-left/total;
      let dmg=left/total>=DF.seuil?0:Math.round(a.d*DF.riposte*Math.pow(used,1.6));
      finishBoss(dmg,dmg===0?"Repoussé sans une égratignure.":"Tu encaisses le choc.");
    },()=>{left=Math.max(600,left-3000);$("#duTimer").style.width=(left/total*100)+"%"},DF.grace);
    clearInterval(duTi);
    duTi=setInterval(()=>{
      if(PAUSED)return;
      left-=100;$("#duTimer").style.width=Math.max(0,left/total*100)+"%";
      if(left<=0){clearInterval(duTi);api.dead=true;$("#duTimerWrap").style.display="none";
        finishBoss(Math.round(a.d*1.4*DF.riposte),"Attaque non contenue.")}
    },100);
    MG[a.mg].run($("#duBox"),api);
  },1500);
}
function finishBoss(dmg,msg){
  duKey=null;
  if(D.shield){const abs=Math.min(D.shield,dmg);D.shield-=abs;dmg-=abs}
  D.pv-=dmg;
  if(dmg>0){pop("#mePanel","−"+dmg,"var(--bad)");sBad()}else sGood();
  fiche($("#duToast"),`<b>${msg}</b> ${dmg>0?dmg+" dégâts subis.":"Aucun dégât."}`);
  paintDuel();
  setTimeout(()=>{
    if(D.pv<=0){D.pv=0;paintDuel();return endRun()}
    D.turn++;S.wave=D.turn;hand();
  },1400);
}
function winBoss(){
  S.score+=450;D.bi++;D.pv=Math.min(D.pvMax,D.pv+35);D.shield=0;D.fat={};D.lastUsed=null;
  fiche($("#duToast"),`<b>${D.boss.n} est neutralisé.</b> +450 points, +35 PV. Un autre arrive.`);
  $("#duBox").innerHTML=`<div class="announce"><div class="big" style="color:var(--ok)">Menace neutralisée</div><div class="s">Le suivant est déjà dans le réseau.</div></div>`;
  beep(600,.12);setTimeout(()=>beep(900,.18),130);
  setTimeout(()=>{loadBoss();D.turn++;hand()},1800);
}
$("#qDuel").onclick=()=>{clearInterval(duTi);duKey=null;S=null;show("hub");paintHub()};

