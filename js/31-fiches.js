/* =======================================================
   FICHES
   ======================================================= */
function ficheHTML(f){
  const q=(f||"").toLowerCase(),hit=t=>String(t).toLowerCase().includes(q);
  let h="";
  ["reseau","systemes","virtu","gouv"].forEach(k=>{
    const rows=ACROS.filter(a=>a.t===k&&(!q||hit(a.s)||hit(a.d)||hit(a.def)));
    if(!rows.length)return;
    h+=`<div class="grp">${CATN[k]}</div>`+rows.map(a=>
      `<div class="fiche" style="--c:${CATC[k]}"><div class="h"><b>${a.s}</b><span>${a.d}</span></div><p>${a.def}</p></div>`).join("");
  });
  const pr=PORTS.filter(p=>!q||hit(p.s)||hit(p.p)||hit(p.c)||hit(p.al||""));
  if(pr.length)h+=`<div class="grp">Ports et protocoles</div>`+pr.map(p=>
    `<div class="fiche" style="--c:var(--l6)"><div class="h"><b>${p.s}</b><span class="mono">${p.p}</span>${p.al?`<span>alias : ${p.al}</span>`:""}</div><p>${multi(p)?portLine(p)+". ":""}${p.c}</p></div>`).join("");
  const ol=OSI.filter(l=>!q||hit(l.nom)||hit(l.role)||hit(l.n));
  if(ol.length)h+=`<div class="grp">Modèle OSI</div>`+ol.slice().reverse().map(l=>
    `<div class="fiche" style="--c:var(--l${l.n})"><div class="h"><b>${l.n} — ${l.nom}</b><span>${OSI_ITEMS.filter(i=>i.n===l.n).slice(0,3).map(i=>i.l).join(", ")}</span></div><p>${l.role}</p></div>`).join("");
  return h||`<p class="lead">Aucune fiche. Essaie un sigle, un numéro de port ou un nom de couche.</p>`;
}

