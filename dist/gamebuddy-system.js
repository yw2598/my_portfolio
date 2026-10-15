(function(root){
  'use strict';
  const stages=[
    {kicker:'01 / Perception',title:'One world. Two kinds of input.',body:'Semantic game state is supplied by the game interface. First-person imagery supplies the companion’s visual perspective. Both inform decisions; game state also informs higher-level reasoning.',input:'Visible game state + first-person image',output:'Context for System2 and System1',nodes:['s2','s1'],inputs:['state','vision'],wires:['state-s2','state-s1','vision']},
    {kicker:'02 / System2',title:'Understand what the player means.',body:'The cloud reasoning layer brings together intentions, voice, chat, long-term memory, and game state. On the sketch’s 15–30 second timescale, it sets goals, instructions, and verifiers for System1.',input:'Intentions + memory + semantic game state',output:'Goals, instructions, and verifiers',nodes:['s2'],inputs:['state','memory'],wires:['state-s2','memory'],selected:'s2'},
    {kicker:'03 / System1',title:'Make a decision in context.',body:'The proposed local 0.8B decision VLM combines first-person perception, semantic game state, and System2’s instructions. Local training and distillation target fast, human-like in-game decisions at 5 Hz.',input:'First-person image + game state + System2 instructions',output:'Action vector for System0',nodes:['s1'],inputs:['state','vision'],wires:['goals','vision','state-s1'],selected:'s1'},
    {kicker:'04 / System0',title:'Keep the body responding.',body:'The 50 Hz closed-loop script consumes the action vector and dynamically adjusts in-game behavior. Execution remains constrained by native movement, animation, damage, equipment, and stamina rules.',input:'Action vector + current execution feedback',output:'Responsive in-game actions',nodes:['s0'],inputs:[],wires:['actions'],selected:'s0'},
    {kicker:'05 / Feedback',title:'The world answers back.',body:'Actual game results become the next context: visible threats, health and stamina changes, and native action outcomes. Continuous feedback lets the script respond while slower reasoning and decisions operate on their own timescales.',input:'Native outcomes + current visible state',output:'Updated context for the next cycle',nodes:['s0'],inputs:['state'],wires:['feedback','state-s1'],selected:'s0'}
  ];
  function newDrawGate(engagement,stamina,distance){
    const s=Number(stamina),d=Number(distance);
    if(s<10)return {title:'Recover before starting a new action.',body:'Stamina below 10% enters recovery. A new shot is blocked; choosing Engage cannot cancel the recovery rule.',code:'recover'};
    if(engagement==='Disengage')return {title:'Retreat. Do not start a new shot.',body:'Disengage identifies selected enemies as threats for withdrawal. It does not authorize a new attack; committed native actions still follow their lifecycle.',code:'disengage'};
    if(engagement==='Observe')return {title:'Observe and react defensively.',body:'Observe allows observation and reactive defense, but does not authorize a new proactive bow draw.',code:'observe'};
    if(d<=7)return {title:'Create distance before drawing.',body:'A nearest visible enemy within 7 m blocks a new kiting draw. Create space first. This does not describe the release rules for a draw already in progress.',code:'distance'};
    if(s<50)return {title:'Pause new shots and conserve stamina.',body:'Below 50% stamina, kiting pauses new shots. Beginning the next draw still requires recovery to at least 70%.',code:'low-stamina'};
    if(s<70)return {title:'Wait for the next draw threshold.',body:'A new kiting bow draw requires at least 70% stamina. Leaving recovery does not override this separate condition.',code:'draw-threshold'};
    return {title:'Begin a moving bow draw.',body:'The stamina and distance gate is open: at least 70% stamina, with the nearest visible enemy more than 7 m away. Equipment, native action state, and other execution checks still apply.',code:'draw'};
  }
  function init(doc,env){
    const explorer=doc.querySelector('[data-gb-explorer]');if(!explorer)return null;
    let step=0,timer=null,wantedPlaying=false;
    const reduced=env.matchMedia?env.matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
    const inspector=doc.querySelector('[data-gb-inspector]');
    const get=s=>doc.querySelector(s),all=s=>Array.from(explorer.querySelectorAll(s));
    const play=get('[data-gb-play]');
    function render(){
      const data=stages[step];
      all('[data-gb-step]').forEach(el=>el.setAttribute('aria-pressed',String(Number(el.dataset.gbStep)===step)));
      all('[data-gb-node]').forEach(el=>{el.classList.toggle('is-active',data.nodes.includes(el.dataset.gbNode));el.classList.toggle('is-selected',data.selected===el.dataset.gbNode);el.setAttribute('aria-pressed',String(data.selected===el.dataset.gbNode));});
      all('[data-gb-layer]').forEach(el=>el.classList.toggle('is-active',data.nodes.includes(el.dataset.gbLayer)));
      all('[data-gb-input]').forEach(el=>el.classList.toggle('is-active',data.inputs.includes(el.dataset.gbInput)));
      all('[data-gb-wire]').forEach(el=>el.classList.toggle('is-active',data.wires.includes(el.dataset.gbWire)));
      for(const [key,selector] of [['kicker','[data-gb-detail-kicker]'],['title','[data-gb-detail-title]'],['body','[data-gb-detail-body]'],['input','[data-gb-detail-input]'],['output','[data-gb-detail-output]']])get(selector).textContent=data[key];
    }
    function stop(keepIntent=false){if(timer!==null)env.clearInterval(timer);timer=null;if(!keepIntent)wantedPlaying=false;explorer.classList.remove('is-playing');play.textContent='▶ Play flow';play.setAttribute('aria-pressed','false');inspector?.setAttribute('aria-live','polite');}
    function start(){wantedPlaying=true;if(timer!==null||doc.hidden)return;explorer.classList.add('is-playing');play.textContent='Ⅱ Pause flow';play.setAttribute('aria-pressed','true');inspector?.setAttribute('aria-live','off');timer=env.setInterval(()=>{if(!doc.hidden){step=(step+1)%stages.length;render();}},2200);}
    function choose(n){stop();step=(n+stages.length)%stages.length;render();}
    all('[data-gb-step]').forEach(el=>el.addEventListener('click',()=>choose(Number(el.dataset.gbStep))));
    all('[data-gb-node]').forEach(el=>el.addEventListener('click',()=>choose({s2:1,s1:2,s0:3}[el.dataset.gbNode])));
    get('[data-gb-previous]').addEventListener('click',()=>choose(step-1));get('[data-gb-next]').addEventListener('click',()=>choose(step+1));
    play.addEventListener('click',()=>{if(timer!==null){stop();return;}start();});
    doc.addEventListener('visibilitychange',()=>{if(doc.hidden)stop(true);else if(wantedPlaying)start();});
    reduced.addEventListener?.('change',()=>{if(reduced.matches)stop();});
    const engagement=get('[data-gb-engagement]'),network=get('[data-gb-network]'),stamina=get('[data-gb-stamina]'),distance=get('[data-gb-distance]');
    function updateRule(){
      get('[data-gb-stamina-value]').textContent=stamina.value+'%';get('[data-gb-distance-value]').textContent=distance.value+' m';
      const result=newDrawGate(engagement.value,stamina.value,distance.value);
      get('[data-gb-rule-title]').textContent=result.title;get('[data-gb-rule-body]').textContent=result.body;
      get('[data-gb-network-note]').textContent=network.value==='pending'?'A response is still pending. System0 continues under the last valid preference shown here.':'Apply the received preference on the next physics tick.';
    }
    [engagement,network,stamina,distance].forEach(el=>el.addEventListener('input',updateRule));
    render();updateRule();if(!reduced.matches)start();
    return {choose,stop,updateRule,getStep:()=>step,isPlaying:()=>timer!==null};
  }
  function initPreview(doc,env){
    const preview=doc.querySelector('[data-gb-preview]');if(!preview)return null;
    const button=doc.querySelector('[data-gb-preview-toggle]');
    const reduced=env.matchMedia?env.matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
    let paused=reduced.matches,manuallyPaused=false;
    function renderPreview(){preview.classList.toggle('is-paused',paused||doc.hidden);button.textContent=paused?'▶ Resume signals':'Ⅱ Pause signals';button.setAttribute('aria-pressed',String(paused));}
    button.addEventListener('click',()=>{paused=!paused;manuallyPaused=paused;renderPreview();});
    reduced.addEventListener?.('change',()=>{paused=reduced.matches||manuallyPaused;renderPreview();});
    doc.addEventListener('visibilitychange',renderPreview);renderPreview();
    return {isPaused:()=>paused};
  }
  root.GameBuddySystem={stages,newDrawGate,init,initPreview};
  if(typeof module!=='undefined')module.exports={stages,newDrawGate,init,initPreview};
  if(typeof document!=='undefined'){initPreview(document,root);init(document,root);}
})(typeof window!=='undefined'?window:globalThis);
