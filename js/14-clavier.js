/* =======================================================
   CLAVIER
   ======================================================= */
document.addEventListener("keydown",e=>{
  if($("#s-duel").classList.contains("on")||$("#s-mara").classList.contains("on")||$("#s-bomb").classList.contains("on")||$("#s-zen").classList.contains("on")){
    if(!duKey)return;
    if(/^[0-9]$/.test(e.key))duKey(e.key);
    else if(e.key==="Backspace"){e.preventDefault();duKey("del")}
    else if(e.key==="Enter")duKey("ok");
    return;
  }
  if($("#s-red").classList.contains("on")){
    if(!redKey)return;
    if(/^[0-9]$/.test(e.key))redKey(e.key);
    else if(e.key==="Backspace"){e.preventDefault();redKey("del")}
    else if(e.key==="Enter")redKey("ok");
    return;
  }
  if($("#s-fw").classList.contains("on")){
    if(/^[0-9]$/.test(e.key))padType(e.key);
    else if(e.key==="Backspace"){e.preventDefault();padType("del")}
    else if(e.key==="Enter")padType("ok");
  }else if($("#s-port").classList.contains("on")){
    if(/^[0-9]$/.test(e.key)){
      e.preventDefault();
      const inp=$("#portInput");
      if(document.activeElement!==inp)inp.focus();
      if(inp.value.length<5)inp.value+=e.key;
    }else if(e.key==="Backspace"){
      const inp=$("#portInput");
      if(document.activeElement!==inp)e.preventDefault();
    }else if(e.key==="Enter"){
      e.preventDefault();submitPort();
    }
  }else if($("#s-osi").classList.contains("on")){
    if(/^[1-7]$/.test(e.key))resolveOSI(+e.key);
  }else if($("#s-soc").classList.contains("on")){
    if(/^[1-5]$/.test(e.key)){const b=document.querySelectorAll(".hcard")[+e.key-1];if(b&&!b.disabled)b.click()}
  }
});

