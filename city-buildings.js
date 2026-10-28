/* Named locations share the same footprint for rendering, hover and selection. */
window.BCBuildings = (() => {
  let map, state, openPlace, openCivic, byKey = new Map(), hoverId, selectedIds=[];
  const ids = ['places-flat', 'places-3d', 'places-outline', 'places-windows'];
  const allowed = () => map && state()?.layers.bld && (state()?.mode || 'real') === 'real';
  const color = ['case', ['boolean',['feature-state','selected'],false], '#ffe27b', ['boolean',['feature-state','hover'],false], '#fff0ba', ['boolean',['feature-state','worn'],false], '#937966', ['boolean',['feature-state','renewed'],false], '#8ed4bd', ['get','color']];
  function set(id, prop, value) { if(id != null && map?.getSource('named-buildings')) map.setFeatureState({source:'named-buildings',id},{[prop]:value}); }
  function select(key) { selectedIds.forEach(id=>set(id,'selected',false));selectedIds=(byKey.get(key)||[]).map(f=>f.id);selectedIds.forEach(id=>set(id,'selected',true)); }
  function hit(point) {
    if(!allowed() || !map.getLayer('places-flat'))return null;
    const layers=['places-flat','places-3d','pyramid-flat','pyramid-3d'].filter(id=>map.getLayer(id));
    const f=map.queryRenderedFeatures(point,{layers})[0];
    if(f?.source==='pyramid')return {properties:{name:'The Pyramid',address:'1 Bass Pro Dr.',keys:'["landmark:pyramid"]'}};
    return f || null;
  }
  function hover(point) {
    set(hoverId,'hover',false);hoverId=null;
    const f=hit(point);if(!f)return false;
    hoverId=f.id;set(hoverId,'hover',true);
    const tip=document.getElementById('tip');tip.replaceChildren();
    const title=document.createElement('b');title.textContent=f.properties.name;
    tip.append(title,document.createElement('br'),document.createTextNode(f.properties.address),document.createElement('br'),document.createTextNode('Click the building to visit'));
    tip.hidden=false;tip.style.left=Math.min(point.x+14,window.innerWidth-240)+'px';tip.style.top=(point.y+14)+'px';
    document.getElementById('map').classList.add('hot');return true;
  }
  function visit(key) {select(key);const [kind,id]=key.split(':');if(kind==='civic')openCivic(id);else openPlace(id);}
  function click(point) {
    const f=hit(point);if(!f)return false;
    const keys=JSON.parse(f.properties.keys);
    if(keys.length===1)visit(keys[0]);
    else {
      const el=document.createElement('div');el.className='building-choices';
      for(const key of keys){const b=document.createElement('button');b.textContent=key.startsWith('civic:')?'Visit public service':'Open landmark';b.onclick=()=>{popup.remove();visit(key);};el.append(b);}
      const popup=new maplibregl.Popup().setLngLat(map.unproject(point)).setDOMContent(el).addTo(map);
    }
    return true;
  }
  function sync() {
    if(!map?.getLayer('places-flat'))return;
    for(const id of ids)if(map.getLayer(id))map.setLayoutProperty(id,'visibility',allowed()?'visible':'none');
    const filter=state()?.layers.civic===false?['==',['get','kind'],'landmark']:null;
    for(const id of ids)if(map.getLayer(id))map.setFilter(id,filter);
  }
  async function install(options) {
    ({map,state,openPlace,openCivic}=options);
    const response=await fetch('data/named-buildings.json?v=18');
    if(!response.ok)throw new Error('Named buildings '+response.status);
    const data=await response.json();
    options.onAnchors?.(data.anchors || []);
    for(const f of data.features)for(const key of JSON.parse(f.properties.keys))byKey.set(key,[...(byKey.get(key)||[]),f]);
    map.addSource('named-buildings',{type:'geojson',data,tolerance:0.1});
    map.addLayer({id:'places-flat',type:'fill',source:'named-buildings',minzoom:12,maxzoom:13.5,paint:{'fill-color':color,'fill-opacity':.95}});
    map.addLayer({id:'places-3d',type:'fill-extrusion',source:'named-buildings',minzoom:13.5,paint:{'fill-extrusion-color':color,'fill-extrusion-height':['interpolate',['linear'],['zoom'],13.5,0,14.2,['+', ['get','height'],.3]],'fill-extrusion-opacity':1,'fill-extrusion-vertical-gradient':true}});
    map.addLayer({id:'places-outline',type:'line',source:'named-buildings',minzoom:12,paint:{'line-color':'#fff1bf','line-width':['case',['boolean',['feature-state','selected'],false],3,1.2],'line-opacity':.9}});
    sync();window.BCLife?.sync();
    // Facade decoration is optional: failure leaves the clickable footprints intact.
    try {
      const r=await fetch('data/building-details.json?v=18');if(!r.ok)throw new Error(r.status);
      map.addSource('building-details',{type:'geojson',data:await r.json(),tolerance:0});
      map.addLayer({id:'places-windows',type:'fill-extrusion',source:'building-details',minzoom:15.2,paint:{'fill-extrusion-color':['get','color'],'fill-extrusion-base':['get','base'],'fill-extrusion-height':['get','top'],'fill-extrusion-opacity':1}});
      sync();
    }catch(e){console.warn('Facade details unavailable',e);}
  }
  function conditions(values){for(const [key,v] of Object.entries(values))for(const f of byKey.get(key)||[])for(const [prop,value] of Object.entries(v))set(f.id,prop,value);}
  return {install,sync,hit,hover,click,select,conditions};
})();
