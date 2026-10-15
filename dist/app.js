(function () {
  'use strict';
  const motionButton=document.querySelector('[data-motion-toggle]');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let paused=reduced.matches;
  const orbit=document.querySelector('[data-orbit]');
  const orbitLabels=orbit?Array.from(orbit.querySelectorAll('[data-orbit-label]')):[];
  let orbitSeconds=0;
  function drawOrbit(){
    if(!orbit||!orbitLabels.length)return;
    const box=orbit.getBoundingClientRect();
    const labelWidth=Math.max(...orbitLabels.map(label=>label.offsetWidth));
    const labelHeight=Math.max(...orbitLabels.map(label=>label.offsetHeight));
    orbitLabels.forEach((label,index)=>{
      const p=PortraitOrbit.position(box.width,box.height,labelWidth,labelHeight,index,orbitSeconds);
      label.style.left='50%';label.style.top='50%';
      label.style.transform='translate3d('+(p.x-box.width/2)+'px,'+(p.y-box.height/2)+'px,0) translate(-50%,-50%)';
    });
  }
  const scenes=Array.from(document.querySelectorAll('canvas[data-landscape]')).map(canvas=>({canvas,ctx:canvas.getContext('2d'),visible:true}));
  function drawAll(t=0){scenes.forEach(s=>{if(s.ctx&&s.visible)PixelForest.draw(s.ctx,s.canvas.width,s.canvas.height,t);});}
  function motion(){if(motionButton){const label=paused?'Resume animation':'Pause animation';const symbol=motionButton.querySelector('[data-motion-symbol]');if(symbol)symbol.textContent=paused?'▶':'Ⅱ';motionButton.setAttribute('aria-label',label);motionButton.setAttribute('title',label);motionButton.setAttribute('aria-pressed',String(paused));}}
  function resize(){scenes.forEach(s=>{const box=s.canvas.getBoundingClientRect();s.canvas.width=Math.min(760,Math.max(320,Math.round(box.width/2)));s.canvas.height=Math.max(180,Math.round(s.canvas.width*box.height/Math.max(box.width,1)));});drawAll();drawOrbit();}
  motionButton?.addEventListener('click',()=>{paused=!paused;motion();drawAll();});
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{const s=scenes.find(s=>s.canvas===e.target);if(s){s.visible=e.isIntersecting;if(s.visible&&s.ctx)PixelForest.draw(s.ctx,s.canvas.width,s.canvas.height,0);}});});scenes.forEach(s=>observer.observe(s.canvas));}
  window.addEventListener('resize',resize);reduced.addEventListener('change',()=>{paused=reduced.matches;motion();drawAll();});
  resize();motion();
  let last=0,previous=null,lastOrbit=0;
  function frame(t){
    const delta=previous===null?0:Math.min((t-previous)/1000,.1);previous=t;
    if(!paused&&!document.hidden){
      orbitSeconds+=delta;
      if(t-last>120){drawAll(t/1000);last=t;}
      if(t-lastOrbit>32){drawOrbit();lastOrbit=t;}
    }
    requestAnimationFrame(frame);
  }
  if(scenes.length||orbitLabels.length)requestAnimationFrame(frame);
})();
