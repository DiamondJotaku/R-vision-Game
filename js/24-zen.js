/* =======================================================
   MODE ZEN
   ======================================================= */
function startZEN(){
  newSession("zen");decks={};TOAST="#zenToast";
  show("zen");$("#zenToast").className="toast empty";
  $("#zenToast").textContent="Pas de chrono, pas de points de vie. La fiche s'affiche à chaque réponse.";
  nextZen();
}
function nextZen(){
  duKey=null;
  const id=shuffle(PLAYER_MG)[0];
  MG[id].run($("#zenBox"),mkApi(()=>setTimeout(nextZen,700),null,0,
    ()=>{S.score+=10;$("#zGood").innerHTML=`Bonnes réponses <b>${S.hits}</b>`}));
  $("#zGood").innerHTML=`Bonnes réponses <b>${S.hits}</b>`;
}
$("#zenSkip").onclick=()=>nextZen();
$("#qZen").onclick=()=>{duKey=null;S.note="session zen";endRun()};
$("#openZen").onclick=()=>startZEN();

