/* First-person home. Fixed room geometry with a depth-tested renderer. */
(function(root){
  'use strict';
  const CATALOG=[
    {id:'sofa',name:'Sage sofa',price:850,w:2.3,d:.95,color:'#788775'},
    {id:'chair',name:'Amber armchair',price:320,w:.9,d:.85,color:'#bc874e'},
    {id:'coffee',name:'Walnut coffee table',price:180,w:1.15,d:.65,color:'#77533c'},
    {id:'tv',name:'TV & media console',price:650,w:1.6,d:.45,color:'#77533c',use:'news'},
    {id:'bed',name:'Linen bed',price:900,w:1.7,d:2.2,color:'#ddd3b9',use:'rest'},
    {id:'desk',name:'Writing desk',price:380,w:1.4,d:.7,color:'#866044',use:'campaign'},
    {id:'shelf',name:'Bookcase',price:240,w:1.15,d:.35,color:'#8c6749'},
    {id:'plant',name:'Potted palm',price:65,w:.55,d:.55,color:'#567858'},
    {id:'lamp',name:'Floor lamp',price:110,w:.45,d:.45,color:'#e9c68d'},
    {id:'rug',name:'Woven rug',price:140,w:2.5,d:1.8,color:'#b87857',flat:true},
    {id:'table',name:'Dining table',price:360,w:1.35,d:.85,color:'#886146'},
    {id:'art',name:'Memphis art easel',price:95,w:.65,d:.4,color:'#c9915d'}
  ];
  const ITEMS=Object.fromEntries(CATALOG.map(x=>[x.id,x]));
  const WALLS=[{name:'Warm ivory',color:'#e5ddc9'},{name:'Soft sage',color:'#bdc8b5'},{name:'Dusty blue',color:'#b5c5cb'},{name:'Clay',color:'#d5b8a4'}];
  const FLOORS=[{name:'Honey oak',color:'#b99165'},{name:'Walnut',color:'#816047'},{name:'Pale oak',color:'#c9b99a'}];
  const STRUCTURE=[{x:0,z:5,w:.18,d:10},{x:12,z:5,w:.18,d:10},{x:6,z:0,w:12,d:.18},{x:6,z:10,w:12,d:.18},{x:7,z:1.9,w:.16,d:3.8},{x:7,z:7.8,w:.16,d:4.4},{x:1.1,z:6,w:2.2,d:.16},{x:5.8,z:6,w:2.4,d:.16}];
  const FIXTURES=[{x:3.2,z:9.5,w:5.5,d:.85},{x:.65,z:8.65,w:.85,d:.85}];
  const DOORWAYS=[{x:7,z:4.7,w:.85,d:1.8},{x:3.4,z:6,w:2.4,d:.85},{x:3.5,z:.6,w:1.6,d:1.2}];
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const money=n=>'$'+Math.round(n).toLocaleString('en-US');
  function rect(item){const b=ITEMS[item.type],swap=Math.abs(Math.round(item.r||0))%2;return {x:item.x,z:item.z,w:swap?b.d:b.w,d:swap?b.w:b.d};}
  function overlaps(a,b,pad=0){return Math.abs(a.x-b.x)<(a.w+b.w)/2+pad&&Math.abs(a.z-b.z)<(a.d+b.d)/2+pad;}
  function initial(){return {version:1,wall:0,floor:0,next:12,items:[
    {uid:1,type:'sofa',x:1.15,z:3,r:1},{uid:2,type:'tv',x:5.95,z:3,r:3},{uid:3,type:'coffee',x:3.4,z:3,r:0},
    {uid:4,type:'rug',x:3.4,z:3,r:0},{uid:5,type:'plant',x:.6,z:5.2,r:0},{uid:6,type:'lamp',x:1.2,z:1.3,r:0},
    {uid:7,type:'bed',x:10,z:7.8,r:0},{uid:8,type:'desk',x:10,z:1.1,r:2},{uid:9,type:'shelf',x:11.65,z:4,r:3},
    {uid:10,type:'table',x:3.5,z:7.8,r:0},{uid:11,type:'art',x:8.2,z:8.8,r:0}
  ]};}
  function ensure(s){
    if(!s.interior||s.interior.version!==1)s.interior=initial();
    const h=s.interior;h.wall=clamp(Math.floor(h.wall)||0,0,WALLS.length-1);h.floor=clamp(Math.floor(h.floor)||0,0,FLOORS.length-1);
    h.items=(Array.isArray(h.items)?h.items:[]).filter(i=>ITEMS[i.type]&&Number.isFinite(i.x)&&Number.isFinite(i.z)&&Number.isInteger(i.uid)).slice(0,64);
    h.items.forEach(i=>{i.r=((Math.round(i.r)||0)%4+4)%4;i.x=clamp(i.x,.2,11.8);i.z=clamp(i.z,.2,9.8)});
    h.next=Math.max(1,...h.items.map(i=>i.uid+1),Number.isInteger(h.next)?h.next:1);return h;
  }
  function canPlace(h,item,player){
    if(!ITEMS[item.type]||![item.x,item.z,item.r].every(Number.isFinite))return false;
    const a=rect(item);if(a.x-a.w/2<.18||a.x+a.w/2>11.82||a.z-a.d/2<.18||a.z+a.d/2>9.82)return false;
    if([...STRUCTURE,...FIXTURES].some(b=>overlaps(a,b,.04)))return false;
    if(ITEMS[item.type].flat)return true;
    if(DOORWAYS.some(b=>overlaps(a,b,.08)))return false;
    if(player&&overlaps(a,{x:player.x,z:player.z,w:.5,d:.5},.06))return false;
    return !h.items.some(b=>!b.stored&&b.uid!==item.uid&&!ITEMS[b.type].flat&&overlaps(a,rect(b),.08));
  }
  function transact(s,item,player){
    const h=ensure(s),old=h.items.find(x=>x.uid===item.uid),def=ITEMS[item.type];
    if(!def||!canPlace(h,item,player))return {ok:false,message:'Choose a clear spot. Keep doorways open.'};
    if(old&&old.type!==item.type)return {ok:false,message:'That item changed. Choose it again.'};
    if(!old&&h.items.length>=64)return {ok:false,message:'Your home has room for 64 items.'};
    if(!old&&(!Number.isFinite(s.purse?.cash)||s.purse.cash<def.price))return {ok:false,message:'Not enough personal money.'};
    const placed={uid:old?old.uid:h.next++,type:item.type,x:item.x,z:item.z,r:item.r,stored:false};
    if(old)Object.assign(old,placed);else{s.purse.cash-=def.price;s.purse.mf=s.purse.mf||{};s.purse.mf.buy=(s.purse.mf.buy||0)+def.price;h.items.push(placed);}
    return {ok:true,cost:old?0:def.price,item:placed};
  }
  function walkable(h,x,z){
    const a={x,z,w:.46,d:.46};if(x<.35||x>11.65||z<.35||z>9.65)return false;
    return ![...STRUCTURE,...FIXTURES,...h.items.filter(i=>!i.stored&&!ITEMS[i.type].flat).map(rect)].some(b=>overlaps(a,b,.02));
  }
  function move(h,p,dx,dz){ // Small steps prevent passing through walls on a slow frame.
    const n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.08));
    for(let i=0;i<n;i++){if(walkable(h,p.x+dx/n,p.z))p.x+=dx/n;if(walkable(h,p.x,p.z+dz/n))p.z+=dz/n;}return p;
  }
  function shade(c,f){const n=parseInt(c.slice(1),16);return `rgb(${[n>>16,(n>>8)&255,n&255].map(x=>Math.round(clamp(x*f,0,255))).join(',')})`;}
  function geometry(h,itemsOnly=false){
    const faces=[];
    function poly(points,c){faces.push({points,c});}
    function box(x,y,z,w,ht,d,c,r=0){
      const co=Math.cos(r),si=Math.sin(r),p=[];
      for(const [dx,dy,dz] of [[-1,0,-1],[1,0,-1],[1,0,1],[-1,0,1],[-1,1,-1],[1,1,-1],[1,1,1],[-1,1,1]])p.push([x+dx*w/2*co+dz*d/2*si,y+dy*ht,z-dx*w/2*si+dz*d/2*co]);
      [[0,1,2,3,.6],[0,4,5,1,.82],[1,5,6,2,.9],[2,6,7,3,.96],[3,7,4,0,.87],[4,7,6,5,1.07]].forEach(a=>poly(a.slice(0,4).map(i=>p[i]),shade(c,a[4])));
    }
    if(!itemsOnly){
    const wall=WALLS[h.wall].color,floor=FLOORS[h.floor].color;
    // Continuous surfaces close the room; decorative boards sit above the base.
    poly([[0,-.015,0],[12,-.015,0],[12,-.015,10],[0,-.015,10]],'#8e7458');
    poly([[0,2.8,0],[0,2.8,10],[12,2.8,10],[12,2.8,0]],'#e8e2d4');
    for(let x=0;x<12;x+=.6)for(let z=0;z<10;z+=1){const kitchen=x<7&&z>=6;poly([[x,0,z],[x+.59,0,z],[x+.59,0,z+.99],[x,0,z+.99]],shade(kitchen?'#c1bdac':floor,1+(((Math.round(x*10)+z*3)%7)-3)*.015));}
    for(const b of STRUCTURE){const along=b.w>b.d,length=along?b.w:b.d,n=Math.ceil(length/.7);for(let i=0;i<n;i++){
      const x=along?b.x-b.w/2+(i+.5)*length/n:b.x,z=along?b.z:b.z-b.d/2+(i+.5)*length/n;
      box(x,0,z,along?length/n:b.w,2.8,along?b.d:length/n,wall);box(x,0,z,along?length/n:b.w+.035,.15,along?b.d+.035:length/n,'#f0e8d5');
    }}
    // Lintels leave real walkable door openings.
    box(7,2.28,4.7,.2,.52,1.8,wall);box(3.4,2.28,6,2.4,.52,.2,wall);
    box(3.5,0,.11,1.35,2.25,.07,'#8d674c');box(3,1,.17,.07,.07,.06,'#d9b16b');
    // Window frames and a stylized Memphis skyline outside.
    for(const [x,z,rot] of [[.12,3.3,Math.PI/2],[11.88,7.8,Math.PI/2]]){
      box(x,.85,z,2.5,1.45,.06,'#f3ebdb',rot);box(x+(x<6?.04:-.04),.94,z,2.27,1.25,.035,'#90afb3',rot);
      for(let j=0;j<7;j++)box(x+(x<6?.07:-.07),.95,z-1+j*.33,.25,.22+(j%3)*.1,.02,'#678f98',rot);
      box(x+(x<6?.09:-.09),.89,z,.055,1.4,.045,'#f3ebdb',rot);box(x+(x<6?.09:-.09),1.55,z,2.35,.06,.045,'#f3ebdb',rot);
    }
    // Kitchen cabinets, countertop, sink and range.
    for(let k=0;k<6;k++){const x=.9+k*.88;box(x,0,9.5,.85,.88,.85,'#82948a');box(x,.9,9.5,.89,.08,.9,'#e7e0cb');box(x,.43,9.055,.65,.035,.035,'#d5b36f');box(x,1.65,9.72,.85,.72,.42,'#d6cdb8');}
    box(.65,0,8.65,.85,1.95,.85,'#c9d0cb');box(.65,1.25,8.2,.7,.025,.025,'#788881');
    box(2.65,.99,9.5,.65,.015,.5,'#80999b');box(2.65,1,9.74,.05,.25,.05,'#afbec0');box(2.65,1.22,9.65,.05,.04,.2,'#afbec0');
    box(4.4,.99,9.5,.7,.025,.65,'#414c4c');for(const x of [4.2,4.6])for(const z of [9.32,9.68])box(x,1.02,z,.2,.01,.2,'#8b9894');
    }
    h.items.filter(i=>!i.stored).forEach(item=>furniture(item,box));
    return faces;
  }
  function furniture(i,box,tint){
    const b=ITEMS[i.type],r=i.r*Math.PI/2,co=Math.cos(r),si=Math.sin(r),c=tint||b.color;
    const part=(x,y,z,w,h,d,color)=>box(i.x+x*co+z*si,y,i.z-x*si+z*co,w,h,d,tint||color,r);
    const legs=(w,d,y)=>{for(const x of [-w/2+.08,w/2-.08])for(const z of [-d/2+.08,d/2-.08])part(x,0,z,.075,y,.075,'#514334');};
    if(i.type==='sofa'||i.type==='chair'){
      legs(b.w,b.d,.2);part(0,.16,0,b.w,.32,b.d,c);part(0,.48,b.d/2-.12,b.w,.48,.23,c);
      for(const x of [-b.w/2+.12,b.w/2-.12])part(x,.4,0,.24,.4,b.d,c);
      const n=i.type==='sofa'?3:1;for(let k=0;k<n;k++)part((k-(n-1)/2)*(b.w-.5)/n,.48,-.08,(b.w-.5)/n-.025,.13,b.d-.3,'#9ca58a');
      if(n>1){part(-.67,.65,.08,.35,.32,.17,'#d4b878');part(.67,.65,.08,.35,.32,.17,'#d4b878');}
    }else if(i.type==='bed'){
      legs(b.w,b.d,.2);part(0,.15,0,b.w,.3,b.d,'#8c684e');part(0,.43,0,b.w-.04,.2,b.d-.04,'#efe8d8');
      part(0,.64,-.3,b.w-.03,.045,1.45,'#718f8d');part(0,.15,1.04,b.w,1.05,.13,'#99795a');
      for(const x of [-.43,.43])part(x,.65,.68,.64,.12,.4,'#f6efdf');
    }else if(['coffee','desk','table'].includes(i.type)){
      const h=i.type==='coffee'?.4:.76;legs(b.w,b.d,h);part(0,h,0,b.w,.075,b.d,c);
      if(i.type==='desk'){part(.3,.84,.12,.42,.28,.05,'#344e52');part(.3,.83,0,.42,.025,.24,'#45585a');part(-.4,.84,-.05,.25,.035,.3,'#e8d6a8');}
      if(i.type==='coffee'){part(.25,.48,.05,.28,.035,.2,'#c9ac77');part(-.25,.48,0,.13,.13,.13,'#e4dac3');}
    }else if(i.type==='tv'){
      legs(b.w,b.d,.12);part(0,.1,0,b.w,.4,b.d,c);part(0,.5,.05,.6,.035,.25,'#354447');part(0,.54,.05,.08,.14,.07,'#354447');part(0,.67,.08,1.38,.78,.08,'#263b41');
      part(0,.72,.03,1.26,.66,.015,'#73979e');part(0,.75,.015,1.2,.12,.012,'#d6b77e');part(-.26,1,.01,.55,.2,.012,'#b4c6bd');
    }else if(i.type==='shelf'){
      part(-.54,0,0,.07,1.95,.35,c);part(.54,0,0,.07,1.95,.35,c);part(0,0,.15,1.08,1.95,.04,c);
      for(let k=0;k<5;k++){part(0,k*.47,0,1.15,.06,.35,c);if(k<4)for(let j=0;j<6;j++)part(-.43+j*.15,k*.47+.06,.02,.1,.26+(j%3)*.05,.23,['#728a81','#b77654','#c8b178'][j%3]);}
    }else if(i.type==='plant'){
      part(0,0,0,.37,.4,.37,'#c78f69');part(0,.4,0,.06,.75,.06,'#6c7352');
      for(let k=0;k<5;k++){const a=k*1.25;part(Math.sin(a)*.18,.65+(k%3)*.18,Math.cos(a)*.18,.25,.35,.2,k%2?'#658b61':'#416d50');}
    }else if(i.type==='lamp'){
      part(0,0,0,.4,.045,.4,'#786349');part(0,.04,0,.045,1.45,.045,'#a68958');part(0,1.4,0,.44,.38,.44,'#f3d7a1');
    }else if(i.type==='rug'){
      part(0,.009,0,b.w,.009,b.d,c);part(0,.02,0,b.w-.15,.006,b.d-.15,'#d5b891');part(0,.03,0,b.w-.3,.006,b.d-.3,c);
      for(let k=-2;k<=2;k++)part(k*.38,.04,0,.045,.003,b.d-.4,'#ddc9a6');
    }else if(i.type==='art'){
      legs(.5,.35,1);part(0,.65,.08,.65,.85,.07,c);part(0,.71,.035,.55,.72,.018,'#dfc593');
      for(let k=0;k<4;k++)part(-.19+k*.13,.74,.02,.09,.2+k%3*.13,.015,'#557c7b');part(.13,1.21,.015,.13,.13,.01,'#c17848');
    }
  }
  function clipNear(points){const out=[];for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length],ina=a[2]>=.08,inb=b[2]>=.08;if(ina)out.push(a);if(ina!==inb){const t=(.08-a[2])/(b[2]-a[2]);out.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,.08]);}}return out;}
  const api={CATALOG,WALLS,FLOORS,initial,ensure,canPlace,transact,walkable,move,geometry,clipNear};
  if(typeof module!=='undefined'&&module.exports){module.exports=api;return;}
  let host,canvas,renderer,adapter,s,h,p,scene=[],active=false,raf,last=0,dirty=true,keys=new Set(),stick={x:0,y:0},look=null,selection=null,tab='shop',noticeTimer,previousFocus;
  const $=id=>host.querySelector('#'+id);
  function say(message){$('hi-status').textContent=message;clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>{$('hi-status').textContent=''},5000);}
  function persist(){adapter.save();dirty=true;scene=geometry(h);renderer.setScene(scene);$('hi-cash').textContent=money(s.purse.cash)+' personal';if(s._saveFail)say('Could not save: browser storage is full. Free space before leaving.');}
  function room(){return p.x>7?'Bedroom':p.z>6?'Kitchen':'Living room';}
  function resize(){const r=canvas.getBoundingClientRect(),scale=Math.min(root.devicePixelRatio||1,1.5,Math.sqrt(renderer.maxPixels/Math.max(1,r.width*r.height)));canvas.width=Math.max(1,Math.round(r.width*scale));canvas.height=Math.max(1,Math.round(r.height*scale));dirty=true;}
  function target(){const dist=clamp(1.62/Math.tan(Math.max(.38,p.pitch)),1.25,3.4);return {x:Math.round((p.x+Math.sin(p.yaw)*dist)*4)/4,z:Math.round((p.z+Math.cos(p.yaw)*dist)*4)/4};}
  function draft(){return selection?{...selection,...target()}:null;}
  function draw(){
    const proposed=draft(),valid=proposed&&canPlace(h,proposed,p);
    // Preview geometry also tests depth, so it cannot shine through a wall.
    const ghost=proposed?geometry({...h,items:[{...proposed,uid:-1}]},true).map(face=>({...face,c:valid?'#86bda1':'#cf8274'})):[];
    renderer.setPreview(ghost);renderer.render(p);
    $('hi-room').textContent=room();
    if(proposed){$('hi-place').disabled=!valid||(!selection.uid&&s.purse.cash<ITEMS[selection.type].price);$('hi-placement-note').textContent=valid?'Clear spot · ready to place':'Blocked · move or turn toward open floor';}
    const near=h.items.filter(i=>!i.stored&&ITEMS[i.type].use&&Math.hypot(i.x-p.x,i.z-p.z)<2.5).sort((a,b)=>Math.hypot(a.x-p.x,a.z-p.z)-Math.hypot(b.x-p.x,b.z-p.z))[0];
    const use=$('hi-use');use.hidden=!!selection||!near;if(near){use.dataset.uid=near.uid;use.textContent={news:'Watch the news',rest:'Rest on bed',campaign:'Review campaign'}[ITEMS[near.type].use];}
  }
  function frame(now){if(!active)return;const dt=Math.min(.04,(now-last)/1000||0);last=now;
    if(!document.hidden){let forward=(keys.has('w')||keys.has('arrowup')?1:0)-(keys.has('s')||keys.has('arrowdown')?1:0)-stick.y;
      let side=(keys.has('d')?1:0)-(keys.has('a')?1:0)+stick.x,turn=(keys.has('arrowright')||keys.has('e')?1:0)-(keys.has('arrowleft')||keys.has('q')?1:0);
      if(forward||side||turn){const len=Math.max(1,Math.hypot(forward,side));forward/=len;side/=len;p.yaw+=turn*dt*1.6;move(h,p,(Math.sin(p.yaw)*forward+Math.cos(p.yaw)*side)*dt*2,(Math.cos(p.yaw)*forward-Math.sin(p.yaw)*side)*dt*2);dirty=true;}
      if(dirty){draw();dirty=false;}
    }
    raf=requestAnimationFrame(frame);
  }
  function panel(){
    const body=$('hi-panel-body');$('hi-panel').hidden=false;keys.clear();stick={x:0,y:0};
    $('hi-tabs').innerHTML=[['shop','Furniture'],['owned','Your items'],['style','Room style']].map(([id,label])=>`<button data-hi-tab="${id}" aria-pressed="${tab===id}">${label}</button>`).join('');
    if(tab==='shop')body.innerHTML='<p>Preview first. Pay only when you place it. Prices are in-game.</p><div class="hi-catalog">'+CATALOG.map(b=>`<button data-hi-buy="${b.id}"><span class="hi-swatch" style="background:${b.color}"></span><b>${b.name}</b><small>${money(b.price)} · Preview</small></button>`).join('')+'</div>';
    else if(tab==='owned')body.innerHTML='<p>Move or store furniture for free. Stored items remain yours.</p>'+h.items.map(i=>`<div class="hi-owned"><span><b>${ITEMS[i.type].name}</b><small>${i.stored?'In storage':'In your home'}</small></span><button data-hi-move="${i.uid}">${i.stored?'Place':'Move'}</button>${i.stored?'':`<button data-hi-store="${i.uid}">Store</button>`}</div>`).join('');
    else body.innerHTML='<p>Choose your wall and floor finish. Color changes are free.</p><h3>Walls</h3><div class="hi-finishes">'+WALLS.map((v,i)=>`<button data-hi-wall="${i}" aria-pressed="${h.wall===i}" style="--sample:${v.color}">${v.name}</button>`).join('')+'</div><h3>Floors</h3><div class="hi-finishes">'+FLOORS.map((v,i)=>`<button data-hi-floor="${i}" aria-pressed="${h.floor===i}" style="--sample:${v.color}">${v.name}</button>`).join('')+'</div>';
  }
  function select(type,uid){selection={type,uid:uid||null,r:uid?(h.items.find(i=>i.uid===uid)?.r||0):0};$('hi-panel').hidden=true;$('hi-placement').hidden=false;$('hi-place').textContent=uid?'Place item':'Buy & place · '+money(ITEMS[type].price);$('hi-selected').textContent=ITEMS[type].name;$('hi-furnish').hidden=true;dirty=true;say('Face open floor. Move closer or farther, then place.');}
  function cancel(){selection=null;$('hi-placement').hidden=true;$('hi-furnish').hidden=false;dirty=true;}
  function resetControls(){keys.clear();stick={x:0,y:0};look=null;if(host)$('hi-stick-knob').style.transform='translate(0,0)';}
  function exit(next){if(!active)return;active=false;cancelAnimationFrame(raf);clearTimeout(noticeTimer);resetControls();renderer.destroy();host.remove();root.removeEventListener('resize',resize);root.removeEventListener('blur',resetControls);document.removeEventListener('visibilitychange',resetControls);document.body.classList.remove('inside-home');adapter.close(next);previousFocus?.focus?.();}
  function open(options){
    if(active)return;adapter=options;s=options.state();if(!s?.started||!s.home)return;h=ensure(s);p={x:3.5,z:1.05,yaw:0,pitch:.08};previousFocus=document.activeElement;active=true;
    host=document.createElement('section');host.id='home-interior';host.setAttribute('role','dialog');host.setAttribute('aria-modal','true');host.setAttribute('aria-label','Inside your home');
    host.innerHTML=`<canvas id="hi-view" aria-label="First-person view of your furnished home. Use the walking controls or WASD to move and drag the view to look around."></canvas>
      <header class="hi-header"><div><small>YOUR HOME · CITY PAUSED</small><h2 id="hi-room">Living room</h2><span id="hi-cash"></span></div><button id="hi-exit">Leave home</button></header>
      <div class="hi-crosshair" aria-hidden="true">+</div><p id="hi-status" role="status" aria-live="polite"></p>
      <div class="hi-actions"><button id="hi-use" hidden></button><button id="hi-furnish">Furnish & decorate</button></div>
      <div id="hi-placement" hidden><strong id="hi-selected"></strong><small id="hi-placement-note"></small><div><button id="hi-rotate">Rotate ↻</button><button id="hi-place">Place</button><button id="hi-cancel">Cancel</button></div></div>
      <div class="hi-controls"><div id="hi-stick" aria-label="Drag to walk"><span id="hi-stick-knob"></span><b>WALK</b></div><div class="hi-step-controls"><button data-hi-step="forward" aria-label="Walk forward">↑</button><button data-hi-step="back" aria-label="Walk backward">↓</button><button data-hi-step="left" aria-label="Turn left">↶</button><button data-hi-step="right" aria-label="Turn right">↷</button></div><span class="hi-look-help">Drag the room to look<br><span>WASD · arrows turn</span></span></div>
      <aside id="hi-panel" hidden aria-label="Furnish your home"><div class="hi-panel-title"><h2>Make yourself at home</h2><button id="hi-panel-close" aria-label="Close furniture shop">×</button></div><nav id="hi-tabs" aria-label="Furniture categories"></nav><div id="hi-panel-body"></div></aside>`;
    document.body.appendChild(host);document.body.classList.add('inside-home');canvas=$('hi-view');renderer=root.BCHomeRenderer.create(canvas);canvas=renderer.canvas||canvas;scene=geometry(h);renderer.setScene(scene);resize();$('hi-cash').textContent=money(s.purse.cash)+' personal';$('hi-exit').focus();
    host.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
      if(b.id==='hi-exit'){exit();return;}if(b.id==='hi-furnish'){panel();return;}if(b.id==='hi-panel-close'){$('hi-panel').hidden=true;$('hi-furnish').focus();return;}
      if(d.hiTab){tab=d.hiTab;panel();return;}if(d.hiBuy){select(d.hiBuy);return;}if(d.hiMove){const i=h.items.find(x=>x.uid===+d.hiMove);if(i)select(i.type,i.uid);return;}
      if(d.hiStore){const i=h.items.find(x=>x.uid===+d.hiStore);if(i)i.stored=true;persist();panel();say('Stored. You can place it again for free.');return;}
      if(d.hiWall!==undefined||d.hiFloor!==undefined){if(d.hiWall!==undefined)h.wall=+d.hiWall;else h.floor=+d.hiFloor;persist();panel();return;}
      if(b.id==='hi-rotate'){selection.r=(selection.r+1)%4;dirty=true;}if(b.id==='hi-cancel')cancel();
      if(b.id==='hi-place'&&selection){const result=transact(s,draft(),p);if(result.ok){h=s.interior;cancel();persist();say(result.cost?'Placed · '+money(result.cost)+' from personal money.':'Furniture moved.');}else say(result.message);}
      if(d.hiStep){if(d.hiStep==='left')p.yaw-=Math.PI/8;else if(d.hiStep==='right')p.yaw+=Math.PI/8;else{const n=d.hiStep==='forward'?.45:-.45;move(h,p,Math.sin(p.yaw)*n,Math.cos(p.yaw)*n);}dirty=true;}
      if(b.id==='hi-use'){const item=h.items.find(i=>i.uid===+b.dataset.uid);if(item){const use=ITEMS[item.type].use;if(use==='rest')say('A quiet moment at home. City time stays paused while you rest.');else exit(use);}}
    });
    canvas.addEventListener('webglcontextlost',()=>say('Graphics paused. Leave and re-enter your home to restore the view.'));
    canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;canvas.setPointerCapture(e.pointerId);look={id:e.pointerId,x:e.clientX,y:e.clientY};});
    canvas.addEventListener('pointermove',e=>{if(!look||e.pointerId!==look.id)return;p.yaw+=(e.clientX-look.x)*.005;p.pitch=clamp(p.pitch+(e.clientY-look.y)*.004,-.65,.85);look.x=e.clientX;look.y=e.clientY;dirty=true;});
    for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>{look=null});
    const pad=$('hi-stick');let padId=null;
    const padMove=e=>{if(e.pointerId!==padId)return;const r=pad.getBoundingClientRect(),dx=(e.clientX-r.left-r.width/2)/35,dy=(e.clientY-r.top-r.height/2)/35,len=Math.max(1,Math.hypot(dx,dy));stick={x:dx/len,y:dy/len};$('hi-stick-knob').style.transform=`translate(${stick.x*25}px,${stick.y*25}px)`;};
    pad.addEventListener('pointerdown',e=>{padId=e.pointerId;pad.setPointerCapture(padId);padMove(e)});pad.addEventListener('pointermove',padMove);
    for(const event of ['pointerup','pointercancel','lostpointercapture'])pad.addEventListener(event,()=>{padId=null;stick={x:0,y:0};$('hi-stick-knob').style.transform='translate(0,0)';});
    root.addEventListener('resize',resize);root.addEventListener('blur',resetControls);document.addEventListener('visibilitychange',resetControls);last=performance.now();dirty=true;raf=requestAnimationFrame(frame);adapter.save();
  }
  root.addEventListener('keydown',e=>{if(!active)return;if(e.key==='Tab'){const buttons=[...host.querySelectorAll('button')].filter(b=>!b.disabled&&b.getClientRects().length);if(e.shiftKey&&document.activeElement===buttons[0]){e.preventDefault();buttons.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===buttons.at(-1)){e.preventDefault();buttons[0].focus();}e.stopImmediatePropagation();return;}
    e.stopImmediatePropagation();if(['Enter',' '].includes(e.key)&&e.target.tagName==='BUTTON')return;e.preventDefault();
    if(e.key==='Escape'){if(selection)cancel();else if(!$('hi-panel').hidden)$('hi-panel').hidden=true;else exit();return;}
    if($('hi-panel').hidden)keys.add(e.key.toLowerCase());
  },true);
  root.addEventListener('keyup',e=>{if(active){keys.delete(e.key.toLowerCase());e.stopImmediatePropagation();}},true);
  root.addEventListener('pagehide',()=>{if(active)adapter.save();});
  Object.assign(api,{open,close:exit});Object.defineProperty(api,'isOpen',{get:()=>active});root.BCInterior=api;
})(typeof window!=='undefined'?window:globalThis);
