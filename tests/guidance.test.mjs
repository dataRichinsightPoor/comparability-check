import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {VIEWS,GUIDANCE_ANCHORS,routeForHash} from "../web/navigation-model.mjs";
const html=await readFile(new URL("../web/index.html",import.meta.url),"utf8");
for(const view of VIEWS)test(`view ${view} has a route and unique markup`,()=>{
  assert.deepEqual(routeForHash("#"+view),{view,anchor:view});
  assert.equal((html.match(new RegExp(`id="${view}"`,"g"))||[]).length,1);
  assert.ok(html.includes(`data-view="${view}"`));
});
for(const anchor of GUIDANCE_ANCHORS)test(`guidance anchor ${anchor} resolves to visible parent`,()=>{
  assert.deepEqual(routeForHash("#"+anchor),{view:"guidance",anchor});
  assert.ok(html.includes(`id="${anchor}"`));
});
test("unknown and malformed hash values are not routed",()=>{
  for(const hash of ["",null,"guidance","#unknown","#%E0%A4%A","#guidance-bogus","#<script>"])assert.equal(routeForHash(hash),null);
});
test("all document IDs are unique",()=>{
  const ids=Array.from(html.matchAll(/\bid="([^"]+)"/g),m=>m[1]);
  assert.equal(ids.length,new Set(ids).size);
});
test("all local page anchors target an existing element",()=>{
  for(const [,id] of html.matchAll(/href="#([^"]+)"/g))assert.ok(html.includes(`id="${id}"`),id);
});
test("guidance carries corrected ICH sources, early discovery source and numerical caveats",()=>{
  for(const text of ["Q6B%20Guideline.pdf","Q5E%20Guideline.pdf","ICH_Q2(R2)_Guideline_2023_1130_ErrorCorrection_2025.pdf","ICH_Q14_Guideline_2023_1130_ErrorCorrection_2025.pdf","NBK83783","90% t confidence interval","95% Wilson Monte Carlo intervals","not regulatory acceptance limits"])assert.ok(html.includes(text),text);
});
test("pharma practice distinguishes GMP execution from developmental stage",()=>{
  for(const text of ["Development stage and GMP answer different questions.","Early discovery is not early clinical release.","not from statutory CGMP","https://www.fda.gov/media/119267/download","workshop-introduction-to-bioassay-development.pdf","USPNF_M912_02_01.html"])assert.ok(html.includes(text),text);
});
test("published essay download exactly matches the maintained article",async()=>{
  assert.equal(await readFile(new URL("../web/resources/to-be-or-not-to-be-comparable.md",import.meta.url),"utf8"),
    await readFile(new URL("../docs/COMPANION-ARTICLE.md",import.meta.url),"utf8"));
});
test("all linked downloadable files are bundled",async()=>{
  for(const [,p] of html.matchAll(/href="(resources\/[^"]+)"/g)){
    const file=await readFile(new URL("../web/"+p,import.meta.url));assert.ok(file.length>0,p);
  }
});
test("figure counts and displayed rates match versioned synthetic results",async()=>{
  const rows=JSON.parse(await readFile(new URL("../web/resources/misleading-historical-equivalence-data.json",import.meta.url),"utf8")).rows;
  for(const row of rows){
    const path=row.blocks===8?"results/simulation-results.json":`results/blocks-${row.blocks}/simulation-results.json`;
    const result=JSON.parse(await readFile(new URL("../"+path,import.meta.url),"utf8"));
    const c=result.scenarios.find(x=>x.id==="masked").contrasts.historical.equivalence90;
    assert.equal(row.count,c.count);assert.equal(row.ratePercent,c.rate*100);
    assert.ok(html.includes(row.count.toLocaleString("en-US")));
    assert.ok(html.includes(row.ratePercent.toFixed(3)+"%"));
  }
});
