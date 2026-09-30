/* =======================================================
   SESSION COMMUNE
   ======================================================= */
let S=null,raf=null;
function newSession(kind){
  S={kind,score:0,combo:1,streak:0,hp:3,wave:1,hits:0,errors:[]};
  return S;
}
function addScore(base){S.score+=Math.round(base*S.combo);S.streak++;if(S.streak%4===0)S.combo=Math.min(5,S.combo+1)}
function loseHp(){S.hp--;S.streak=0;S.combo=1;sBad()}
function fiche(el,html){el.innerHTML=html;el.classList.remove("empty")}
function endRun(){
  cancelAnimationFrame(raf);raf=null;
  const xp=Math.round(S.score/4)+S.hits*3;
  DB.xp+=xp;
  const rev=!!DB.rev;
  if(!rev&&S.score>(DB.best[S.kind]||0))DB.best[S.kind]=S.score;
  save();
  $("#endScore").textContent=S.score;
  $("#endSub").textContent=(S.note?S.note+" · ":"")+`${S.hits} bonnes réponses · ${rev?"version révision, record non enregistré":"record : "+(DB.best[S.kind]||0)}`;
  $("#endXp").textContent=`+${xp} XP`;
  $("#errTitle").style.display=S.errors.length?"block":"none";
  $("#errList").innerHTML=S.errors.slice(0,12).map(e=>`<div class="err"><div class="q">${e.q}</div><div class="a">${e.a}</div></div>`).join("");
  show("end");paintHub();
}
$("#againBtn").onclick=()=>start(S.kind);
$("#hubBtn").onclick=()=>{show("hub");paintHub()};

