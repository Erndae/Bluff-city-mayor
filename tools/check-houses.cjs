const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const H=require('../city-houses.js');
const area=r=>Math.abs(r.reduce((s,a,i)=>{const b=r[(i+1)%r.length];return s+a[0]*b[1]-a[1]*b[0]},0))/2;
for(const shape of [ [[0,0],[12,0],[12,9],[0,9]], [[0,0],[14,0],[14,6],[7,6],[7,12],[0,12]], [[0,0],[20,0],[20,15],[14,15],[14,6],[6,6],[6,15],[0,15]] ]){
 for(const r of [shape,[...shape].reverse(),[...shape,shape[0]]]){
  const clean=H.clean(r),t=H.triangulate(clean);assert(Math.abs(t.reduce((n,t)=>n+area(t),0)-area(shape))<.01,'Roof triangulation must cover the real outline');
  const m=H.mesh(r,13,false);assert(m.length>0&&m.length%18===0);assert(m.every(Number.isFinite));
  const h=H.style(13).height;let roofArea=0,peak=0;
  for(let i=0;i<m.length;i+=18){const p=[[m[i],m[i+1],m[i+2]],[m[i+6],m[i+7],m[i+8]],[m[i+12],m[i+13],m[i+14]]];peak=Math.max(peak,...p.map(p=>p[2]));if(p.every(p=>p[2]>=h+.079))roofArea+=area(p);}
  assert(Math.abs(roofArea-area(shape))<.01,'Sloped roof must cover outline without holes or doubled faces');assert(peak>h+1,'Roof must rise above walls');
 }
}
assert.equal(new Set(Array.from({length:500},(_,i)=>H.style(i).wall)).size,H.WALLS.length);
assert.equal(new Set(Array.from({length:500},(_,i)=>H.style(i).roof)).size,H.ROOFS.length);
for(let id=1;id<100;id++)assert.deepEqual(H.style(id),H.style(id));
const html=fs.readFileSync('index.html','utf8'),meta=JSON.parse(fs.readFileSync('data/base.json')).meta;
const ctx={META:meta,atob:s=>Buffer.from(s,'base64').toString('binary')};vm.createContext(ctx);vm.runInContext(html.slice(html.indexOf('function decodeLayer('),html.indexOf('function fcLine('))+';this.decode=decodeLayer;this.fc=fcPoly;',ctx);
const raw=JSON.parse(fs.readFileSync('data/buildings-homes.json')).layers.bldRest;
console.time('decode and index');const rings=ctx.decode(raw.g),data=ctx.fc(rings,i=>H.style(i+1));H.ingest(data.features);console.timeEnd('decode and index');
let supported=0,samples=0;for(let i=0;i<data.features.length;i+=389){const f=data.features[i];if(f.geometry.coordinates.length!==1)continue;samples++;const m=H.mesh(f.geometry.coordinates[0].map(H.xy),f.id,false);if(m.length){supported++;assert(m.every(Number.isFinite));}}
assert(supported/samples>.9,`At least 90% of sampled small footprints must have roofs: ${supported}/${samples}`);
// Include homes inside the core layer; otherwise Midtown stays flat blocks.
const core=JSON.parse(fs.readFileSync('data/buildings-main.json')).layers.bldCore;
const coreRings=ctx.decode(core.g),coreHouses=ctx.fc(coreRings,i=>({houseId:1000000+i,...H.style(1000000+i)}));
coreHouses.features=coreHouses.features.filter((f,i)=>H.isHouse(f.geometry.coordinates,Math.round((core.a[f.id-1]||0)*.3048)));
H.ingest(coreHouses.features);assert(coreHouses.features.length>25000);
assert(!H.isHouse([[[0,0],[1,0],[1,1],[0,1]]],20),'Tall buildings must not acquire house roofs');
const c=H.xy([-89.991,35.13]),near=coreHouses.features.filter(f=>{const p=H.xy(f.geometry.coordinates[0][0]);return Math.hypot(p[0]-c[0],p[1]-c[1])<1000;});
assert(near.length>1000,'Performance benchmark must include a real dense neighborhood');
console.time('neighborhood roofs');let floats=0;for(const f of near)if(f.geometry.coordinates.length===1)floats+=H.mesh(f.geometry.coordinates[0].map(H.xy),f.properties.houseId||f.id,false).length;console.timeEnd('neighborhood roofs');
console.log(`PASS: ${data.features.length} footprints indexed; ${supported}/${samples} sampled roofs valid; ${H.WALLS.length} wall colors, ${H.ROOFS.length} roof colors; ${near.length} neighborhood roofs use ${(floats*4/1048576).toFixed(1)} MB.`);
// Module integration: loading the buildings and roofs must share height and color.
assert(html.includes("window.BCHouses?.style(i+1)"));assert(html.includes("window.BCHouses?.ingest(r.features.filter"));assert(html.includes("window.BCHouses?.install({map,state:()=>S})"));assert(html.includes("window.BCHouses?.sync()"));
for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))if(m[1].trim())new vm.Script(m[1]);

// Exercise the custom layer lifecycle without pretending a mock validates GPU pixels.
(async()=>{
 const box={module:{exports:{}},setTimeout,clearTimeout};vm.createContext(box);vm.runInContext(fs.readFileSync('city-houses.js','utf8'),box);const houses=box.module.exports;
 let layer,zoom=16,repaints=0,draws=0,uploads=0,lastMatrix;const state={layers:{bld:true}},handlers=new Map();
 const gl=new Proxy({getShaderParameter:()=>true,getProgramParameter:()=>true,getAttribLocation:(_p,n)=>n==='a_pos'?0:1,getUniformLocation:()=>1,createShader:()=>({}),createProgram:()=>({}),createBuffer:()=>({}),bufferData:(_target,v)=>{assert(v.length>0);uploads++},uniformMatrix4fv:(_u,_t,m)=>{lastMatrix=m;assert(Array.from(m).every(Number.isFinite))},drawArrays:(_kind,_first,count)=>{assert(count>0&&count%3===0);draws++}}, {get:(o,k)=>k in o?o[k]:(/^[A-Z_]+$/.test(k)?1:()=>{})});
 const map={getZoom:()=>zoom,getBounds:()=>({getWest:()=>-89.992,getEast:()=>-89.99,getSouth:()=>35.129,getNorth:()=>35.131}),getCenter:()=>({lng:-89.991,lat:35.13}),triggerRepaint:()=>repaints++,on:(k,f)=>handlers.set(k,f),off:k=>handlers.delete(k),addLayer:l=>{layer=l;l.onAdd(map,gl)}};
 houses.ingest([{id:1,properties:{},geometry:{coordinates:[[[-89.991,35.13],[-89.99088,35.13],[-89.99088,35.1301],[-89.991,35.1301],[-89.991,35.13]]]}}]);
 houses.install({map,state:()=>state});await new Promise(r=>setTimeout(r,150));assert(repaints>0);assert.equal(uploads,0,'Upload must occur inside render, not an asynchronous GL call');
 const matrix=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];layer.render(gl,matrix);assert.equal(draws,1);assert.equal(uploads,1);assert(lastMatrix[0]>0&&lastMatrix[5]<0&&lastMatrix[10]>0,'Local north/up axes must map into Mercator correctly');
 state.layers.bld=false;houses.sync();layer.render(gl,matrix);assert.equal(draws,1,'Building toggle must hide roofs');
 state.layers.bld=true;houses.sync();zoom=14;layer.render(gl,matrix);assert.equal(draws,1,'Citywide zoom must hide detailed roofs');zoom=16;layer.render(gl,matrix);assert.equal(draws,2);
 layer.onRemove(map,gl);assert.equal(handlers.size,0);console.log('PASS: renderer uploads, coordinate axes, zoom, building toggle, and cleanup.');
})().catch(e=>{console.error(e);process.exitCode=1});

// Commercial architecture and the ambient animation clock.
for(const h of [4,18,70])for(const r of [[[0,0],[24,0],[24,18],[0,18]],[[0,0],[24,0],[24,8],[12,8],[12,18],[0,18]]]){
 const m=H.buildingMesh(r,42,h,true);assert(m.length>0&&m.length%18===0);assert(m.every(Number.isFinite));
 let highest=0;for(let i=2;i<m.length;i+=6)highest=Math.max(highest,m[i]);assert(Math.abs(highest-(h+.55))<.001,'Roof coping must align with the building height');
 const base=H.buildingMesh(r,42,h,false);assert(m.length>base.length,'Close zoom must add doors and window rows');
}
assert(new Set(Array.from({length:100},(_,i)=>H.buildingStyle(i,30).wall)).size>=6);
const clock=H.motionClock();clock.step(0,false);assert.equal(clock.step(100,true),.1);assert.equal(clock.step(200,false),.1);assert.equal(clock.step(100000,false),.1);assert.equal(clock.step(100100,true),.2,'Resume must not jump ahead through paused time');
const moving={started:true,paused:false,over:false,layers:{bld:true}};assert(H.motionAllowed(moving,16,false,false));
for(const [s,z,hidden,reduced] of [[{...moving,paused:true},16,false,false],[{...moving,layers:{bld:false}},16,false,false],[moving,12,false,false],[moving,16,true,false],[moving,16,false,true],[{...moving,started:false},16,false,false]])assert(!H.motionAllowed(s,z,hidden,reduced));
console.log('PASS: commercial roof heights, facade detail, varied colors, paused/resumed lighting, layer/zoom/visibility/reduced-motion gating.');
