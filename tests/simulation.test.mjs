import test from "node:test";
import assert from "node:assert/strict";
import {SCENARIOS,generator,runSuite,runSuiteAsync,validateSimulation,effectLevelRatios,simulateScenario,simulateCells} from "../web/simulation-model.mjs";
test("cooperative browser runner matches synchronous CLI exactly",async()=>{
  assert.deepEqual(await runSuiteAsync({iterations:100}),runSuite({iterations:100}));
});
test("cooperative runner cancels without returning a partial result",async()=>{
  await assert.rejects(runSuiteAsync({iterations:100},()=>{},()=>true),/Cancelled/);
});
test("seeded PRNG is reproducible, finite, and seed zero works",()=>{
  const a=generator(0),b=generator(0);
  for(let i=0;i<1000;i++){assert.equal(a.normal(),b.normal());const u=a.uniform();assert.equal(u,b.uniform());assert.ok(u>0&&u<1);}
});
test("reject invalid simulation inputs",()=>{
  for(const o of [{iterations:99},{iterations:1e6+1},{seed:-1},{seed:2**32},{blocks:2},{blocks:101},{iterations:NaN},{blocks:3.5}])assert.throws(()=>validateSimulation(o));
});
test("same seed produces exact same complete suite",()=>{
  assert.deepEqual(runSuite({iterations:100}),runSuite({iterations:100}));
});
test("equal midpoints with unequal slopes imply response-dependent dose ratios",()=>{
  effectLevelRatios().forEach((x,i)=>assert.ok(Math.abs(x.doseRatioBA-[2,1,.5][i])<1e-12));
  for(const x of effectLevelRatios(1,2,1,1))assert.equal(x.doseRatioBA,2);
  assert.throws(()=>effectLevelRatios(0));
});
test("paired estimates recover truth; historical masking is biased",()=>{
  const r=simulateScenario(SCENARIOS[1],{iterations:10000});
  assert.ok(Math.abs(r.contrasts.historical.geometricMeanEstimate-1)<.02);
  assert.ok(Math.abs(r.contrasts.P.geometricMeanEstimate-2)<.02);
  assert.ok(r.contrasts.historical.coverage95.rate<.1);
  assert.ok(r.contrasts.P.coverage95.rate>.935&&r.contrasts.P.coverage95.rate<.965);
});
test("boundary false-equivalence is approximately alpha or below",()=>{
  const r=simulateScenario(SCENARIOS[4],{iterations:10000});
  assert.equal(r.contrasts.P.truthInsideMargins,false);
  assert.ok(r.contrasts.P.equivalence90.rate>.035&&r.contrasts.P.equivalence90.rate<.065);
});
test("interaction and comparator drift change conditional Q contrast",()=>{
  for(const [i,target] of [[2,1.5],[3,2]]){
    const r=simulateScenario(SCENARIOS[i],{iterations:1000});
    assert.ok(Math.abs(r.contrasts.Q.geometricMeanEstimate-target)<.05);
    assert.ok(Math.abs(r.contrasts.interaction.geometricMeanEstimate-target)<.05);
  }
});
test("noisy equal lots are often nonsignificant but rarely equivalent",()=>{
  const r=simulateScenario(SCENARIOS[5],{iterations:2000});
  assert.ok(r.contrasts.P.containsOne95.rate>.9);
  assert.ok(r.contrasts.P.equivalence90.rate<.1);
});
test("cell Monte Carlo obeys its explicitly bounded mechanism",()=>{
  const r=simulateCells({iterations:1000});
  assert.deepEqual(r.summaries.bindingNoDepletionRatio,{q05:1,median:1,q95:1});
  assert.deepEqual(r.summaries.competitionRatio,{q05:1,median:1,q95:1});
  for(const k of ["bindingFiniteSupplyRatio","reporterRatio","plateauRatio"]){
    const q=r.summaries[k];assert.ok(q.q05>0&&q.q05<q.median&&q.median<q.q95&&q.q95<1);
  }
});
