/* Location identity and decision-driven room details, derived from saved city state. */
(function(){
 const esc=dlgEsc;
 function roomIdentity(kind,id,role,scene){
  if(kind==='nb')return{key:'regional',title:'Regional council room',detail:'Local maps, town photographs and a shared planning table.'};
  if(kind==='council'||scene==='cafe')return{key:'cafe',title:'Neighborhood coffee shop',detail:'A chalkboard menu, warm brick and neighborhood notices.'};
  if(id==='fedex'||id==='chamber')return{key:'business',title:'Business boardroom',detail:'Glass, a skyline photograph and a project presentation board.'};
  if(id==='pastors')return{key:'church',title:'Church fellowship hall',detail:'Community photographs, warm wood and volunteer notices.'};
  if(id==='union')return{key:'union',title:'Union meeting hall',detail:'Worker photographs, a solidarity banner and practical work tables.'};
  if(kind==='group'||scene==='community')return{key:'community',title:'Neighborhood community center',detail:'Colorful local artwork and a noticeboard for neighborhood projects.'};
  if(/police|fire|safety/i.test(role))return{key:'safety',title:'Public safety briefing room',detail:'A city grid, service reports and a briefing board.'};
  if(/school|education|superintendent/i.test(role))return{key:'education',title:'Education planning room',detail:'Student artwork, books and a school planning board.'};
  return{key:'civic',title:'City Hall office',detail:'Framed civic photographs, wood paneling and the mayor’s project files.'};
 }
 function roomEvidence(state,district,person){
  const projects=(state.projects||[]).filter(p=>!district||Number(p.d)===district);
  const items=projects.filter(p=>['done','build','plan','bid','vote'].includes(p.stage)||p.paused).slice(-3).reverse().map(p=>({title:p.name||'City project',state:p.stage==='done'?(p.maintCut||p.sat<40?'worn':'done'):p.paused?'paused':'working',text:p.stage==='done'?(p.maintCut||p.sat<40?'The completion photograph now carries an upkeep notice.':'A framed completion photograph has replaced the project plan.'):p.paused?'A work-paused notice is pinned over the plans.':'Plans and progress notes are spread across the project board.'}));
  const i=(state.council||[]).findIndex(m=>m.name===person.name),memory=i>=0?state.mem?.[i]:null;
  if(memory)items.push({title:'They remember: '+memory.t,state:memory.v<0?'paused':'done',text:memory.v<0?'The discussion returns to this unresolved grievance.':'Your earlier decision is still appreciated here.'});
  return items;
 }
 const original=meetingScene;
 meetingScene=function(p,name,role,scene,mood){
  const d=typeof DLG!=='undefined'?DLG:null,identity=roomIdentity(d?.kind,d?.id,role,scene);
  const district=d?.kind==='council'?Number(homeOf(p)):!d&&p.seat?Number(homeOf(p)):0;
  // Suburban and private offices do not claim Memphis projects as their own.
  const local=d?.kind!=='nb'&&!(d?.kind==='vip'&&['fedex','chamber'].includes(d.id));
  const evidence=local?roomEvidence(S,district,p):[];
  const cards=evidence.filter(x=>!x.title.startsWith('They remember:'));
  const board=cards.length?cards.map(x=>`<span class="room-prop ${x.state}">${x.state==='done'?'PROJECT PHOTO':x.state==='paused'?'WORK PAUSED':x.state==='worn'?'UPKEEP DUE':'PROJECT PLAN'}</span>`).join(''):'<span class="room-prop">'+({cafe:'TODAY’S MENU',business:'PROJECT BRIEF',church:'VOLUNTEERS',union:'WORKER VOICES',safety:'CITY GRID',education:'STUDENT ART',regional:'REGION MAP',community:'LOCAL NOTICES',civic:'CITY SEAL'}[identity.key])+'</span>';
  let html=original(p,name,role,scene,mood).replace('meeting-stage ','meeting-stage room-'+identity.key+' ').replace(/<div class="meeting-setting">[^<]*<\/div>/,`<div class="meeting-setting">${identity.title}</div>`).replace('<div class="meeting-plant"></div>',`<div class="meeting-plant"></div><div class="room-board">${board}</div>`);
  return html+`<div class="room-story"><p>${identity.detail}</p>${evidence.length?`<details><summary>What your decisions changed here${district?' · District '+district:''}</summary>${evidence.map(x=>`<p><b>${esc(x.title)}</b><br>${esc(x.text)}</p>`).join('')}</details>`:(local?'<small>As local projects progress, this room’s project board will change.</small>':'<small>This office keeps its own regional or business briefing board.</small>')}</div>`;
 };
 window.BCRoomStories={roomIdentity,roomEvidence};
})();
