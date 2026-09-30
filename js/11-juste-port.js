/* =======================================================
   JEU 2 — LE JUSTE PORT
   ======================================================= */
let PQ=null;

function portProtocols(p){
  const s=(p.p+" "+p.c).toLowerCase();
  const out=[];
  if(/\/tcp\b/.test(s))out.push("TCP");
  if(/\/udp\b/.test(s))out.push("UDP");
  return [...new Set(out)];
}
function portTargets(){
  const out=[];
  PORTS.forEach(p=>{
    p.nums.forEach(n=>{
      const protos=portProtocols(p);
      out.push({
        service:p.s,
        port:Number(n),
        detail:(PORTQ[p.s]&&PORTQ[p.s][n])||"",
        protocols:protos,
        note:p.c
      });
    });
  });
  return shuffle(out);
}
function startPort(){
  newSession("port");
  PQ={end:Date.now()+60000,pool:portTargets(),cur:null,locked:false,interval:null};
  show("port");
  $("#portInput").value="";
  $("#portFeedback").className="pqfeedback";
  $("#portFeedback").textContent="";
  nextPort();
  $("#portInput").focus();
  PQ.interval=setInterval(tickPort,50);
  tickPort();
}
function nextPort(){
  if(!PQ||!S||S.kind!=="port")return;
  if(!PQ.pool.length)PQ.pool=portTargets();
  PQ.cur=PQ.pool.pop();
  const t=PQ.cur;
  $("#portService").textContent=t.service;
  const bits=[];
  if(t.detail)bits.push(t.detail);
  if(t.protocols.length===1)bits.push(t.protocols[0]);
  else if(t.protocols.length>1)bits.push(t.protocols.join(" / "));
  $("#portMeta").textContent=bits.length?bits.join(" · "):"Trouve le numéro de port";
  $("#portInput").value="";
  $("#portFeedback").className="pqfeedback";
  $("#portFeedback").textContent="";
}
function tickPort(){
  if(!PQ||!S||S.kind!=="port")return;
  if(PAUSED)return;
  const left=Math.max(0,PQ.end-Date.now());
  $("#portClock").textContent=`${Math.floor(left/1000)}s`;
  $("#portTimer").style.width=(left/60000*100)+"%";
  if(left<=0)endPort();
}
function submitPort(){
  if(!PQ||!PQ.cur||!S||S.kind!=="port"||PQ.locked||PAUSED)return;
  const raw=$("#portInput").value.trim();
  if(!/^\d{1,5}$/.test(raw))return;
  const guess=Number(raw),target=PQ.cur.port;
  if(guess===target){
    PQ.locked=true;
    S.hits++;
    S.score=S.hits;
    mark("port:"+PQ.cur.service,true);
    sGood();
    $("#portFeedback").className="pqfeedback good";
    $("#portFeedback").textContent=`✓ CORRECT ! Le port est ${target}`;
    $("#portScore").innerHTML=`Ports <b>${S.hits}</b>`;
    setTimeout(()=>{
      if(!PQ||!S||S.kind!=="port")return;
      PQ.locked=false;
      nextPort();
      $("#portInput").focus();
    },700);
  }else{
    const dir=guess<target?"⬆ PLUS — le port recherché est plus grand":"⬇ MOINS — le port recherché est plus petit";
    $("#portFeedback").className="pqfeedback "+(guess<target?"plus":"less");
    $("#portFeedback").textContent=dir;
    $("#portInput").value="";
    $("#portInput").focus();
    sPop();
  }
}
function endPort(){
  if(!PQ||!S||S.kind!=="port")return;
  if(PQ.interval){clearInterval(PQ.interval);PQ.interval=null}
  PQ=null;
  S.note="1 minute";
  endRun();
}
$("#portSend").onclick=submitPort;
$("#portInput").addEventListener("keydown",e=>{
  if(e.key==="Enter"){e.preventDefault();submitPort()}
});
$("#qPort").onclick=()=>{
  if(PQ&&PQ.interval)clearInterval(PQ.interval);
  PQ=null;S=null;show("hub");paintHub();
};

