import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {WALKTHROUGH_STEPS,walkthroughPair,walkthroughReport,validateWalkthrough} from "../web/walkthrough-model.mjs";
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
for(let i=0;i<WALKTHROUGH_STEPS.length;i++)test(`walkthrough ${i+1}: matched axes, fixed K and complete explanations`,()=>{
  const p=walkthroughPair(i);
  assert.deepEqual(p.before.doses,p.after.doses);
  near(p.before.settings.kd,1);near(p.after.settings.kd,1);
  for(const k of ["changed","fixed","question","answer","establishes","cannot","next"])assert.ok(p.step[k].length>40);
  assert.equal(p.before.curves.raji.length,81);assert.equal(p.after.curves.current.length,81);
});
test("baseline equal by construction",()=>{const p=walkthroughPair(0);near(p.after.states.current.scale,1);near(p.after.states.current.bindingEC50,1);});
test("fraction-only loss halves plateau",()=>{const p=walkthroughPair(1);near(p.before.states.current.scale,1);near(p.after.states.current.scale,.5);near(p.after.states.current.density,100000);});
test("density loss halves plateau again",()=>{const p=walkthroughPair(2);near(p.before.states.current.scale,.5);near(p.after.states.current.scale,.25);near(p.after.states.current.bindingEC50,1);});
test("normalization changes only representation",()=>{
  const p=walkthroughPair(3),a={...p.before.settings},b={...p.after.settings};delete a.plot;delete b.plot;assert.deepEqual(a,b);
  near(p.after.states.current.scale,.25);
  p.after.curves.raji.forEach((v,i)=>near(v.normalized,p.after.curves.current[i].normalized));
});
test("positive gate does not change cell population or mass balance",()=>{const p=walkthroughPair(4);near(p.before.states.current.scale,.25);near(p.after.states.current.scale,.5);near(p.before.states.current.rt,p.after.states.current.rt);});
test("high load paired comparison changes only mass-balance assumption",()=>{
  const p=walkthroughPair(5),a={...p.before.settings},b={...p.after.settings};delete a.depletion;delete b.depletion;assert.deepEqual(a,b);
  assert.ok(p.after.states.raji.bindingEC50>p.after.states.current.bindingEC50);
  assert.ok(p.before.states.raji.bindingDepletionFraction>.1);
});
test("tracer changes competition not binding midpoint",()=>{const p=walkthroughPair(6);near(p.before.states.raji.competitionIC50,2);near(p.after.states.raji.competitionIC50,11);near(p.after.states.current.bindingEC50,1);});
test("generic reporter matches stated numerical outputs and boundary",()=>{const p=walkthroughPair(7);near(p.after.states.raji.functionalIC50,102);near(p.after.states.current.functionalIC50,52);assert.match(p.step.boundary,/NOT CD20/);});
test("walkthrough does not mutate shared base or settings across navigation",()=>{
  const original=JSON.stringify(WALKTHROUGH_STEPS);for(let i=7;i>=0;i--)walkthroughPair(i);assert.equal(JSON.stringify(WALKTHROUGH_STEPS),original);
});
test("report contains all steps, inputs and source boundaries",()=>{
  const text=walkthroughReport();WALKTHROUGH_STEPS.forEach(s=>assert.ok(text.includes(s.title)));
  assert.match(text,/Reproducible parameters/);assert.match(text,/pmc.ncbi.nlm.nih.gov/);assert.match(text,/not rituximab biology/);
  assert.match(text,/Data-Rich, Insight-Poor CCLX · 99 Small Problems · No. 07/);
});
test("repository handout stays synchronized with the downloadable walkthrough",async()=>{
  assert.equal(await readFile(new URL("../docs/GUIDED-WALKTHROUGH.md",import.meta.url),"utf8"),walkthroughReport());
});
for(const value of [null,[],{step:-1},{step:8},{step:.5},{step:"2"},{}])test(`reject malformed walkthrough state ${JSON.stringify(value)}`,()=>assert.throws(()=>validateWalkthrough(value)));
