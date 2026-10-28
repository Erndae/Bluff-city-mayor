// Small, deterministic subsets of real footprints for simulated rehab projects.
const fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
const meta=JSON.parse(fs.readFileSync('data/base.json')).meta;
const homes=JSON.parse(fs.readFileSync('data/buildings-homes.json')).layers.bldRest;
const start=html.indexOf('const HOODS='),end=html.indexOf(';',start);
const decoder=html.slice(html.indexOf('function decodeLayer('),html.indexOf('function fcPoly('));
const ctx={META:meta,atob:s=>Buffer.from(s,'base64').toString('binary')};vm.createContext(ctx);
vm.runInContext(decoder+html.slice(start,end+1)+'\nthis.hoods=HOODS;this.decode=decodeLayer;',ctx);
const sets=ctx.hoods.map(h=>({name:h[0],center:[h[2],h[1]],homes:[]}));
ctx.decode(homes.g).forEach((rings,id)=>{
  const r=rings[0];if(!r?.length)return;
  const c=r.reduce((s,p)=>[s[0]+p[0]/r.length,s[1]+p[1]/r.length],[0,0]);
  for(const set of sets){const distance=Math.hypot((c[0]-set.center[0])*91054,(c[1]-set.center[1])*110950);if(distance>230)continue;
    const f={id,distance,geometry:{type:'Polygon',coordinates:rings.map(r=>r[0][0]===r.at(-1)[0]&&r[0][1]===r.at(-1)[1]?r:[...r,r[0]])}};
    set.homes.push(f);set.homes.sort((a,b)=>a.distance-b.distance);set.homes.length=Math.min(8,set.homes.length);
  }
});
fs.writeFileSync('data/neighborhood-scenes.json',JSON.stringify(sets));
console.log(`${sets.reduce((n,s)=>n+s.homes.length,0)} footprints prepared across ${sets.length} neighborhoods.`);
