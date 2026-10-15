(function (root) {
  'use strict';
  function draw(ctx,w,h,time=0) {
    let seed=87221;
    const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    const rect=(x,y,a,b,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.ceil(a),Math.ceil(b));};
    const poly=(points,c)=>{ctx.fillStyle=c;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(Math.round(p[0]),Math.round(p[1])):ctx.moveTo(Math.round(p[0]),Math.round(p[1])));ctx.closePath();ctx.fill();};
    ctx.clearRect(0,0,w,h);
    const sky=ctx.createLinearGradient(0,0,0,h*.72);sky.addColorStop(0,'#375876');sky.addColorStop(.65,'#6fa7b1');sky.addColorStop(1,'#c5dfb2');rect(0,0,w,h,sky);
    // Soft pixel ribbons and sunlit haze give the forest a dreamlike glow.
    for(let band=0;band<4;band++){
      const p=[],q=[];for(let x=w*.32;x<=w*1.04;x+=8){const y=h*(.13+band*.032)+Math.sin(x/w*7+time*.035+band*.45)*h*.042;p.push([x,y]);const fade=Math.pow(Math.sin(Math.min(1,Math.max(0,(x/w-.32)/.72))*Math.PI),.7);q.unshift([x,y+h*(.035+band*.012)*fade]);}
      poly(p.concat(q),['#b7efd622','#77d9d823','#d0bbf124','#b7e0d819'][band]);
    }
    const halo=ctx.createRadialGradient(w*.75,h*.29,1,w*.75,h*.29,w*.26);halo.addColorStop(0,'#ffe1a332');halo.addColorStop(1,'#ffe1a300');rect(w*.4,0,w*.65,h*.8,halo);

    for(let i=0;i<65;i++){const x=rand()*w,y=rand()*h*.38;rect(x,y,1,1,`rgba(220,227,197,${.18+rand()*.45})`);}
    const mx=w*.8,my=h*.19;rect(mx-4,my-10,12,20,'#f1eac3');rect(mx-8,my-6,20,12,'#f1eac3');rect(mx+2,my-9,12,15,'#66879e');
    const mountains=(base,amp,col,offset)=>{let p=[[0,h]];for(let x=0;x<=w+12;x+=12){const wave=Math.sin(x/w*11+offset)*.55+Math.sin(x/w*27+offset)*.25;p.push([x,base+wave*amp]);}p.push([w,h]);poly(p,col);};
    mountains(h*.44,h*.16,'#819fb8',2);mountains(h*.5,h*.12,'#519c99',4);mountains(h*.59,h*.07,'#2c806b',1);
    function pine(x,y,s,col,light){rect(x-1,y-s*.7,2,s*.7,col);for(let k=0;k<7;k++){const top=y-s+k*s*.095;const span=s*(.055+k*.035);poly([[x,top],[x-span,top+s*.26],[x+span,top+s*.26]],col);if(light)poly([[x,top],[x-span,top+s*.26],[x-span*.15,top+s*.21]],light);} }
    for(let i=0;i<145;i++){const x=rand()*w,y=h*.55+Math.sin(x/w*7)*h*.025,s=h*(.035+rand()*.075);pine(x,y,s,'#3b8b6d');}
    rect(0,h*.59,w,h*.27,'#388d96');
    for(let i=0;i<110;i++){let y=h*.6+rand()*h*.26,x=rand()*w;rect(x,y,5+rand()*40,1,'#b8efd74a');}
    for(let i=0;i<22;i++){let y=h*(.61+i*.009),x=w*.8+Math.sin(i*4)*4;rect(x-i*.6,y,5+i*1.1,1,'#f1e6a352');}
    const bank=[[w*.36,h],[w*.41,h*.91],[w*.56,h*.78],[w*.67,h*.75],[w*.78,h*.69],[w*.89,h*.7],[w,h*.65],[w,h]];poly(bank,'#276546');
    poly([[w*.49,h],[w*.61,h*.86],[w*.75,h*.82],[w*.81,h*.77],[w*.84,h*.8],[w*.76,h*.87],[w*.69,h*.9],[w*.59,h]],'#88a764');
    for(let i=0;i<110;i++){const x=w*(.62+rand()*.43),y=h*(.71+rand()*.28);rect(x,y,2+rand()*4,1,'#4e8851');}
    for(let i=0;i<24;i++){const x=w*(.87+rand()*.15),y=h*(.68+rand()*.07),s=h*(.12+rand()*.18);pine(x,y,s,'#20563c','#438449');}
    const cx=w*.768,cy=h*.725,scale=Math.max(.65,w/650),cw=49*scale,ch=34*scale;
    rect(cx-cw/2,cy-ch,cw,ch,'#4b4935');
    for(let k=0;k<6;k++)rect(cx-cw/2,cy-ch+k*ch/6,cw,1,'#282f2580');
    poly([[cx-cw*.72,cy-ch],[cx,cy-ch*1.85],[cx+cw*.72,cy-ch]],'#25392c');
    poly([[cx,cy-ch*1.85],[cx+cw*.72,cy-ch],[cx+cw*.08,cy-ch]],'#394837');
    rect(cx+cw*.19,cy-ch*1.55,6*scale,12*scale,'#3a4030');
    rect(cx+cw*.02,cy-ch*.75,12*scale,14*scale,'#f0c87d');rect(cx+cw*.08,cy-ch*.75,1*scale,14*scale,'#937449');rect(cx+cw*.02,cy-ch*.54,12*scale,1*scale,'#937449');
    rect(cx-cw*.31,cy-ch*.64,10*scale,ch*.64,'#223326');rect(cx-cw*.5,cy-1,cw,3*scale,'#687054');
    const fx=cx+cw*.95,fy=cy+ch*.54;
    const glow=ctx.createRadialGradient(fx,fy,1,fx,fy,ch*1.8);glow.addColorStop(0,'#eba95235');glow.addColorStop(1,'#eba95200');rect(fx-ch*2,fy-ch*2,ch*4,ch*4,glow);
    rect(fx-7*scale,fy,14*scale,3*scale,'#918365');rect(fx-4*scale,fy+2*scale,8*scale,2*scale,'#3c3627');
    const flicker=Math.sin(time*5)*1.5;poly([[fx-4*scale,fy],[fx-5*scale,fy-4*scale],[fx-2*scale,fy-10*scale-flicker],[fx+1*scale,fy-6*scale],[fx+3*scale,fy-13*scale+flicker],[fx+5*scale,fy-4*scale],[fx+4*scale,fy]],'#d58340');rect(fx-1*scale,fy-6*scale,3*scale,6*scale,'#efd594');
    for(let i=0;i<8;i++){const t=(time*.12+i*.14)%1;rect(fx+Math.sin(i*13+t*5)*5*scale,fy-t*26*scale,1,1,`rgba(239,191,113,${1-t})`);}
    // Small wanderer, part of the landscape illustration rather than a product UI.
    rect(fx-19*scale,fy-12*scale,4*scale,4*scale,'#bdbd91');rect(fx-20*scale,fy-8*scale,6*scale,8*scale,'#849078');rect(fx-20*scale,fy,2*scale,4*scale,'#1c3024');rect(fx-16*scale,fy,2*scale,4*scale,'#1c3024');
    for(let i=0;i<4;i++){let y=h*(.54+i*.068);rect(0,y,w,3,'#bcd0b713');}
    for(let i=0;i<9;i++){let x=rand()*w*.29,y=h*(.82+rand()*.14),s=h*(.33+rand()*.36);pine(x,y,s,'#124a38','#20603d');}
    for(let i=0;i<4;i++){let x=w*(.97+rand()*.08),y=h*(.9+rand()*.1),s=h*(.4+rand()*.3);pine(x,y,s,'#144434');}
    poly([[0,h*.96],[w*.18,h*.93],[w*.32,h*.98],[w*.47,h*.97],[w*.65,h*.95],[w*.81,h*.98],[w,h*.94],[w,h],[0,h]],'#15462c');
    for(let i=0;i<75;i++){const x=rand()*w,y=h*(.94+rand()*.07);rect(x,y,1,2+rand()*5,'#37653a');}
    for(let i=0;i<16;i++){const x=w*(.48+rand()*.5),y=h*(.56+rand()*.36)+Math.sin(time*.45+i)*2;rect(x,y,1,1,`rgba(237,240,146,${.35+.35*Math.sin(time*.7+i)})`);}
  }
  root.PixelForest={draw};
  if(typeof module!=='undefined')module.exports={draw};
})(typeof window!=='undefined'?window:globalThis);
