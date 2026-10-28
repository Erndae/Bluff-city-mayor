const {chromium}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
(async()=>{
  const browser=await chromium.launch({headless:true,channel:'msedge'});
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/favicon.ico',route=>route.fulfill({status:204}));
  page.on('console',m=>{if(m.type()==='error'){errors.push(m.text());console.log(m.text());}});
  await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.BCBuildings && typeof map!=='undefined' && map?.getLayer('places-3d'),null,{timeout:60000});
  await page.evaluate(()=>{beginTerm(newCR());closeModal();document.getElementById('start').hidden=true;S.paused=true;map.jumpTo({center:[LM.cityhall.lon,LM.cityhall.lat],zoom:16,pitch:52});});
  await page.waitForFunction(()=>map.loaded());
  await page.evaluate(()=>{onClose=null;closeModal();closePanel();navReset();});
  const found=await page.evaluate(()=>{
    const p=map.project([LM.cityhall.lon,LM.cityhall.lat]);
    const hit=BCBuildings.hit(p);BCBuildings.select('landmark:cityhall');
    return {name:hit?.properties.name,source:!!map.getSource('named-buildings'),count:document.querySelectorAll('.civ').length};
  });
  assert(found.source);assert.equal(found.count,76);
  fs.mkdirSync('preview',{recursive:true});
  await page.screenshot({path:'preview/city-desktop.png'});
  // Exercise building selection through the same path used by pointer input.
  const clicked=await page.evaluate(()=>{const features=map.queryRenderedFeatures({layers:['places-3d']});for(const f of features){if(f.properties.name==='City Hall'){const ring=f.geometry.coordinates[0];for(const c of ring){const p=map.project(c);if(BCBuildings.click(p))return true;}}}return false;});
  assert(clicked,'A visible named building must be clickable');
  await page.evaluate(()=>{closeModal();openCouncil();});
  await page.screenshot({path:'preview/characters-desktop.png'});
  await page.evaluate(()=>{closeModal();S.layers.bld=false;applyLayers();});
  assert.equal(await page.evaluate(()=>map.getLayoutProperty('places-3d','visibility')),'none');
  await page.evaluate(()=>{S.layers.bld=true;S.mode='political';applyLayers();});
  assert.equal(await page.evaluate(()=>map.getLayoutProperty('places-3d','visibility')),'none');
  await page.evaluate(()=>{S.mode='real';applyLayers();openMayor();});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:'preview/characters-mobile.png'});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  console.log(JSON.stringify({found,errors},null,2));
  await browser.close();
  assert.equal(errors.length,0,'Browser errors');
})().catch(e=>{console.error(e);process.exit(1);});
