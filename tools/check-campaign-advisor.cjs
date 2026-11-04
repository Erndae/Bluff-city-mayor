const assert=require('node:assert/strict'),{build}=require('../campaign-advisor.js');
const base={slots:3,cash:80,burn:6,days:80,manager:'field',needsPlatform:false,goals:3,organizers:1,supporters:true,callsReady:true,callYield:6,fundraiserReady:true,speechReady:true,pollAge:3,endorse:null,ad:{title:'Introduction',gain:1.2},adCost:40,liveDebate:null,prepReady:true,districts:[{d:1,vote:18,ready:true},{d:2,vote:47,ready:true},{d:3,vote:53,ready:true},{d:4,vote:70,ready:true}]};
let p=build(base);assert.equal(p.ranked[0].d,2);assert(p.moves.find(m=>m.key==='doors:2'));assert(!p.moves.some(m=>m.key==='doors:1'),'Do not automatically target weakest');
p=build({...base,slots:0,cash:0});assert(p.moves.every(m=>m.action===0&&m.cash===0));assert(!p.moves.some(m=>/^(doors:|endorse:|fundraiser|prep|ads|poll|office:|organizer)/.test(m.key)));assert.equal(p.moves[0].key,'calls');
p=build({...base,slots:0,cash:0,callsReady:false,speechReady:false});assert.equal(p.moves.length,1);assert.equal(p.moves[0].key,'wait');
p=build({...base,cash:35,burn:10});assert(!p.moves.some(m=>m.key==='ads'),'Keep next payroll');assert(!p.moves.some(m=>m.key==='organizer'||m.key.startsWith('office:')),'Do not recommend unaffordable recurring costs');
p=build({...base,days:200,cash:400});assert(!p.moves.some(m=>['ads','organizer'].includes(m.key)||m.key.startsWith('office:')),'Avoid early spending advice');
p=build({...base,districts:base.districts.map(d=>({...d,ready:false})),fundraiserReady:false,pollAge:0,prepReady:false});assert(!p.moves.some(m=>m.key.startsWith('doors:')));
p=build({...base,districts:[{d:1,vote:15,ready:true},{d:2,vote:28,ready:true}]});assert.equal(p.ranked[0].d,2);assert(p.moves.find(m=>m.key==='doors:2').why.includes('long shot'));
p=build({...base,goals:6});assert(p.warning.includes('6 distinct goals'));assert(p.warning.includes('Reaffirm'));assert(p.moves.find(m=>m.key==='doors:2').why.includes('overpromising'));
p=build({...base,cash:0,liveDebate:'1'});assert.equal(p.moves[0].key,'debate:1');assert.equal(p.moves[0].action,0);
p=build({...base,needsPlatform:true});assert.equal(p.moves[0].key,'platform');assert(!p.moves.some(m=>m.key.startsWith('doors:')));
for(const cash of [0,5,20,50,200])for(const slots of [0,1,4])for(const days of [7,90,200]){const x={...base,cash,slots,days},r=build(x);assert(r.moves.every(m=>m.action<=slots&&m.cash<=cash));assert.equal(new Set(r.moves.map(m=>m.key)).size,r.moves.length);}
console.log('PASS: competitive targeting, honest long shots, cash/action limits, payroll reserve, recurring costs, timing, cooldowns, promise warnings, platform and live debate priority, and deterministic unique moves');

const html=require("node:fs").readFileSync("index.html","utf8");assert(html.includes('src="campaign-advisor.js?v=26.55"'));assert(html.indexOf('src="campaign-advisor.js')>html.indexOf('src="campaign-districts.js'));
