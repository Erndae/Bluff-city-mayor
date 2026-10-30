/* Fixed home geometry with per-pixel depth, on the GPU or in the software fallback. */
(function(root){
  'use strict';
  const NEAR=.08,FAR=40,EYE=1.62;
  const colors=new Map();
  function rgb(value){
    if(colors.has(value))return colors.get(value);
    const n=value[0]==='#'?parseInt(value.slice(1),16):null;
    const c=n===null?value.match(/[\d.]+/g).slice(0,3).map(Number):[n>>16,(n>>8)&255,n&255];
    colors.set(value,c);return c;
  }
  function mesh(faces){
    const values=[];
    for(const face of faces){const c=rgb(face.c);for(let i=1;i<face.points.length-1;i++)for(const p of [face.points[0],face.points[i],face.points[i+1]])values.push(...p,c[0]/255,c[1]/255,c[2]/255);}
    return new Float32Array(values);
  }
  function viewPoint(v,p){
    const dx=v[0]-p.x,dz=v[2]-p.z,y=v[1]-EYE,z=dx*Math.sin(p.yaw)+dz*Math.cos(p.yaw);
    return [dx*Math.cos(p.yaw)-dz*Math.sin(p.yaw),y*Math.cos(p.pitch)+z*Math.sin(p.pitch),z*Math.cos(p.pitch)-y*Math.sin(p.pitch)];
  }
  function clipNear(points){
    const out=[];for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length],ina=a[2]>=NEAR,inb=b[2]>=NEAR;
      if(ina)out.push(a);if(ina!==inb){const t=(NEAR-a[2])/(b[2]-a[2]);out.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,NEAR]);}}
    return out;
  }
  function projection(w,h){const f=Math.min(w,h)*.88;return {f,cx:w/2,cy:h*.48};}
  function makeTarget(width,height){return {width,height,pixels:new Uint8ClampedArray(width*height*4),depth:new Float64Array(width*height)};}
  function rasterTriangle(target,a,b,c,color){
    const {width:w,height:h,pixels,depth}=target;
    const edge=(p,q,x,y)=>(q[0]-p[0])*(y-p[1])-(q[1]-p[1])*(x-p[0]);
    let area=edge(a,b,c[0],c[1]);if(Math.abs(area)<1e-8)return;if(area<0){[b,c]=[c,b];area=-area;}
    const x0=Math.max(0,Math.ceil(Math.min(a[0],b[0],c[0])-.5)),x1=Math.min(w-1,Math.floor(Math.max(a[0],b[0],c[0])-.5));
    const y0=Math.max(0,Math.ceil(Math.min(a[1],b[1],c[1])-.5)),y1=Math.min(h-1,Math.floor(Math.max(a[1],b[1],c[1])-.5));
    if(x0>x1||y0>y1)return;
    const inv=1/area,az=a[2]*inv,bz=b[2]*inv,cz=c[2]*inv;
    const ax=b[1]-c[1],bx=c[1]-a[1],cx=a[1]-b[1],ay=c[0]-b[0],by=a[0]-c[0],cy=b[0]-a[0];
    let rowA=edge(b,c,x0+.5,y0+.5),rowB=edge(c,a,x0+.5,y0+.5),rowC=edge(a,b,x0+.5,y0+.5);
    for(let y=y0;y<=y1;y++,rowA+=ay,rowB+=by,rowC+=cy){
      let ea=rowA,eb=rowB,ec=rowC,index=y*w+x0;
      for(let x=x0;x<=x1;x++,index++,ea+=ax,eb+=bx,ec+=cx){
        if(ea<-.00001||eb<-.00001||ec<-.00001)continue;
        // Reciprocal camera depth is linear in screen space. Average face depth is not.
        const z=ea*az+eb*bz+ec*cz;if(z<=depth[index])continue;depth[index]=z;
        const pixel=index*4;pixels[pixel]=color[0];pixels[pixel+1]=color[1];pixels[pixel+2]=color[2];pixels[pixel+3]=255;
      }
    }
  }
  function softwareRender(faces,p,target){
    const {width:w,height:h,pixels,depth}=target,{f,cx,cy}=projection(w,h);depth.fill(0);
    for(let i=0;i<pixels.length;i+=4){pixels[i]=220;pixels[i+1]=216;pixels[i+2]=204;pixels[i+3]=255;}
    const sy=Math.sin(p.yaw),co=Math.cos(p.yaw),sp=Math.sin(p.pitch),cp=Math.cos(p.pitch);
    for(const face of faces){
      const points=clipNear(face.points.map(v=>{const dx=v[0]-p.x,dz=v[2]-p.z,y=v[1]-EYE,z=dx*sy+dz*co;return [dx*co-dz*sy,y*cp+z*sp,z*cp-y*sp];}));
      if(points.length<3)continue;
      const screen=points.map(v=>[cx+v[0]*f/v[2],cy-v[1]*f/v[2],1/v[2]]),color=rgb(face.c);
      for(let i=1;i<screen.length-1;i++)rasterTriangle(target,screen[0],screen[i],screen[i+1],color);
    }
    return target;
  }
  const VERTEX=`attribute vec3 a_position; attribute vec3 a_color;
    uniform vec2 u_position; uniform vec4 u_angles; uniform vec2 u_scale;
    varying mediump vec3 v_color;
    void main(){
      vec2 delta=a_position.xz-u_position;
      float forward=dot(delta,u_angles.xy);
      float right=delta.x*u_angles.y-delta.y*u_angles.x;
      float up=a_position.y-1.62;
      float y=up*u_angles.w+forward*u_angles.z;
      float z=forward*u_angles.w-up*u_angles.z;
      gl_Position=vec4(right*u_scale.x,y*u_scale.y+0.04*z,${((FAR+NEAR)/(FAR-NEAR)).toFixed(10)}*z-${((2*FAR*NEAR)/(FAR-NEAR)).toFixed(10)},z);
      v_color=a_color;
    }`;
  const FRAGMENT='precision mediump float; varying mediump vec3 v_color; void main(){gl_FragColor=vec4(v_color,1.0);}';
  function gpuRenderer(canvas,gl){
    const compile=(type,source)=>{const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){const error=gl.getShaderInfoLog(shader);gl.deleteShader(shader);throw Error(error);}return shader;};
    const vs=compile(gl.VERTEX_SHADER,VERTEX),fs=compile(gl.FRAGMENT_SHADER,FRAGMENT),program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
    const position=gl.getAttribLocation(program,'a_position'),color=gl.getAttribLocation(program,'a_color');
    const loc=Object.fromEntries(['u_position','u_angles','u_scale'].map(n=>[n,gl.getUniformLocation(program,n)]));
    const solid=gl.createBuffer(),preview=gl.createBuffer();let count=0,previewCount=0,sceneFaces=[],previewFaces=[],lost=false;
    const upload=(buffer,faces)=>{const data=mesh(faces);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);return data.length/6;};
    const onLost=e=>{e.preventDefault();lost=true;};canvas.addEventListener('webglcontextlost',onLost);
    function render(p){if(lost)return;
      const w=canvas.width,h=canvas.height,{f}=projection(w,h);gl.viewport(0,0,w,h);gl.clearColor(220/255,216/255,204/255,1);gl.clearDepth(1);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LESS);gl.depthMask(true);gl.disable(gl.CULL_FACE);gl.disable(gl.BLEND);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(program);
      gl.uniform2f(loc.u_position,p.x,p.z);gl.uniform4f(loc.u_angles,Math.sin(p.yaw),Math.cos(p.yaw),Math.sin(p.pitch),Math.cos(p.pitch));gl.uniform2f(loc.u_scale,2*f/w,2*f/h);
      const draw=(buffer,n)=>{if(!n)return;gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.enableVertexAttribArray(position);gl.enableVertexAttribArray(color);gl.vertexAttribPointer(position,3,gl.FLOAT,false,24,0);gl.vertexAttribPointer(color,3,gl.FLOAT,false,24,12);gl.drawArrays(gl.TRIANGLES,0,n);};
      draw(solid,count);draw(preview,previewCount);
    }
    return {mode:'webgl',maxPixels:2200000,setScene(faces){sceneFaces=faces;count=upload(solid,faces);},setPreview(faces){previewFaces=faces;previewCount=upload(preview,faces);},render,
      get lost(){return lost;},get faces(){return sceneFaces.concat(previewFaces);},
      destroy(){canvas.removeEventListener('webglcontextlost',onLost);gl.deleteBuffer(solid);gl.deleteBuffer(preview);gl.deleteProgram(program);gl.getExtension('WEBGL_lose_context')?.loseContext();}};
  }
  function canvasRenderer(canvas){
    const ctx=canvas.getContext('2d',{alpha:false});let faces=[],preview=[],target,image;
    return {mode:'software-depth',maxPixels:460000,setScene(v){faces=v;},setPreview(v){preview=v;},render(p){
      if(!target||target.width!==canvas.width||target.height!==canvas.height){target=makeTarget(canvas.width,canvas.height);image=ctx.createImageData(canvas.width,canvas.height);}
      softwareRender(preview.length?faces.concat(preview):faces,p,target);image.data.set(target.pixels);ctx.putImageData(image,0,0);
    },destroy(){target=null;image=null;faces=[];preview=[];}};
  }
  function create(canvas){
    let gl;try{gl=canvas.getContext('webgl',{alpha:false,antialias:true,depth:true,powerPreference:'low-power'});if(gl)return gpuRenderer(canvas,gl);}catch(e){console.warn('Home GPU rendering unavailable',e);}
    // A canvas cannot change context types after a GL context has been allocated.
    if(gl){const copy=canvas.cloneNode();canvas.replaceWith(copy);canvas=copy;}
    const renderer=canvasRenderer(canvas);renderer.canvas=canvas;return renderer;
  }
  const api={create,canvasRenderer,softwareRender,makeTarget,rasterTriangle,clipNear,projection,viewPoint,mesh,gpuRenderer,VERTEX,FRAGMENT};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.BCHomeRenderer=api;
})(typeof window!=='undefined'?window:globalThis);
