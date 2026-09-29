const $=id=>document.getElementById(id);
const pages=['Command Center','Nearby Wells Map','Historical Analogues','What Happened Next?','Historical Replay','Risk & Evidence','Assistant','Foresight Flow','Formation Intelligence','Document Review'];
$('nav').innerHTML=[7,0,8,9,1,2,3,4,5,6].map(i=>`<button data-i="${i}" class="${i==7?'on':''}" onclick="go(${i})">${pages[i]}</button>`).join('');
function go(i){if(i!=7)pause2();document.querySelectorAll('.pg').forEach((e,j)=>e.classList.toggle('on',i==j));[...$('nav').children].forEach((b,j)=>b.classList.toggle('on',+b.dataset.i==i));if(i==2)barsIn()}

const sc=c=>c>=85?'H':c>=75?'M':'L';
$('kpi').innerHTML=[['Current depth','2,785 m'],['Formation','XYZ Sandstone'],['Nearby wells','18'],['Historical events','47'],['Active risks','3'],['Closest analog','91% B12'],['Risk level','<span class="tag H">HIGH</span>']].map(k=>`<div class="c"><div class="kv">${k[0]}</div><div>${k[1]}</div></div>`).join('');
$('chain').innerHTML=['Real-time state','Nearby wells','Formation + depth','Analogue matching','Event sequence','What happened next?','Risk alert','Evidence','Engineer review'].map((x,i)=>(i?'<span style="background:0;border:0">›</span>':'')+`<span>${x}</span>`).join('');
// telemetry
const T=[['ROP m/hr',22,-1,3],['Torque kNm',14.2,.6,.4],['WOB kN',82,0,3],['RPM',115,0,2],['SPP psi',3420,20,25],['Flow GPM',480,0,4]];
const H=T.map(t=>Array.from({length:30},(_,i)=>t[1]+t[2]*(i-30)/8+(Math.random()-.5)*t[3]));
function spark(){$('sp').innerHTML=T.map((t,k)=>{const d=H[k],mn=Math.min(...d),mx=Math.max(...d),p=d.map((v,i)=>`${i*7},${36-(v-mn)/(mx-mn||1)*32}`).join(' ');
return`<div><span class="kv">${t[0]}</span> <b>${d[29].toFixed(t[1]<100?1:0)}</b><svg viewBox="0 0 203 38" preserveAspectRatio="none"><polyline points="${p}" fill="none" stroke="var(--am)" stroke-width="1.6"/></svg></div>`}).join('');
$('upd').textContent='Updated '+new Date().toLocaleTimeString()}
setInterval(()=>{H.forEach((d,k)=>{d.shift();d.push(d[28]+T[k][2]/8+(Math.random()-.5)*T[k][3])});spark()},2000);spark();
const AL=[['HIGH','Potential mud-loss interval approaching','Depth 2,785 m · historical evidence: 3 nearby wells','12:42:18'],['MEDIUM','Torque pattern similarity detected','Current well resembles OIL-D04','12:39:05'],['MEDIUM','Formation transition ahead','XYZ Sandstone interval, 5 wells analysed','12:31:40']];
$('alerts').innerHTML=AL.map(a=>`<div class="al ${a[0][0]=='H'?'H':''}"><small>${a[3]}</small> <span class="tag ${a[0][0]}">${a[0]}</span><div>${a[1]}</div><small>${a[2]}</small><br><button class="btn" style="margin-top:6px" onclick="go(${a[0]=='HIGH'?5:2})">Investigate</button></div>`).join('');
// map
let R=20;$('rad').innerHTML=[2,5,10,20].map(r=>`<button class="btn ${r==20?'on':''}" onclick="R=${r};drawMap(this)">${r} km</button>`).join('');
function drawMap(b){if(b){[...$('rad').children].forEach(x=>x.classList.remove('on'));b.classList.add('on')}
const k=10.5;let s=[5,10,20].map(r=>`<circle cx="300" cy="230" r="${r*k}" fill="none" stroke="#2b3646" stroke-dasharray="3 5"/><text x="${300+r*k*.71+4}" y="${230-r*k*.71}" fill="#5c6a7d" font-size="10">${r} km</text>`).join('');
s+=W.filter(w=>w.d<=R).map(w=>{const x=300+w.d*k*Math.sin(w.a*Math.PI/180),y=230-w.d*k*Math.cos(w.a*Math.PI/180),c=w.d==0?'#f0a030':w.sim>=85?'#e5484d':w.ev.length?'#e8c547':'#3fb27f';
return`<g style="cursor:pointer" onclick="wsel('${w.id}')">${w.d==0?`<circle cx="${x}" cy="${y}" r="16" fill="none" stroke="${c}"><animate attributeName="r" values="8;22" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="2s" repeatCount="indefinite"/></circle>`:''}<circle cx="${x}" cy="${y}" r="${w.d?7:9}" fill="${c}"/><text x="${x+12}" y="${y+4}" fill="#e8ecf1" font-size="12">${w.id}</text></g>`}).join('');
s+=`<text x="12" y="446" fill="#8b98aa" font-size="11">Amber active · red high-risk analogue · yellow prior events · green no major events. Synthetic coordinates.</text>`;$('map').innerHTML=s}
function wsel(id){const w=W.find(x=>x.id==id);$('wd').innerHTML=`<h3>${w.id}</h3><div class="kv">Distance</div>${w.d?w.d+' km':'—'}<div class="kv">Formation</div>${w.f}<div class="kv">Status</div>${w.s}<div class="kv">Similarity</div>${w.sim}%<div class="kv">Historical events</div>${w.ev.join(', ')||'None'}<div class="kv">Critical interval</div>${w.ci}`}
drawMap();
// analogues
const A=W.slice(1,5);
$('an').innerHTML='<tr><th>Well</th><th>Dist.</th><th>Similarity</th><th>Event</th><th>Depth</th><th>Outcome</th></tr>'+A.map(w=>`<tr class="cl" onclick="cmp('${w.id}')"><td>${w.id}</td><td>${w.d} km</td><td style="width:22%">${w.sim}%<div class="bar"><i data-w="${w.sim}"></i></div></td><td>${w.m}</td><td>${w.dep.toLocaleString()} m</td><td>${w.out}</td></tr>`).join('');
function barsIn(){setTimeout(()=>document.querySelectorAll('.bar i').forEach(i=>i.style.width=i.dataset.w+'%'),50)}
function cmp(id){const w=W.find(x=>x.id==id);$('cmp').innerHTML=`<table><tr><th></th><th>OIL-X17</th><th>${id}</th></tr>${[['Depth','2,785 m',w.dep+' m'],['Formation','Sandstone',w.f.replace('XYZ ','')],['Torque','14.2 kNm',w.t+' kNm'],['ROP','22 m/hr',w.r+' m/hr'],['Mud weight','1.18 SG',w.mw+' SG'],['Distance','—',w.d+' km'],['Casing','9-5/8 in planned',evs(w.id,'Casing Issue')],['Cementing','Not yet run',evs(w.id,'Cementing Issue')]].map(r=>`<tr><td class="kv">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</table><div class="note">Synthetic data. The current well is beginning to resemble historical behaviour in this comparison.</div>`}
// what next
const S=[['OIL-B12',[['2,760 m','Normal',''],['2,772 m','Torque ↑','w'],['2,781 m','ROP ↓','w'],['2,790 m','Mud loss','r']]],['OIL-C08',[['2,770 m','Normal',''],['2,790 m','Torque ↑','w'],['2,802 m','Drag ↑','w'],['2,815 m','Stuck pipe','r']]],['OIL-D04',[['2,755 m','Normal',''],['2,770 m','Torque spike','w'],['2,785 m','ROP ↓','w'],['2,805 m','Stuck pipe','r']]]];
const row=(n,a)=>`<div class="kv" style="margin-top:8px">${n}</div><div class="seq">${a.map(x=>`<div class="st ${x[2]}"><b>${x[1]}</b>${x[0]}</div>`).join('')}</div>`;
$('seqs').innerHTML=S.map(s=>row(s[0],s[1])).join('')+`<div class="kv" style="margin-top:8px;color:var(--am)">OIL-X17 · CURRENT WELL</div><div class="seq">${[['2,760 m','Normal',''],['2,780 m','Torque ↑','w'],['2,790 m','ROP ↓','w'],['2,795 m','Current','cur']].map(x=>`<div class="st ${x[2]}"><b>${x[1]}</b>${x[0]}</div>`).join('')}</div>`;
// replay
const RP={'OIL-B12':[['2,700 m','Normal drilling'],['2,750 m','Formation transition into XYZ Sandstone'],['2,772 m','Torque increase'],['2,781 m','ROP decrease'],['2,790 m','Partial mud loss, LCM treatment','r'],['2,820 m','STUCK PIPE, jarring','r'],['2,840 m','Fishing operation'],['2,870 m','Drilling resumed'],['2,890 m','Casing run, 9-5/8 in'],['2,895 m','Cement job: lost returns, remedial squeeze','r']]};
$('rw').innerHTML='<span class="kv">Well: OIL-B12 (synthetic)</span>';
let ri=-1,rt;function draw(){$('tl').innerHTML=RP['OIL-B12'].map((e,i)=>`<div class="ev ${e[2]||''} ${i<=ri?'on':''}"><em>${e[0]}</em>${e[1]}</div>`).join('')}
function play(){pause();ri=-1;draw();rt=setInterval(()=>{ri++;draw();if(ri>=9)pause()},1100)}function pause(){clearInterval(rt)}draw();
// evidence
$('why').innerHTML=['Current depth approaching historical risk interval','Same formation as 4 historical wells','Torque increased 18% (observed)','ROP decreased 12% (observed)','Current pattern resembles OIL-B12','OIL-B12 recorded mud loss at 2,790 m and stuck pipe at 2,820 m','OIL-C08 showed similar drag behaviour'].map(x=>`<li>✓ ${x}</li>`).join('');
const SRC=[['OIL-B12','Daily Drilling Report','43','Partial mud loss','2,790 m'],['OIL-C08','Well Completion Report','117','Stuck pipe','2,810 m'],['OIL-D04','Daily Drilling Report','81','Stuck pipe','2,805 m']];
const srcCard=s=>`<div class="src"><b>SOURCE</b> ${s[0]} · ${s[1]} · Page ${s[2]}<br>Event: ${s[3]} · Depth ${s[4]}</div>`;
$('ev').innerHTML='<div class="kv">Observed data, historical evidence and model-derived risk are shown separately. Recommendation text is simulated.</div>'+SRC.map(srcCard).join('');
// assistant
const Q={'Which nearby wells experienced mud losses?':['OIL-B12 recorded partial mud loss near 2,790 m in XYZ Sandstone; OIL-J09 recorded lost circulation at 2,670 m in Formation A.',[SRC[0]],84],
'What happened after the torque spike in Well B12?':['ROP declined about 15 m later, and stuck pipe followed near 2,810 m. Historical responses observed: LCM treatment, then fishing.',[SRC[0]],88],
'Show wells similar to the current well.':['Top analogues: OIL-B12 91%, OIL-C08 86%, OIL-D04 81%, OIL-F19 77%.',[SRC[0],SRC[1]],90],
'Which historical wells had stuck pipe between 2800–2900 m?':['OIL-C08 (2,810 m) and OIL-D04 (2,805 m). Both are XYZ Sandstone within 6 km.',[SRC[1],SRC[2]],86]};
$('qs').innerHTML=Object.keys(Q).map(q=>`<button class="btn" onclick="ask('${q}')">${q}</button>`).join('');
function ask(q){let k=Object.keys(Q).find(x=>x==q)||Object.keys(Q).find(x=>q.toLowerCase().includes('mud')?/mud/.test(x):q.toLowerCase().includes('stuck')?/stuck/.test(x):q.toLowerCase().includes('similar')?/similar/.test(x):/torque/.test(x));const a=Q[k];
$('ans').innerHTML=`<div class="c" style="background:var(--sf2);margin-top:12px"><div class="kv">${k}</div><p>${a[0]}</p>${a[1].map(srcCard).join('')}<div class="kv" style="margin-top:8px">Retrieval confidence ${a[2]}% · synthetic knowledge base · requires engineer review</div><button class="btn" style="margin-top:8px" onclick="go(5)">View evidence</button></div>`}

const ST=['Current well','Knowledge graph','Historical analogues','Event sequence','What happened next?','Explainable alert','Evidence'];
const SD=['OIL-X17 · 2,785 m','XYZ links 5 wells','3 analogues · 81–91%','Torque ↑ → ROP ↓','3 of 5 wells','Stuck pipe · potential','3 source pages'];
let cs=0,tt;
$('rail').innerHTML=ST.map((x,i)=>`<button id="rl${i}" onclick="pause2();stage(${i})"><b style="color:var(--tx);font-weight:500">${x}</b><br>${SD[i]}</button>`).join('');
const seg=a=>a.map(x=>`<i style="width:${x[0]}%;background:${x[1]};color:${x[2]}">${x[3]}</i>`).join('');
const P=[
()=>`<p>Observed in the simulated feed: torque up 18%, ROP down 12%, standpipe pressure slightly elevated. OIL-X17 is drilling XYZ Sandstone at 2,785 m.</p><div class="kv">Depth and risk zones, 2,700–2,900 m (historical, from nearby wells)</div><div class="dz"><span class="pin" style="left:42.5%">▼ 2,785 m</span>${seg([[50,'#1f5a40','#cfe','normal'],[10,'#8a6a10','#fff','mud loss'],[15,'#8a2a2e','#fff','stuck pipe zone'],[25,'#1f5a40','#cfe','normal']])}</div><div class="dz" style="margin-top:4px">${seg([[30,'#2b3646','#e8ecf1','Formation B'],[70,'#3a4658','#e8ecf1','XYZ Sandstone from 2,760 m']])}</div><div class="kv">Amber 2,800–2,820 m: historical mud loss (OIL-B12). Red 2,820–2,850 m: historical stuck pipe (OIL-C08, OIL-D04).</div>`,
()=>`<p>Ranked by proximity, formation, depth, trajectory, mud weight, drilling parameters and event history.</p>`+A.slice(0,3).map(w=>`<div style="margin:10px 0"><b>${w.id}</b> · ${w.d} km · ${w.f} · <b style="color:var(--am)">${w.sim}%</b><div class="bar"><i style="width:${w.sim}%"></i></div><span class="kv">${w.m} at ${w.dep.toLocaleString()} m, outcome: ${w.out}</span></div>`).join(''),
()=>`<p>Each analogue followed an ordered sequence. The current well matches the first steps.</p>`+S.map(x=>row(x[0],x[1])).join('')+`<div class="kv" style="color:var(--am)">OIL-X17 · CURRENT WELL</div><div class="seq">${[['2,760 m','Normal',''],['2,780 m','Torque ↑','w'],['2,790 m','ROP ↓','w'],['2,795 m','Current','cur']].map(x=>`<div class="st ${x[2]}"><b>${x[1]}</b>${x[0]}</div>`).join('')}</div>`,
()=>`<div class="big">3 of 5 comparable wells experienced a significant drilling event within the next 20–40 m.</div><div class="dots">${[['B12',1],['C08',1],['D04',1],['F19',0],['H05',0]].map(x=>`<b class="${x[1]?'x':''}">OIL-${x[0]} · ${x[1]?'event followed':'no event followed'}</b>`).join('')}</div><div class="note">Simulated data. Pattern similarity in historical wells, not a forecast.</div>`,
()=>`<span class="tag H">STUCK PIPE · potential risk · HIGH</span><ul style="line-height:1.9;padding-left:18px">${$('why').innerHTML}</ul><div id="hitl" class="note">Engineer review: <b>pending</b>. NWIS never acts automatically.</div><button class="btn" onclick="rv('acknowledged')">Acknowledge</button><button class="btn" onclick="rv('escalated to senior engineer')">Escalate</button><button class="btn" onclick="rv('dismissed, reason logged')">Dismiss with reason</button>`,
()=>`<p>Each historical claim traces to a source page.</p>${SRC.map(srcCard).join('')}<div class="note">Synthetic data, not a recommendation. The engineer decides.</div>`];
function stage(k){cs=k;go(7);setTimeout(()=>k==1&&gdraw(),0);ST.forEach((_,i)=>$('rl'+i).className=i==k?'on':i<k?'done':'');
$('sg').innerHTML=`<div class="kv" style="margin-top:10px">Step ${k+1} of 7</div><h3 style="font-size:20px;margin:2px 0 8px">${ST[k]}</h3>${P[k]()}<div style="margin-top:12px">${k?`<button class="btn" onclick="pause2();stage(${k-1})">Back</button>`:''}${k<6?`<button class="btn on" onclick="pause2();stage(${k+1})">Next: ${ST[k+1]}</button>`:`<button class="btn" onclick="go(5)">Open risk and evidence page</button>`}</div>`}
function tour(){pause2();stage(0);tt=setInterval(()=>{if(cs>=6)return pause2();stage(cs+1)},3800)}
function pause2(){clearInterval(tt)}
function rv(t){$('hitl').innerHTML=`Engineer review: <b>${t}</b>. Demo action only, nothing is sent to any system.`}
function nl(q){const l=q.toLowerCase(),m=l.match(/(\d+)\s*km/),r=m&&+m[1],f=/sandstone/.test(l)&&'Sandstone',e=['stuck','mud','kick','torque','cementing','lost'].find(x=>l.includes(x));
const res=W.filter(w=>w.d>0&&(!r||w.d<=r)&&(!f||w.f.includes(f))&&(!e||w.ev.some(x=>x.toLowerCase().includes(e))));
$('sr').innerHTML=`<div>${r?`<span class="chip">Radius: ${r} km</span>`:''}${f?`<span class="chip">Formation: ${f}</span>`:''}${e?`<span class="chip">Event: ${e}</span>`:''}<span class="kv">Filters parsed by a rule-based demo parser</span></div><table>${res.map(w=>`<tr class="cl" onclick="go(1);wsel('${w.id}')"><td>${w.id}</td><td>${w.d} km</td><td>${w.f}</td><td>${w.ev.join(', ')||'None'}</td></tr>`).join('')||'<tr><td>No wells match these filters in the synthetic data.</td></tr>'}</table>`}


const sl=e=>e.s.replace('_OIL_','_')+' p.'+e.p,SIM={};A.forEach(w=>SIM[w.id]=w.sim);
const evs=(id,t)=>{const e=EV.find(x=>x.w==id&&x.t==t);return e?`${e.d.toLocaleString()} m, ${e.m}, ${e.o}`:'None recorded'};
function fstat(f){const v=EV.filter(e=>e.f==f),b=Array(10).fill(0);v.forEach(e=>{const k=Math.floor((e.d-2700)/20);if(k>=0&&k<10)b[k]++});const h=b.map((c,i)=>c>=3?i:-1).filter(i=>i>=0);return{v,b,h:h.length?`${(2700+h[0]*20).toLocaleString()}–${(2700+h[h.length-1]*20+20).toLocaleString()} m`:'none',wells:new Set(v.map(e=>e.w)).size}}
// knowledge graph
let gsel=new Set(),gtitle='',GN={},gf={w:'',f:X,t:'',m:'',o:'',d:''};
const uq=k=>[...new Set(EV.map(e=>e[k]))].sort();
const fl=()=>EV.map((e,i)=>({...e,i})).filter(e=>(!gf.w||e.w==gf.w)&&(!gf.f||e.f==gf.f)&&(!gf.t||e.t==gf.t)&&(!gf.m||e.m==gf.m)&&(!gf.o||e.o==gf.o)&&(!gf.d||(e.d>=+gf.d&&e.d<+gf.d+100)));
function gp(){const O=k=>[['','All']].concat(uq(k).map(x=>[x,x])),sel=(k,l,o)=>`<label class="kv">${l} <select onchange="gf.${k}=this.value;gsel.clear();gtitle='';gdraw()">${o.map(x=>`<option value="${x[0]}" ${gf[k]==x[0]?'selected':''}>${x[1]}</option>`).join('')}</select></label> `;
return `<p>The graph is built from the event repository: well, formation, event and depth, mitigation, outcome, source page. Filtered to the current formation it returns the analogue wells and the events they recorded. Select a node to trace every chain through it.</p>`+sel('w','Well',O('w'))+sel('f','Formation',O('f'))+sel('t','Event',O('t'))+sel('d','Depth',[['','All'],[2600,'2,600–2,700 m'],[2700,'2,700–2,800 m'],[2800,'2,800–2,900 m'],[2900,'2,900 m+']])+sel('m','Mitigation',O('m'))+sel('o','Outcome',O('o'))+`<div style="margin:8px 0"><button class="btn on" onclick="gtrace()">Trace OIL-B12 mud loss to source</button></div><div class="g"><svg id="gsvg" viewBox="0 0 880 440" style="width:100%;background:#0b1017;border-radius:3px"></svg><div id="gdet" class="c" style="background:var(--sf2)"></div></div><div class="note">Synthetic demonstration data. Well locations are synthetic coordinates.</div>`}
function gdraw(){const ev=fl().sort((a,b)=>a.d-b.d),C={w:65,f:215,e:365,m:515,o:665,s:815},N={},Ed={};
const nk=(c,k,l)=>{const key=c+':'+k;return N[key]=N[key]||{c,key,lab:l,ev:[]}};
ev.forEach(e=>{const ch=[nk('w',e.w,e.w+(SIM[e.w]?' · '+SIM[e.w]+'%':'')),nk('f',e.f,e.f),nk('e',e.i,e.d.toLocaleString()+' m · '+e.t),nk('m',e.m,e.m),nk('o',e.o,e.o),nk('s',sl(e),sl(e))];ch.forEach(n=>n.ev.push(e.i));for(let j=0;j<5;j++){const k=ch[j].key+'|'+ch[j+1].key;(Ed[k]=Ed[k]||{a:ch[j],b:ch[j+1],ev:[]}).ev.push(e.i)}});
Object.keys(C).forEach(c=>{const ns=Object.values(N).filter(n=>n.c==c),st=Math.min(34,380/Math.max(ns.length-1,1));ns.forEach((n,i)=>{n.x=C[c];n.y=225-(ns.length-1)*st/2+i*st})});
GN=N;const on=a=>a.some(i=>gsel.has(i)),dim=h=>gsel.size&&!h?.2:1;
let o=['Well','Formation','Event · depth','Mitigation','Outcome','Source document'].map((l,i)=>`<text x="${65+i*150}" y="14" fill="#8b98aa" font-size="10" text-anchor="middle">${l}</text>`).join('');
o+=Object.values(Ed).map(e=>{const h=on(e.ev),x1=e.a.x+58,x2=e.b.x-58,m=(x1+x2)/2;return`<path class="ge ${h?'hl':''}" opacity="${dim(h)}" d="M${x1} ${e.a.y}C${m} ${e.a.y} ${m} ${e.b.y} ${x2} ${e.b.y}"/>`}).join('');
o+=Object.values(N).map(n=>{const h=on(n.ev),t=n.lab.length>19?n.lab.slice(0,18)+'…':n.lab;return`<g class="gn ${h?'hl':''}" opacity="${dim(h)}" onclick="gclick('${n.key}')"><title>${n.lab}</title><rect x="${n.x-58}" y="${n.y-11}" width="116" height="22" rx="2"/><text x="${n.x}" y="${n.y+4}" text-anchor="middle">${t}</text></g>`}).join('');
$('gsvg').innerHTML=o||'<text x="30" y="40" fill="#8b98aa">No events match these filters.</text>';
$('gdet').innerHTML=gsel.size?`<h3>${gtitle}</h3>`+[...gsel].map(i=>EV[i]).map(e=>{const w=W.find(x=>x.id==e.w);return`<div class="src"><b>${e.w}</b>${w&&w.d?` · ${w.d} km away`:''} · ${e.f} · ${e.d.toLocaleString()} m<br>${e.t} (${e.sv}) → ${e.m} → ${e.o}<br>Source: ${sl(e)}</div>`}).join('')+`<button class="btn" style="margin-top:8px" onclick="stage(2)">Use these wells as analogues</button>`:'<div class="kv">Select a node. Every event chain passing through it is highlighted and listed here.</div>'}
function gclick(k){gsel=new Set(GN[k].ev);gtitle=GN[k].lab;gdraw()}
function gtrace(){gf={w:'',f:X,t:'',m:'',o:'',d:''};gsel=new Set([1]);gtitle='OIL-B12 → XYZ Sandstone → Mud Loss 2,790 m → LCM Treatment → Recovery → DDR_B12 p.43';stage(1)}
// formation intelligence
function fi(f){f=f||X;const s=fstat(f),mx=Math.max(1,...TAX.map(t=>s.v.filter(e=>e.t==t).length));
$('fib').innerHTML=`<div>${[X,'Formation A','Formation B'].map(x=>`<button class="btn ${x==f?'on':''}" onclick="fi('${x}')">${x}</button>`).join('')}</div><h3 style="font-size:22px">${f}</h3><div>${s.wells} wells and ${s.v.length} events in the demo repository (synthetic sample).</div>
<div class="kv" style="margin-top:12px">Historical event density by depth, 2,700–2,900 m. High density: <b style="color:#ff8f93">${s.h}</b></div>
<div class="dz">${f==CUR?'<span class="pin" style="left:42.5%">▼ OIL-X17 2,785 m</span>':''}${s.b.map(c=>`<i style="width:10%;background:${c>=3?'#8a2a2e':c?'#5a4a1a':'#1a2230'};color:#fff">${c||''}</i>`).join('')}</div>
<div class="mk">${s.v.filter(e=>e.d>=2700&&e.d<2900).map(e=>`<u style="left:${(e.d-2700)/2}%;background:${TC[e.t]}" title="${e.w} · ${e.t} · ${e.d} m"></u>`).join('')}</div>
<div class="kv">Numbers show events per 20 m. Markers are coloured by event type.</div>
<table><tr><th>Event type</th><th>Events</th><th>Wells</th><th>Historical mitigation</th><th>Outcomes</th></tr>${TAX.map(t=>{const v=s.v.filter(e=>e.t==t),c=x=>{const m={};v.forEach(e=>m[e[x]]=(m[e[x]]||0)+1);return Object.entries(m).map(a=>a[0]+' ×'+a[1]).join(', ')||'—'};return`<tr><td><span style="color:${TC[t]}">■</span> ${t}<div class="bar"><i style="width:${v.length/mx*100}%;background:${TC[t]}"></i></div></td><td>${v.length}</td><td>${new Set(v.map(e=>e.w)).size}</td><td>${c('m')}</td><td>${c('o')}</td></tr>`}).join('')}</table>
<div class="note">Synthetic demonstration data. Historical mitigation approaches observed in comparable wells, not recommendations.</div>
<button class="btn on" onclick="gf.f='${f}';gsel.clear();gtitle='';stage(1)">Open these wells in the knowledge graph</button><button class="btn" onclick="stage(2)">See analogues</button>`}
// document review
const DF=[['Well','OIL-F19',98],['Depth','2,845 m',97],['Formation',X,93],['Event','Casing Issue',95],['Severity','Moderate',84],['Parameter','Test pressure 3,200 psi',90],['Mitigation','Remedial squeeze',88],['Outcome','Resolved',86],['Date','2020-03-14',96]];
let ds=0,dt,added=false;
function dr(){const m=t=>`<mark>${t}</mark>`,PL=['Raw document','OCR','NLP extraction','Structured event','Knowledge graph'];
$('dvw').innerHTML=`<div class="pl">${PL.map((x,i)=>`<span class="${i<=ds?'on':''}">${x}</span>`).join('')}</div><button class="btn on" onclick="drun()">Run pipeline</button><div class="g t2" style="margin-top:8px"><div class="paper ${ds>=1?'ocr':''} ${ds>=2?'nlp':''}"><b>WELL COMPLETION REPORT</b>
Well: ${m('OIL-F19')}    Date: ${m('14 Mar 2020')}

9-5/8 in casing shoe set at ${m('2845 m')} in ${m('XYZ Sandstone')}. ${m('Casing pressure test failed at 3,200 psi')}, ${m('moderate')} leak. ${m('Remedial squeeze cementing')} carried out. Retest ${m('passed')}.

Source: WCR_OIL_F19, p.52 (synthetic document)</div>
<div>${ds<2?'<div class="kv">Run the pipeline to extract entities.</div>':`<div class="kv" style="margin-bottom:8px">Review and correct. Fields under 90% are flagged.</div>${DF.map((f,i)=>`<div class="fr"><span class="kv">${f[0]}</span>${f[0]=='Event'?`<select id="df${i}">${TAX.map(t=>`<option ${t==f[1]?'selected':''}>${t}</option>`).join('')}</select>`:`<input id="df${i}" value="${f[1]}">`}<span style="color:${f[2]<90?'var(--yl)':'var(--gn)'}">${f[2]}%</span></div>`).join('')}<button class="btn on" ${ds<3||added?'disabled':''} onclick="addkg()">Add to Knowledge Graph</button>${added?`<div class="note">Added after engineer review (demo). The graph now holds ${EV.length} events. <button class="btn" onclick="gf={w:'',f:document.getElementById('df2').value,t:'',m:'',o:'',d:''};gsel=new Set([${EV.length-1}]);gtitle='New event from reviewed document';stage(1)">Open in knowledge graph</button></div>`:''}`}</div></div>`}
function drun(){clearInterval(dt);ds=0;dr();dt=setInterval(()=>{ds++;dr();if(ds>=3)clearInterval(dt)},900)}
function addkg(){const v=i=>$('df'+i).value;EV.push({w:v(0),d:parseInt(v(1).replace(/\D/g,''))||0,f:v(2),t:v(3),sv:v(4),m:v(6),o:v(7),s:'WCR_OIL_F19',p:52});added=true;ds=4;dr();fi(CUR);rtab()}
// wire into the flow
P.splice(1,0,gp);
P[2]=()=>{fm=typeof fm=='undefined'?true:fm;const l=W.filter(w=>w.d>0&&(!fm||w.f==CUR)).sort((a,b)=>b.sim-a.sim).slice(0,fm?4:6);return`<p>The current formation, ${CUR}, comes from formation intelligence and the graph, and decides which wells are candidates. Then depth, trajectory, mud weight and event history rank them.</p><button class="btn ${fm?'on':''}" onclick="fm=!fm;stage(2)">Match current formation: ${fm?'on':'off'}</button>`+l.map(w=>`<div style="margin:10px 0"><b>${w.id}</b> · ${w.d} km · ${w.f} · <b style="color:var(--am)">${w.sim}%</b><div class="bar"><i style="width:${w.sim}%"></i></div><span class="kv">Formation ${w.f==CUR?'matches':'differs'} · ${EV.filter(e=>e.w==w.id).length} graph-linked events${w.dep?', main event at '+w.dep.toLocaleString()+' m':''}</span></div>`).join('')};
var fm=true;
const p0=P[0];P[0]=()=>p0()+`<div class="note">Formation intelligence: ${fstat(CUR).v.length} events in ${CUR} across ${fstat(CUR).wells} wells (demo repository). High historical density ${fstat(CUR).h}.</div>`;
const p3=P[3];P[3]=()=>p3()+`<div class="kv">Current telemetry against analogues (synthetic)</div><table><tr><th></th><th>OIL-X17</th>${A.slice(0,3).map(w=>`<th>${w.id}</th>`).join('')}</tr>${[['Torque kNm','t',14.2],['ROP m/hr','r',22],['Mud weight SG','mw',1.18]].map(r=>`<tr><td class="kv">${r[0]}</td><td>${r[2]}</td>${A.slice(0,3).map(w=>`<td>${w[r[1]]}</td>`).join('')}</tr>`).join('')}</table><div class="kv">In each analogue torque rose and ROP fell before the event.</div>`;
const p5=P[5];P[5]=()=>p5()+`<div class="note">Model-derived risk from ${fstat(CUR).v.length} graph-linked events in ${CUR}. Simulated. Requires engineer review.</div>`;
const p6=P[6];P[6]=()=>{const m={};EV.filter(e=>e.f==CUR&&['Mud Loss','Lost Circulation','Stuck Pipe'].includes(e.t)).forEach(e=>{m[e.m]=m[e.m]||[0,0];m[e.m][0]++;if(e.o=='Recovery')m[e.m][1]++});
return p6()+`<div class="kv" style="margin-top:10px">Historical outcomes, mud loss, lost circulation and stuck pipe in ${CUR}</div><table><tr><th>Response observed</th><th>Cases</th><th>Recovery</th></tr>${Object.entries(m).map(a=>`<tr><td>${a[0]}</td><td>${a[1][0]}</td><td>${a[1][1]}</td></tr>`).join('')}</table><button class="btn" onclick="go(9)">Open source in Document Review</button><button class="btn" onclick="gf.f=CUR;gsel.clear();gtitle='';stage(1)">Trace in knowledge graph</button><button class="btn" onclick="stage(0)">Return to start of Foresight Flow</button>`};
function rtab(){const m={};EV.filter(e=>e.f==CUR&&['Mud Loss','Lost Circulation','Stuck Pipe'].includes(e.t)).forEach(e=>{m[e.m]=m[e.m]||[0,0];m[e.m][0]++;if(e.o=='Recovery')m[e.m][1]++});$('rtab').innerHTML=`<table><tr><th>Response observed</th><th>Cases</th><th>Recovery</th></tr>${Object.entries(m).map(a=>`<tr><td>${a[0]}</td><td>${a[1][0]}</td><td>${a[1][1]}</td></tr>`).join('')}</table><div class="kv">Counts come from the event repository (${CUR}).</div>`}
cmp('OIL-B12');fi();dr();rtab();
go(7);stage(0);
