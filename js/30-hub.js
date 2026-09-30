/* =======================================================
   HUB
   ======================================================= */
const STARTERS={fw:startFW,port:startPort,soc:startSOC,red:startRED,duel:startDUEL,mara:startMARA,bomb:startBOMB,duo:startDUO,zen:startZEN};
function start(kind){(STARTERS[kind]||startDUEL)()}
document.querySelectorAll(".game").forEach(b=>b.onclick=()=>start(b.dataset.g));
function paintHub(){
  const {r,nx}=rank();
  $("#rkIco").textContent=r[2];$("#rkName").textContent=r[1];
  const base=r[0],top=nx?nx[0]:r[0]+1;
  $("#rkBar").style.width=(nx?Math.min(100,(DB.xp-base)/(top-base)*100):100)+"%";
  $("#rkXp").textContent=nx?`${DB.xp} XP · ${top-DB.xp} avant ${nx[1]}`:`${DB.xp} XP · grade maximal`;
  $("#b-mara").textContent="Record "+(DB.best.mara||0);
  $("#b-bomb").textContent="Record "+(DB.best.bomb||0);
  $("#b-duel").textContent="Record "+(DB.best.duel||0);
  $("#b-red").textContent="Record "+(DB.best.red||0);
  $("#b-fw").textContent="Record "+(DB.best.fw||0);
  $("#b-port").textContent="Record "+(DB.best.port||0);
  $("#b-soc").textContent="Record "+(DB.best.soc||0);
}
paintHub();
$("#thBtn").onclick=()=>{
  const light=document.documentElement.getAttribute("data-theme")==="light";
  document.documentElement.setAttribute("data-theme",light?"dark":"light");
};
$("#sndBtn").onclick=()=>{muted=!muted;$("#sndBtn").textContent=muted?"🔇":"🔊"};
$("#resetBtn").onclick=()=>{
  if(confirm("Efface les XP, les records et la mémoire de tes erreurs sur cet appareil. Irréversible. Continuer ?")){
    DB={xp:0,best:{mara:0,bomb:0,duo:0,zen:0,duel:0,red:0,fw:0,port:0,osi:0,soc:0},m:{}};save();paintHub();
  }
};
$("#openFiches").onclick=()=>{paintFiches("");show("fiches")};
$("#qFiches").onclick=()=>show("hub");

