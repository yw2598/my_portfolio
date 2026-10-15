(function(root){
 'use strict';
 function pointerValues(rect,x,y){const nx=Math.max(-1,Math.min(1,((x-rect.left)/Math.max(rect.width,1)-.5)*2)),ny=Math.max(-1,Math.min(1,((y-rect.top)/Math.max(rect.height,1)-.5)*2));return {rx:-ny*1.7,ry:nx*1.7,x:nx*5,y:ny*5,px:(nx+1)*50,py:(ny+1)*50};}
 function init(doc,env){
  const reduced=env.matchMedia('(prefers-reduced-motion: reduce)'),fine=env.matchMedia('(hover: hover) and (pointer: fine)');
  const depth=Array.from(doc.querySelectorAll('.portrait-orbit,.rb-index-card,.hl-art,.robot-scene-image,.gb-system-panel,.gb-video-panel,.gb-capture'));
  depth.forEach(el=>{
   el.classList.add('reactive-depth');let frame=null,point=null;
   function reset(){point=null;if(frame!==null){env.cancelAnimationFrame(frame);frame=null;}['--react-rx','--react-ry','--image-x','--image-y'].forEach(k=>el.style.removeProperty(k));el.classList.remove('is-pointer-active');}
   el.addEventListener('pointermove',e=>{if(reduced.matches||!fine.matches||e.pointerType==='touch')return;point={x:e.clientX,y:e.clientY};if(frame!==null)return;frame=env.requestAnimationFrame(()=>{frame=null;if(!point)return;const p=pointerValues(el.getBoundingClientRect(),point.x,point.y);for(const [key,value] of [['--react-rx',p.rx+'deg'],['--react-ry',p.ry+'deg'],['--image-x',p.x+'px'],['--image-y',p.y+'px'],['--pointer-x',p.px+'%'],['--pointer-y',p.py+'%']])el.style.setProperty(key,value);el.classList.add('is-pointer-active');});});
   el.addEventListener('pointerleave',reset);el.addEventListener('pointercancel',reset);reduced.addEventListener('change',reset);fine.addEventListener('change',reset);
  });
  const candidates=Array.from(doc.querySelectorAll('.chapter>.wrap>.section-title,.gb-showcase-copy,.rb-home-heading,.hl-home-copy,.rb-index-card,.rb-detail-grid,.hl-contribution-grid,.about-block'));
  if(!reduced.matches&&env.IntersectionObserver){const observer=new env.IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-revealed');observer.unobserve(e.target);}});},{threshold:.08,rootMargin:'0px 0px -25px 0px'});candidates.forEach((el,i)=>{el.classList.add('scroll-reactive');el.style.setProperty('--reveal-delay',(i%3)*45+'ms');el.addEventListener('focusin',()=>{el.classList.add('is-revealed');observer.unobserve(el);});observer.observe(el);});reduced.addEventListener('change',()=>{if(reduced.matches){candidates.forEach(el=>el.classList.add('is-revealed'));observer.disconnect();}});}
  doc.querySelectorAll('[data-robot-explorer]').forEach(panel=>{let ready=false;const observer=new env.MutationObserver(()=>{if(!ready){ready=true;return;}const image=panel.querySelector('[data-robot-image]');image.getAnimations?.().forEach(a=>a.cancel());if(!reduced.matches)image.animate?.([{opacity:.35,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,easing:'ease-out'});});observer.observe(panel,{attributes:true,attributeFilter:['data-robot-setting']});ready=true;});
 }
 const api={pointerValues,init};if(typeof module!=='undefined')module.exports=api;if(typeof document!=='undefined')init(document,root);
})(typeof window!=='undefined'?window:globalThis);
