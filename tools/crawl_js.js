// injected into the page: helpers for the button crawler
window.__h=s=>{let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return h};
window.__sig=()=>{const g=id=>document.getElementById(id);const mb=g('mBody'),pb=g('pBody');const toast=g('toast');
  let sh=0;try{sh=__h(JSON.stringify(S))}catch(e){}
  return JSON.stringify([!!modalOpen,(g('mTitle')||{}).textContent,(g('mSub')||{}).textContent,mb?__h(mb.innerHTML):0,g('panel')&&g('panel').hidden,(g('pTitle')||{}).textContent,pb?__h(pb.innerHTML):0,
    typeof HD!=='undefined'?[HD.view,HD.on,HD.more]:0,document.body.className,!!(window.BCInterior&&BCInterior.isOpen),!!g('actCard'),toast?toast.textContent+toast.className:'',
    document.querySelectorAll('#notes .note-card').length,sh,(g('homeDesk')||{}).innerHTML?__h(g('homeDesk').innerHTML):0,location.hash,document.querySelector('.hd-sheet')?1:0,
    [...document.querySelectorAll('dialog[open],.overlay:not([hidden]),[role=dialog]:not([hidden])')].length,mb?Math.round(mb.scrollTop):0,pb?Math.round(pb.scrollTop):0,(document.querySelector('#homeDesk .hd-body')||{}).scrollTop|0])};
window.__closeAll=()=>{try{document.querySelectorAll('dialog[open]').forEach(d=>d.close())}catch(e){}try{while(modalOpen)closeModal()}catch(e){}try{closePanel()}catch(e){}try{if(window.BCInterior&&BCInterior.isOpen)BCInterior.close()}catch(e){}
  try{document.getElementById('actCard')&&document.getElementById('actCard').remove()}catch(e){}try{if(typeof DEV!=='undefined'&&document.body.classList.contains('dev-on')&&typeof closeDevice==='function')closeDevice()}catch(e){}
  document.body.classList.remove('dev-on','dev-aud','inside-home','panel-over');try{HD.more=false}catch(e){}};
window.__snap=()=>JSON.stringify(S);
window.__restore=(snap,view)=>{__closeAll();S=JSON.parse(snap);try{S.paused=true;setPaused(true)}catch(e){}try{if(typeof HD!=='undefined'){HD.on=view!=='map';HD.view=view==='map'?HD.view:view;HD.more=false;HD.last=null}}catch(e){}
  try{refreshHUD()}catch(e){}try{renderHomeDesk(true)}catch(e){}};
window.__SKIP=/start over|new game|brand-new|delete|erase|reset|quit|sign out|overwrite/i;
window.__buttons=(root)=>{const R=typeof root==='string'?document.querySelector(root):root;if(!R)return[];
  return[...R.querySelectorAll('button,a[href],[data-act],[role=button],input[type=checkbox],select')].filter(b=>{if(b.disabled)return false;const r=b.getBoundingClientRect();if(!r.width||!r.height)return false;const cs=getComputedStyle(b);if(cs.visibility==='hidden'||cs.display==='none')return false;
    const t=(b.textContent||b.getAttribute('aria-label')||'').trim();if(__SKIP.test(t))return false;if(b.closest('[data-slot],[data-load],[data-del]'))return false;return true})};
window.__label=b=>{if(!b||b.nodeType!==1)return"?";const t=(String(b.innerText||b.getAttribute('aria-label')||b.getAttribute('title')||'')).replace(/\s+/g,' ').trim().slice(0,50);const d=Object.entries(b.dataset).map(([k,v])=>k+'='+v).join(',');return(t||'(no text)')+(d?' ['+d+']':'')+(b.tagName==='SELECT'?' <select>':'')};

window.__where=()=>{const g=id=>document.getElementById(id);if(window.BCInterior&&BCInterior.isOpen)return'room';if(document.querySelector('dialog[open]'))return'dialog:'+(document.querySelector('dialog[open] h2')||{}).textContent;if(document.body.classList.contains('dev-on'))return'device';if(modalOpen)return'modal:'+(g('mTitle')||{}).textContent;if(g('panel')&&!g('panel').hidden)return'panel:'+(g('pTitle')||{}).textContent;if(g('actCard'))return'card';return typeof HD!=='undefined'&&HD.on?'desk:'+HD.view:'map'};
window.__state=()=>{const A=S.after;return{slots:S.slots,res:+(S.reserve||0).toFixed(3),cash:Math.round(S.purse?S.purse.cash:0),app:+(S.approval||0).toFixed(2),d:S.day,m:S.m,y:S.y,inf:A?Math.round(A.inf):null,ra:A?A.ra||0:null,odds:A&&A.camp?Math.round(A.camp.odds*100):null,home:S.fam?Math.round(S.fam.home):null,ccash:S.camp?Math.round(S.camp.cash||0):null}};
window.__dest=()=>{const g=id=>document.getElementById(id);const T=el=>el?String(el.innerText||'').replace(/\s+/g,' ').trim():'';let kind='map',title='',sub='',body='',root=null;
  if(window.BCInterior&&BCInterior.isOpen){kind='room';root=g('home-interior');title=T(root&&root.querySelector('h2'));}
  else if(document.querySelector('dialog[open]')){root=document.querySelector('dialog[open]');kind='dialog';title=T(root.querySelector('h2'));}
  else if(document.body.classList.contains('dev-on')&&!modalOpen){kind='device';root=document.querySelector('.dev,.device,#device')||document.body}
  else if(g('actCard')){kind='card';root=g('actCard');title=T(root.querySelector('h3'))}
  else if(modalOpen){kind='modal';title=T(g('mTitle'));sub=T(g('mSub'));root=g('mBody')}
  else if(g('panel')&&!g('panel').hidden){kind='panel';title=T(g('pTitle'));sub=T(g('pSub'));root=g('pBody')}
  else if(typeof HD!=='undefined'&&HD.on){kind='desk:'+HD.view;root=document.querySelector('#homeDesk .hd-body');title=T(document.querySelector('#homeDesk .hd-where'))}
  body=T(root).slice(0,600);const btns=root?[...root.querySelectorAll('button')].filter(b=>b.offsetParent).length:0;
  const exit=kind==='modal'?!!document.querySelector('#modal .x, #modal [data-act=close], #modal button[aria-label*=Close i]'):true;
  return{kind,title,sub,body,btns,exit}};
