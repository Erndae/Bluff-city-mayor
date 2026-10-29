/* Weekly priorities, four navigation groups and concise measured action results. */
(function(root){
  'use strict';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function weekOf(s){const d=new Date(Date.UTC(s.y,s.m-1,s.day));d.setUTCDate(d.getUTCDate()-(d.getUTCDay()+6)%7);return d.toISOString().slice(0,10);}
  function choose(s,list){
    if(!s.started||s.over||!list.length)return null;
    const week=weekOf(s),old=s.weeklyPlan;
    let pick=old&&old.week===week&&old.phase===s.phase?list.find(x=>x.t===old.title):null;
    // Time-sensitive business takes precedence even when the week's goal is still available.
    if(!pick||list[0].pri>=95&&list[0].pri>pick.pri)pick=list[0];
    s.weeklyPlan={week,phase:s.phase,title:pick.t};return pick;
  }
  function changed(a,b){return JSON.stringify(a)!==JSON.stringify(b);}
  const api={weekOf,choose,changed};
  if(typeof module!=='undefined'&&module.exports){module.exports=api;return;}
  root.BCFlow=api;
  const labels={city:'City',budget:'Budget',people:'People',campaign:'Campaign'};
  const groups={openDesk:'city',openActions:'city',openLedger:'city',openRegion:'people',openFinances:'budget',openHousehold:'budget',openMayor:'people',openCabinet:'people',openOpinion:'people',openCouncil:'people',openBudget:'budget',openPolicies:'budget',openHQ:'campaign',openCandActions:'campaign',openMgr:'campaign',openBank:'city',openOutlook:'budget',openHelp:'city',openSlots:'city'};
  function options(){
    if(!S?.started||S.over)return [];
    const next=nextSteps(),urgent=next.filter(x=>x.pri>=95);
    const plan=isCand()&&curMgr()?campStrategy():null;
    const list=plan?[...urgent,...plan.moves.map(x=>({...x,h:x.why})),...next.filter(x=>x.pri<95)]:next;
    const seen=new Set();return list.filter(x=>!seen.has(x.t)&&seen.add(x.t));
  }
  function current(){return choose(S,options());}
  function weeklyHTML(compact=false){const p=current();if(!p)return '';
    const A=advisor(),others=options().filter(x=>x.t!==p.t).slice(0,2),w=S.weeklyPlan.week;
    const name=A?.name||'Your next step',role=A?.role||'City guide';
    return `<section class="weekly-card" aria-label="This week's priority"><div class="weekly-by">${A?.face||''}<div><small>THIS WEEK · ${esc(w.slice(5))}</small><b>${esc(name)}</b><span>${esc(role)}</span></div></div><h3>${esc(p.t)}</h3><p>${esc(p.h||'Review the options, then choose your next move.')}</p><button class="btn primary" data-weekly="${esc(p.t)}">${p.pri<=10?'Continue time':'Take the next step'}</button>${compact?'':`<details class="weekly-alternatives"><summary>Other priorities</summary>${others.map(x=>`<button class="choice" data-weekly="${esc(x.t)}"><b>${esc(x.t)}</b><small>${esc(x.h||'')}</small></button>`).join('')}</details>`}</section>`;
  }
  const route=(key)=>{
    const routes={desk:()=>openDesk(),actions:()=>openActions(),budget:()=>openBudget(),outlook:()=>openOutlook(),policies:()=>openPolicies(),money:()=>openFinances(),home:()=>openHousehold(),council:()=>openCouncil(),cabinet:()=>openCabinet(),opinion:()=>openOpinion(),mayor:()=>openMayor(),region:()=>openRegion(),hq:()=>openHQ(),ledger:()=>openLedger(),history:()=>BCLife.history(),bank:()=>openBank(),help:()=>openHelp(),save:()=>openSlots(),layers:()=>{hideViews();toggleLayersBox();}};
    if(routes[key]){mgrPopClose();routes[key]();}
  };
  const tile=(key,title,description)=>`<button class="flow-tile" data-flow-route="${key}"><b>${esc(title)}</b><span>${esc(description)}</span></button>`;
  function hubBody(group){
    if(group==='city')return weeklyHTML()+`<div class="flow-grid">${tile('desk','Your desk','Decisions, deadlines and projects')}${tile('actions',isCand()?'Meet voters':'Take action',isCand()?'Community groups and speeches':'Projects, town halls and executive orders')}${tile('bank','Available actions',`${S.slots} ${slotWord(S.slots)} left this month`)}${tile('history','Your decisions','Spending, results and reactions')}</div><details class="flow-tools"><summary>Reports and settings</summary><div class="flow-grid">${tile('ledger','Ledger','Read recent city and campaign updates')}${tile('layers','Map layers','Buildings, labels and map controls')}${tile('save','Save and load','Keep or continue a saved game')}${tile('help','Guide','Controls and a guided tour')}<button class="flow-tile" data-music-open><b>Music & volume</b><span>Soundtrack settings</span></button></div></details>`;
    if(group==='budget')return `<p class="note">${inOffice()?'Manage city spending and keep your own finances in view.':'You can review your finances now. City budgeting becomes available when you take office.'}</p><div class="flow-grid">${inOffice()?tile('budget','City budget','Department funding, taxes and council approval')+tile('outlook','Reserve outlook','See the next 12 months')+tile('policies','City programs','Manage ongoing funding'):''}${tile('money','Your finances','Campaign cash, personal money and city reserves')}${tile('home','Your household','Housing, bills and personal purchases')}</div>`;
    return `<p class="note">Build relationships and understand what residents need.</p><div class="flow-grid">${tile('opinion','Residents','Support, concerns and community groups')}${tile('council','City Council','Members, priorities and relationships')}${inOffice()?tile('cabinet','Your cabinet','Department heads and their advice'):''}${tile('mayor','Your character','Skills, appearance and public record')}${tile('region','Neighboring cities','Mayors and regional relationships')}</div>`;
  }
  function openHub(group){if(!labels[group])return;mgrPopClose();if(group==='campaign'){hideViews();openHQ();return;}hideViews();VIEWS['flow_'+group]();}
  for(const group of ['city','budget','people']){const name='flow_'+group;VIEWS[name]=navWrap(name,()=>{closePanel();openModal('Your next move · '+dateStr(),labels[group],hubBody(group),true);});groups[name]=group;}
  function navGroup(){const n=NAV.cur?.name;return groups[n]||groups[TAB_OF[n]]||'city';}
  const originalNav=renderNav;
  renderNav=function(){originalNav();const active=navGroup();const html=Object.entries(labels).map(([g,n])=>`<button data-flow-hub="${g}" class="${active===g?'on':''}" aria-pressed="${active===g}">${n}</button>`).join('');for(const id of ['pTabs','mTabs'])if($(id))$(id).innerHTML=html;document.querySelectorAll('nav.actions [data-flow-hub]').forEach(b=>b.setAttribute('aria-pressed',String(viewOpen()&&b.dataset.flowHub===active)));};
  // Keep keyboard shortcuts and full desk tools, while reducing the always-visible controls.
  const bar=document.querySelector('nav.actions'),play=$('bPlay');
  if(bar){bar.replaceChildren();for(const [group,label] of Object.entries(labels)){const b=document.createElement('button');b.className='btn';b.dataset.flowHub=group;b.textContent=label;bar.append(b);}if(play)bar.append(play);bar.setAttribute('aria-label','Main navigation');}
  const originalDesk=renderDesk;
  renderDesk=function(){originalDesk();const el=$('desk');if(!el)return;el.querySelectorAll('.guidebox,.nextbox').forEach(n=>n.remove());el.insertAdjacentHTML('afterbegin',weeklyHTML(true));};
  const originalOpenDesk=openDesk;openDesk=function(...args){const result=originalOpenDesk(...args);if(!$('pBody').querySelector('.weekly-card'))$('pBody').insertAdjacentHTML('afterbegin',weeklyHTML());return result;};VIEWS.openDesk=openDesk;
  const originalChip=renderNextChip;
  renderNextChip=function(){originalChip();const el=$('nextchip'),p=S?.started?current():null;if(!el||!p)return;el.removeAttribute('data-next');el.dataset.flowHub='city';el.innerHTML=`<span>This week</span>${esc(p.t)}`;el.setAttribute('aria-label','This week: '+p.t);};
  // Keep the tour pointing at visible controls after consolidating the action bar.
  for(const step of [...TUT_MAYOR,...TUT_CAND]){if(step.mob?.includes('.actions'))step.mob='[data-flow-hub="city"]';if(step.sel?.includes('.actions'))step.sel=step.sel.includes('hq')?'[data-flow-hub="campaign"]':'[data-flow-hub="city"]';}
  const originalBriefing=openBriefing;openBriefing=function(...args){const result=originalBriefing(...args),body=$('mBody');const suggestions=Array.from(body.querySelectorAll('.facts')).find(n=>n.querySelector('h4')?.textContent==='My suggestions');if(suggestions)suggestions.outerHTML=weeklyHTML();return result;};
  function goPriority(title){const selected=options().find(x=>x.t===title);if(!selected){openHub('city');toast('Your priorities have changed. Here is the current plan.');return;}document.querySelector('dialog[open]')?.close();hideViews();mgrPopClose();selected.go();}
  function amount(c){const n=Math.abs(c.delta),sign=c.delta>0?'+':'−';return c.unit==='M'?sign+fmtM(n):c.unit==='K'?sign+fmtK(n):sign+(Number.isInteger(n)?n:n.toFixed(1))+(c.unit?' '+c.unit:'');}
  function receipt(r){
    const key=r.changes.filter(c=>!['Meetings remaining','Campaign stops remaining'].includes(c.name)),resource=r.changes.filter(c=>['Meetings remaining','Campaign stops remaining'].includes(c.name));
    const top=[...key,...resource].slice(0,3),reaction=r.groups.length?r.groups.slice().sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta))[0]:r.reactions[0];
    const summary=reaction?`${reaction.name}: ${r.groups.includes(reaction)?'support':'opinion'} ${reaction.delta>0?'rose':'fell'} ${Math.abs(reaction.delta).toFixed(1)} points.`:'No immediate change in recorded relationships.';
    const p=current();
    return `<p class="note">${esc(r.date)}</p><p class="flow-result-summary">${esc(r.summary)}</p><h3>What changed</h3>${top.length?`<dl class="life-results">${top.map(c=>`<div><dt>${esc(c.name)}</dt><dd>${esc(amount(c))}</dd></div>`).join('')}</dl>`:'<p>No immediate change to tracked indicators or spending.</p>'}<p>${esc(summary)}</p>${r.later.length?`<p class="note">${esc(r.later[0])}</p>`:''}<details class="flow-result-details"><summary>All results and reactions</summary><dl class="life-results">${r.changes.map(c=>`<div><dt>${esc(c.name)}</dt><dd>${esc(amount(c))}</dd></div>`).join('')}</dl>${r.reactions.map(x=>`<p>${esc(x.name)} · opinion ${esc(amount(x))}</p>`).join('')}${r.groups.map(x=>`<p>${esc(x.name)} · support ${esc(amount(x))} points</p>`).join('')}${r.later.length?`<ul>${r.later.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}<button class="btn" data-life-history>View decision history</button></details>${p?`<div class="flow-follow"><small>YOUR NEXT STEP</small><b>${esc(p.t)}</b><button class="btn primary" data-weekly="${esc(p.t)}">Review next step</button></div>`:''}`;
  }
  Object.assign(api,{options,current,weeklyHTML,openHub,receipt});
  document.addEventListener('click',e=>{const b=e.target.closest('[data-flow-hub],[data-flow-route],[data-weekly]');if(!b||!S?.started)return;e.preventDefault();e.stopImmediatePropagation();if(b.dataset.weekly)goPriority(b.dataset.weekly);else if(b.dataset.flowHub)openHub(b.dataset.flowHub);else route(b.dataset.flowRoute);},true);
  // Measure existing actions after their normal handlers run. Blocked actions produce no receipt.
  const tracked={cdoors:'Knocked doors',cmeet:'Met community leaders',cspeak:'Spoke on an issue',poll:'Commissioned a poll',fundraiser:'Held a grassroots fundraiser',ad:'Launched campaign advertising',org:'Changed campaign staffing',office:'Changed a campaign office',seek:'Requested an endorsement',townhall:'Held a town hall',meetgroup:'Met a community group',meet:'Met a council member',exec:'Issued an executive order'};
  window.addEventListener('click',e=>{const b=e.target.closest('[data-act],[data-doors]');if(!b||b.disabled||!S?.started||!BCLife)return;const title=b.hasAttribute('data-doors')?'Knocked doors':tracked[b.dataset.act];if(!title)return;
    const before=BCLife.snapshot(),owner=S,last=S.life?.history?.[0]?.id;
    setTimeout(()=>{if(S!==owner||S.life?.history?.[0]?.id!==last)return;const after=BCLife.snapshot();if(!changed(before,after))return;const routine=['Knocked doors','Met community leaders','Spoke on an issue','Commissioned a poll','Held a grassroots fundraiser','Requested an endorsement','Changed campaign staffing','Changed a campaign office','Held a town hall','Met a community group','Met a council member'].includes(title);if(routine)window.__bcQuiet=true;BCLife.record(before,title,'Your action is complete. Review the changes below.','campaign',[]);renderDesk();});
  },true);
  renderNav();if(S?.started)renderDesk();renderNextChip();
})(typeof window!=='undefined'?window:globalThis);
