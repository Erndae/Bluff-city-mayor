const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const elements=new Map(),audios=[],timers=new Map();let tick=0,route={track:'main'},saved,observer;
class Element{constructor(){this.events={};this.hidden=false;}addEventListener(n,f){this.events[n]=f;}querySelector(n){if(!elements.has(n))elements.set(n,new Element());return elements.get(n);}setAttribute(){}focus(){}showModal(){this.open=true;}}
const document=new Element();document.body={append(){}};document.createElement=()=>new Element();document.getElementById=()=>new Element();
let defer=false,pending=[];
class Audio extends Element{constructor(){super();this.paused=true;audios.push(this);}pause(){this.paused=true;}play(){this.paused=false;return defer?new Promise(r=>pending.push(r)):Promise.resolve();}}
const window=new Element();window.bluffMusicContext=()=>route;
vm.runInNewContext(fs.readFileSync('music.js','utf8'),{window,document,Audio,localStorage:{getItem:()=>null,setItem:(k,v)=>saved=JSON.parse(v)},MutationObserver:class{constructor(f){observer=f;}observe(){}},setTimeout:(f,ms)=>{timers.set(++tick,{f,ms});return tick;},clearTimeout:id=>timers.delete(id),console});
const flush=async()=>{await Promise.resolve();await Promise.resolve();};
const active=()=>audios.find(a=>!a.paused&&a.volume>0);
const name=()=>active().src.split('/').pop().split('?')[0];
async function change(next){route=next;observer();for(const [id,t] of [...timers])if(t.ms===450){timers.delete(id);t.f();}await flush();}
(async()=>{
 document.events.pointerdown({isTrusted:true});await flush();
 const first=[];for(let i=0;i<12;i++){assert(active());assert.equal(active().loop,false);first.push(name());active().events.ended();await flush();}
 for(let i=0;i<12;i+=4)assert.equal(new Set(first.slice(i,i+4)).size,4,'every song plays before repeating');
 for(let i=1;i<first.length;i++)assert.notEqual(first[i],first[i-1],'no back-to-back repeats');
 const before=name();elements.get('#musicNext').events.click();await flush();assert.notEqual(name(),before);
 document.hidden=true;document.events.visibilitychange();assert(audios.every(a=>a.paused));document.hidden=false;document.events.visibilitychange();await flush();assert(active());
 await change({track:'victory',event:'win-1'});assert(name().startsWith('05-'));assert(elements.get('#musicNext').disabled);active().events.ended();await flush();assert(!name().startsWith('05-'));await change(route);assert(!name().startsWith('05-'));
 await change({track:'main'});const previous=name();defer=true;await change({track:'council'});await change({track:'main'});defer=false;pending.splice(0).forEach(r=>r());await flush();assert.equal(name(),previous,'returning to original scene cancels a pending transition');
 elements.get('#musicVolume').value=40;elements.get('#musicVolume').events.input();assert.equal(saved.volume,.4);
 elements.get('#musicEnabled').checked=false;elements.get('#musicEnabled').events.change();await flush();assert(audios.every(a=>a.paused));elements.get('#musicEnabled').checked=true;elements.get('#musicEnabled').events.change();await flush();assert(active());
 const manifest=JSON.parse(fs.readFileSync('assets/music/manifest.json'));assert.equal(manifest.tracks.length,8);for(const t of manifest.tracks){const file=fs.readFileSync('assets/music/'+t.file);assert(file.length>100000,t.file+' must contain audio');}
 console.log('PASS: playlist cycles, no consecutive repeats, next song, pause/resume, victory once, transition cancellation, preferences and all eight audio assets.');
})().catch(e=>{console.error(e);process.exitCode=1;});

