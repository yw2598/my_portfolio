from pathlib import Path
parts=['''<svg class="gb-network-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 540" role="img" aria-labelledby="gb-graphic-title gb-graphic-desc"><title id="gb-graphic-title">GameBuddy reasoning and action architecture</title><desc id="gb-graphic-desc">Semantic game state feeds System2 and System1. Long-term memory feeds System2. First-person imagery feeds System1. Goals and instructions pass to System1; action vectors pass to System0; game feedback closes the loop. Model interiors are schematic.</desc><defs><pattern id="gb-grid" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".65" fill="#9caf8830"/></pattern><marker id="gb-graph-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#ffdc90"/></marker><linearGradient id="gb-model-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#306e59"/><stop offset="1" stop-color="#21594f"/></linearGradient></defs><rect width="900" height="540" fill="#226159"/><rect width="900" height="540" fill="url(#gb-grid)"/>''']
def text(x,y,t,size=15,fill='#d9e9c5',anchor='start',cls=''):
 parts.append(f'<text x="{x}" y="{y}" fill="{fill}" font-size="{size}" font-family="Arial,Helvetica,sans-serif" text-anchor="{anchor}" class="{cls}">{t}</text>')
def path(d,kind='trace',data='',speed='3s'):
 parts.append(f'<path class="gb-{kind}" d="{d}" fill="none" stroke="#97c5a1" stroke-width="1.6" {data} style="--gb-speed:{speed}"/>')
def wire(d,name,speed):
 path(d,'base-wire')
 parts.append(f'<path class="gb-signal-path" data-gb-wire="{name}" d="{d}" fill="none" stroke="#ffda8a" stroke-width="2.6" marker-end="url(#gb-graph-arrow)" style="--gb-speed:{speed}"/>')
# Semantic-state fan-out is separate from memory and vision.
wire('M272 79H265V170','state-s2','4s')
wire('M272 79H515V170','state-s1','3s')
wire('M148 252H185','memory','5s')
wire('M188 449H515V394','vision','2.2s')
wire('M345 286H435','goals','3.8s')
wire('M595 286H685','actions','1.6s')
wire('M765 394V512H16V79H30','feedback','2.6s')
for key,x,y,w,h,title,sub in [('state',30,42,242,61,'SEMANTIC GAME STATE','Native game interface'),('memory',28,208,120,88,'LONG-TERM','MEMORY'),('vision',28,410,160,77,'FIRST-PERSON','VIEW')]:
 parts.append(f'<g data-gb-input="{key}"><rect class="gb-source-frame" x="{x}" y="{y}" width="{w}" height="{h}" fill="#286958" stroke="#97c5a1" stroke-width="1.2"/>')
 text(x+12,y+25,title,13,'#d2dcc0');text(x+12,y+45,sub,12,'#d1e6ba')
 if key=='memory':
  for i in range(3):path(f'M{x+12} {y+58+i*7}H{x+70-i*8}')
 if key=='vision':
  parts.append(f'<path d="M{x+119} {y+18}h24v26h-24zM{x+123} {y+37}l7-9 9 9" fill="none" stroke="#ffda8a" stroke-width="1.5"/>')
 parts.append('</g>')
for key,x,title,subtitle,footer,rate in [('s2',185,'System2','CLOUD REASONING','Goals + verifiers','15–30 seconds'),('s1',435,'System1','LOCAL DECISION VLM','0.8B · distillation target','5 Hz'),('s0',685,'System0','CLOSED-LOOP SCRIPT','Native game execution','50 Hz tick')]:
 parts.append(f'<g data-gb-layer="{key}"><rect class="gb-model-frame" x="{x}" y="170" width="160" height="224" fill="url(#gb-model-fill)" stroke="#b9c59d" stroke-width="1.2"/><path d="M{x} 215H{x+160}M{x} 344H{x+160}" stroke="#91a78155"/>')
 text(x+15,195,title,25,'#ffe0a0');text(x+15,209,subtitle,9,'#d7ebc8')
 if key=='s2':
  cols=[[x+28,x+79,x+130],[231,260,289,318]]
  for col in range(2):
   for j,y1 in enumerate(cols[1]):
    for k,y2 in enumerate(cols[1]):
     if abs(j-k)<=1:path(f'M{cols[0][col]} {y1}L{cols[0][col+1]} {y2}','synapse')
  for i,cx in enumerate(cols[0]):
   for j,cy in enumerate(cols[1]):parts.append(f'<circle class="gb-neuron" cx="{cx}" cy="{cy}" r="3.1" fill="#ffda8a" style="--gb-delay:-{(i+j)*.31}s"/>')
 elif key=='s1':
  for col in range(3):
   ox=x+16+col*47;oy=230+col*7
   parts.append(f'<path d="M{ox-5} {oy-4}h36v88h-36z" fill="#245f52" stroke="#a3bd9160"/>')
   for a in range(3):
    for b in range(6):
     color='#dac58b' if (a+b+col)%3==0 else '#76bc89'
     parts.append(f'<rect class="gb-tensor" x="{ox+a*8}" y="{oy+b*12}" width="4" height="6" fill="{color}" style="--gb-delay:-{(a+b+col)*.13}s"/>')
   if col<2:path(f'M{ox+25} {oy+43}H{ox+43}','synapse')
 else:
  for i,label in enumerate(['MOVE','DEFEND','ACT']):
   y=239+i*34;text(x+12,y,label,11,'#d7ebc8')
   path(f'M{x+65} {y-4}h12v-8h8v16h8v-8h11v-5h8v10h8v-5h12','control-wave',speed=['1.2s','.8s','.6s'][i])
 text(x+80,365,rate,17,'#ffda8a','middle');text(x+80,382,footer,10,'#d3e9b8','middle');parts.append('</g>')
text(390,249,'GOALS +',10,'#d9e9c5','middle');text(390,264,'INSTRUCTIONS',10,'#d9e9c5','middle')
text(640,249,'ACTION',10,'#d9e9c5','middle');text(640,264,'VECTOR',10,'#d9e9c5','middle')
text(505,489,'CONTINUOUS WORLD FEEDBACK',11,'#c4e0b1','middle')
text(853,529,'GAMEBUDDY / ARCHITECTURE DESIGN',9,'#b6d8a3','end')
parts.append('</svg>')
Path('dist/assets/gamebuddy-architecture.svg').write_text(''.join(parts))
