/* Lightweight pitched roofs and facade details on the existing house footprints.
 * Geometry is stylized; it does not describe each property's real architecture. */
(function(root){
  'use strict';
  const WALLS=['#f0dfbd','#b96e55','#8bb6c9','#a7bd8a','#d9a36d','#e7cf83','#e9e8da','#b9a8c9','#91bcb2','#d3937e'];
  const ROOFS=['#535a61','#785443','#647e8d','#a45f49','#596c5b','#837b70'];
  const ORIGIN=[-90.05,35.15],R=6378137,CIRC=2*Math.PI*R;
  const merc=(lon,lat)=>[(lon+180)/360,(1-Math.log(Math.tan(Math.PI/4+lat*Math.PI/360))/Math.PI)/2];
  const origin=merc(...ORIGIN),unit=1/(CIRC*Math.cos(ORIGIN[1]*Math.PI/180));
  const xy=p=>{const m=merc(p[0],p[1]);return[(m[0]-origin[0])/unit,(origin[1]-m[1])/unit];};
  const hash=id=>{let x=(id+1)|0;x=Math.imul(x^(x>>>16),0x45d9f3b);x=Math.imul(x^(x>>>16),0x45d9f3b);return (x^(x>>>16))>>>0;};
  function style(id){const h=hash(id);return {wall:WALLS[h%WALLS.length],roof:ROOFS[(h>>>7)%ROOFS.length],height:h%5===0?5.8:3.6};}
  const BUILDING_WALLS=['#c59c7d','#c3b6a3','#a6bcc4','#bc8070','#d9c7a0','#8fa5ad','#b8b1a4','#9aa992'];
  function buildingStyle(id,height){return {wall:BUILDING_WALLS[hash(id)%BUILDING_WALLS.length],roof:ROOFS[(hash(id)>>>5)%ROOFS.length],height};}
  function motionClock(){let last=null,time=0;return {step(now,running){if(last!==null&&running)time+=Math.max(0,Math.min(250,now-last))/1000;last=now;return time;},get time(){return time;}};}
  function motionAllowed(s,zoom,hidden,reduced){return !!(s?.started&&!s.paused&&!s.over&&s.layers?.bld!==false&&zoom>=15.2&&!hidden&&!reduced);}
  const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
  function clean(ring){
    let r=[];for(const p of ring)if(!r.length||Math.hypot(p[0]-r.at(-1)[0],p[1]-r.at(-1)[1])>.05)r.push(p);
    if(r.length>1&&Math.hypot(r[0][0]-r.at(-1)[0],r[0][1]-r.at(-1)[1])<.05)r.pop();
    let changed=true;while(changed&&r.length>3){changed=false;for(let i=0;i<r.length;i++)if(Math.abs(cross(r[(i+r.length-1)%r.length],r[i],r[(i+1)%r.length]))<.02){r.splice(i,1);changed=true;break;}}
    if(r.reduce((a,p,i)=>a+p[0]*r[(i+1)%r.length][1]-r[(i+1)%r.length][0]*p[1],0)<0)r.reverse();
    return r;
  }
  function triangulate(r){
    const indices=r.map((_,i)=>i),out=[];let budget=r.length*r.length;
    while(indices.length>3&&budget-->0){let found=false;
      for(let k=0;k<indices.length;k++){
        const ia=indices[(k+indices.length-1)%indices.length],ib=indices[k],ic=indices[(k+1)%indices.length],a=r[ia],b=r[ib],c=r[ic];
        if(cross(a,b,c)<=.001)continue;
        if(indices.some(j=>j!==ia&&j!==ib&&j!==ic&&cross(a,b,r[j])>=-.001&&cross(b,c,r[j])>=-.001&&cross(c,a,r[j])>=-.001))continue;
        out.push([a,b,c]);indices.splice(k,1);found=true;break;
      }
      if(!found)return []; // Degenerate GIS outlines keep their existing flat roof.
    }
    if(indices.length===3)out.push(indices.map(i=>r[i]));return out;
  }
  function clip(poly,axis,mid,side){
    const out=[],d=p=>(p[0]*axis[0]+p[1]*axis[1]-mid)*side;
    for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=d(a),db=d(b);if(da>=-1e-7)out.push(a);if((da>0&&db<0)||(da<0&&db>0)){const t=da/(da-db);out.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]);}}
    return out;
  }
  const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
  function mesh(input,id,detailed=true){
    const ring=clean(input),triangles=triangulate(ring),s=style(id),out=[];if(!triangles.length)return out;
    let length=0,ux=1,uy=0;
    for(let i=0;i<ring.length;i++){const a=ring[i],b=ring[(i+1)%ring.length],d=Math.hypot(b[0]-a[0],b[1]-a[1]);if(d>length){length=d;ux=(b[0]-a[0])/d;uy=(b[1]-a[1])/d;}}
    const axis=[-uy,ux],v=ring.map(p=>p[0]*axis[0]+p[1]*axis[1]),min=Math.min(...v),max=Math.max(...v),mid=(min+max)/2,half=(max-min)/2;
    if(half<1.3||half>28)return out;
    const rise=Math.max(1.5,Math.min(3.8,half*.48)),eave=s.height+.08;
    const top=p=>eave+rise*Math.max(0,1-Math.abs((p[0]*axis[0]+p[1]*axis[1]-mid)/half));
    function tri(a,b,c,color,shade=true){
      let light=1;if(shade){const u=b.map((x,i)=>x-a[i]),v=c.map((x,i)=>x-a[i]);let n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];if(n[2]<0)n=n.map(x=>-x);const len=Math.hypot(...n)||1;light=.68+.32*Math.max(0,(n[0]*-.4+n[1]*-.5+n[2]*.77)/len);}
      const col=rgb(color).map(x=>x*light);for(const p of [a,b,c])out.push(...p,...col);
    }
    const quad=(a,b,c,d,color,shade=true)=>{tri(a,b,c,color,shade);tri(a,c,d,color,shade);};
    for(const t of triangles)for(const side of [-1,1]){const p=clip(t,axis,mid,side);for(let i=1;i<p.length-1;i++)tri([...p[0],top(p[0])],[...p[i],top(p[i])],[...p[i+1],top(p[i+1])],s.roof);}
    const front=ring.map((a,i)=>({i,a,b:ring[(i+1)%ring.length]})).filter(e=>Math.hypot(e.b[0]-e.a[0],e.b[1]-e.a[1])>=5).sort((a,b)=>(a.a[1]+a.b[1])-(b.a[1]+b.b[1]))[0]?.i;
    // Close the gable ends, with a cream fascia strip following the roof line.
    for(let i=0;i<ring.length;i++){
      const a=ring[i],b=ring[(i+1)%ring.length],va=a[0]*axis[0]+a[1]*axis[1]-mid,vb=b[0]*axis[0]+b[1]*axis[1]-mid;
      const path=[a];if(va*vb<0){const t=va/(va-vb);path.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]);}path.push(b);
      for(let j=1;j<path.length;j++){const p=path[j-1],q=path[j];quad([...p,s.height],[...q,s.height],[...q,top(q)],[...p,top(p)],s.wall);quad([...p,top(p)-.17],[...q,top(q)-.17],[...q,top(q)],[...p,top(p)],'#f4e9d4');}
      if(!detailed)continue;
      const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);if(len<4)continue;
      const ex=dx/len,ey=dy/len,nx=ey*.06,ny=-ex*.06;
      const panel=(d,w,z,h,color,offset=0)=>{const x=a[0]+ex*d+nx+ey*offset,y=a[1]+ey*d+ny-ex*offset;quad([x-ex*w/2,y-ey*w/2,z],[x+ex*w/2,y+ey*w/2,z],[x+ex*w/2,y+ey*w/2,z+h],[x-ex*w/2,y-ey*w/2,z+h],color,false);};
      const count=Math.min(5,Math.floor(len/3));
      for(let j=0;j<count;j++){const d=(j+.5)*len/count;
        if(i===front&&j===Math.floor(count/2)){panel(d,1.1,0,2.25,'#f4e9d4');panel(d,.83,.05,2.04,'#694b3e',.012);continue;}
        for(let floor=0;floor<(s.height>5?2:1);floor++){const z=1.05+floor*2.65;panel(d,1.22,z-.10,1.40,'#f4e9d4');panel(d,1.02,z,1.20,'#315866',.012);panel(d,.065,z,1.2,'#e6e3cd',.024);panel(d,1.03,z+.56,.065,'#e6e3cd',.024);}
      }
    }
    return out;
  }
  // Flat roofs with a raised edge distinguish larger buildings from pitched-roof homes.
  function buildingMesh(input,id,height,detailed=true){
    const ring=clean(input),triangles=triangulate(ring),out=[],look=buildingStyle(id,height);
    if(!triangles.length||!Number.isFinite(height)||height<1)return out;
    const tri=(a,b,c,col)=>{const color=rgb(col);for(const p of [a,b,c])out.push(...p,...color);};
    const quad=(a,b,c,d,col)=>{tri(a,b,c,col);tri(a,c,d,col);};
    for(const t of triangles)tri(...t.map(p=>[...p,height+.12]),look.roof);
    for(let i=0;i<ring.length;i++){
      const a=ring[i],b=ring[(i+1)%ring.length],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);if(len<.1)continue;
      const ex=dx/len,ey=dy/len;
      quad([...a,height],[...b,height],[...b,height+.55],[...a,height+.55],look.wall);
      // A visible coping strip follows the actual perimeter, with no guessed bounding-box roof.
      const ai=[a[0]-ey*.22,a[1]+ex*.22],bi=[b[0]-ey*.22,b[1]+ex*.22];
      quad([...a,height+.55],[...b,height+.55],[...bi,height+.55],[...ai,height+.55],'#d7d2bd');
      if(!detailed||len<5)continue;
      const panel=(d,w,z,h,col,offset=.07)=>{const x=a[0]+ex*d+ey*offset,y=a[1]+ey*d-ex*offset;quad([x-ex*w/2,y-ey*w/2,z],[x+ex*w/2,y+ey*w/2,z],[x+ex*w/2,y+ey*w/2,z+h],[x-ex*w/2,y-ey*w/2,z+h],col);};
      const floors=Math.max(1,Math.min(10,Math.floor(height/3.5))),n=Math.min(8,Math.floor(len/4)),gap=height/floors;
      for(let floor=0;floor<floors;floor++)for(let j=0;j<n;j++){
        const d=(j+.5)*len/n,z=.8+floor*gap,h=Math.min(1.65,gap-1.1),w=Math.min(2,len/n*.55);
        panel(d,w+.22,z-.1,h+.2,'#d7d2bd');panel(d,w,z,h,'#315866',.085);
      }
      if(i===0){panel(len/2,2.7,0,2.6,'#d7d2bd',.10);panel(len/2,2.35,.08,2.35,'#315866',.12);panel(len/2,.1,.08,2.35,'#d7d2bd',.14);}
    }
    return out;
  }
  function isHouse(rings,height){
    if(rings.length!==1||height>10)return false;
    const r=rings[0].map(xy),a=Math.abs(r.reduce((n,p,i)=>{const q=r[(i+1)%r.length];return n+p[0]*q[1]-q[0]*p[1]},0))/2;
    return a>=18&&a<=500;
  }
  let map,state,index,cells,buffer,program,position,color,matrixUniform,timeUniform,motionJob,motion=motionClock(),lastNamed=-1,motionQuery,vertexCount=0,signature='',enabled=true,ready=false,job,pendingVertices,generation=0;
  function ingest(features,kind='house'){
    // Compact meter-space rings avoid retaining a second citywide GeoJSON copy.
    const eligible=features.filter(f=>f.geometry.coordinates.length===1),total=eligible.reduce((n,f)=>n+f.geometry.coordinates[0].length*2,0);
    const old=index,base=old?old.ids.length:0,start=old?old.points.length:0;
    const points=new Float32Array(start+total),offsets=new Uint32Array(base+eligible.length+1),ids=new Uint32Array(base+eligible.length),centers=new Float32Array((base+eligible.length)*2),heights=new Float32Array(base+eligible.length);
    if(old){points.set(old.points);offsets.set(old.offsets);ids.set(old.ids);centers.set(old.centers);heights.set(old.heights);}else cells=new Map();let p=start;
    eligible.forEach((f,j)=>{const i=base+j;offsets[i]=p;ids[i]=f.properties.houseId||f.properties.architectureId||f.id;heights[i]=kind==='building'?f.properties.h:0;const r=f.geometry.coordinates[0];let x=0,y=0;for(const c of r){const q=xy(c);points[p++]=q[0];points[p++]=q[1];x+=q[0]/r.length;y+=q[1]/r.length;}centers[i*2]=x;centers[i*2+1]=y;const key=Math.floor(x/350)+','+Math.floor(y/350);if(!cells.has(key))cells.set(key,[]);cells.get(key).push(i);});
    offsets[base+eligible.length]=p;index={points,offsets,ids,centers,heights};signature='';schedule();
  }
  function visible(){return enabled&&ready&&index&&map.getZoom()>=15;}
  function schedule(){generation++;if(job)clearTimeout(job);job=setTimeout(rebuild,100);}
  async function rebuild(){
    job=null;if(!visible())return;
    const run=generation;
    const b=map.getBounds(),lo=xy([b.getWest(),b.getSouth()]),hi=xy([b.getEast(),b.getNorth()]),c=xy([map.getCenter().lng,map.getCenter().lat]),detail=map.getZoom()>=16;
    const limits=[Math.floor((lo[0]-70)/350),Math.floor((lo[1]-70)/350),Math.floor((hi[0]+70)/350),Math.floor((hi[1]+70)/350)];
    const sig=limits.join(',')+':'+detail;if(signature===sig)return;
    const found=[];for(let x=limits[0];x<=limits[2];x++)for(let y=limits[1];y<=limits[3];y++)for(const i of cells.get(x+','+y)||[])found.push(i);
    found.sort((a,b)=>Math.hypot(index.centers[a*2]-c[0],index.centers[a*2+1]-c[1])-Math.hypot(index.centers[b*2]-c[0],index.centers[b*2+1]-c[1]));
    const chunks=[];let count=0;
    let batch=0;for(const i of found.slice(0,8000)){const r=[];for(let p=index.offsets[i];p<index.offsets[i+1];p+=2)r.push([index.points[p],index.points[p+1]]);const m=index.heights[i]?buildingMesh(r,index.ids[i],index.heights[i],detail):mesh(r,index.ids[i],detail);chunks.push(m);count+=m.length;
      if(++batch%128===0){await new Promise(resolve=>setTimeout(resolve,0));if(run!==generation||!visible())return;}}
    const vertices=new Float32Array(count);let at=0;for(const m of chunks){vertices.set(m,at);at+=m.length;}
    signature=sig;pendingVertices=vertices;map.triggerRepaint();
  }
  function sync(){if(typeof state!=='function')return;enabled=state()?.layers.bld!==false;if(map){schedule();map.triggerRepaint();}}
  function motionTick(){
    if(!ready)return;
    const reduced=!!motionQuery?.matches;
    const running=motionAllowed(state?.(),map.getZoom(),!!root.document?.hidden,reduced);
    motion.step(Date.now(),running);
    if(running){map.triggerRepaint();if(motion.time-lastNamed>=1){root.BCBuildings?.animate?.(motion.time);lastNamed=motion.time;}}
    motionJob=setTimeout(motionTick,100);
  }
  function install(options){map=options.map;state=options.state;
    const layer={id:'house-roofs',type:'custom',renderingMode:'3d',
      onAdd(_map,gl){
        motionQuery=root.matchMedia?.('(prefers-reduced-motion: reduce)');
        const compile=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
        const vs=compile(gl.VERTEX_SHADER,'attribute vec3 a_pos; attribute vec3 a_color; uniform mat4 u_matrix; varying vec3 v_color; varying vec3 v_world; void main(){gl_Position=u_matrix*vec4(a_pos,1.0);v_color=a_color;v_world=a_pos;}');
        const fs=compile(gl.FRAGMENT_SHADER,'precision mediump float; uniform float u_time; varying vec3 v_color; varying vec3 v_world; void main(){vec3 col=v_color;if(distance(col,vec3(0.19216,0.34510,0.4))<0.01){float seed=dot(floor(v_world*vec3(0.12,0.12,0.28)),vec3(1.7,2.3,0.9));float glow=smoothstep(0.15,0.85,0.5+0.5*sin(u_time*0.18+seed));col=mix(col,vec3(1.0,0.78,0.39),glow*0.72);}gl_FragColor=vec4(col,1.0);}');
        program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
        position=gl.getAttribLocation(program,'a_pos');color=gl.getAttribLocation(program,'a_color');matrixUniform=gl.getUniformLocation(program,'u_matrix');timeUniform=gl.getUniformLocation(program,'u_time');buffer=gl.createBuffer();ready=true;map.on('moveend',schedule);map.on('zoomend',schedule);schedule();motionTick();
      },
      render(gl,m){if(!visible())return;
        if(pendingVertices){gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,pendingVertices,gl.DYNAMIC_DRAW);vertexCount=pendingVertices.length/6;pendingVertices=null;}
        if(!vertexCount)return;
        // Multiply in JS double precision before uploading floats, keeping roofs
        // aligned with the map rather than losing precision near street level.
        const local=new Float32Array(16);for(let row=0;row<4;row++){local[row]=m[row]*unit;local[4+row]=-m[4+row]*unit;local[8+row]=m[8+row]*unit;local[12+row]=m[row]*origin[0]+m[4+row]*origin[1]+m[12+row];}
        gl.useProgram(program);gl.uniform1f(timeUniform,motion.time);gl.uniformMatrix4fv(matrixUniform,false,local);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.enableVertexAttribArray(position);gl.enableVertexAttribArray(color);gl.vertexAttribPointer(position,3,gl.FLOAT,false,24,0);gl.vertexAttribPointer(color,3,gl.FLOAT,false,24,12);gl.disable(gl.CULL_FACE);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.depthMask(true);gl.drawArrays(gl.TRIANGLES,0,vertexCount);
      },
      onRemove(_map,gl){ready=false;generation++;if(job)clearTimeout(job);if(motionJob)clearTimeout(motionJob);map.off('moveend',schedule);map.off('zoomend',schedule);gl.deleteBuffer(buffer);gl.deleteProgram(program);}
    };
    map.addLayer(layer);sync();
  }
  const api={style,buildingStyle,buildingMesh,motionClock,motionAllowed,isHouse,mesh,triangulate,clean,xy,ingest,install,sync,WALLS,ROOFS};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.BCHouses=api;
})(typeof window!=='undefined'?window:globalThis);
