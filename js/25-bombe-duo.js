/* =======================================================
   JEU 8 — DÉSAMORÇAGE À DEUX (bombe + manuel)
   ======================================================= */
const SYMS=["✦","▣","◍","※","⌁","☍","⟁","✕","◆","⧉"];
const ARROWS=["↑","→","↓","←"];
const COLS=[{k:"rouge",c:"#d64a3f"},{k:"vert",c:"#3f9e53"},{k:"bleu",c:"#3f7fd6"}];
function rng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);
  t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function sshuffle(arr,r){arr=arr.slice();for(let i=arr.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}return arr}
function bookFor(seed){
  const r=rng(seed);
  const order=sshuffle(SYMS,r),symDigit={},digitSym={};
  order.forEach((s,i)=>{symDigit[s]=i;digitSym[i]=s});
  const arrows=[0,1,2].map(()=>{const a=sshuffle(ARROWS,r),m={};TH.forEach((t,i)=>m[t.k]=a[i]);return m});
  const colors={};ACROS.forEach(a=>colors[a.s]=COLS[Math.floor(r()*3)].k);
  const fils={};[3,4].forEach(n=>{const th=sshuffle(TH,r);fils[n]={pair:th[0].k,impair:th[1].k}});
  return{order,symDigit,digitSym,arrows,colors,fils};
}
const DUODIF=[
 {nom:"Entraînement",i:"🧯",s:"3 modules, 6 minutes, module couche désactivé.",mods:3,t:360000,osi:0},
 {nom:"Standard",i:"💣",s:"4 modules, 5 minutes, module couche toutes les 28 s.",mods:4,t:300000,osi:28000},
 {nom:"Cauchemar",i:"☢️",s:"4 modules, 4 minutes, module couche toutes les 18 s.",mods:4,t:240000,osi:18000}
];
const DUOMODS={
 fils:{nom:"Fils",s:"module actif"},
 code:{nom:"Clavier chiffré",s:"module actif"},
 fleches:{nom:"Flèches",s:"module actif"},
 colorize:{nom:"Colorize",s:"module actif"}
};
let DU=null,duoTi=null;

function startDUO(){
  newSession("duo");TOAST="#duoToast";
  show("duo");clearInterval(duoTi);
  $("#osiAlarm").style.display="none";$("#duoGrid").innerHTML="";
  $("#dClock").textContent="—";$("#dSerial").innerHTML="Série <b>----</b>";
  $("#dMods").innerHTML="Modules <b>0/0</b>";$("#dLeds").innerHTML="";
  $("#duoBox").innerHTML=`<div class="tname">Désamorçage à deux</div>
    <div class="tsub">Le désamorceur garde cet écran. Le décodeur ouvre « Manuel du décodeur » sur son propre téléphone et saisit le numéro de série affiché. Interdit de montrer son écran à l'autre.</div>
    <div class="acards">${DUODIF.map((d,i)=>`<button class="acard" data-i="${i}" style="--c:${i===0?"var(--l4)":i===1?"var(--l6)":"var(--bad)"}">
      <span class="ei">${d.i}</span><span><b>${d.nom}</b><span>${d.s}</span></span>
      <span class="mult"><b>${d.mods}</b><br>modules</span></button>`).join("")}</div>
    <div class="tsub" style="margin-top:14px">Série imposée (facultatif) : si le décodeur a imprimé un manuel, saisis son numéro ici pour retrouver les mêmes tables.</div>
    <input class="search" id="duoSeed" inputmode="numeric" maxlength="4" placeholder="Numéro de série à 4 chiffres">`;
  $("#duoBox").querySelectorAll(".acard").forEach(b=>b.onclick=()=>armDuo(DUODIF[+b.dataset.i]));
}
function armDuo(d){
  const forced=parseInt(($("#duoSeed")&&$("#duoSeed").value)||"",10);
  const seed=(forced>=1000&&forced<=9999)?forced:1000+Math.floor(Math.random()*9000);
  const ids=shuffle(Object.keys(DUOMODS)).slice(0,d.mods);
  DU={seed,book:bookFor(seed),left:d.t,total:d.t,err:0,solved:0,
      active:null,mods:ids.map(id=>({id,ok:false,st:null})),osiP:d.osi,osiNext:d.osi?d.osi:Infinity,osiOn:false,osiLeft:0,osiL:null,busy:false};
  $("#dSerial").innerHTML=`Série <b>${seed}</b>`;
  paintDuo();duoGrid();
  clearInterval(duoTi);
  duoTi=setInterval(()=>{
    if(PAUSED)return;
    DU.left-=100;
    $("#dTimer").style.width=Math.max(0,DU.left/DU.total*100)+"%";
    const s=Math.max(0,DU.left/1000);
    $("#dClock").textContent=Math.floor(s/60)+":"+String(Math.floor(s%60)).padStart(2,"0");
    if(DU.osiP){
      if(!DU.osiOn){DU.osiNext-=100;if(DU.osiNext<=0)osiAlarmOn()}
      else{DU.osiLeft-=100;$("#aClock").textContent=Math.ceil(DU.osiLeft/1000);
        if(DU.osiLeft<=0){osiAlarmOff();strikeDuo(`<b>Module couche ignoré.</b> C'était la couche ${DU.osiL.n} — ${DU.osiL.nom}.`)}}
    }
    if(DU.left<=0)boomDuo("Chrono écoulé.");
  },100);
}
function paintDuo(){
  $("#dMods").innerHTML=`Modules <b>${DU.solved}/${DU.mods.length}</b>`;
  $("#dLeds").innerHTML=[0,1,2].map(i=>`<span class="led ${i<DU.err?"on":""}"></span>`).join("");
}
function strikeDuo(msg){
  DU.err++;DU.left=Math.max(500,DU.left-12000);paintDuo();sBad();
  fiche($("#duoToast"),msg+" <b>Erreur + 12 s de pénalité.</b>");
  if(DU.err>=3)boomDuo("Trois erreurs.");
}
function osiAlarmOn(){
  DU.osiOn=true;DU.osiL=OSI[(Math.random()*7)|0];DU.osiLeft=12000;
  $("#osiAlarm").style.display="block";$("#aTxt").textContent=DU.osiL.role;
  $("#lnums").innerHTML=OSI.map(l=>`<button class="lnum" data-n="${l.n}" style="--c:var(--l${l.n})">${l.n}</button>`).join("");
  $("#lnums").querySelectorAll(".lnum").forEach(b=>b.onclick=()=>{
    const L=DU.osiL;
    if(+b.dataset.n===L.n){osiAlarmOff();S.hits++;S.score+=40;sGood();
      fiche($("#duoToast"),`<b>Couche ${L.n} — ${L.nom}.</b> ${L.role}`);}
    else{osiAlarmOff();strikeDuo(`<b>C'était la couche ${L.n} — ${L.nom}.</b>`);S.errors.push({q:L.role,a:`Couche ${L.n} — ${L.nom}`})}
  });
  beep(240,.25,"square");
}
function osiAlarmOff(){DU.osiOn=false;DU.osiNext=DU.osiP;$("#osiAlarm").style.display="none"}
function duoGrid(){
  duKey=null;DU.busy=false;
  $("#duoGrid").innerHTML=DU.mods.map((m,i)=>
    `<button class="bmod ${m.ok?"ok":""}" data-i="${i}" ${m.ok?"disabled":""}>${m.ok?"✓ ":""}${DUOMODS[m.id].nom}<small>${m.ok?"neutralisé":m.st?"en cours":"module actif"}</small></button>`).join("");
  DU.active=null;
  $("#duoBox").innerHTML=`<div class="announce"><div class="big" style="color:var(--l6)">${DU.mods.length-DU.solved} module${DU.mods.length-DU.solved>1?"s":""} restant${DU.mods.length-DU.solved>1?"s":""}</div>
    <div class="s">Numéro de série ${DU.seed}.</div></div>`;
  $("#duoGrid").querySelectorAll(".bmod").forEach(b=>b.onclick=()=>openMod(+b.dataset.i));
  markGrid();
}
function duoSolved(m,msg){
  m.ok=true;DU.solved++;S.score+=180;paintDuo();sGood();
  fiche($("#duoToast"),msg);
  if(DU.solved>=DU.mods.length)return defusedDuo();
  setTimeout(duoGrid,1100);
}
function defusedDuo(){
  clearInterval(duoTi);$("#osiAlarm").style.display="none";
  const s=Math.round(DU.left/1000);
  S.score+=600+s*4;S.note=`désamorcée à deux, ${s} s d'avance, ${DU.err} erreur${DU.err>1?"s":""}`;
  $("#duoGrid").innerHTML="";
  $("#duoBox").innerHTML=`<div class="announce"><div class="big" style="color:var(--ok)">Désamorcée ✂️</div>
    <div class="s">${DU.mods.length} modules, ${s} s d'avance.</div></div>`;
  beep(620,.12);setTimeout(()=>beep(920,.2),130);
  setTimeout(endRun,2400);
}
function boomDuo(raison){
  clearInterval(duoTi);duKey=null;$("#osiAlarm").style.display="none";
  S.note=raison+" "+DU.solved+" module"+(DU.solved>1?"s":"")+" sur "+DU.mods.length;
  $("#duoBox").innerHTML=`<div class="announce"><div class="big">💥 Explosion</div><div class="s">${raison}</div></div>`;
  sBad();setTimeout(endRun,1700);
}

/* --- navigation entre modules --- */
function openMod(i){
  const m=DU.mods[i];if(m.ok)return;
  DU.active=i;markGrid();
  ({fils:modFils,code:modCode,fleches:modFleches,colorize:modColorize})[m.id](m);
}
function markGrid(){
  $("#duoGrid").querySelectorAll(".bmod").forEach((b,i)=>{
    b.classList.toggle("act",i===DU.active);
    b.classList.toggle("ok",DU.mods[i].ok);
  });
}
/* --- module Fils --- */
function modFils(m){
  if(!m.st){
    const n=3+((Math.random()*2)|0),par=(DU.seed%10)%2===0?"pair":"impair";
    const cible=DU.book.fils[n][par];
    const bon=shuffle(ACROS.filter(a=>a.t===cible))[0];
    const autres=shuffle(ACROS.filter(a=>a.t!==cible)).slice(0,n-1);
    m.st={bon,cible,wires:shuffle([bon,...autres]),cut:[]};
  }
  const st=m.st,cw=["var(--l7)","var(--l4)","var(--l3)","var(--l6)"];
  const paint=()=>{
    $("#duoBox").innerHTML=`<div class="tname">Module Fils</div>
      ${st.wires.map((a,i)=>`<div class="wirerow ${st.cut.includes(a.s)?"cut":""}" data-s="${a.s}"><b>${a.s}</b><span class="ln" style="--c:${cw[i]}"></span>${st.cut.includes(a.s)?"<span class='mono' style='font-size:12px;color:var(--muted)'>coupé</span>":"<button class='ghost'>Couper</button>"}</div>`).join("")}`;
    $("#duoBox").querySelectorAll(".wirerow button").forEach(btn=>btn.onclick=()=>{
      const row=btn.closest(".wirerow"),a=ACROS.find(x=>x.s===row.dataset.s);
      st.cut.push(a.s);
      if(a.s===st.bon.s){S.hits++;paint();duoSolved(m,`<b>${st.bon.s} — ${st.bon.d}</b> : ${TH.find(t=>t.k===st.cible).n}.`)}
      else{const T2=TH.find(t=>t.k===a.t);
        strikeDuo(`<b>${a.s} relève de ${T2.n}.</b>`);
        S.errors.push({q:a.s,a:T2.n});paint()}
    });
  };paint();
}
/* --- module Clavier chiffré --- */
function modCode(m){
  if(!m.st){
    const p=shuffle(PORTS)[0],t=askPort(p);
    const base=p.al&&Math.random()<.5?p.al.split(",")[0].trim():(Math.random()<.4?p.c:p.s);
    m.st={p,t,seq:[],indice:base+(t.q?` <em class="qual">${t.q}</em>`:"")};
  }
  const st=m.st,p=st.p;
  const paint=()=>{
    $("#duoBox").innerHTML=`<div class="tname">Module Clavier chiffré</div>
      <div class="subject">${st.indice}<div class="mono" style="font-size:26px;color:var(--l6);letter-spacing:6px;min-height:34px">${st.seq.map(i=>DU.book.digitSym[i]).join("")||"·····"}</div></div>
      <div class="syms">${DU.book.order.map(sy=>`<button class="sym" data-s="${sy}">${sy}</button>`).join("")}</div>
      <div class="two" style="margin-top:9px"><button class="btn" id="cDel">⌫ Effacer</button><button class="btn solid" id="cOk">Valider</button></div>`;
    $("#duoBox").querySelectorAll(".sym").forEach(b=>b.onclick=()=>{
      if(st.seq.length<5){st.seq.push(DU.book.symDigit[b.dataset.s]);sPop();paint()}});
    $("#cDel").onclick=()=>{st.seq.pop();paint()};
    $("#cOk").onclick=()=>{
      if(!st.seq.length)return;
      if(st.seq.join("")===st.t.n){S.hits++;duoSolved(m,`<b>${st.t.full} → ${st.t.n}.</b> ${portLine(p)}. ${p.c}`)}
      else{strikeDuo(`<b>${st.t.full} → ${st.t.n}.</b> ${portLine(p)}. ${p.c}`);S.errors.push({q:st.t.full,a:st.t.n});st.seq=[];paint()}
    };
  };paint();
}
/* --- module Flèches --- */
function modFleches(m){
  if(!m.st)m.st={lvl:0,a:shuffle(ACROS)[0]};
  const st=m.st;
  const paint=()=>{
    const a=st.a,T=TH.find(t=>t.k===a.t);
    $("#duoBox").innerHTML=`<div class="tname">Module Flèches — étape ${st.lvl+1} sur 3</div>
      <div class="qbig" style="text-align:center"><span class="s">${a.s}</span></div>
      <div class="arrows">
        <button class="arr sp"></button><button class="arr" data-a="↑">↑</button><button class="arr sp"></button>
        <button class="arr" data-a="←">←</button><button class="arr sp"></button><button class="arr" data-a="→">→</button>
        <button class="arr sp"></button><button class="arr" data-a="↓">↓</button><button class="arr sp"></button>
      </div>`;
    $("#duoBox").querySelectorAll(".arr[data-a]").forEach(b=>b.onclick=()=>{
      if(b.dataset.a===DU.book.arrows[st.lvl][a.t]){
        S.hits++;st.lvl++;sGood();
        fiche($("#duoToast"),`<b>${a.s} — ${a.d}</b> : ${T.n}.`);
        if(st.lvl>=3)return duoSolved(m,`<b>Module Flèches neutralisé.</b>`);
        st.a=shuffle(ACROS)[0];setTimeout(paint,700);
      }else{
        strikeDuo(`<b>${a.s} — ${a.d}</b> relève de ${T.n}.`);
        S.errors.push({q:a.s,a:T.n});st.lvl=0;st.a=shuffle(ACROS)[0];setTimeout(paint,1300);
      }
    });
  };paint();
}
/* --- module Colorize --- */
function modColorize(m){
  if(!m.st)m.st={n:0,a:shuffle(ACROS)[0]};
  const st=m.st;
  const paint=()=>{
    const a=st.a,att=DU.book.colors[a.s];
    $("#duoBox").innerHTML=`<div class="tname">Module Colorize — ${st.n} sur 3</div>
      <div class="qbig">${a.def}</div>
      <div class="cols">${COLS.map(c=>`<button class="colb" data-k="${c.k}" style="--c:${c.c}">${c.k}</button>`).join("")}</div>`;
    $("#duoBox").querySelectorAll(".colb").forEach(b=>b.onclick=()=>{
      if(b.dataset.k===att){
        S.hits++;st.n++;sGood();fiche($("#duoToast"),`<b>${a.s} — ${a.d}.</b> ${a.def}`);
        if(st.n>=3)return duoSolved(m,`<b>Module Colorize neutralisé.</b>`);
        st.a=shuffle(ACROS)[0];setTimeout(paint,800);
      }else{
        strikeDuo(`<b>${a.s} — ${a.d}</b> : couleur attendue ${att}.`);
        S.errors.push({q:a.def,a:a.s+" — "+a.d});st.a=shuffle(ACROS)[0];setTimeout(paint,1400);
      }
    });
  };paint();
}
$("#qDuo").onclick=()=>{clearInterval(duoTi);duKey=null;S=null;show("hub");paintHub()};

/* --- le manuel du décodeur --- */
function openManual(seed){
  show("manual");
  const box=$("#manualBox");
  if(!seed){
    box.innerHTML=`<div class="tname" style="font-size:20px">Manuel du décodeur</div>
      <p class="lead" style="margin:6px 0 14px">Tu tiens les tables, l'autre tient la bombe. Il connaît les ports, les sigles et les couches ; toi, tu connais les correspondances. Personne ne montre son écran.</p>
      <p class="lead" style="margin:0 0 14px">Saisis le numéro de série affiché en haut de sa bombe : le manuel est différent pour chaque série.</p>
      <input class="search" id="mSeed" inputmode="numeric" maxlength="4" placeholder="Numéro de série à 4 chiffres">
      <button class="btn solid" id="mGo" style="width:100%">Ouvrir le manuel</button>`;
    $("#mGo").onclick=()=>{const v=parseInt($("#mSeed").value,10);if(v>=1000&&v<=9999)openManual(v)};
    $("#mSeed").onkeydown=e=>{if(e.key==="Enter")$("#mGo").click()};
    return;
  }
  const b=bookFor(seed),par=(seed%10)%2===0?"pair":"impair";
  const th=k=>TH.find(t=>t.k===k).n;
  const tri=ACROS.slice().sort((x,y)=>x.s.localeCompare(y.s,"fr"));
  box.innerHTML=`<div class="man">
    <div class="tname" style="font-size:20px">Manuel du décodeur — série ${seed}</div>
    <p class="lead" style="margin:6px 0 4px">Valable pour cette bombe uniquement. Dernier chiffre de la série : <b>${seed%10}</b>, donc colonne <b>${par}e</b>.</p>
    <p class="lead" style="margin:0 0 14px">Trois erreurs et elle saute. Chaque erreur coûte aussi 12 secondes. Tu peux tout dire à voix haute, mais ne montre jamais l'écran.</p>

    <h2>Ton rôle en quatre phrases</h2>
    <div class="step" style="--c:var(--l5)">
      <ol><li>Demande-lui quel module il attaque.</li>
      <li>Demande-lui l'information que la table réclame (le thème, un chiffre, un sigle).</li>
      <li>Lis la ligne correspondante et dis-lui quoi presser.</li>
      <li>S'il hésite, fais-lui énoncer son raisonnement : c'est lui qui doit savoir, pas toi.</li></ol>
    </div>

    <h2>Module Fils</h2>
    <div class="step" style="--c:var(--l7)">
      <p>Il voit 3 ou 4 fils, chacun marqué d'un sigle.</p>
      <p><b>Demande-lui :</b> combien de fils.</p>
      <table class="mtable" style="margin:8px 0">
        <tr><th>Nombre de fils</th><th>Thème à couper (série ${par}e)</th></tr>
        <tr><td class="big2">3 fils</td><td>${th(b.fils[3][par])}</td></tr>
        <tr><td class="big2">4 fils</td><td>${th(b.fils[4][par])}</td></tr>
      </table>
      <p class="say">« Coupe le fil dont le sigle appartient au thème … »</p>
      <p class="warn">Ne lui donne jamais le sigle : c'est à lui de savoir lequel relève de ce thème.</p>
    </div>

    <h2>Module Clavier chiffré</h2>
    <div class="step" style="--c:var(--l6)">
      <p>Il voit un nom de service et dix touches marquées de symboles. Il doit connaître le port.</p>
      <p><b>Demande-lui :</b> les chiffres du port, un par un.</p>
      <table class="mtable" style="margin:8px 0">
        <tr>${[0,1,2,3,4].map(i=>`<th style="text-align:center">${i}</th>`).join("")}</tr>
        <tr>${[0,1,2,3,4].map(i=>`<td class="sym">${b.digitSym[i]}</td>`).join("")}</tr>
        <tr>${[5,6,7,8,9].map(i=>`<th style="text-align:center">${i}</th>`).join("")}</tr>
        <tr>${[5,6,7,8,9].map(i=>`<td class="sym">${b.digitSym[i]}</td>`).join("")}</tr>
      </table>
      <p class="say">« Pour le 6, appuie sur … »</p>
      <p>Quand il a tout saisi, rappelle-lui de valider. En cas de faute de frappe, le bouton effacer retire le dernier symbole, sans pénalité.</p>
    </div>

    <h2>Module Flèches</h2>
    <div class="step" style="--c:var(--l1)">
      <p>Il voit un sigle et quatre flèches. Trois étapes à enchaîner.</p>
      <p><b>Demande-lui :</b> le numéro d'étape affiché, puis le thème du sigle.</p>
      <table class="mtable" style="margin:8px 0">
        <tr><th>Thème annoncé</th><th style="text-align:center">Étape 1</th><th style="text-align:center">Étape 2</th><th style="text-align:center">Étape 3</th></tr>
        ${TH.map(t=>`<tr><td>${t.n}</td>${[0,1,2].map(l=>`<td style="font-size:21px;text-align:center">${b.arrows[l][t.k]}</td>`).join("")}</tr>`).join("")}
      </table>
      <p class="warn">Après une erreur le module repart de l'étape 1 : reviens à la première colonne.</p>
    </div>

    <h2>Module Colorize</h2>
    <div class="step" style="--c:var(--l3)">
      <p>Il voit une définition et trois boutons rouge, vert, bleu. Trois définitions à passer.</p>
      <p><b>Demande-lui :</b> le sigle correspondant à la définition.</p>
      <p class="warn">S'il te donne la signification développée, redemande le sigle : la table est classée par sigle.</p>
      <div class="mgrid" style="margin-top:8px">${tri.map(a=>{const c=COLS.find(c=>c.k===b.colors[a.s]);
        return `<span style="--c:${c.c};color:${c.c}">${a.s} · ${c.k}</span>`}).join("")}</div>
    </div>

    <h2>Module Couche</h2>
    <div class="step" style="--c:var(--l4)">
      <p>Aucune table. Le bandeau rouge s'allume tout seul, affiche le rôle d'une couche OSI, et il a douze secondes pour cliquer le bon numéro.</p>
      <p>Ton rôle : le prévenir dès qu'il clignote et compter à voix haute les trois dernières secondes. Il répond seul.</p>
    </div>

    <h2>Si la bombe saute</h2>
    <div class="step" style="--c:var(--muted)">
      <p>Relancez une partie : une nouvelle série donne un nouveau manuel. Pour rejouer avec ce manuel imprimé, le désamorceur saisit <b class="big2">${seed}</b> dans le champ « série imposée » avant de choisir sa difficulté.</p>
    </div>

    <div class="two" style="margin-top:16px">
      <button class="btn" id="mBack">Autre série</button>
      <button class="btn solid" id="mPrint">Imprimer ou PDF</button>
    </div></div>`;
  $("#mBack").onclick=()=>openManual(null);
  $("#mPrint").onclick=()=>window.print();
}
$("#qManual").onclick=()=>show("hub");
$("#openManual").onclick=()=>openManual(null);

