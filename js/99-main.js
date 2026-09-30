/* --- injection des boutons dans les écrans de jeu --- */
const MODESCR={"s-fw":"fw","s-soc":"soc","s-duel":"duel","s-red":"red","s-mara":"mara","s-bomb":"bomb","s-duo":"duo","s-port":"port","s-zen":"zen"};
Object.keys(MODESCR).forEach(id=>{
  const hud=document.querySelector("#"+id+" .hud");if(!hud)return;
  const k=MODESCR[id];
  const c=document.createElement("button");
  c.className="ghost cheatBtn";c.textContent="📋";c.title="Fiche de notes";
  c.style.marginLeft="auto";c.onclick=openCheat;
  const q=document.createElement("button");
  q.className="ghost";q.textContent="?";q.title="Règles";q.onclick=()=>openRules(k);
  hud.appendChild(c);hud.appendChild(q);
});
function paintRev(){
  const on=!!DB.rev;
  $("#revSw").classList.toggle("on",on);
  document.querySelectorAll(".cheatBtn").forEach(b=>b.style.display=on?"":"none");
}
$("#revSw").onclick=()=>{DB.rev=!DB.rev;save();paintRev()};

/* --- boutons ? sur les cartes de la salle serveur --- */
document.querySelectorAll(".game").forEach(card=>{
  const k=card.dataset.g;if(!RULES[k])return;
  const q=document.createElement("span");
  q.className="qbtn";q.textContent="?";q.setAttribute("role","button");q.title="Règles";
  q.onclick=e=>{e.stopPropagation();openRules(k)};
  card.appendChild(q);
});

function paintFiches(f){$("#ficheList").innerHTML=ficheHTML(f)}
$("#search").oninput=e=>paintFiches(e.target.value);

/* =======================================================
   DÉMARRAGE
   ======================================================= */
paintRev();
if(DB.patch!==PATCH_V){
  const d=document.createElement("span");d.className="dot9";$("#newsBtn").appendChild(d);
  setTimeout(()=>openPatch(true),450);
}
