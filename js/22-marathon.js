/* =======================================================
   JEU 6 — MARATHON
   ======================================================= */
let MA=null;
function startMARA(){
  newSession("mara");decks={};TOAST="#maraToast";
  MA={dist:0,goal:1200,speed:6,pal:1,last:0,t0:Date.now(),etape:1};
  show("mara");$("#maraToast").className="toast empty";
  $("#maraToast").textContent="La foulée ralentit sans arrêt. Chaque bonne réponse la relance ; une faute ne coûte que le temps perdu.";
  nextMara();raf=requestAnimationFrame(stepMara);
}
function paintMara(){
  const pct=Math.min(100,MA.dist/MA.goal*100);
  $("#maBar").style.width=pct+"%";
  $("#runner").style.left=Math.max(4,Math.min(96,pct))+"%";
  $("#maSpeed").innerHTML=`Allure <b>${MA.speed.toFixed(1)} m/s</b>`;
  $("#maPal").innerHTML=`Palier <b>${MA.pal}</b>`;
  $("#maDist").textContent=Math.round(MA.dist)+" / "+MA.goal+" m";
  document.querySelector(".track2").classList.toggle("tired",MA.speed<2);
}
function stepMara(ts){
  if(!S||S.kind!=="mara")return;
  if(PAUSED){MA.last=ts;raf=requestAnimationFrame(stepMara);return}
  if(!MA.last)MA.last=ts;
  const dt=Math.min(90,ts-MA.last);MA.last=ts;
  MA.speed=Math.max(0,MA.speed-(.16+.10*(MA.pal-1))*dt/1000);
  MA.dist+=MA.speed*dt/1000;
  const pal=Math.min(4,1+Math.floor(MA.dist/(MA.goal/4)));
  if(pal!==MA.pal){
    MA.pal=pal;beep(520,.13);
    fiche($("#maraToast"),`<b>Palier ${pal} sur 4.</b> La fatigue augmente : il faut enchaîner plus vite.`);
  }
  paintMara();
  if(MA.dist>=MA.goal)return winMara();
  if(MA.speed<=.05){
    cancelAnimationFrame(raf);raf=null;
    S.note=`épuisée à ${Math.round(MA.dist)} m (étape ${MA.etape})`;
    return endRun();
  }
  raf=requestAnimationFrame(stepMara);
}
function nextMara(){
  duKey=null;
  const id=shuffle(PLAYER_MG)[0];
  MG[id].run($("#maraBox"),mkApi(
    (f,t)=>{if(f===0){MA.speed+=2.6;MA.dist+=35;S.score+=60;fiche($("#maraToast"),"<b>Épreuve parfaite : relance de vitesse.</b>")}
      setTimeout(nextMara,500)},
    null,
    0,
    ()=>{MA.speed=Math.min(18,MA.speed+1.5);S.score+=12}
  ));
}
function winMara(){
  cancelAnimationFrame(raf);raf=null;
  const sec=Math.round((Date.now()-MA.t0)/1000);
  S.score+=700+Math.max(0,300-sec*2);
  MA.etape++;S.note=`ligne d'arrivée en ${Math.floor(sec/60)} min ${sec%60} s`;
  $("#maraBox").innerHTML=`<div class="announce"><div class="big" style="color:var(--ok)">Ligne franchie 🏁</div>
    <div class="s">${MA.goal} m en ${sec} s. Étape ${MA.etape} : 200 m de plus et fatigue accrue.</div></div>`;
  beep(620,.12);setTimeout(()=>beep(880,.2),130);
  setTimeout(()=>{
    MA.goal+=200;MA.dist=0;MA.pal=1;MA.speed=6;MA.last=0;MA.t0=Date.now();
    paintMara();nextMara();raf=requestAnimationFrame(stepMara);
  },2200);
}
$("#qMara").onclick=()=>{cancelAnimationFrame(raf);raf=null;duKey=null;S=null;show("hub");paintHub()};

