/* =======================================================
   JEU 5 — DUEL : bibliothèque de mini-jeux partagée
   ======================================================= */
const TH=["reseau","systemes","virtu","gouv"].map(k=>({k,n:CATN[k],c:CATC[k]}));
let decks={};
function deal(key,list,n){
  let d=decks[key];
  if(!d||!d.length)d=decks[key]=shuffle(list);
  const out=[];
  while(out.length<n){if(!d.length)d=decks[key]=shuffle(list);out.push(d.pop())}
  return out;
}
let TOAST="#duToast";
function mkApi(cb,onFault,grace,onGood){
  let gr=grace||0;
  const a={f:0,t:0,dead:false,
    good(h){if(a.dead)return;a.t++;S.hits++;sGood();fiche($(TOAST),h);onGood&&onGood()},
    bad(h,e){if(a.dead)return;a.t++;if(e)S.errors.push(e);
      if(gr>0){gr--;beep(300,.1);fiche($(TOAST),"<b>Erreur pardonnée.</b> "+h);return}
      a.f++;sBad();fiche($(TOAST),h);onFault&&onFault()},
    end(){if(a.dead)return;a.dead=true;cb(a.f,a.t)}};
  return a;
}
const qopts=(box,list,goodTxt,onPick)=>{
  box.innerHTML=shuffle(list).map(o=>`<button class="qopt" data-o="${String(o).replace(/"/g,"&quot;")}">${o}</button>`).join("");
  box.querySelectorAll(".qopt").forEach(b=>b.onclick=()=>{
    if(b.disabled)return;
    box.querySelectorAll(".qopt").forEach(x=>{x.disabled=true;if(x.dataset.o===goodTxt)x.classList.add("good")});
    if(b.dataset.o!==goodTxt)b.classList.add("bad");
    onPick(b.dataset.o===goodTxt);
  });
};
const MG={};

/* 1 — Téléchargement : les 4 thèmes */
MG.dl={nom:"Téléchargement des correctifs",sub:"Range chaque sigle dans son thème. Juste, le transfert avance ; faux, il recule.",
run(h,api){
  let pct=0;
  const paint=()=>{
    const a=deal("dl",ACROS,1)[0],T=TH.find(t=>t.k===a.t);
    h.innerHTML=`<div class="tname">${MG.dl.nom}</div><div class="tsub">${MG.dl.sub}</div>
      <div class="dlbar"><i style="width:${pct}%"></i></div><div class="dlpct">${Math.round(pct)} %</div>
      <div class="qbig"><span class="s">${a.s}</span></div>
      <div class="qopts">${TH.map(t=>`<button class="qopt" data-k="${t.k}" style="border-left:4px solid ${t.c}">${t.n}</button>`).join("")}</div>`;
    h.querySelectorAll(".qopt").forEach(b=>b.onclick=()=>{
      h.querySelectorAll(".qopt").forEach(x=>{x.disabled=true;if(x.dataset.k===a.t)x.classList.add("good")});
      if(b.dataset.k===a.t){pct=Math.min(100,pct+25);api.good(`<b>${a.s} — ${a.d}.</b> Thème : ${T.n}.`)}
      else{b.classList.add("bad");pct=Math.max(0,pct-10);api.bad(`<b>${a.s}</b> appartient au thème ${T.n}. ${a.def}`,{q:a.s,a:T.n})}
      h.querySelector(".dlbar i").style.width=pct+"%";h.querySelector(".dlpct").textContent=Math.round(pct)+" %";
      setTimeout(()=>pct>=100?api.end():paint(),560);
    });
  };paint();
}};

/* 2 — Assemblage de la pile OSI (glisser-déposer) */
MG.stack={nom:"Assemblage de la pile",sub:"Attrape chaque couche et dépose-la à son étage, de la 1 en bas à la 7 en haut.",
run(h,api){
  h.innerHTML=`<div class="tname">${MG.stack.nom}</div><div class="tsub">${MG.stack.sub}</div>
    <div class="slots">${OSI.map(l=>`<div class="slot" data-n="${l.n}" style="--c:var(--l${l.n})"><span class="num">${l.n}</span><span class="ph">— libre —</span></div>`).join("")}</div>
    <div class="tray">${shuffle(OSI).map(l=>`<button class="tile" data-n="${l.n}">${l.nom}</button>`).join("")}</div>`;
  let placed=0,armed=null,gh=null,moved=0;
  const drop=(tile,slot)=>{
    if(slot.classList.contains("on"))return;
    const L=OSI[+tile.dataset.n-1],sn=+slot.dataset.n;
    if(sn===+tile.dataset.n){
      slot.classList.add("on");slot.querySelector(".ph").textContent=L.nom;
      tile.classList.add("gone");placed++;
      api.good(`<b>Couche ${L.n} — ${L.nom}.</b> ${L.role}`);
      if(placed===7)setTimeout(()=>api.end(),450);
    }else{
      slot.classList.add("no");setTimeout(()=>slot.classList.remove("no"),330);
      api.bad(`<b>${L.nom} est la couche ${L.n}</b>, pas la ${sn}. ${L.role}`,{q:L.nom,a:"Couche "+L.n});
    }
    tile.classList.remove("sel");armed=null;
  };
  h.querySelectorAll(".tile").forEach(t=>{
    t.addEventListener("pointerdown",e=>{
      if(t.classList.contains("gone"))return;
      e.preventDefault();moved=0;armed=t;
      h.querySelectorAll(".tile").forEach(x=>x.classList.remove("sel"));t.classList.add("sel");
      gh=document.createElement("div");gh.className="ghostile";gh.textContent=t.textContent;
      gh.style.left=e.clientX+"px";gh.style.top=e.clientY+"px";document.body.appendChild(gh);
      t.setPointerCapture(e.pointerId);sPop();
    });
    t.addEventListener("pointermove",e=>{
      if(!gh||armed!==t)return;moved++;
      gh.style.left=e.clientX+"px";gh.style.top=e.clientY+"px";
    });
    t.addEventListener("pointerup",e=>{
      if(!gh||armed!==t)return;
      const el=document.elementFromPoint(e.clientX,e.clientY),slot=el&&el.closest(".slot");
      gh.remove();gh=null;
      if(slot)drop(t,slot);
    });
  });
  h.querySelectorAll(".slot").forEach(s=>s.onclick=()=>{if(armed)drop(armed,s)});
}};

/* 3 — Triage des sigles dans les 4 thèmes */
MG.tri={nom:"Triage des sigles",sub:"Envoie chaque sigle dans la bonne boîte thématique.",
run(h,api){
  const lot=deal("tri",ACROS,8);let done=0,sel=null;
  h.innerHTML=`<div class="tname">${MG.tri.nom}</div><div class="tsub">${MG.tri.sub}</div>
    <div class="pool">${lot.map((a,i)=>`<button class="sig" data-i="${i}">${a.s}</button>`).join("")}</div>
    <div class="boxes">${TH.map(t=>`<button class="box" data-k="${t.k}" style="--c:${t.c}"><span class="bt">${t.n}</span><span class="in"></span></button>`).join("")}</div>`;
  h.querySelectorAll(".sig").forEach(b=>b.onclick=()=>{
    h.querySelectorAll(".sig").forEach(x=>x.classList.remove("sel"));b.classList.add("sel");sel=b;sPop();
  });
  h.querySelectorAll(".box").forEach(bx=>bx.onclick=()=>{
    if(!sel)return;
    const a=lot[+sel.dataset.i],T=TH.find(t=>t.k===a.t);
    if(bx.dataset.k===a.t){
      bx.querySelector(".in").insertAdjacentHTML("beforeend",`<span>${a.s}</span>`);
      sel.classList.add("gone");sel=null;done++;
      api.good(`<b>${a.s} — ${a.d}.</b> ${a.def}`);
      if(done===8)setTimeout(()=>api.end(),450);
    }else{
      bx.classList.add("no");setTimeout(()=>bx.classList.remove("no"),330);
      api.bad(`<b>${a.s}</b> va dans « ${T.n} ». ${a.def}`,{q:a.s,a:T.n});
    }
  });
}};

/* 4 — Divert Power : 10 interrupteurs */
MG.power={nom:"Dérivation de l'alimentation",sub:"Baisse l'interrupteur portant le port du service demandé.",
run(h,api){
  const lot=deal("power",PORTS,10).map(p=>({p,t:askPort(p)}));
  const cibles=shuffle(lot).slice(0,5);let i=0;
  const paint=()=>{
    const c=cibles[i];
    h.innerHTML=`<div class="tname">${MG.power.nom}</div><div class="tsub">${MG.power.sub}</div>
      <div class="prog">${i} sur 5</div>
      <div class="qbig">Router le service <span class="s">${c.t.lbl}</span></div>
      <div class="sw">${lot.map(x=>`<button class="swb" data-n="${x.t.n}"><i></i>${x.t.n}</button>`).join("")}</div>`;
    h.querySelectorAll(".swb").forEach(b=>b.onclick=()=>{
      if(b.disabled)return;
      if(b.dataset.n===c.t.n){
        b.classList.add("on");h.querySelectorAll(".swb").forEach(x=>x.disabled=true);
        api.good(`<b>${c.t.full} → ${c.t.n}.</b> ${portLine(c.p)}. ${c.p.c}`);
        i++;setTimeout(()=>i>=5?api.end():paint(),520);
      }else{
        b.classList.add("no");setTimeout(()=>b.classList.remove("no"),330);
        const w=lot.find(x=>x.t.n===b.dataset.n);
        api.bad(`<b>${b.dataset.n} c'est ${w.t.full}.</b> ${c.t.full} écoute sur ${c.t.n}.`,{q:c.t.full,a:c.t.n});
      }
    });
  };paint();
}};

/* 5 — Entrer le code */
MG.code={nom:"Saisie du code d'accès",sub:"Tape le port du service affiché, puis valide.",
run(h,api){
  let n=0,typed="",cur=null;
  const keys=["1","2","3","4","5","6","7","8","9","del","0","ok"];
  let tgt=null;
  const take=()=>{cur=deal("code",PORTS,1)[0];tgt=askPort(cur);typed=""};
  const paint=()=>{
    h.innerHTML=`<div class="tname">${MG.code.nom}</div><div class="tsub">${MG.code.sub}</div>
      <div class="prog">${n} sur 3</div>
      <div class="subject">${tgt.lbl}<div class="mono" style="font-size:23px;color:var(--l6);letter-spacing:5px;min-height:30px">${typed||"·····"}</div></div>
      <div class="pad">${keys.map(k=>k==="del"?`<button class="key del" data-k="del">⌫</button>`:k==="ok"?`<button class="key send" data-k="ok">OK</button>`:`<button class="key" data-k="${k}">${k}</button>`).join("")}</div>`;
    h.querySelector(".pad").onclick=e=>{const b=e.target.closest(".key");if(b)press(b.dataset.k)};
  };
  const press=k=>{
    if(k==="del")typed=typed.slice(0,-1);
    else if(k==="ok"){
      if(!typed)return;
      if(typed===tgt.n){
        n++;api.good(`<b>${tgt.full} → ${tgt.n}.</b> ${portLine(cur)}. ${cur.c}`);
        if(n>=3){typed="";paint();return setTimeout(()=>api.end(),450)}
        take();
      }else{api.bad(`<b>${tgt.full} → ${tgt.n}.</b> ${portLine(cur)}. ${cur.c}`,{q:tgt.full,a:tgt.n});typed=""}
    }else if(typed.length<5){typed+=k;sPop()}
    paint();
  };
  take();paint();duKey=press;
}};

/* 6 — Les fils */
MG.fils={nom:"Rebrancher les fils",sub:"Touche une borne à gauche, puis sa destination à droite.",
run(h,api){
  const v=["dev","def","port"][(Math.random()*3)|0];
  const src=v==="port"?deal("filsp",PORTS,4):deal("fils",ACROS,4);
  const key=x=>v==="port"?x.s:x.s;
  const val=x=>v==="dev"?x.d:v==="def"?x.def:portLine(x);
  const right=shuffle(src);
  const cols=["var(--l6)","var(--l3)","var(--l5)","var(--l1)"];
  h.innerHTML=`<div class="tname">${MG.fils.nom}</div>
    <div class="tsub">${v==="dev"?"Relie chaque sigle à sa signification.":v==="def"?"Relie chaque sigle à sa définition.":"Relie chaque service à son port."}</div>
    <div class="wires" id="wires2"><svg id="wsvg2"></svg>
      <div class="wcol">${src.map((x,i)=>`<button class="wire l" data-i="${i}" style="--c:${cols[i]}"><b>${key(x)}</b><span class="dot"></span></button>`).join("")}</div>
      <div class="wcol">${right.map(x=>`<button class="wire r" data-s="${key(x)}" style="--c:var(--line)"><span class="dot"></span><span>${val(x)}</span></button>`).join("")}</div>
    </div>`;
  const wl=[...h.querySelectorAll(".wire.l")],wr=[...h.querySelectorAll(".wire.r")];
  let sel=null,done=0;const conns=[];
  const draw=()=>{
    const box=h.querySelector("#wires2").getBoundingClientRect(),svg=h.querySelector("#wsvg2");
    svg.setAttribute("viewBox",`0 0 ${box.width} ${box.height}`);
    svg.innerHTML=conns.map(([a,b,c])=>{
      const ra=a.querySelector(".dot").getBoundingClientRect(),rb=b.querySelector(".dot").getBoundingClientRect();
      const x1=ra.left-box.left+ra.width/2,y1=ra.top-box.top+ra.height/2;
      const x2=rb.left-box.left+rb.width/2,y2=rb.top-box.top+rb.height/2,mx=(x1+x2)/2;
      return `<path d="M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    }).join("");
  };
  wl.forEach(b=>b.onclick=()=>{if(b.classList.contains("done"))return;wl.forEach(x=>x.classList.remove("sel"));b.classList.add("sel");sel=b;sPop()});
  wr.forEach(b=>b.onclick=()=>{
    if(!sel||b.classList.contains("done"))return;
    const x=src[+sel.dataset.i];
    if(b.dataset.s===key(x)){
      const c=cols[+sel.dataset.i];
      b.classList.add("done");sel.classList.add("done");sel.classList.remove("sel");
      b.style.setProperty("--c",c);conns.push([sel,b,c]);draw();sel=null;done++;
      api.good(v==="port"?`<b>${x.s} → ${x.p}.</b> ${x.c}`:`<b>${x.s} — ${x.d}.</b> ${x.def}`);
      if(done===4)setTimeout(()=>api.end(),550);
    }else{
      const cur=sel;b.classList.add("err");cur.classList.add("err");
      api.bad(v==="port"?`<b>${x.s} → ${x.p}.</b> ${x.c}`:`<b>${x.s} — ${x.d}.</b> ${x.def}`,{q:key(x),a:val(x)});
      setTimeout(()=>{b.classList.remove("err");cur.classList.remove("err")},330);
    }
  });
}};

/* 7 — Décodage : sigle → signification */
MG.qcm={nom:"Décodage des sigles",sub:"Un sigle arrive : choisis sa signification exacte.",
run(h,api){
  let i=0;const N=5;
  const paint=()=>{
    const a=deal("qcm",ACROS,1)[0];
    const pool=ACROS.filter(x=>x.t===a.t&&x!==a),lot=(pool.length>=3?pool:ACROS.filter(x=>x!==a));
    h.innerHTML=`<div class="tname">${MG.qcm.nom}</div><div class="tsub">${MG.qcm.sub}</div>
      <div class="prog">${i} sur ${N}</div><div class="qbig"><span class="s">${a.s}</span></div><div class="qopts" id="qo"></div>`;
    qopts(h.querySelector("#qo"),[a.d,...shuffle(lot).slice(0,3).map(x=>x.d)],a.d,ok=>{
      ok?api.good(`<b>${a.s} — ${a.d}.</b> ${a.def}`):api.bad(`<b>${a.s} — ${a.d}.</b> ${a.def}`,{q:a.s,a:a.d});
      i++;setTimeout(()=>i>=N?api.end():paint(),700);
    });
  };paint();
}};

/* 8 — Identification : définition → sigle */
MG.qcmInv={nom:"Identification",sub:"Une définition s'affiche : retrouve le sigle.",
run(h,api){
  let i=0;const N=5;
  const paint=()=>{
    const a=deal("qcmi",ACROS,1)[0];
    const pool=ACROS.filter(x=>x.t===a.t&&x!==a),lot=(pool.length>=3?pool:ACROS.filter(x=>x!==a));
    h.innerHTML=`<div class="tname">${MG.qcmInv.nom}</div><div class="tsub">${MG.qcmInv.sub}</div>
      <div class="prog">${i} sur ${N}</div><div class="qbig">${a.def}</div><div class="qopts" id="qo"></div>`;
    qopts(h.querySelector("#qo"),[a.s,...shuffle(lot).slice(0,3).map(x=>x.s)],a.s,ok=>{
      ok?api.good(`<b>${a.s} — ${a.d}.</b>`):api.bad(`<b>${a.s} — ${a.d}.</b> ${a.def}`,{q:a.def,a:a.s});
      i++;setTimeout(()=>i>=N?api.end():paint(),700);
    });
  };paint();
}};

/* 9 — Radio du SOC : alias et commentaires */
MG.radio={nom:"Écoute radio du SOC",sub:"On te donne un alias ou un commentaire de la table : retrouve le service.",
run(h,api){
  let i=0;const N=5;
  const withAlias=PORTS.filter(p=>p.al);
  const paint=()=>{
    const useAl=Math.random()<.5;
    const p=deal(useAl?"radA":"radC",useAl?withAlias:PORTS,1)[0];
    const lot=PORTS.filter(x=>x!==p);
    h.innerHTML=`<div class="tname">${MG.radio.nom}</div><div class="tsub">${MG.radio.sub}</div>
      <div class="prog">${i} sur ${N}</div>
      <div class="qbig">${useAl?`Alias entendu : <span class="s">${p.al}</span>`:p.c}</div><div class="qopts" id="qo"></div>`;
    qopts(h.querySelector("#qo"),[p.s,...shuffle(lot).slice(0,3).map(x=>x.s)],p.s,ok=>{
      const msg=`<b>${p.s} → ${p.p}.</b> ${p.al?"Alias : "+p.al+". ":""}${p.c}`;
      ok?api.good(msg):api.bad(msg,{q:useAl?p.al:p.c,a:p.s+" — "+p.p});
      i++;setTimeout(()=>i>=N?api.end():paint(),750);
    });
  };paint();
}};

/* 10 — Séquence du réacteur : l'ordre des couches */
MG.seq={nom:"Séquence du réacteur",sub:"Touche les sept couches dans l'ordre, de la physique vers l'application.",
run(h,api){
  let step=0;
  h.innerHTML=`<div class="tname">${MG.seq.nom}</div><div class="tsub">${MG.seq.sub}</div>
    <div class="seq">${shuffle(OSI).map(l=>`<button class="seqbtn" data-n="${l.n}">${l.nom}</button>`).join("")}</div>`;
  h.querySelectorAll(".seqbtn").forEach(b=>b.onclick=()=>{
    const L=OSI[step];
    if(+b.dataset.n===step+1){
      b.classList.add("on");b.disabled=true;step++;
      api.good(`<b>Couche ${L.n} — ${L.nom}.</b> ${L.role}`);
      if(step===7)setTimeout(()=>api.end(),450);
    }else{
      b.classList.add("no");setTimeout(()=>b.classList.remove("no"),330);
      api.bad(`<b>La suivante est la couche ${L.n} : ${L.nom}.</b> ${L.role}`,{q:"Ordre OSI",a:`Couche ${L.n} = ${L.nom}`});
    }
  });
}};

/* 11 — Attribution des rôles OSI */
MG.role={nom:"Attribution des rôles",sub:"Un rôle s'affiche : désigne la couche qui s'en charge.",
run(h,api){
  let i=0;const N=5;
  const paint=()=>{
    const L=deal("role",OSI,1)[0];
    h.innerHTML=`<div class="tname">${MG.role.nom}</div><div class="tsub">${MG.role.sub}</div>
      <div class="prog">${i} sur ${N}</div><div class="qbig">${L.role}</div>
      <div class="lrows">${OSI.map(l=>`<button class="lrow" data-n="${l.n}" style="--c:var(--l${l.n})"><span class="num">${l.n}</span><span>${l.nom}</span></button>`).join("")}</div>`;
    h.querySelectorAll(".lrow").forEach(b=>b.onclick=()=>{
      if(b.disabled)return;h.querySelectorAll(".lrow").forEach(x=>x.disabled=true);
      const ok=+b.dataset.n===L.n;
      ok?api.good(`<b>Couche ${L.n} — ${L.nom}.</b>`):api.bad(`<b>C'était la couche ${L.n} — ${L.nom}.</b> ${L.role}`,{q:L.role,a:`Couche ${L.n} — ${L.nom}`});
      i++;setTimeout(()=>i>=N?api.end():paint(),650);
    });
  };paint();
}};

/* 12 — Clair ou chiffré */
MG.flux={nom:"Filtrage des flux",sub:"Sélectionne les quatre services demandés parmi les huit.",
run(h,api){
  const clair=Math.random()<.5;
  const cibles=shuffle(clair?CLAIR:CHIFFRE).slice(0,4),leurres=shuffle(clair?CHIFFRE:CLAIR).slice(0,4);
  const all=shuffle([...cibles,...leurres]);let found=0;
  h.innerHTML=`<div class="tname">${clair?"Couper les protocoles en clair":"Autoriser les protocoles chiffrés"}</div>
    <div class="tsub">Quatre cibles ${clair?"non chiffrées":"chiffrées"} dans la liste.</div>
    <div class="chips">${all.map(x=>`<button class="chipbtn" data-t="${cibles.includes(x)?1:0}" data-s="${x.s}" data-p="${x.p}"><b>${x.s}</b><span>${x.p}</span></button>`).join("")}</div>`;
  h.querySelectorAll(".chipbtn").forEach(b=>b.onclick=()=>{
    if(b.disabled)return;
    if(b.dataset.t==="1"){
      b.classList.add("hit");b.disabled=true;found++;
      api.good(`<b>${b.dataset.s} — ${b.dataset.p}</b> : ${clair?"en clair":"chiffré"}.`);
      if(found===4)setTimeout(()=>api.end(),450);
    }else{
      b.classList.add("miss");setTimeout(()=>b.classList.remove("miss"),330);
      api.bad(`<b>${b.dataset.s} — ${b.dataset.p}</b> est ${clair?"chiffré":"en clair"}.`);
    }
  });
}};

/* 13 — L'intrus thématique */
MG.intrus={nom:"Chasse à l'intrus",sub:"Trois sigles du même thème, un intrus : désigne-le.",
run(h,api){
  let i=0;const N=4;
  const paint=()=>{
    const t=TH[(Math.random()*4)|0];
    const fam=shuffle(ACROS.filter(a=>a.t===t.k)).slice(0,3);
    const out=shuffle(ACROS.filter(a=>a.t!==t.k))[0];
    const lot=shuffle([...fam,out]);
    h.innerHTML=`<div class="tname">${MG.intrus.nom}</div><div class="tsub">${MG.intrus.sub}</div>
      <div class="prog">${i} sur ${N}</div>
      <div class="qbig">Thème dominant : <b>${t.n}</b></div>
      <div class="qopts">${lot.map(a=>`<button class="qopt" data-s="${a.s}"><b>${a.s}</b> — ${a.d}</button>`).join("")}</div>`;
    h.querySelectorAll(".qopt").forEach(b=>b.onclick=()=>{
      h.querySelectorAll(".qopt").forEach(x=>{x.disabled=true;if(x.dataset.s===out.s)x.classList.add("good")});
      const T2=TH.find(z=>z.k===out.t);
      if(b.dataset.s===out.s)api.good(`<b>${out.s} — ${out.d}</b> relève de ${T2.n}.`);
      else{b.classList.add("bad");const bad=ACROS.find(a=>a.s===b.dataset.s);
        api.bad(`<b>${bad.s}</b> est bien dans ${t.n}. L'intrus était ${out.s}, qui relève de ${T2.n}.`,{q:"Intrus",a:out.s+" ("+T2.n+")"})}
      i++;setTimeout(()=>i>=N?api.end():paint(),800);
    });
  };paint();
}};

/* 14 — Vrai ou faux */
MG.vrai={nom:"Contrôle qualité",sub:"Une affirmation s'affiche : vrai ou faux.",
run(h,api){
  let i=0;const N=6;
  const gen=()=>{
    const vrai=Math.random()<.5,k=(Math.random()*4)|0;
    if(k===0){const p=deal("v0",PORTS,1)[0],o=shuffle(PORTS.filter(x=>x!==p))[0];
      return{txt:`<b>${p.s}</b> écoute sur <b>${vrai?p.p:o.p}</b>`,v:vrai,exp:`${p.s} → ${p.p}. ${p.c}`};}
    if(k===1){const a=deal("v1",ACROS,1)[0],o=shuffle(ACROS.filter(x=>x!==a))[0];
      return{txt:`<b>${a.s}</b> signifie « ${vrai?a.d:o.d} »`,v:vrai,exp:`${a.s} — ${a.d}. ${a.def}`};}
    if(k===2){const L=deal("v2",OSI,1)[0],o=shuffle(OSI.filter(x=>x!==L))[0];
      return{txt:`La couche <b>${L.n}</b> du modèle OSI est la couche <b>${vrai?L.nom:o.nom}</b>`,v:vrai,exp:`Couche ${L.n} — ${L.nom}. ${L.role}`};}
    const a=deal("v3",ACROS,1)[0],T=TH.find(t=>t.k===a.t),o=shuffle(TH.filter(t=>t.k!==a.t))[0];
    return{txt:`<b>${a.s}</b> appartient au thème « ${vrai?T.n:o.n} »`,v:vrai,exp:`${a.s} — ${a.d} : thème ${T.n}.`};
  };
  const paint=()=>{
    const q=gen();
    h.innerHTML=`<div class="tname">${MG.vrai.nom}</div><div class="tsub">${MG.vrai.sub}</div>
      <div class="prog">${i} sur ${N}</div><div class="qbig">${q.txt}</div>
      <div class="two"><button class="btn kob" data-v="0">Faux</button><button class="btn okb" data-v="1">Vrai</button></div>`;
    h.querySelectorAll(".btn").forEach(b=>b.onclick=()=>{
      h.querySelectorAll(".btn").forEach(x=>x.disabled=true);
      const rep=b.dataset.v==="1";
      rep===q.v?api.good(`<b>${q.v?"Vrai":"Faux"}.</b> ${q.exp}`):api.bad(`<b>C'était ${q.v?"vrai":"faux"}.</b> ${q.exp}`,{q:q.txt.replace(/<[^>]+>/g,""),a:q.exp});
      i++;setTimeout(()=>i>=N?api.end():paint(),800);
    });
  };paint();
}};

/* 15 — TCP, UDP ou les deux */
MG.proto={nom:"Aiguillage TCP / UDP",sub:"Pour chaque service, indique le protocole de transport.",
run(h,api){
  const P=PORTS.filter(p=>/tcp|udp/.test(p.p)).map(p=>({...p,pr:/tcp et udp/.test(p.p)?"TCP et UDP":/tcp/.test(p.p)?"TCP":"UDP"}));
  let i=0;const N=5;
  const paint=()=>{
    const p=deal("proto",P,1)[0];
    h.innerHTML=`<div class="tname">${MG.proto.nom}</div><div class="tsub">${MG.proto.sub}</div>
      <div class="prog">${i} sur ${N}</div>
      <div class="qbig"><span class="s">${p.s}</span><br>${p.nums.join(" · ")}</div>
      <div class="qopts">${["TCP","UDP","TCP et UDP"].map(o=>`<button class="qopt" data-o="${o}">${o}</button>`).join("")}</div>`;
    h.querySelectorAll(".qopt").forEach(b=>b.onclick=()=>{
      h.querySelectorAll(".qopt").forEach(x=>{x.disabled=true;if(x.dataset.o===p.pr)x.classList.add("good")});
      if(b.dataset.o===p.pr)api.good(`<b>${p.s} → ${p.p}.</b> ${p.c}`);
      else{b.classList.add("bad");api.bad(`<b>${p.s} → ${p.p}.</b> ${p.c}`,{q:p.s,a:p.p})}
      i++;setTimeout(()=>i>=N?api.end():paint(),750);
    });
  };paint();
}};

/* 16 — Memory : sigle et signification */
MG.memo={nom:"Appariement mémoire",sub:"Mémorise les cartes pendant qu'elles sont visibles, puis réunis chaque sigle et sa signification.",
run(h,api){
  const lot=deal("memo",ACROS,4);
  const cards=shuffle(lot.flatMap((a,i)=>[{i,t:a.s,k:"s"},{i,t:a.d,k:"d"}]));
  let up=[],found=0,lock=true,left=6,ti=null;
  h.innerHTML=`<div class="tname">${MG.memo.nom}</div><div class="tsub">${MG.memo.sub}</div>
    <div class="memhead"><span id="memMsg">Mémorise : <b id="memCd">6</b> s</span><button class="ghost" id="memGo">Cacher maintenant</button></div>
    <div class="mem">${cards.map((c,j)=>`<button class="memc up" data-j="${j}">${c.t}</button>`).join("")}</div>`;
  const els=[...h.querySelectorAll(".memc")];
  const hide=()=>{
    clearInterval(ti);lock=false;
    const hd=h.querySelector(".memhead");if(hd)hd.innerHTML=`<span>Retourne les cartes deux par deux.</span>`;
    els.forEach((e,j)=>{if(!e.classList.contains("done")){e.classList.remove("up");e.textContent="◈"}});
  };
  ti=setInterval(()=>{
    if(typeof PAUSED!=="undefined"&&PAUSED)return;
    left--;const cd=h.querySelector("#memCd");if(cd)cd.textContent=left;
    if(left<=0)hide();
  },1000);
  const go=h.querySelector("#memGo");if(go)go.onclick=hide;
  els.forEach((b,j)=>b.onclick=()=>{
    if(lock||b.classList.contains("up")||b.classList.contains("done"))return;
    b.classList.add("up");b.textContent=cards[j].t;up.push(j);sPop();
    if(up.length<2)return;
    lock=true;
    const [x,y]=up,a=lot[cards[x].i];
    if(cards[x].i===cards[y].i&&cards[x].k!==cards[y].k){
      els[x].classList.add("done");els[y].classList.add("done");found++;
      api.good(`<b>${a.s} — ${a.d}.</b> ${a.def}`);
      up=[];lock=false;
      if(found===4){clearInterval(ti);setTimeout(()=>api.end(),450)}
    }else{
      const b2=lot[cards[y].i];
      api.bad(`<b>${a.s} = ${a.d}</b> · <b>${b2.s} = ${b2.d}</b>`,null);
      setTimeout(()=>{[x,y].forEach(z=>{els[z].classList.remove("up");els[z].textContent="◈"});up=[];lock=false},1400);
    }
  });
}};

/* 17 — Ports par ordre croissant */
MG.ordre={nom:"Remise en ordre",sub:"Touche les services du plus petit numéro de port au plus grand.",
run(h,api){
  const lot=deal("ordre",PORTS,5).map(p=>({p,t:askPort(p,p.nums[0])}));
  const tri=lot.slice().sort((a,b)=>+a.t.n-+b.t.n);
  let step=0;
  h.innerHTML=`<div class="tname">${MG.ordre.nom}</div><div class="tsub">${MG.ordre.sub}</div>
    <div class="qopts">${shuffle(lot).map(x=>`<button class="qopt" data-s="${x.p.s}">${x.t.lbl}</button>`).join("")}</div>`;
  h.querySelectorAll(".qopt").forEach(b=>b.onclick=()=>{
    if(b.disabled)return;
    const att=tri[step];
    if(b.dataset.s===att.p.s){
      b.disabled=true;b.classList.add("good");b.textContent=`${step+1}. ${att.t.full} — ${att.t.n}`;step++;
      api.good(`<b>${att.t.full} → ${att.t.n}.</b> ${att.p.c}`);
      if(step===5)setTimeout(()=>api.end(),500);
    }else{
      b.classList.add("bad");setTimeout(()=>b.classList.remove("bad"),400);
      const w=lot.find(x=>x.p.s===b.dataset.s);
      api.bad(`<b>${w.t.full} c'est ${w.t.n}</b>, le prochain est plus petit : ${att.t.full} → ${att.t.n}.`,{q:"Ordre des ports",a:`${att.t.full} = ${att.t.n}`});
    }
  });
}};

/* 18 — Étage du service */
MG.etage={nom:"Étage du service",sub:"À quelle couche OSI se rattache l'élément affiché ?",
run(h,api){
  let i=0;const N=5;
  const paint=()=>{
    const it=deal("etage",OSI_ITEMS,1)[0],L=OSI[it.n-1];
    h.innerHTML=`<div class="tname">${MG.etage.nom}</div><div class="tsub">${MG.etage.sub}</div>
      <div class="prog">${i} sur ${N}</div><div class="qbig"><span class="s">${it.l}</span></div>
      <div class="lrows">${OSI.map(l=>`<button class="lrow" data-n="${l.n}" style="--c:var(--l${l.n})"><span class="num">${l.n}</span><span>${l.nom}</span></button>`).join("")}</div>`;
    h.querySelectorAll(".lrow").forEach(b=>b.onclick=()=>{
      if(b.disabled)return;h.querySelectorAll(".lrow").forEach(x=>x.disabled=true);
      +b.dataset.n===it.n
        ?api.good(`<b>${it.l} → couche ${L.n}, ${L.nom}.</b> ${L.role}`)
        :api.bad(`<b>${it.l} → couche ${L.n}, ${L.nom}.</b> ${L.role}`,{q:it.l,a:`Couche ${L.n} — ${L.nom}`});
      i++;setTimeout(()=>i>=N?api.end():paint(),700);
    });
  };paint();
}};

