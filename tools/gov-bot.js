(()=>{const out=[];try{
 const W={crime:-1,streets:1,blight:-1,jobs:1.2,reading:1.2,health:0.8,transit:0.8,revenue:0.35,mood:0.6,officers:0.1};
 const score=c=>{if(!c)return -99;let v=0;const fx=c.fx||{};for(const k in fx)v+=(W[k]||0)*fx[k];v-=(c.cost||0)*0.35;const g=c.grp||{};for(const k in g)v+=g[k]/12;if(/Take the|bribe|kickback|steer|nephew/i.test(c.label||''))v-=50;return v};
 // 1. answer regular decisions with the choice that does the city the most good
 (S.events||[]).filter(e=>e.kind==='event').slice(0,6).forEach(ev=>{const def=EVENTS.find(x=>x.id===ev.id);if(!def||!def.choices)return;let best=0,bv=-1e9;def.choices.forEach((c,i)=>{const v=score(c);if(c.cost&&S.reserve<c.cost)return;if(v>bv){bv=v;best=i}});try{resolve(ev,best);out.push('decided '+def.id+' -> '+best)}catch(e){out.push('resolveERR '+e.message)}while(modalOpen)closeModal()});
 // 2. keep projects going in the weakest districts
 if(inOffice()&&activeProjects().length<3&&S.reserve>25){let d=1,bv=999;for(let k=1;k<=7;k++){const v=dApp(k);if(v<bv){bv=v;d=k}}const types=['road','housing','park'];const type=types[(S.pseq||0)%3];try{if(siteOptions(type,d).length){S._plan={type,d,si:0,fund:S.reserve>60?'cash':'bond'};sendProject();out.push('project '+type+' D'+d)}}catch(e){out.push('projERR '+e.message)}while(modalOpen)closeModal()}
 // 3. neighborhoods: show up, and deliver asks
 try{if(typeof unlocked==='function'&&unlocked('hoods')&&S.slots>1){const ns=Object.keys(HOODX).sort((a,b)=>hoodMood(a)-hoodMood(b));const n=ns.find(x=>nowM()-S.hoods[x].visit>=3);if(n){hoodVisit(n);out.push('visited '+n)}const a=ns.find(x=>!S.hoods[x].asked&&HOODX[x].ask.cost<1&&S.reserve>40);if(a&&S.m%2===0){hoodFund(a);out.push('ask '+a)}}}catch(e){out.push('hoodERR '+e.message)}while(modalOpen)closeModal();
 // 4. fight Nashville bills
 try{if(unlocked('nash')&&S.leg){S.leg.bills.forEach((b,i)=>{if(!b.dead&&b.st<4&&S.slots>0&&b.acted!==nowM()){legAct(i,'deleg');out.push('fought '+b.id)}})}}catch(e){out.push('legERR '+e.message)}while(modalOpen)closeModal();
 // 5. federal money
 try{if(unlocked('deleg')&&S.slots>0){const D=delegInit();const r=Object.values(D.reps).sort((a,b)=>b.rel-a.rel).find(r=>nowM()-r.ask>=6);if(r){delegAsk(r.d);out.push('asked rep '+r.d)}}}catch(e){out.push('delegERR '+e.message)}while(modalOpen)closeModal();
 // 6. campaign in the last months: a manager and ads
 try{if(!isCand()&&S.camp&&monthsToElection()<=4){campInit(S);if(!curMgr()){const m=MGRS.find(m=>S.camp.cash>=m.sal+150);if(m){hireMgr(m.id);out.push('hired '+m.id)}}const opts=adOptions();let k=0;while(S.camp.cash>=120+40&&opts.length&&k<3){buyAd(opts[k%opts.length].ref,'big');k++}if(k)out.push('ads '+k)}}catch(e){out.push('campERR '+e.message)}while(modalOpen)closeModal();
}catch(e){out.push('GOVERR '+e.message)}return out.join('; ')})()
