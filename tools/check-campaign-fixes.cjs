const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
function segment(a,b){return html.slice(html.indexOf(a),html.indexOf(b,html.indexOf(a)))}
function run(code,ctx){vm.createContext(ctx);vm.runInContext(code,ctx);return ctx}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
// Door-knocking must save, report and charge exactly once, with and without geometry.
for(const center of [null,[-90,35]]){let saved=0,refreshed=0,moved=0,reported=0;const acts=new Set();
 const c=run(segment('function candDoors(d)','function candMeet('),{S:{slots:2},cdLeft:k=>acts.has(k),markAct:k=>acts.add(k),dComp:()=>({a:1}),GROUPS:[{id:'a',share:100}],clamp,candBump(){},recUp(){},gainXP(){},districtCenter:()=>center,goTo(){moved++},cityApproval:()=>40,save(){saved++},refreshHUD(){refreshed++},toast(){reported++},openCandActions(){}});
 c.candDoors(2);assert.equal(c.S.slots,1);assert.equal(saved,1);assert.equal(refreshed,1);assert.equal(reported,1);assert.equal(moved,center?1:0);c.candDoors(2);assert.equal(saved,1);assert.equal(c.S.slots,1);}
// Cap both sides' boosted turnout, including district-office uplift; ordinary rates survive.
const c=run(segment('function groupTurnout(','// What each piece added'),{S:{pop:{d:{1:0}},groups:{g:{app:30}},camp:{organizers:10,offices:{1:true}},rival:{camp:{organizers:10}}},tEff:()=>.95,mgrMul:()=>2,officeReach:()=>1,rivalOfficeReach:()=>1,endorsementFor:()=> 'rival',clamp,GROUPS:[{id:'g',turn:.8,share:100}],groupSupport:()=>.4,dComp:()=>({g:1}),DLEAN:{1:0}});
for(const sup of [.3,.7]){assert(c.groupTurnout(c.GROUPS[0],sup)<=1);assert(c.groupTurnout(c.GROUPS[0],sup)>=0)}assert.equal(c.groupTurnout(c.GROUPS[0],.7,{noOrg:true,noOff:true,noEndorse:true}),.95);assert.equal(c.headToHead(1),.4);
// Old polls must not masquerade as the current race; keep recent polls.
const st=run(segment('function campStanding()','function weakGroup()'),{S:{approval:30,camp:{polls:[{m:100,when:'March',you:20,und:10}]}},nowM:()=>103,headToHead:()=>.48});assert.equal(st.campStanding().you,48);assert(st.campStanding().src.includes('out of date'));st.nowM=()=>101;assert.equal(st.campStanding().you,20);
// Daily updates keep the desk and an open manager card synchronized without reopening it.
let desk=0,chip=0,ticks=0;const nodes={'.mp-phase':{},'.mp-say':{}},el={hidden:false,querySelector:k=>nodes[k]};
run(segment('// Daily campaign information','// ======================= BOOT'),{S:{started:true},dayTick(){ticks++},renderDesk(){desk++},renderNextChip(){chip++},$:()=>el,campStrategy:()=>({ph:{n:'Final stretch',d:'Act now'},read:'Current estimate',style:''}),daysToElection:()=>7}).dayTick();assert.equal(ticks,1);assert.equal(desk,1);assert.equal(chip,1);assert(nodes['.mp-phase'].textContent.includes('7 days'));
// Exercise real debate scoring at both timing extremes; feedback names delivery independently.
for(const pos of [0,50]){let rendered=0;const d={qs:[{good:'attack',bad:'record'}],round:0,pick:'attack',pos,you:0,them:0,room:0,log:[]};const ctx=run(segment('function dbtDeliver()','function dbtFinish('),{DBT:d,cancelAnimationFrame(){},dbtRAF:0,dbtZone:()=>20,mskill:()=>18,rnd:()=>0,S:{rival:{name:'Test Rival'}},dbtRender(){rendered++},dbtFinish(){}});ctx.dbtDeliver();assert(d.last.includes('Answer: a perfect fit'));assert(d.last.includes(pos===50?'Delivery: right in the center':'Delivery: you missed the timing zone'));assert(!d.last.includes('fell flat'));assert.equal(rendered,1);}
// Loader advances on a timeout, accepts a success, and reports exhausted sources.
let timers=[],scripts=[],events=[];const loader=segment('// Serve the pinned engine','</script>');const l=run(loader,{window:{dispatchEvent:e=>events.push(e)},Event:class{constructor(type){this.type=type}},setTimeout:f=>(timers.push(f),timers.length),clearTimeout(){},document:{createElement:()=>({remove(){}}),head:{appendChild:s=>scripts.push(s)}}});assert(scripts[0].src.startsWith('assets/vendor/'));timers[0]();assert.equal(scripts.length,2);scripts[1].onerror();scripts[2].onerror();assert.equal(l.window.__mlFail,true);assert.equal(events[0].type,'mlready');
for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))if(m[1].trim())new vm.Script(m[1]);
console.log('PASS: missing-map outreach saves once, turnout bounds, poll age, daily dates, debate feedback, loader timeout/failure and inline syntax');
