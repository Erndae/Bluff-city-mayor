/* Neighborhood responses and a chief-of-staff briefing, derived from real projects. */
(function(){
 const esc=dlgEsc;
 function phase(p){return p.stage==='done'?(p.maintCut||p.sat<40?'neglected':'complete'):p.paused?'paused':p.stage==='build'?'building':'planning';}
 function update(s,day,date){
  const n=s.officeLife||(s.officeLife={projects:{},letters:[],serial:0});let changed=false;
  const live=new Set((s.projects||[]).map(p=>String(p.id)));
  for(const id of Object.keys(n.projects))if(!live.has(id)){delete n.projects[id];changed=true;}
  for(const p of s.projects||[]){const id=String(p.id),value=phase(p),old=n.projects[id];
   if(!old){n.projects[id]={phase:value,since:day,protest:false};changed=true;continue;}
   let type=null;
   if(old.phase!==value){type=value==='complete'?(old.phase==='neglected'?'restored':'thanks'):value==='neglected'?'complaint':value==='paused'?'pause':value==='building'&&old.phase==='paused'?'restart':null;n.projects[id]={phase:value,since:day,protest:false};changed=true;}
   const current=n.projects[id];if(value==='neglected'&&!current.protest&&day-current.since>=30){current.protest=true;type='protest';changed=true;}
   if(type){const words={thanks:['Thank you from the neighborhood','The completed project has brought a thank-you letter from local residents.'],restored:['Residents welcome restored upkeep','Residents noticed that the upkeep warning has cleared.'],complaint:['Residents ask for upkeep','Residents are asking you to address the upkeep warning on this completed project.'],pause:['Neighbors ask why work stopped','Residents want to know when construction can resume.'],restart:['Neighbors welcome the restart','Construction has resumed, and residents are glad to see progress again.'],protest:['Residents organize a peaceful protest','After 30 days of unresolved upkeep problems, residents have organized a peaceful protest and sent a representative to request a meeting.']}[type];n.letters.unshift({id:++n.serial,pid:p.id,d:p.d,project:p.name,type,date,title:words[0],text:words[1],read:false});n.letters=n.letters.slice(0,30);}
  }return changed;
 }
 function sync(){if(!S?.started)return; if(update(S,dayN(),dateStr()))save();}
 function urgent(s){return(s.events||[]).filter(e=>Number.isFinite(e.expires)&&Number.isFinite(e.born)&&e.expires-(nowM()-e.born)<=0);}
 function briefing(){sync();const events=urgent(S),V=BCRoomActions.visitors(S),unread=(S.officeLife?.letters||[]).filter(x=>!x.read).length;return{events,V,unread};}
 function briefingHTML(){const b=briefing();return `<section class="facts office-brief"><h3>Your assistant’s briefing</h3><p>${b.events.length?`<b>${b.events.length} decision${b.events.length===1?'':'s'} expire this month.</b> `:'No decisions expire this month. '}${officeVisitors().length+b.V.length} visitors have business with you. ${b.unread} unread neighborhood letters.</p>${b.events.slice(0,2).map(e=>`<p class="note">${esc(evTitle(e))}</p>`).join('')}<div class="row"><button class="btn" data-office-mail>Neighborhood letters</button>${b.events.length?'<button class="btn" data-office-urgent>Review urgent business</button>':''}</div></section>`;}
 const audience=openAudience;openAudience=function(...a){const r=audience.apply(this,a);$('mBody').insertAdjacentHTML('afterbegin',briefingHTML());return r;};
 const enter=enterOffice;enterOffice=function(...a){const was=window.BCInterior?.isOpen,r=enter.apply(this,a);if(!was&&window.BCInterior?.isOpen){const b=briefing();notify('people','Your assistant: welcome to the office',`${b.events.length} urgent decisions · ${officeVisitors().length+b.V.length} visitors · ${b.unread} neighborhood letters`,()=>openAudience(),{ttl:12});}return r;};
 const tick=dayTick;dayTick=function(...a){const r=tick.apply(this,a);sync();return r;};
 const render=refreshHUD;refreshHUD=function(...a){const r=render.apply(this,a);sync();return r;};
 const scene=meetingScene;meetingScene=function(...a){return scene.apply(this,a)+'<div class="room-objects"><button class="btn" data-office-mail>Neighborhood reactions</button></div>';};
 const dialog=document.createElement('dialog');dialog.id='neighborhoodMail';document.body.append(dialog);let paused,focus;
 function mail(){sync();if(!dialog.open){paused=S.paused;focus=document.activeElement;S.paused=true;}const letters=S.officeLife?.letters||[];
  dialog.innerHTML=`<header><h2>Neighborhood reactions</h2><button class="btn" data-office-close>Return</button></header><p class="note">Letters reflect project changes since this update. Reading a letter does not resolve its issue.</p>${letters.length?letters.map(x=>`<article class="room-visitor"><small>${esc(x.date)} · District ${esc(x.d)}${x.read?'':' · NEW'}</small><h3>${esc(x.title)}</h3><b>${esc(x.project)}</b><p>${esc(x.text)}</p></article>`).join(''):'<p>No new neighborhood letters yet. Finish projects, restart work or address upkeep to see residents respond.</p>'}`;
  letters.forEach(x=>x.read=true);save();if(!dialog.open)dialog.showModal();dialog.querySelector('button')?.focus();
 }
 dialog.addEventListener('close',()=>{S.paused=paused;focus?.isConnected&&focus.focus();});
 document.addEventListener('click',e=>{const b=e.target.closest('[data-office-mail],[data-office-close],[data-office-urgent]');if(!b||!S)return;e.preventDefault();e.stopPropagation();if(b.hasAttribute('data-office-close')){dialog.close();return;}if(b.hasAttribute('data-office-mail')){mail();return;}if(window.BCInterior?.isOpen)BCInterior.close();endDevice();onClose=null;closeModal();closePanel();openDesk();});
 window.BCOfficeLife={update,phase};
})();
