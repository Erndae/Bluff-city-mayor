import asyncio,subprocess,sys,time
from playwright.async_api import async_playwright
REPO='/home/claude/bluff-city-mayor'
async def main():
    open(REPO+'/_new.html','w').write(open(REPO+'/index.html').read().replace('https://cdn.jsdelivr.net/npm/maplibre-gl@4.7.1/dist/maplibre-gl.js','/_ml.js'))
    srv=subprocess.Popen(['python3','-m','http.server','8774'],cwd=REPO,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);await asyncio.sleep(1)
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--enable-precise-memory-info'])
        ctx=await b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=1)
        pg=await ctx.new_page();cdp=await ctx.new_cdp_session(pg);rate=int(sys.argv[1]) if len(sys.argv)>1 else 4
        await cdp.send('Emulation.setCPUThrottlingRate',{'rate':rate})
        t0=time.time();await pg.goto('http://localhost:8774/_new.html')
        dcl=await pg.evaluate("performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd|0")
        for i in range(200):
            if await pg.evaluate("typeof mapReady!=='undefined'&&mapReady&&!document.getElementById('splash')"):break
            await asyncio.sleep(.25)
        tr=time.time()-t0
        await pg.evaluate("localStorage.clear();localStorage.setItem('bcm-nomoneyintro','1');localStorage.setItem('bcm-tutoff','1');localStorage.setItem('bcm-tipsoff','1')")
        await pg.tap('#bNew');await asyncio.sleep(.4);await pg.fill('#cName','Perf');t1=time.time();await pg.evaluate("document.getElementById('cGo').click()");await asyncio.sleep(2)
        await pg.evaluate("try{while(modalOpen)closeModal();choosePromises(['health','jobs','crime']);closePanel()}catch(e){}")
        r=await pg.evaluate("""(()=>{const o={};const t=f=>{const a=performance.now();try{f()}catch(e){return 'ERR'}return Math.round(performance.now()-a)};
          const days=[];for(let i=0;i<60;i++){while(modalOpen)closeModal();if(!$('panel').hidden)closePanel();const a=performance.now();S.paused=false;dayTick();S.paused=true;days.push(performance.now()-a)}days.sort((a,b)=>a-b);
          o.dayMedian=Math.round(days[30]);o.dayP90=Math.round(days[54]);o.dayMax=Math.round(days[59]);
          for(const f of ['openHoods','openPowers','openHQ','openOpinion','openFamily','openNash']){while(modalOpen)closeModal();o[f]=t(()=>window[f]())}while(modalOpen)closeModal();
          o.save=t(()=>save());o.saveKB=Math.round(JSON.stringify(S).length/1024);o.heapMB=performance.memory?Math.round(performance.memory.usedJSHeapSize/1048576):'?';o.domNodes=document.getElementsByTagName('*').length;return o})()""")
        print(f'CPU x{rate}: DOMContentLoaded {dcl}ms, map ready {tr:.1f}s')
        print(' ',r)
        await b.close()
    srv.terminate();import os;os.remove(REPO+'/_new.html')
asyncio.run(main())
