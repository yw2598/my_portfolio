(function(root){
 'use strict';
 const robots={
  outdoor:{image:'https://www.zeroth0.com/cdn/shop/files/W1HeroImage.png?v=1766378069&width=1946',alt:'Official Zeroth W1 outdoor robot image',note:'Official product image / Zeroth',kicker:'Outdoor / W1',title:'Take it outside.',description:'A tracked platform for carrying equipment, autonomous following, and portable power.',labelA:'Platform',factA:'Tracked mobility',labelB:'Listed capacity',factB:'20 kg'},
  home:{image:'/assets/home-companion-context.svg',alt:'Illustration of a home interaction context, not a product photograph',note:'Home context / illustration',kicker:'Home / Companion',title:'Share an everyday space.',description:'The home version brings companion robotics into a shared living space. Model-specific product material is still to come.',labelA:'Setting',factA:'Home environment',labelB:'Image',factB:'Context illustration'},
  mini:{image:'https://www.zeroth0.com/cdn/shop/files/m1v2-hero-bg.webp?v=9427574492251337491',alt:'Official Zeroth M1 mini humanoid product image',note:'Official product image / Zeroth',kicker:'Mini humanoid / M1 EDU',title:'Explore embodied learning.',description:'A desk-sized humanoid with Python control and locomotion workflows using Isaac Gym and MuJoCo.',labelA:'Listed height',factA:'50 cm',labelB:'Listed weight',factB:'2.8 kg'}
 };
 function upgradeModel(value){
  const n=Number(value),tier=Number.isFinite(n)?Math.max(1,Math.min(5,Math.round(n))):2;
  let min=1,max=1.1,average=1.05,previous=1.05;
  for(let t=2;t<=tier;t++){previous=average;min*=4*(1+.1*(t-1));max*=4*(1+.1*t);average*=4*(1+.1*(t-1)+.05);}
  return {tier,min,max,average,previous,multiplier:1+.1*(tier-1)+.05,baseCards:4**(tier-1)};
 }
 const format=n=>Number(n.toFixed(6)).toLocaleString('en-US',{maximumFractionDigits:6});
 function initRobot(panel){
  const buttons=Array.from(panel.querySelectorAll('[data-robot-choice]'));
  function select(key){const data=robots[key];if(!data)return false;
   const image=panel.querySelector('[data-robot-image]');image.src=data.image;image.alt=data.alt;
   for(const [name,value] of Object.entries({kicker:data.kicker,title:data.title,description:data.description,'image-note':data.note,'label-a':data.labelA,'fact-a':data.factA,'label-b':data.labelB,'fact-b':data.factB}))panel.querySelector('[data-robot-'+name+']').textContent=value;
   panel.querySelector('[data-robot-link]').href='/projects/robotics/#'+key;
   buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.robotChoice===key)));
   panel.dataset.robotSetting=key;return true;
  }
  buttons.forEach((b,i)=>{b.addEventListener('click',()=>select(b.dataset.robotChoice));b.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%buttons.length;else if(e.key==='ArrowLeft')next=(i+buttons.length-1)%buttons.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=buttons.length-1;else return;e.preventDefault();buttons[next].focus();select(buttons[next].dataset.robotChoice);});});
  return {select};
 }
 function initUpgrade(panel){
  const range=panel.querySelector('[data-upgrade-range]');
  function render(){const m=upgradeModel(range.value);range.value=m.tier;
   panel.querySelector('[data-upgrade-output]').textContent=m.tier+' / 5';
   const stars=panel.querySelector('[data-upgrade-stars]');stars.textContent='★'.repeat(m.tier);stars.setAttribute('aria-label',m.tier+' stars');
   panel.querySelector('[data-upgrade-tier]').textContent='Level '+m.tier;
   panel.querySelector('[data-upgrade-base]').textContent=format(m.baseCards);
   panel.querySelector('[data-upgrade-average]').textContent=format(m.average);
   panel.querySelector('[data-upgrade-recipe]').textContent=m.tier===1?'Start with one base card.':'Combine 4 Level '+(m.tier-1)+' cards.';
   panel.querySelector('[data-upgrade-calculation]').textContent=m.tier===1?'Base range: 1–1.1 · average 1.05':'4 × '+format(m.previous)+' × '+format(m.multiplier)+' = '+format(m.average);
   const input=panel.querySelector('[data-upgrade-inputs]');input.setAttribute('aria-label',m.tier===1?'One base card':'Four Level '+(m.tier-1)+' cards');
   Array.from(input.querySelectorAll('span')).forEach((card,i)=>{card.hidden=m.tier===1&&i>0;card.textContent=m.tier===1?'Base':(m.tier-1)+'★';});
   panel.dataset.tier=m.tier;return m;
  }
  range.addEventListener('input',render);render();return {render};
 }
 function initPreview(panel){
  const layers=Array.from(panel.querySelectorAll('[data-preview-layer]'));
  const data={s2:['System2 / Understand the player','Cloud reasoning interprets intentions and sets goals. The architecture targets a 15–30 second timescale.'],s1:['System1 / Choose the next action','First-person images, game state and System2 instructions inform decisions. The proposed local model targets 5 Hz.'],s0:['System0 / Keep the body responding','A 50 Hz closed-loop script adjusts execution using game feedback and native movement and action rules.']};
  function select(key){if(!data[key])return;layers.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.previewLayer===key)));panel.querySelectorAll('[data-gb-layer]').forEach(g=>g.classList.toggle('is-active',g.dataset.gbLayer===key));
   const inspector=panel.parentElement.querySelector('[data-preview-inspector]');inspector.querySelector('[data-preview-title]').textContent=data[key][0];inspector.querySelector('[data-preview-body]').textContent=data[key][1];
  }
  layers.forEach(b=>b.addEventListener('click',()=>select(b.dataset.previewLayer)));return {select};
 }
 const presets={ready:{engagement:'Engage',network:'ready',stamina:80,distance:10},close:{engagement:'Engage',network:'ready',stamina:80,distance:4},tired:{engagement:'Engage',network:'ready',stamina:5,distance:10},waiting:{engagement:'Engage',network:'pending',stamina:80,distance:10}};
 function initAction(panel,env){
  const get=key=>panel.querySelector('[data-gb-'+key+']');
  const controls=['engagement','network','stamina','distance'];
  const buttons=Array.from(panel.querySelectorAll('[data-action-preset]'));
  function render(){const result=env.GameBuddySystem.newDrawGate(get('engagement').value,get('stamina').value,get('distance').value);
   panel.dataset.action=result.code;panel.querySelector('[data-arena-enemy]').style.left=(30+Number(get('distance').value)*3.5)+'%';panel.querySelector('[data-arena-distance]').textContent=get('distance').value+' m';
   buttons.forEach(b=>{const p=presets[b.dataset.actionPreset];b.setAttribute('aria-pressed',String(controls.every(k=>String(p[k])===get(k).value)));});return result;
  }
  function apply(key){const p=presets[key];if(!p)return;controls.forEach(k=>{get(k).value=String(p[k]);get(k).dispatchEvent(new env.Event('input',{bubbles:true}));});render();}
  controls.forEach(k=>get(k).addEventListener('input',render));buttons.forEach(b=>b.addEventListener('click',()=>apply(b.dataset.actionPreset)));render();return {apply,render};
 }
 function initZoom(doc){
  const buttons=Array.from(doc.querySelectorAll('[data-media-zoom]'));if(!buttons.length)return;
  const dialog=doc.createElement('dialog');dialog.className='media-dialog';dialog.setAttribute('aria-label','Project image viewer');
  dialog.innerHTML='<div class="media-dialog-tools"><span>Original project material</span><div><button type="button" data-zoom-out aria-label="Zoom out">−</button><button type="button" data-zoom-in aria-label="Zoom in">+</button><button type="button" data-zoom-close aria-label="Close image viewer">Close ×</button></div></div><div class="media-dialog-scroll"><img alt=""></div>';
  doc.body.appendChild(dialog);const image=dialog.querySelector('img'),scroll=dialog.querySelector('.media-dialog-scroll');let scale=1;
  function resize(){image.style.width=100*scale+'%';dialog.querySelector('[data-zoom-out]').disabled=scale===1;dialog.querySelector('[data-zoom-in]').disabled=scale===3;}
  buttons.forEach(b=>b.addEventListener('click',()=>{const src=b.querySelector('img');image.src=src.src;image.alt=src.alt;scale=1;resize();dialog.showModal();scroll.scrollTop=0;scroll.scrollLeft=0;}));
  dialog.querySelector('[data-zoom-close]').addEventListener('click',()=>dialog.close());dialog.querySelector('[data-zoom-in]').addEventListener('click',()=>{scale=Math.min(3,scale+1);resize();});dialog.querySelector('[data-zoom-out]').addEventListener('click',()=>{scale=Math.max(1,scale-1);resize();});dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
 }
 function init(doc,env){doc.querySelectorAll('[data-robot-explorer]').forEach(initRobot);doc.querySelectorAll('[data-upgrade-explorer]').forEach(initUpgrade);doc.querySelectorAll('[data-preview-explorer]').forEach(initPreview);if(env.GameBuddySystem)doc.querySelectorAll('[data-action-explorer]').forEach(p=>initAction(p,env));initZoom(doc);}
 const api={upgradeModel,robots,presets,initRobot,initUpgrade,initPreview,initAction,init};if(typeof module!=='undefined')module.exports=api;
 if(typeof document!=='undefined')init(document,root);
})(typeof window!=='undefined'?window:globalThis);
