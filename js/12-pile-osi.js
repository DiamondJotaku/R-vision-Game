/* =======================================================
   JEU 2 — LA PILE OSI
   ======================================================= */
let OS=null;
function startOSI(){
  newSession("osi");
  $("#stack").innerHTML=OSI.map(l=>
    `<button class="layer" data-n="${l.n}" style="--c:var(--l${l.n})"><span class="num">${l.n}</span><span>${l.nom}</span></button>`).join("");
  $("#osiField").querySelectorAll(".pkt").forEach(e=>e.remove());
  OS={pool:shuffle(weak(OSI_ITEMS,i=>"osi:"+i.n)),cur:null,last:0};
  show("osi");hudOSI();
  $("#osiToast").className="toast empty";
  $("#osiToast").textContent="Touche la couche qui reçoit l'élément. Touches 1 à 7 au clavier.";
  nextOSI();raf=requestAnimationFrame(stepOSI);
}
function hudOSI(){
  $("#osiScore").innerHTML=`Score <b>${S.score}</b>`;
  $("#osiCombo").textContent="×"+S.combo;
  $("#osiCombo").className="chip"+(S.combo>1?" combo":"");
  $("#osiWave").innerHTML=`Vague <b>${S.wave}</b>`;
  $("#osiHp").textContent=hearts(S.hp);
}
function nextOSI(){
  if(!OS.pool.length)OS.pool=shuffle(OSI_ITEMS);
  const it=OS.pool.pop();
  const el=document.createElement("div");
  el.className="pkt live";el.style.setProperty("--c","var(--l"+it.n+")");
  el.style.left="50%";el.style.top="-54px";
  el.innerHTML=`<div class="lbl">${it.l}</div>`;
  $("#osiField").appendChild(el);
  OS.cur={el,y:-54,it};
}
function stepOSI(ts){
  if(!S||S.kind!=="osi")return;
  if(PAUSED){OS.last=ts;raf=requestAnimationFrame(stepOSI);return}
  if(!OS.last)OS.last=ts;
  const dt=Math.min(60,ts-OS.last);OS.last=ts;
  const H=$("#osiField").clientHeight-$("#stack").clientHeight-14;
  const c=OS.cur;
  if(c&&!c.dead){
    c.y+=((26+S.wave*6)/1000)*dt;c.el.style.top=c.y+"px";
    if(c.y>H){resolveOSI(null)}
  }
  hudOSI();
  if(S.hp<=0)return endRun();
  raf=requestAnimationFrame(stepOSI);
}
function resolveOSI(n){
  const c=OS.cur;if(!c||c.dead)return;
  const L=OSI.find(x=>x.n===c.it.n);
  const good=n===c.it.n;
  c.dead=true;
  const lay=$(`.layer[data-n="${c.it.n}"]`);
  if(good){
    c.el.classList.add("pop");addScore(25);S.hits++;mark("osi:"+c.it.n,true);sGood();
    lay&&lay.classList.add("good");
    fiche($("#osiToast"),`<b>${c.it.l} → couche ${L.n}, ${L.nom}.</b> ${L.role}`);
    if(S.hits%7===0)S.wave++;
  }else{
    c.el.classList.add("kaboom");loseHp();mark("osi:"+c.it.n,false);
    S.errors.push({q:c.it.l,a:`Couche ${L.n} — ${L.nom}`});
    lay&&lay.classList.add("wrong");
    fiche($("#osiToast"),`<b>${c.it.l} → couche ${L.n}, ${L.nom}.</b> ${L.role}`);
    $("#osiFlash").classList.add("go");setTimeout(()=>$("#osiFlash").classList.remove("go"),360);
  }
  setTimeout(()=>{c.el.remove();lay&&lay.classList.remove("good","wrong")},520);
  hudOSI();
  if(S.hp>0)setTimeout(nextOSI,420);
}
$("#stack").onclick=e=>{const b=e.target.closest(".layer");if(b)resolveOSI(+b.dataset.n)};
$("#qOsi").onclick=()=>{cancelAnimationFrame(raf);raf=null;S=null;show("hub");paintHub()};

