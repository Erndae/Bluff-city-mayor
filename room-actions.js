/* Inspect room objects without interrupting a meeting; receive project visitors. */
(function(){
 const esc=dlgEsc;
 function visitors(s){return(s.projects||[]).filter(p=>p.paused||(p.stage==='done'&&(p.maintCut||p.sat<40))||p.stage==='build').slice(0,4).map(p=>({id:p.id,name:p.paused?'Project liaison':p.stage==='done'?'Neighborhood resident':'Site supervisor',reason:p.paused?'Work has stopped. Review what it will take to restart.':p.stage==='done'?'The finished project needs upkeep. Review its maintenance.':'Construction is underway. Review progress and the next milestone.',project:p.name}));}
 const dialog=document.createElement('dialog');dialog.id='roomInspect';document.body.append(dialog);let priorPause=false,returnFocus=null;
 function inspect(title,body){if(!dialog.open){priorPause=S.paused;returnFocus=document.activeElement;S.paused=true;}dialog.innerHTML=`<header><h2>${esc(title)}</h2><button class="btn" data-room-close>Return</button></header>${body}`;if(!dialog.open)dialog.showModal();dialog.querySelector('button')?.focus();}
 dialog.addEventListener('close',()=>{if(S)S.paused=priorPause;returnFocus?.isConnected&&returnFocus.focus();});
 function project(id){const p=(S.projects||[]).find(x=>String(x.id)===String(id));if(!p){inspect('Project board','<p>This project is no longer on the board.</p>');return;}
  const stage=p.paused?'Work paused':p.stage==='done'?(p.maintCut||p.sat<40?'Upkeep needs attention':'Completed'):p.stage;
  inspect(p.name,`<p>District ${esc(p.d)} · <b>${esc(stage)}</b></p><p>Construction progress: ${Math.round(Math.max(0,Math.min(1,p.progress||0))*100)}%</p><p>${p.paused?'The liaison asks you to review the pause and remaining funding.':p.stage==='done'?'The resident wants the completed work kept in good condition.':'The supervisor has brought the current project plans.'}</p>${typeof DLG!=='undefined'&&DLG?'<p class="note">Finish your conversation before changing this project. Your meeting is still waiting behind this board.</p>':`<button class="btn primary" data-room-manage="${esc(p.id)}">Open project controls</button>`}`);
 }
 const scene=meetingScene;
 meetingScene=function(...args){let html=scene(...args);const d=typeof DLG!=='undefined'?DLG:null,local=d?.kind!=='nb'&&!(d?.kind==='vip'&&['fedex','chamber'].includes(d.id));const district=d?.kind==='council'?Number(homeOf(args[0])):!d&&args[0].seat?Number(homeOf(args[0])):0;
  const projects=local?(S.projects||[]).filter(p=>(!district||Number(p.d)===district)&&(['done','build','plan','bid','vote','council','design'].includes(p.stage)||p.paused)).slice(-3).reverse():[];
  const links=projects.map(p=>`<button class="room-prop" data-room-project="${esc(p.id)}" aria-label="Inspect ${esc(p.name)}">${esc(p.name)}</button>`).join('');
  if(links)html=html.replace(/<div class="room-board">[\s\S]*?<\/div>/,`<div class="room-board">${links}</div>`);
  return html+`<div class="room-objects">${projects.length?'<span class="note">Tap a project on the wall to inspect it.</span>':''}<button class="btn" data-room-letters>Read correspondence</button></div>`;
 };
 const audience=openAudience;
 openAudience=function(...args){const r=audience.apply(this,args),V=visitors(S);if(V.length)$('mBody').insertAdjacentHTML('beforeend',`<section class="facts"><h3>Visitors with project business</h3><p class="note">These visitors are here because of current project conditions. Reviewing their request is free; project actions show their own costs.</p>${V.map(v=>`<div class="room-visitor"><b>${esc(v.name)} · ${esc(v.project)}</b><p>${esc(v.reason)}</p><button class="btn" data-room-project="${esc(v.id)}">Hear them out</button></div>`).join('')}</section>`);return r;};
 if(window.BCInterior){const open=BCInterior.open;BCInterior.open=function(options){if(options.place==='office'){const base=options.visitors;options={...options,visitors:()=>[...(base?base():[]),...visitors(S).map((v,i)=>({skin:['#8d5524','#c68642','#e0ac69'][i%3],suit:'#4a635a',hair:'#302821',glasses:i%2===0}))]};}return open.call(this,options);};}
 document.addEventListener('click',e=>{const b=e.target.closest('[data-room-project],[data-room-close],[data-room-manage],[data-room-letters]');if(!b||!S)return;e.preventDefault();e.stopPropagation();
  if(b.hasAttribute('data-room-close')){dialog.close();return;}
  if(b.hasAttribute('data-room-project')){project(b.dataset.roomProject);return;}
  if(b.hasAttribute('data-room-manage')){const id=b.dataset.roomManage,p=(S.projects||[]).find(p=>String(p.id)===id);dialog.close();if(!p)return;if(window.BCInterior?.isOpen)BCInterior.close();endDevice();onClose=null;closeModal();closePanel();openProject(p.id);return;}
  const letters=(S.life?.history||[]).slice(0,5);inspect('Recent city correspondence',letters.length?letters.map(r=>`<article class="room-visitor"><small>${esc(r.date)}</small><h3>${esc(r.title)}</h3><p>${esc(r.summary)}</p></article>`).join(''):'<p>No decision reports have arrived yet. Reports appear here as you act on city issues.</p>');
 });
 window.BCRoomActions={visitors};
})();
