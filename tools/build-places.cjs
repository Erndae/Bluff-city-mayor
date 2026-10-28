// Rebuild named-building links from the game's existing municipal footprints.
// Only containment is accepted. A nearby footprint is not evidence of identity.
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync('index.html', 'utf8');
function array(name) {
  const start = html.indexOf(`const ${name}=`);
  const end = html.indexOf(';', start);
  return vm.runInNewContext(html.slice(start, end + 1) + `\n${name}`);
}
const areaSites = new Set(['beale', 'liberty', 'zoo', 'uofm', 'pw', 'airport', 'pyramid']);
const sites = array('LMKS').filter(p => !p.planned && !areaSites.has(p.id)).map(p => ({...p, key:'landmark:'+p.id, kind:'landmark'}));
for (const [name, kind, prefix] of [['CIV_POLICE','police','p'],['CIV_FIRE','fire','f'],['CIV_HOSP','hospital','h']]) {
  array(name).forEach((p,i) => sites.push({key:'civic:'+prefix+i,kind,name:kind==='fire'?`Fire Station ${p[0]}`:p[0],addr:p[1],lon:p[2],lat:p[3]}));
}
const meta = JSON.parse(fs.readFileSync('data/base.json')).meta;
fs.writeFileSync('data/site-locations.json',JSON.stringify(sites.map(p=>({key:p.key,address:p.addr})),null,2)+'\n');
const candidates=fs.existsSync('data/address-candidates.json')?JSON.parse(fs.readFileSync('data/address-candidates.json')):[];
for(const site of sites){
  const result=candidates.find(c=>c.key===site.key);
  const c=result?.candidates?.find(c=>c.score===100&&c.attributes.Addr_type==='PointAddress');
  if(c){site.original=[site.lon,site.lat];site.lon=c.location.x;site.lat=c.location.y;site.source=result.source;}
}
function decode(g) {
  const bytes = Buffer.from(g,'base64'); let i=0,px=0,py=0; const out=[];
  function rv(){let v=0,m=1,c;do{c=bytes[i++];v+=(c&127)*m;m*=128;}while(c>127);return v;}
  while(i<bytes.length){const parts=[];for(let a=rv();a>0;a--){const ring=[];for(let b=rv();b>0;b--){let x=rv(),y=rv();px+=x&1?-(x+1)/2:x/2;py+=y&1?-(y+1)/2:y/2;ring.push([+(meta.LON0+px*meta.Q/meta.KX).toFixed(6),+(meta.LAT1-py*meta.Q/meta.KY).toFixed(6)]);}parts.push(ring);}out.push(parts);}return out;
}
function inside(p,ring){let yes=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])yes=!yes;}return yes;}
const matches = new Map(), features=[];
const supplements=JSON.parse(fs.readFileSync('data/building-supplements.json'));
const superseded=[];
const parcelRecords=fs.existsSync('data/site-parcels.json')?JSON.parse(fs.readFileSync('data/site-parcels.json')):[];
const parcels=parcelRecords.flatMap(p=>(p.features||[]).map(f=>({...p,parcel:f,candidates:[],bounds:f.geometry.rings.flat().reduce((b,[x,y])=>[Math.min(b[0],x),Math.min(b[1],y),Math.max(b[2],x),Math.max(b[3],y)],[Infinity,Infinity,-Infinity,-Infinity])})));
const palettes={landmark:'#f5c462',police:'#689fe8',fire:'#ef896c',hospital:'#67caba'};
for(const file of ['buildings-main.json','buildings-homes.json']) {
  const layers=JSON.parse(fs.readFileSync('data/'+file)).layers;
  for(const [layer,d] of Object.entries(layers)) {
    if(!d.g)continue;
    decode(d.g).forEach((rings,index)=>{
      if(!rings[0]?.length)return;
      const center=rings[0].reduce((s,v)=>[s[0]+v[0]/rings[0].length,s[1]+v[1]/rings[0].length],[0,0]);
      if(supplements.replacementAreas.some(p=>p.geometry.coordinates.reduce((yes,r)=>inside(center,r)?!yes:yes,false))){superseded.push(`${layer}:${index}`);return;}
      let xmin=Infinity,xmax=-Infinity,ymin=Infinity,ymax=-Infinity;
      for(const [x,y] of rings[0]){xmin=Math.min(xmin,x);xmax=Math.max(xmax,x);ymin=Math.min(ymin,y);ymax=Math.max(ymax,y);}
      const found=sites.filter(p=>p.lon>=xmin&&p.lon<=xmax&&p.lat>=ymin&&p.lat<=ymax&&inside([p.lon,p.lat],rings[0])&&!rings.slice(1).some(r=>inside([p.lon,p.lat],r)));
      const id=`${layer}:${index}`, height=layer==='bldRest'?4.5:Math.max(3,Math.round((d.a[index]||0)*.3048));
      for(const p of parcels){const b=p.bounds;if(xmin<b[0]||xmax>b[2]||ymin<b[1]||ymax>b[3])continue;
        if(rings[0].every(v=>p.parcel.geometry.rings.reduce((yes,r)=>inside(v,r)?!yes:yes,false)))p.candidates.push({id,height,rings,area:(xmax-xmin)*(ymax-ymin)});}
      if(!found.length)return;
      const primary=found.find(p=>p.kind!=='landmark')||found[0];
      const geometry={type:'Polygon',coordinates:rings.map(r=>r.length&&(r[0][0]!==r.at(-1)[0]||r[0][1]!==r.at(-1)[1])?[...r,r[0]]:r)};
      features.push({type:'Feature',id:features.length+1,properties:{buildingId:id,keys:JSON.stringify(found.map(p=>p.key)),name:primary.name,address:primary.addr,kind:primary.kind,color:palettes[primary.kind],height},geometry});
      found.forEach(p=>{const list=matches.get(p.key)||[];list.push(id);matches.set(p.key,list);});
    });
  }
}
for(const p of parcels){
  const site=sites.find(s=>s.key===p.key);if(!site||matches.has(site.key)||!p.candidates.length)continue;
  const addressNumber=String(site.addr).match(/^\d+/)?.[0];
  const sameNumber=addressNumber===String(p.parcel.attributes.PAR_ADRNO);
  // A property with multiple buildings requires matching parcel and site numbers.
  // For a single building, an exact address point within that parcel also anchors it.
  if(!sameNumber && !(site.source&&p.candidates.length===1))continue;
  for(const c of p.candidates){
    let f=features.find(f=>f.properties.buildingId===c.id);
    if(f){const keys=JSON.parse(f.properties.keys);if(!keys.includes(site.key))keys.push(site.key);f.properties.keys=JSON.stringify(keys);}
    else {f={type:'Feature',id:features.length+1,properties:{buildingId:c.id,keys:JSON.stringify([site.key]),name:site.name,address:site.addr,kind:site.kind,color:palettes[site.kind],height:c.height},geometry:{type:'Polygon',coordinates:c.rings.map(r=>r[0][0]!==r.at(-1)[0]||r[0][1]!==r.at(-1)[1]?[...r,r[0]]:r)}};features.push(f);}
  }
  matches.set(site.key,p.candidates.map(c=>c.id));site.source=p.source;site.parcel=p.parcel.attributes.PARCELID;
  const primary=p.candidates.sort((a,b)=>b.area-a.area)[0],r=primary.rings[0];
  const center=r.reduce((s,v)=>[s[0]+v[0]/r.length,s[1]+v[1]/r.length],[0,0]);
  let anchor=inside(center,r)?center:null;
  if(!anchor)for(const v of r){const a=[v[0]*.99+center[0]*.01,v[1]*.99+center[1]*.01];if(inside(a,r)){anchor=a;break;}}
  if(anchor){site.original=site.original||[site.lon,site.lat];[site.lon,site.lat]=anchor;}
}
// Reviewed supplementary outlines are explicit, source-backed exceptions to the
// municipal containment pass, never automatic nearest-building substitutions.
for(const extra of supplements.features){
  const p=extra.properties,site=sites.find(s=>s.key===p.key);
  if(!site)throw new Error('Unknown supplemental site '+p.key);
  const ring=extra.geometry.coordinates[0];
  if(ring.length<4||JSON.stringify(ring[0])!==JSON.stringify(ring.at(-1)))throw new Error('Unclosed outline '+p.buildingId);
  const anchor=p.anchor;
  if(anchor&&!inside(anchor,ring))throw new Error('Anchor outside '+p.buildingId);
  features.push({type:'Feature',id:features.length+1,properties:{buildingId:p.buildingId,keys:JSON.stringify([site.key]),name:site.name,address:site.addr,kind:site.kind,color:palettes[site.kind],height:p.height,method:p.method,source:p.source},geometry:extra.geometry});
  matches.set(site.key,[...(matches.get(site.key)||[]),p.buildingId]);
  site.source=p.source;site.method=p.method;
  if(anchor){site.original=site.original||[site.lon,site.lat];[site.lon,site.lat]=anchor;}
}
const report={method:'Address points contained by municipal footprints, or footprints wholly contained by the address parcel. Multi-building parcels require matching street numbers. Reviewed OSM and imagery outlines supplement buildings absent from the 2011 survey. Nearby buildings are never automatically substituted.',superseded,matched:sites.filter(p=>matches.has(p.key)).map(p=>({key:p.key,name:p.name,buildings:matches.get(p.key),method:p.method||(p.parcel?'address-parcel':'point-in-building'),source:p.source||'Existing city GIS point',parcel:p.parcel})),unresolved:sites.filter(p=>!matches.has(p.key)).map(p=>({key:p.key,name:p.name,address:p.addr,coordinates:[p.lon,p.lat]}))};
const anchors=sites.filter(p=>p.original&&matches.has(p.key)).map(p=>({key:p.key,coordinates:[p.lon,p.lat],source:p.source}));
fs.writeFileSync('data/named-buildings.json',JSON.stringify({type:'FeatureCollection',features,anchors,superseded}));
// Stylized facade windows follow real exterior edges. These are decorative,
// not a claim about a building's real window or entrance positions.
const details=[];
for(const f of features){
  const ring=f.geometry.coordinates[0],h=f.properties.height;
  const levels=Math.min(4,Math.max(1,Math.floor(h/3.6)));
  for(let i=1;i<ring.length;i++){
    const a=ring[i-1],b=ring[i],dx=(b[0]-a[0])*91054,dy=(b[1]-a[1])*110950,len=Math.hypot(dx,dy);
    if(len<7)continue;
    const columns=Math.min(8,Math.floor(len/4)),ux=dx/len,uy=dy/len;
    for(let col=0;col<columns;col++){
      const d=(col+.5)*len/columns,cx=a[0]+ux*d/91054,cy=a[1]+uy*d/110950;
      const points=[[-.9,-.25],[.9,-.25],[.9,.25],[-.9,.25],[-.9,-.25]].map(([u,v])=>[+(cx+(ux*u-uy*v)/91054).toFixed(7),+(cy+(uy*u+ux*v)/110950).toFixed(7)]);
      for(let floor=0;floor<levels;floor++){
        const base=.9+floor*h/levels,top=Math.min(base+1.5,h-.35);if(top<=base)continue;
        details.push({type:'Feature',properties:{base,top,kind:f.properties.kind,color:(col+floor)%5===0?'#ffe1a0':'#397c87'},geometry:{type:'Polygon',coordinates:[points]}});
      }
    }
  }
}
fs.writeFileSync('data/building-details.json',JSON.stringify({type:'FeatureCollection',features:details}));
fs.writeFileSync('data/building-link-audit.json',JSON.stringify(report,null,2)+'\n');
console.log(`${report.matched.length}/${sites.length} locations linked to ${features.length} footprints; ${report.unresolved.length} require coordinate/address review.`);
