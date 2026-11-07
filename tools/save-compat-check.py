import asyncio,subprocess,sys,json
from playwright.async_api import async_playwright
REPO='/home/claude/bluff-city-mayor'
OLD=sys.argv[1]; MODE=sys.argv[2] if len(sys.argv)>2 else 'mayor'
def fix(h):return h.replace('https://cdn.jsdelivr.net/npm/maplibre-gl@4.7.1/dist/maplibre-gl.js','/_ml.js')
async def main():
    old=subprocess.run(['git','show',f'{OLD}:index.html'],cwd=REPO,capture_output=True,text=True).stdout
    open(REPO+'/_old.html','w').write(fix(old))
    open(REPO+'/_new.html','w').write(fix(open(REPO+'/index.html').read()))
    # serve a local MapLibre build at /_ml.js if the CDN is blocked in your environment
    srv=subprocess.Popen(['python3','-m','http.server','8773'],cwd=REPO,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    await asyncio.sleep(1)
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
        ctx=await b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=1)
        pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e: errs.append(str(e)[:300]))
        async def ready():
            for i in range(80):
                if await pg.evaluate("typeof mapReady!=='undefined'&&mapReady&&!document.getElementById('splash')"):return
                await asyncio.sleep(.5)
        await pg.goto('http://localhost:8773/_old.html');await ready()
        await pg.evaluate("localStorage.clear();localStorage.setItem('bcm-nomoneyintro','1');localStorage.setItem('bcm-tutoff','1');localStorage.setItem('bcm-tipsoff','1')")
        await pg.tap('#bNew');await asyncio.sleep(.4);await pg.fill('#cName','Old Save');await pg.evaluate("document.getElementById('cGo').click()");await asyncio.sleep(3)
        await pg.evaluate("try{while(modalOpen)closeModal();choosePromises(['health','jobs','crime']);closePanel()}catch(e){}")
        ver=await pg.evaluate("(document.body.innerHTML.match(/v26\\.\\d+/)||['?'])[0]")
        # play the old version for a while
        r=await pg.evaluate("""(()=>{for(let i=0;i<75;i++){try{while(modalOpen)closeModal();if(!$('panel').hidden)closePanel();S.paused=false;dayTick();S.paused=true}catch(e){return 'olderr '+e.message}}return dateStr()+' approval '+Math.round(S.approval)})()""")
        if MODE=='after':
            r+=' | '+await pg.evaluate("""(()=>{try{while(modalOpen)closeModal();for(const g of GROUPS)S.groups[g.id].app=30;S.elY=S.y;S.m=10;S.day=6;S.camp.voted=false;dayTick();while(modalOpen)closeModal();const b=document.querySelector('[data-after]');if(b)b.click();if(typeof setParty==='function')S.mayor.party='D';const A=afterInit();A.role='congress';A.ev=null;A.rev=null;if(typeof cgX==='function'){const c=cgX();c.committee='ti'}save();return 'after role '+A.role}catch(e){return 'aftererr '+e.message}})()""")
        await pg.evaluate("save()")
        keys=await pg.evaluate("Object.keys(localStorage).filter(k=>/bluffcity/.test(k))")
        olderrs=list(errs);errs.clear()
        # now the current version, same storage
        await pg.goto('http://localhost:8773/_new.html');await ready()
        load=await pg.evaluate("""(()=>{try{const meta=JSON.parse(localStorage.getItem('bluffcity-slots')||'[]');const k=Object.keys(localStorage).find(k=>/bluffcity-slot-\\d/.test(k))||'bluffcity-save-v2';const raw=localStorage.getItem(k);enterLoaded(JSON.parse(raw));return 'loaded '+k+' '+dateStr()+' phase '+S.phase+(S.after?' after '+S.after.role:'')}catch(e){return 'LOADERR '+e.message}})()""")
        await asyncio.sleep(1.5)
        scr=await pg.evaluate("""(()=>{const out=[];const L=['openHoods','openNash','openPowers','openSchemes','openStories','openPress','openDeleg','openFamily','openHealth','openHQ','openOpinion','openLedger'];if(S.after)L.splice(0,L.length,'openAfter','openFamily','openHealth');for(const f of L){try{while(modalOpen)closeModal();window[f]?window[f]():eval(f+'()');out.push(f+':'+($('mTitle')?$('mTitle').textContent.slice(0,20):'?'))}catch(e){out.push(f+' ERR '+e.message)}}while(modalOpen)closeModal();return out.join(' | ')})()""")
        run=await pg.evaluate("""(()=>{let n=0;for(let i=0;i<70;i++){try{while(modalOpen)closeModal();if(!$('panel').hidden)closePanel();if(S.after){if(i%10===0){const A=S.after;A.ev=null;A.rev=null;if(A.cg)A.cg.vote=null;A.cev=null;A.chalAsk=false;if(A.cal)A.cal.p=3;if(A.res){A.res.dc=A.res.dc||'rent';A.res.fam=A.res.fam||'memphis'}afterYear();n++}}else{S.paused=false;dayTick();S.paused=true}}catch(e){return 'RUNERR '+e.message+' at '+i}}return 'ran to '+dateStr()+(S.after?' after role '+S.after.role+' years '+n:' approval '+Math.round(S.approval))})()""")
        print(f'{OLD} ({ver}) {MODE}: old play: {r} | keys {keys} | old-version errors {len(olderrs)}')
        print('  '+load);print('  screens: '+scr);print('  '+run);print('  new-version errors:',errs[:6])
        await b.close()
    srv.terminate()
    import os
    for f in ['_old.html','_new.html']:
        try: os.remove(REPO+'/'+f)
        except: pass
asyncio.run(main())
