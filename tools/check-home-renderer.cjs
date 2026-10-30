const assert=require('node:assert/strict'),fs=require('node:fs');
const R=require('../home-renderer.js'),H=require('../home-interior.js');
const near={points:[[-2,-2,2],[2,-2,2],[2,3,2],[-2,3,2]],c:'#e04030'};
const far={points:[[-3,-3,4],[3,-3,4],[3,4,4],[-3,4,4]],c:'#2060e0'};
const p={x:0,z:0,yaw:0,pitch:0},a=R.makeTarget(160,120),b=R.makeTarget(160,120);
R.softwareRender([near,far],p,a);R.softwareRender([far,near],p,b);assert.deepEqual(a.pixels,b.pixels,'visibility must not depend on draw order');
assert.deepEqual([...a.pixels.slice((60*160+80)*4,(60*160+80)*4+3)],[224,64,48]);
// Two crossing surfaces have no correct whole-polygon painter order.
const crossing={points:[[-2,-2,1],[2,-2,5],[2,3,5],[-2,3,1]],c:'#30c070'};
R.softwareRender([near,crossing],p,a);R.softwareRender([crossing,near],p,b);assert.deepEqual(a.pixels,b.pixels,'crossing faces require per-pixel depth');
const subtract=(a,b)=>a.map((x,i)=>x-b[i]),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
function rayHit(origin,dir,v0,v1,v2){const e1=subtract(v1,v0),e2=subtract(v2,v0),q=cross(dir,e2),det=dot(e1,q);if(Math.abs(det)<1e-10)return Infinity;const t=subtract(origin,v0),u=dot(t,q)/det;if(u<0||u>1)return Infinity;const r=cross(t,e1),v=dot(dir,r)/det;if(v<0||u+v>1)return Infinity;const d=dot(e2,r)/det;return d>=.08?d:Infinity;}
function color(c){if(c[0]==='#'){const n=parseInt(c.slice(1),16);return [n>>16,(n>>8)&255,n&255];}return c.match(/[\d.]+/g).slice(0,3).map(Number);}
const h=H.initial(),faces=H.geometry(h),snapshot=JSON.stringify(h),target=R.makeTarget(240,180);let checked=0;
// Independent ray/triangle intersections verify doors, furniture, ceiling and close walls while turning.
for(const camera of [{x:3.5,z:1.05,yaw:0,pitch:.08},{x:3.5,z:1.05,yaw:1.2,pitch:.3},{x:3.5,z:1.05,yaw:3.4,pitch:-.35},{x:6.6,z:4.7,yaw:1.6,pitch:.1},{x:9,z:4.7,yaw:2.8,pitch:.45},{x:3.4,z:6.2,yaw:5.7,pitch:-.2}]){
  R.softwareRender(faces,camera,target);const {f,cx,cy}=R.projection(target.width,target.height);
  for(let y=7;y<target.height;y+=19)for(let x=11;x<target.width;x+=23){const right=(x+.5-cx)/f,up=-(y+.5-cy)/f,forward=up*Math.sin(camera.pitch)+Math.cos(camera.pitch),dy=up*Math.cos(camera.pitch)-Math.sin(camera.pitch);
    const dir=[right*Math.cos(camera.yaw)+forward*Math.sin(camera.yaw),dy,-right*Math.sin(camera.yaw)+forward*Math.cos(camera.yaw)],origin=[camera.x,1.62,camera.z];let nearest=Infinity,expected=[220,216,204];
    for(const face of faces)for(let i=1;i<face.points.length-1;i++){const t=rayHit(origin,dir,face.points[0],face.points[i],face.points[i+1]);if(t<nearest-1e-9){nearest=t;expected=color(face.c);}}
    const offset=(y*target.width+x)*4,actual=[...target.pixels.slice(offset,offset+3)];assert(actual.every((v,i)=>Math.abs(v-expected[i])<=1),`Wrong surface at yaw ${camera.yaw}, pixel ${x},${y}: ${actual}, expected ${expected}`);checked++;
  }
}
assert.equal(JSON.stringify(h),snapshot,'looking must not change saved furniture');
const original=R.softwareRender(faces,p,R.makeTarget(100,100)).pixels.slice();R.softwareRender(faces,{...p,yaw:2},R.makeTarget(100,100));assert.deepEqual(R.softwareRender(faces,p,R.makeTarget(100,100)).pixels,original,'returning to a view is identical');
// Validate the actual GPU setup, uploads, depth state and cleanup without requiring a GPU in CI.
let enabled=[],drawn=0,uploads=0,deleted=0,depthMode;
const gl=new Proxy({DEPTH_TEST:1,LESS:2,COMPILE_STATUS:3,LINK_STATUS:4,COLOR_BUFFER_BIT:8,DEPTH_BUFFER_BIT:16,ARRAY_BUFFER:17,STATIC_DRAW:18,TRIANGLES:19,FLOAT:20,VERTEX_SHADER:21,FRAGMENT_SHADER:22,
  createShader:()=>({}),createProgram:()=>({}),createBuffer:()=>({}),getShaderParameter:()=>true,getProgramParameter:()=>true,getAttribLocation:()=>0,getUniformLocation:()=>({}),getExtension:()=>null,enable:v=>enabled.push(v),depthFunc:v=>depthMode=v,bufferData:()=>uploads++,drawArrays:()=>drawn++,deleteBuffer:()=>deleted++},{get:(o,k)=>k in o?o[k]:()=>{}});
const canvas={width:320,height:200,addEventListener(){},removeEventListener(){}};const gpu=R.gpuRenderer(canvas,gl);gpu.setScene(faces);gpu.setPreview([]);const before=uploads;gpu.render(p);gpu.render({...p,yaw:1});assert(enabled.includes(gl.DEPTH_TEST));assert.equal(depthMode,gl.LESS);assert.equal(uploads,before,'turning never rebuilds room buffers');assert.equal(drawn,2);gpu.destroy();assert.equal(deleted,2);
const html=fs.readFileSync('index.html','utf8');assert(html.indexOf('src="home-renderer.js')<html.indexOf('src="home-interior.js'));
console.log(`PASS: nearest-surface visibility, crossing surfaces, ${checked} independent ray checks across six views, fixed layout, repeatable camera views, GPU depth state, buffer reuse and cleanup.`);
