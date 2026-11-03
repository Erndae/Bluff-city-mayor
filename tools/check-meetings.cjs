const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
const helpers=html.slice(html.indexOf('function dlgEsc('),html.indexOf('\nfunction dlgStart('));
const code=html.slice(html.indexOf('const ISSUE_SK='),html.indexOf('// ---------- what the property tax'));
let output='',saves=0,rolls=[],xp=0;
const council={name:'Avery Mason',seat:'District 1',home:1,opinion:0,prio:['streets']},staff={name:'Rene Cruz',opinion:0},nb={name:'Pat Lee',city:'Bartlett',opinion:0};
const ctx={DLG:null,MODAL_BROWSE:true,S:{mayor:{name:'Your Mayor'},council:[council],nb:{bartlett:nb},reserve:20,camp:{cash:10,raised:0}},
 document:{addEventListener(){}},STAFFMAP:{roads:{role:'Public Works Director'}},staffOf:()=>staff,VMAP:{fedex:{name:'Marcus Bell',role:'Community Affairs'}},GMAP:{working:{c:'#abc'}},
 hash:()=>.5,portrait:p=>`<svg aria-label="${p.name}"></svg>`,isCand:()=>false,PRIO_LABEL:{streets:'Streets'},dlgTopic:()=>({issue:'streets',open:'What can you do?'}),
 dlgApply(v){let p=ctx.DLG.kind==='staff'?staff:ctx.DLG.kind==='nb'?nb:council;p.opinion+=v},dlgApply2(v){ctx.dlgApply(v)},
 oddsTag:(s,b)=>`${s} ${b}`,skillName:s=>s,save:()=>saves++,refreshHUD(){},sfx(){},celebrate(){},dateStr:()=> 'Jan 1',openModal:(sub,title,body)=>{output=body},
 persuade:()=>{xp+=6;assert(rolls.length,'unexpected skill roll');return rolls.shift()},homeOf:m=>m.home,bumpPlace(){},gainXP:n=>{xp+=n},fmtM:n=>n+'M',fmtK:n=>n+'K',recUp(){}};
vm.createContext(ctx);vm.runInContext(helpers+'\n'+code,ctx);
function start(kind='council',id=0){ctx.dlgStart(kind,id,{label:'Meeting place'},{n:kind==='council'?council.name:kind==='staff'?staff.name:kind==='nb'?nb.name:kind==='vip'?'Marcus Bell':'Working families'},'');}
// Failure -> safe repair keeps the refusal, applies a single relationship boost, and never grants the favor.
rolls=[true,false];start();ctx.dlgChoose(0);ctx.dlgChoose(0);assert.equal(ctx.DLG.r,3);assert.equal(ctx.MODAL_BROWSE,false);assert.match(output,/One chance/);assert.equal(council.favors,undefined);ctx.dlgChoose(1);assert.equal(ctx.DLG,null);assert.equal(council.opinion,3);assert.match(output,/request stays declined/);
// Successful recovery awards exactly one favor; stale or repeated clicks cannot grant another.
rolls=[false,false,true];start();ctx.dlgChoose(0);ctx.dlgChoose(0);ctx.dlgChoose(0);assert.equal(council.favors,1);ctx.dlgChoose(0);assert.equal(council.favors,1);
// Another refusal ends the meeting, rather than allowing unlimited rerolls.
rolls=[true,false,false];start();ctx.dlgChoose(0);ctx.dlgChoose(0);ctx.dlgChoose(0);assert.equal(ctx.DLG,null);assert.equal(council.favors,1);
// Department savings only arrive once, after success. Recovery uses no additional action.
rolls=[true,false,true];start('staff','roads');ctx.dlgChoose(0);ctx.dlgChoose(0);assert.equal(ctx.S.reserve,20);ctx.dlgChoose(0);assert.equal(ctx.S.reserve,20.4);ctx.dlgChoose(0);assert.equal(ctx.S.reserve,20.4);
// Normal win and safe no-ask remain two-round conversations; invalid indexes do nothing.
rolls=[true,true];start();ctx.dlgChoose(99);assert.equal(ctx.DLG.r,1);ctx.dlgChoose(0);ctx.dlgChoose(0);assert.equal(council.favors,2);assert.equal(ctx.DLG,null);
rolls=[true];start();ctx.dlgChoose(0);ctx.dlgChoose(3);assert.equal(ctx.DLG,null);assert.equal(rolls.length,0);
// Render every supported contact type using the real scene helpers.
for(const [kind,id] of [['council',0],['staff','roads'],['nb','bartlett'],['vip','fedex'],['group','working']]){start(kind,id);assert.match(output,/meeting-stage/);assert(!output.includes('undefined'));}
assert(saves>0);assert(xp>0);assert.equal(ctx.dlgEsc('<script>'),'&lt;script&gt;');
console.log('PASS: five contact types, normal success, safe no-ask, failed request, safe repair, one-shot recovery, no duplicate favors or money, invalid clicks, saved changes.');
