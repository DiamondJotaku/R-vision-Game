/* =======================================================
   JEU 4 — ALERTE ROUGE
   ======================================================= */
const fromPorts=names=>names.map(n=>{const p=PORTS.find(x=>x.s===n);return{s:p.s,p:p.p}});
const CLAIR=fromPorts(["telnet","http","ftp","smtp","pop3","imap","snmp","ldap","tftp"]);
const CHIFFRE=fromPorts(["https","ssh","ldaps","imaps","pop3s","ftps","ipsec-msft","isakmp / ike"]);
const SABOTAGES=[
 {n:"Surcharge du réacteur",s:"Les correctifs doivent passer avant la fusion."},
 {n:"Coupure des communications",s:"Le tunnel site-à-site est tombé, plus rien ne sort."},
 {n:"Chiffrement de la baie de disques",s:"Un rançongiciel avance sur le SAN."},
 {n:"Compromission de l'annuaire",s:"Un compte admin du domaine a été repris."},
 {n:"Bascule sur onduleur",s:"L'autonomie batterie court jusqu'au bout du compte à rebours."}
];
let RD=null,redTi=null,redKey=null;
const taskMG=id=>function(){
  TOAST="#redToast";
  MG[id].run($("#taskbox"),mkApi(
    ()=>taskDone(),
    ()=>{RD.left=Math.max(500,RD.left-3000);S.combo=1;S.streak=0},
    0,
    ()=>addScore(25)));
};
const TASKS=[taskWires,taskDownload,taskKeypad,taskReactor,taskFlux,
  taskMG("proto"),taskMG("radio"),taskMG("ordre"),taskMG("vrai")];

function startRED(){
  newSession("red");TOAST="#redToast";
  RD={alert:1,left:100000,tasks:[],idx:0};
  show("red");newAlert();
  clearInterval(redTi);redTi=setInterval(tickRED,100);
}
function tickRED(){
  if(PAUSED)return;
  RD.left-=100;
  const s=Math.max(0,RD.left/1000);
  $("#redClock").textContent=Math.floor(s/60)+":"+String(Math.floor(s%60)).padStart(2,"0");
  $("#redAlertBox").classList.toggle("urgent",s<20);
  if(RD.left<=0){clearInterval(redTi);endRun()}
}
function hudRED(){
  $("#redScore").innerHTML=`Score <b>${S.score}</b>`;
  $("#redAlert").innerHTML=`Alerte <b>${RD.alert}</b>`;
  $("#redDots").innerHTML=RD.tasks.map((_,i)=>
    `<i class="${i<RD.idx?"done":i===RD.idx?"now":""}"></i>`).join("");
}
function newAlert(){
  const sb=SABOTAGES[(RD.alert-1)%SABOTAGES.length];
  $("#sabName").textContent="Alerte rouge — "+sb.n;
  $("#sabSub").textContent=sb.s;
  RD.tasks=shuffle(TASKS).slice(0,4);RD.idx=0;TOAST="#redToast";
  S.wave=RD.alert;
  renderTask();
}
function renderTask(){redKey=null;hudRED();RD.tasks[RD.idx]();}
function taskDone(){
  S.score+=60;RD.idx++;
  if(RD.idx>=RD.tasks.length){
    S.score+=250;RD.alert++;
    RD.left=Math.min(RD.left+45000,Math.max(60000,105000-(RD.alert-1)*8000));
    beep(520,.1);setTimeout(()=>beep(780,.14),110);
    fiche($("#redToast"),`<b>Sabotage contenu.</b> Alerte ${RD.alert} en approche, le compte à rebours se resserre.`);
    setTimeout(newAlert,900);
  }else renderTask();
  hudRED();
}
function penalty(ms,html,err){
  RD.left=Math.max(500,RD.left-ms);S.combo=1;S.streak=0;sBad();
  fiche($("#redToast"),html);if(err)S.errors.push(err);
}
function reward(pts,html){addScore(pts);S.hits++;sGood();fiche($("#redToast"),html);hudRED()}

/* --- tâche : les fils --- */
function taskWires(){
  const variante=Math.random()<.5?"d":"def";
  const pick=shuffle(weak(ACROS,a=>"acro:"+a.s)).slice(0,4);
  const right=shuffle(pick);
  const cols=["var(--l6)","var(--l3)","var(--l5)","var(--l1)"];
  $("#taskbox").innerHTML=`
    <div class="tname">Rebrancher les fils</div>
    <div class="tsub">Touche un sigle, puis ${variante==="d"?"sa signification":"sa définition"}.</div>
    <div class="wires" id="wires">
      <svg id="wsvg"></svg>
      <div class="wcol">${pick.map((a,i)=>`<button class="wire l" data-i="${i}" style="--c:${cols[i]}"><b>${a.s}</b><span class="dot"></span></button>`).join("")}</div>
      <div class="wcol">${right.map(a=>`<button class="wire r" data-s="${a.s}" style="--c:var(--line)"><span class="dot"></span><span>${variante==="d"?a.d:a.def}</span></button>`).join("")}</div>
    </div>`;
  const wl=[...document.querySelectorAll(".wire.l")],wr=[...document.querySelectorAll(".wire.r")];
  let sel=null,done=0;const conns=[];
  const draw=()=>{
    const box=$("#wires").getBoundingClientRect(),svg=$("#wsvg");
    svg.setAttribute("viewBox",`0 0 ${box.width} ${box.height}`);
    svg.innerHTML=conns.map(([a,b,c])=>{
      const ra=a.querySelector(".dot").getBoundingClientRect(),rb=b.querySelector(".dot").getBoundingClientRect();
      const x1=ra.left-box.left+ra.width/2,y1=ra.top-box.top+ra.height/2;
      const x2=rb.left-box.left+rb.width/2,y2=rb.top-box.top+rb.height/2,mx=(x1+x2)/2;
      return `<path d="M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    }).join("");
  };
  wl.forEach(b=>b.onclick=()=>{
    if(b.classList.contains("done"))return;
    wl.forEach(x=>x.classList.remove("sel"));b.classList.add("sel");sel=b;sPop();
  });
  wr.forEach(b=>b.onclick=()=>{
    if(!sel||b.classList.contains("done"))return;
    const a=pick[+sel.dataset.i];
    if(b.dataset.s===a.s){
      const c=cols[+sel.dataset.i];
      b.classList.add("done");sel.classList.add("done");sel.classList.remove("sel");
      b.style.setProperty("--c",c);conns.push([sel,b,c]);draw();
      mark("acro:"+a.s,true);reward(40,`<b>${a.s} — ${a.d}.</b> ${a.def}`);
      sel=null;done++;
      if(done===4)setTimeout(taskDone,700);
    }else{
      const bad=ACROS.find(x=>x.s===b.dataset.s),cur=sel;
      b.classList.add("err");cur.classList.add("err");
      mark("acro:"+a.s,false);
      penalty(3000,`<b>Mauvais fil.</b> ${bad.s} signifie « ${bad.d} ». ${a.s} est ailleurs.`,{q:a.s,a:a.d});
      setTimeout(()=>{b.classList.remove("err");cur.classList.remove("err")},340);
    }
  });
  addEventListener("resize",draw,{once:true});
}

/* --- tâche : téléchargement (la pile) --- */
function taskDownload(){
  let pct=0;const pool=shuffle(weak(OSI_ITEMS,i=>"osi:"+i.n));
  const paint=()=>{
    if(!pool.length)pool.push(...shuffle(OSI_ITEMS));
    const it=pool.pop(),L=OSI[it.n-1];
    $("#taskbox").innerHTML=`
      <div class="tname">Téléchargement des correctifs</div>
      <div class="tsub">Chaque élément bien rangé fait avancer le transfert. Une erreur le fait reculer.</div>
      <div class="dlbar"><i style="width:${pct}%"></i></div>
      <div class="dlpct">${Math.round(pct)} %</div>
      <div class="subject">${it.l}</div>
      <div class="lrows">${OSI.map(l=>`<button class="lrow" data-n="${l.n}" style="--c:var(--l${l.n})"><span class="num">${l.n}</span><span>${l.nom}</span></button>`).join("")}</div>`;
    document.querySelectorAll(".lrow").forEach(b=>b.onclick=()=>{
      if(b.disabled)return;
      document.querySelectorAll(".lrow").forEach(x=>x.disabled=true);
      if(+b.dataset.n===it.n){
        pct=Math.min(100,pct+20);mark("osi:"+it.n,true);
        reward(30,`<b>${it.l} → couche ${L.n}, ${L.nom}.</b> ${L.role}`);
      }else{
        pct=Math.max(0,pct-14);mark("osi:"+it.n,false);
        penalty(2500,`<b>${it.l} → couche ${L.n}, ${L.nom}.</b> ${L.role}`,{q:it.l,a:`Couche ${L.n} — ${L.nom}`});
      }
      $(".dlbar i").style.width=pct+"%";$(".dlpct").textContent=Math.round(pct)+" %";
      if(pct>=100)setTimeout(taskDone,700);else setTimeout(paint,520);
    });
  };
  paint();
}

/* --- tâche : code d'accès (ports) --- */
function taskKeypad(){
  let n=0,typed="",cur=null;
  const pool=shuffle(weak(PORTS,p=>"port:"+p.s));
  const keys=["1","2","3","4","5","6","7","8","9","del","0","ok"];
  let tgt=null;
  const take=()=>{cur=pool.pop()||PORTS[(Math.random()*PORTS.length)|0];tgt=askPort(cur);typed=""};
  const paint=()=>{
    $("#taskbox").innerHTML=`
      <div class="tname">Code d'accès de la salle serveur</div>
      <div class="tsub">Trois ports à saisir. ${n} sur 3 validés.</div>
      <div class="subject">${tgt.lbl}
        <div class="mono" style="font-size:23px;color:var(--l6);letter-spacing:5px;min-height:30px">${typed||"·····"}</div></div>
      <div class="pad">${keys.map(k=>k==="del"?`<button class="key del" data-k="del">⌫</button>`
        :k==="ok"?`<button class="key send" data-k="ok">OK</button>`
        :`<button class="key" data-k="${k}">${k}</button>`).join("")}</div>`;
    $("#taskbox .pad").onclick=e=>{const b=e.target.closest(".key");if(b)press(b.dataset.k)};
  };
  const press=k=>{
    if(k==="del")typed=typed.slice(0,-1);
    else if(k==="ok"){
      if(!typed)return;
      if(typed===tgt.n){
        n++;mark("port:"+cur.s,true);reward(40,`<b>${tgt.full} → ${tgt.n}.</b> ${portLine(cur)}. ${cur.c}`);
        if(n>=3){typed="";paint();return setTimeout(taskDone,600)}
        take();
      }else{
        mark("port:"+cur.s,false);
        penalty(3000,`<b>${tgt.full} → ${tgt.n}.</b> ${portLine(cur)}. ${cur.c}`,{q:tgt.full,a:tgt.n});
        typed="";
      }
    }else if(typed.length<5){typed+=k;sPop()}
    paint();
  };
  take();paint();redKey=press;
}

/* --- tâche : séquence du réacteur --- */
function taskReactor(){
  let step=0;
  $("#taskbox").innerHTML=`
    <div class="tname">Séquence du réacteur</div>
    <div class="tsub">Touche les sept couches dans l'ordre, de la physique vers l'application.</div>
    <div class="seq">${shuffle(OSI).map(l=>`<button class="seqbtn" data-n="${l.n}">${l.nom}</button>`).join("")}</div>`;
  document.querySelectorAll(".seqbtn").forEach(b=>b.onclick=()=>{
    const n=+b.dataset.n,L=OSI[step];
    if(n===step+1){
      b.classList.add("on");b.disabled=true;step++;sPop();
      fiche($("#redToast"),`<b>Couche ${L.n} — ${L.nom}.</b> ${L.role}`);
      if(step===7){reward(70,"<b>Séquence complète.</b> Physique, Liaison de données, Réseau, Transport, Session, Présentation, Application.");setTimeout(taskDone,700)}
    }else{
      b.classList.add("no");setTimeout(()=>b.classList.remove("no"),340);
      penalty(3000,`<b>La suivante est la couche ${L.n} : ${L.nom}.</b> ${L.role}`,{q:"Ordre des couches OSI",a:`Couche ${L.n} = ${L.nom}`});
    }
  });
}

/* --- tâche : tri des flux --- */
function taskFlux(){
  const clair=Math.random()<.5;
  const cibles=shuffle(clair?CLAIR:CHIFFRE).slice(0,4);
  const leurres=shuffle(clair?CHIFFRE:CLAIR).slice(0,4);
  const all=shuffle([...cibles,...leurres]);let found=0;
  $("#taskbox").innerHTML=`
    <div class="tname">${clair?"Couper les protocoles en clair":"Autoriser les protocoles chiffrés"}</div>
    <div class="tsub">Sélectionne les quatre services ${clair?"non chiffrés":"chiffrés"} de la liste.</div>
    <div class="chips">${all.map(x=>`<button class="chipbtn" data-t="${cibles.includes(x)?1:0}" data-s="${x.s}" data-p="${x.p}"><b>${x.s}</b><span>${x.p}</span></button>`).join("")}</div>`;
  document.querySelectorAll(".chipbtn").forEach(b=>b.onclick=()=>{
    if(b.disabled)return;
    if(b.dataset.t==="1"){
      b.classList.add("hit");b.disabled=true;found++;
      reward(25,`<b>${b.dataset.s} — ${b.dataset.p}</b> : ${clair?"transite en clair, à couper":"chiffré, à autoriser"}.`);
      if(found===4)setTimeout(taskDone,700);
    }else{
      b.classList.add("miss");setTimeout(()=>b.classList.remove("miss"),340);
      penalty(3000,`<b>${b.dataset.s} — ${b.dataset.p}</b> est ${clair?"chiffré":"en clair"} : ce n'est pas une cible ici.`);
    }
  });
}
$("#qRed").onclick=()=>{clearInterval(redTi);redKey=null;S=null;show("hub");paintHub()};

