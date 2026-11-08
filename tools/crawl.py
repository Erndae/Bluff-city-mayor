import asyncio,subprocess,sys,json,time
from playwright.async_api import async_playwright
SC='/tmp/claude-0/-home-claude/11b30518-df11-544a-a55a-769570a39ecd/scratchpad/'
MODE=sys.argv[1] if len(sys.argv)>1 else 'mayor'
ONLY=sys.argv[2].split(',') if len(sys.argv)>2 and sys.argv[2]!='all' else None
PORT=sys.argv[3] if len(sys.argv)>3 else '8772'
# screens: name, view ('desk','map', or an HD view), opener js, root selector
MAYOR=[
 ('desk','desk',"HD.view='desk';renderHomeDesk(true)",'#homeDesk'),
 ('desk-more','desk',"HD.view='desk';HD.more=true;renderHomeDesk(true)",'#homeDesk .hd-sheet'),
 ('districts','desk',"HD.view='board';renderHomeDesk(true)",'#homeDesk .hd-body'),
 ('district-3','desk',"HD.view='dist';HD.dist=3;renderHomeDesk(true)",'#homeDesk .hd-body'),
 ('map-hud','map',"hdSetView(false)",'.hud-top'),
 ('map-bar','map',"hdSetView(false)",'nav.actions'),
 ('actions','desk',"openActions()",'#modal'),
 ('budget','desk',"openBudget()",'#modal'),
 ('council','desk',"openCouncil()",'#modal'),
 ('schools','desk',"openSchools()",'#modal'),
 ('tourism','desk',"openTourism()",'#modal'),
 ('hoods','desk',"openHoods()",'#modal'),
 ('rankings','desk',"openRankings()",'#modal'),
 ('opinion','desk',"openOpinion()",'#modal'),
 ('news','desk',"openNews()",'#modal'),
 ('hq','desk',"openHQ()",'#modal'),
 ('platform','desk',"openPlatform()",'#modal'),
 ('policies','desk',"openPolicies()",'#modal'),
 ('cabinet','desk',"openCabinet()",'#modal'),
 ('finances','desk',"openFinances()",'#modal'),
 ('household','desk',"openHousehold()",'#modal'),
 ('shop','desk',"openShop()",'#modal'),
 ('bank','desk',"openBank()",'#modal'),
 ('ledger','desk',"openLedger()",'#modal'),
 ('help','desk',"openHelp()",'#modal'),
 ('legacy','desk',"openLegacy()",'#modal'),
 ('look','desk',"openLook()",'#modal'),
 ('family','desk',"openFamily()",'#modal'),
 ('family-set','desk',"famSet('marriedkids');openFamily()",'#modal'),
 ('character','desk',"openMayor()",'#panel'),
 ('cityhall','desk',"openPlace('cityhall')",'#panel'),
 ('district-panel','desk',"openDistrict(4)",'#panel'),
 ('desk-old','desk',"openDesk()",'#modal'),
 ('menu','desk',"document.getElementById('bMenu').click()",'#modal'),
 ('policies-p','desk',"openPolicies()",'#panel'),
 ('ledger-p','desk',"openLedger()",'#panel'),
 ('desk-p','desk',"openDesk()",'#panel'),
 ('home-room','desk',"enterHome()",'#home-interior'),
 ('office-room','desk',"enterOffice()",'#home-interior'),
 ('phone','desk',"openDevice('phone')",'#modal'),
 ('laptop','desk',"openDevice('laptop')",'#modal'),
]
AFTER_PRE="S.phase='cand';afterStart();setParty('D');while(modalOpen)closeModal();"
AFTER=[
 ('after-choose','desk',"",'#homeDesk'),
]
def after_role(role,extra=''):
  return [
   (f'{role}-desk','desk',"HD.view='after';renderHomeDesk(true)",'#homeDesk'),
   (f'{role}-actions','desk',"openActions()",'#modal'),
   (f'{role}-more','desk',"HD.view='after';HD.more=true;renderHomeDesk(true)",'#homeDesk .hd-sheet'),
   (f'{role}-districts','desk',"HD.view='board';renderHomeDesk(true)",'#homeDesk .hd-body'),
   (f'{role}-district','desk',"HD.view='dist';HD.dist=3;renderHomeDesk(true)",'#homeDesk .hd-body'),
   (f'{role}-maphud','map',"hdSetView(false)",'.hud-top'),
   (f'{role}-mapbar','map',"hdSetView(false)",'nav.actions'),
  ]
async def main():
    srv=subprocess.Popen(['python3','-m','http.server',PORT],cwd='/home/claude/bcm',stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    await asyncio.sleep(1)
    html=open('/home/claude/bcm/index.html').read().replace('https://cdn.jsdelivr.net/npm/maplibre-gl@4.7.1/dist/maplibre-gl.js','/_ml.js')
    open(f'/home/claude/bcm/_crawl_{PORT}.html','w').write('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+html+'</body></html>')
    out=[]
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
        ctx=await b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=1)
        pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e: errs.append(str(e)[:200]))
        pg.on('dialog',lambda d: asyncio.ensure_future(d.dismiss()))
        await pg.goto(f'http://localhost:{PORT}/_crawl_{PORT}.html')
        for i in range(60):
            if await pg.evaluate("typeof mapReady!=='undefined'&&mapReady&&!document.getElementById('splash')"):break
            await asyncio.sleep(.5)
        await pg.evaluate("localStorage.clear();localStorage.setItem('bcm-nomoneyintro','1');localStorage.setItem('bcm-tutoff','1')")
        await pg.tap('#bNew');await asyncio.sleep(.4);await pg.fill('#cName','Crawl Mayor');await pg.evaluate(("CR.run=true;renderCreate();" if MODE=='cand' else "")+"document.getElementById('cGo').click()");await asyncio.sleep(3)
        await pg.evaluate("while(modalOpen)closeModal();choosePromises(['health','jobs','crime']);closePanel();document.querySelectorAll('#notes .note-card').forEach(n=>n.remove())");await asyncio.sleep(.3)
        await pg.evaluate(open(SC+'crawl_js.js').read())
        screens=MAYOR
        if MODE=='cand':
            screens=[x for x in MAYOR if x[0] not in ('budget','cabinet','policies','schools','tourism','district-panel')]+[('cand-actions','desk',"openCandActions()",'#modal')]
        if MODE.startswith('after'):
            role=MODE.split(':')[1] if ':' in MODE else None
            await pg.evaluate(AFTER_PRE);await asyncio.sleep(.5)
            if role:
                await pg.evaluate(f"chooseRole('{role}');while(modalOpen)closeModal();HD.view='after';renderHomeDesk(true)");await asyncio.sleep(.6)
                screens=after_role(role)
            else: screens=AFTER
        if ONLY: screens=[s for s in screens if s[0] in ONLY]
        base=await pg.evaluate("__snap()")
        t0=time.time()
        for name,view,opener,root in screens:
            async def openit():
                await pg.evaluate(f"__restore({json.dumps(base)},{json.dumps(view)})")
                if view=='map': await pg.evaluate("hdSetView(false)")
                if opener:
                    try: await pg.evaluate(opener)
                    except Exception as e: return str(e)[:150]
                await asyncio.sleep(1.2 if ('Home(' in opener or 'Office(' in opener) else .25)
                return None
            e0=len(errs);er=await openit()
            if er or len(errs)>e0:
                out.append({'screen':name,'open_error':er or errs[e0:]});print('OPEN FAIL',name,er or errs[e0:],flush=True);continue
            labels=await pg.evaluate(f"__buttons({json.dumps(root)}).map(__label)")
            res={'screen':name,'n':len(labels),'dead':[],'errors':[],'mismatch':0,'go':[]}
            for i,lab in enumerate(labels):
                if time.time()-t0>5000: break
                await openit()
                cur=await pg.evaluate(f"__buttons({json.dumps(root)}).map(__label)")
                if i>=len(cur) or cur[i]!=lab:
                    res['mismatch']+=1
                    if lab in cur: idx=cur.index(lab)
                    elif i<len(cur): idx=i;lab=cur[i]
                    else: continue
                else: idx=i
                s0=await pg.evaluate("__sig()");e0=len(errs)
                try:
                    kind=await pg.evaluate(f"(()=>{{const b=__buttons({json.dumps(root)})[{idx}];if(b.tagName==='SELECT'){{const o=b.options;if(o.length>1){{b.selectedIndex=(b.selectedIndex+1)%o.length;b.dispatchEvent(new Event('change',{{bubbles:true}}));b.dispatchEvent(new Event('input',{{bubbles:true}}))}}return 'select'}}b.click();return 'click'}})()")
                except Exception as ex:
                    res['errors'].append([lab,'click threw: '+str(ex)[:150]]);continue
                await asyncio.sleep(.45)
                s1=await pg.evaluate("__sig()")
                if len(errs)>e0: res['errors'].append([lab,errs[e0:]])
                if s0==s1: res['dead'].append(lab)
                res['go'].append([lab,await pg.evaluate('__where()')])
            out.append(res)
            print(f"{name}: {res['n']} buttons, dead {len(res['dead'])}, errors {len(res['errors'])}, mismatch {res['mismatch']}",flush=True)
        await b.close()
    srv.terminate()
    json.dump(out,open(SC+f'crawl_{MODE.replace(":","_")}.json','w'),indent=1)
asyncio.run(main())
