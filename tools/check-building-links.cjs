// Offline regression checks for the named-building data and interaction contract.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const data=read('data/named-buildings.json'),audit=read('data/building-link-audit.json'),extra=read('data/building-supplements.json');
const inside=(p,r)=>{let yes=false;for(let i=0,j=r.length-1;i<r.length;j=i++){const a=r[i],b=r[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])yes=!yes;}return yes;};
assert.equal(audit.matched.length,90);assert.equal(audit.unresolved.length,0);
const byKey=new Map();
for(const f of data.features){
 assert(!data.superseded.includes(f.properties.buildingId),'A linked building cannot be suppressed');
 for(const key of JSON.parse(f.properties.keys))byKey.set(key,[...(byKey.get(key)||[]),f]);
 for(const r of f.geometry.coordinates){assert.deepEqual(r[0],r.at(-1));assert(r.every(p=>p.length===2&&p.every(Number.isFinite)));}
}
for(const a of data.anchors)assert(byKey.get(a.key)?.some(f=>inside(a.coordinates,f.geometry.coordinates[0])),`Anchor outside ${a.key}`);
for(const f of extra.features){const match=byKey.get(f.properties.key)?.find(g=>g.properties.buildingId===f.properties.buildingId);assert(match);assert.deepEqual(match.geometry,f.geometry);}
assert.equal(byKey.get('civic:p5').length,2);
assert.equal(new Set(data.features.map(f=>f.id)).size,data.features.length);
assert.equal(new Set(data.superseded).size,data.superseded.length);
// Exercise the actual controller against a map adapter, including state resets,
// multi-building selection, location actions and disabled/political map modes.
(async()=>{
 const sources=new Map(),layers=new Map(),states=new Map(),visits=[],requests=[];
 let target,anchors,paintUpdates=[];
 const state={layers:{bld:true,civic:true},mode:'real'};
 const map={setPaintProperty:(id,key,value)=>paintUpdates.push({id,key,value}),addSource:(id,v)=>sources.set(id,v),getSource:id=>sources.get(id),addLayer:l=>layers.set(l.id,l),getLayer:id=>layers.get(id),setFeatureState:(f,v)=>states.set(f.id,{...states.get(f.id),...v}),setLayoutProperty:(id,k,v)=>{layers.get(id).layout={...layers.get(id).layout,[k]:v}},setFilter:(id,f)=>{layers.get(id).filter=f},queryRenderedFeatures:()=>target?[target]:[]};
 const ctx={window:{},console,fetch:async url=>{requests.push(url);return{ok:true,json:async()=>read(url.split('?')[0])}}};
 vm.createContext(ctx);vm.runInContext(fs.readFileSync('city-buildings.js','utf8'),ctx);
 const b=ctx.window.BCBuildings;
 await b.prepare();await b.install({map,state:()=>state,openPlace:id=>visits.push('landmark:'+id),openCivic:id=>visits.push('civic:'+id),onAnchors:a=>anchors=a});
 b.animate(0);b.animate(12);assert.equal(paintUpdates.length,2);assert.notEqual(JSON.stringify(paintUpdates[0].value),JSON.stringify(paintUpdates[1].value));state.paused=true;b.animate(14);assert.equal(paintUpdates.length,2);state.paused=false;
 assert.equal(requests.filter(u=>u.includes('named-buildings')).length,1,'Preparation must be shared');assert.equal(anchors.length,data.anchors.length);
 for(const id of data.superseded){const [layer,n]=id.split(':');assert(b.isSuperseded(layer,Number(n)));}
 assert(!b.isSuperseded('bldBig',-1));
 for(const key of ['landmark:xai','civic:p5','civic:f54']){
  b.select(key);for(const f of data.features)assert.equal(states.get(f.id)?.selected===true,JSON.parse(f.properties.keys).includes(key));
  target=byKey.get(key)[0];assert(b.click({x:100,y:100}));assert.equal(visits.at(-1),key);
 }
 b.conditions({'civic:p5':{renewed:true}});for(const f of byKey.get('civic:p5'))assert(states.get(f.id).renewed);
 state.layers.bld=false;b.sync();assert.equal(b.hit({}),null);for(const l of layers.values())assert.equal(l.layout.visibility,'none');
 state.layers.bld=true;state.mode='political';b.sync();assert.equal(b.click({}),false);
 state.mode='real';state.layers.civic=false;b.sync();for(const l of layers.values()){assert.equal(l.layout.visibility,'visible');assert.equal(JSON.stringify(l.filter),JSON.stringify(['==',['get','kind'],'landmark']));}
 state.layers.civic=true;b.sync();for(const l of layers.values())assert.equal(l.filter,null);
 // Parse every inline game script without running the simulation.
 const html=fs.readFileSync('index.html','utf8');for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)){if(m[1].trim())new vm.Script(m[1]);}
 console.log(`PASS: ${audit.matched.length} destinations, ${data.features.length} footprints, ${data.superseded.length} obsolete footprints suppressed; anchors, selection, visits, layer filters and script syntax.`);
})().catch(e=>{console.error(e);process.exit(1)});
