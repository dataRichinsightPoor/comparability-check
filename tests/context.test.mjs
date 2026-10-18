import test from "node:test";
import assert from "node:assert/strict";
import {cellState,receptorConcentration,singleBound,competitionState,contextDose,analyzeContext,validateContext} from "../web/context-model.mjs";
const near=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
test("Raji held constant by explicit model assumption",()=>{
  assert.deepEqual(cellState({passage:0},"raji"),cellState({passage:80},"raji"));
});
test("fraction and density drift separately",()=>{
  const c=cellState({passage:20,fractionHalfLife:20,densityHalfLife:20,fraction0:1},"current");
  near(c.fraction,.5);near(c.density,50000);near(c.scale,.25);
});
test("fraction-only retains per-positive density",()=>{
  const c=cellState({passage:20,lossMode:"fraction",fraction0:1},"current");near(c.fraction,.5);near(c.density,100000);
});
test("density-only retains positive fraction",()=>{
  const c=cellState({passage:20,lossMode:"density",fraction0:.8},"current");near(c.fraction,.8);near(c.density,50000);
});
test("no-loss scenario invariant",()=>{
  const a=cellState({passage:0,lossMode:"none"}),b=cellState({passage:100,lossMode:"none"});
  near(a.scale,b.scale);near(a.rt,b.rt);
});
test("Avogadro conversion",()=>near(receptorConcentration(100000,100000,1,100),.16605390671738468,1e-12));
test("saturation half occupancy with depletion",()=>{
  for(const rt of [.01,1,10,100])near(singleBound(2+rt/2,2,rt,true),rt/2);
});
test("depletion-free normalized EC50 unchanged by expression",()=>{
  const r=analyzeContext({depletion:false});
  near(r.states.raji.bindingEC50,1);near(r.states.current.bindingEC50,1);
  assert.ok(r.states.current.scale<r.states.raji.scale);
});
test("density loss with depletion can lower apparent binding EC50",()=>{
  const r=analyzeContext({depletion:true,cells:1e6});
  assert.ok(r.states.current.bindingEC50<r.states.raji.bindingEC50);
});
test("gating can conceal positive fraction loss but not alter chemistry",()=>{
  const a=analyzeContext({lossMode:"fraction",gate:"all"}),b=analyzeContext({lossMode:"fraction",gate:"positive"});
  assert.ok(a.states.current.scale<b.states.current.scale);
  near(a.states.current.rt,b.states.current.rt);
  near(a.states.current.bindingEC50,b.states.current.bindingEC50);
});
test("homologous no-depletion competition IC50 = K + tracer",()=>{
  for(const tracer of [.1,1,10]){const r=analyzeContext({tracer,kd:2});near(r.states.current.competitionIC50,2+tracer,1e-8);}
});
test("tracer changes blocking midpoint not binding",()=>{
  const a=analyzeContext({tracer:.1}),b=analyzeContext({tracer:10});
  near(a.states.current.bindingEC50,b.states.current.bindingEC50);
  assert.ok(b.states.current.competitionIC50>a.states.current.competitionIC50);
});
for(const rt of [.001,.1,1,10,100])for(const c of [0,.1,1,100])
  test(`competition mass conservation RT=${rt} C=${c}`,()=>{
    const q=competitionState(c,1,.7,rt,true);
    near(q.freeReceptor+q.boundTracer+q.boundCompetitor,rt,1e-8);
    near(q.freeTracer+q.boundTracer,1);near(q.freeCompetitor+q.boundCompetitor,c);
    near(q.boundTracer,q.freeReceptor*q.freeTracer/.7,1e-8);
    assert.ok(q.boundTracer>=0&&q.freeTracer>=0&&q.freeCompetitor>=0);
  });
test("competitive IC50 hits modeled half response with depletion",()=>{
  const s={depletion:true,cells:1e7,tracer:.1},r=analyzeContext(s);
  for(const k of ["raji","initial","current"])near(contextDose(s,k,r.states[k].competitionIC50).competition,.5,1e-8);
});
test("generic reporter endpoint is distinct and hits half response",()=>{
  const s={reporterThreshold:1000,reporterHill:1},r=analyzeContext(s);
  assert.ok(r.states.raji.functionalIC50>r.states.raji.competitionIC50);
  near(contextDose(s,"raji",r.states.raji.functionalIC50).functional,.5,1e-8);
});
test("h=1 generic response matches analytic reserve formula",()=>{
  const s={kd:2,tracer:3,reporterThreshold:10000,reporterHill:1,depletion:false};
  const r=analyzeContext(s);
  for(const k of ["raji","initial","current"]){
    const occupied=r.states[k].density*s.tracer/(s.kd+s.tracer);
    near(r.states[k].functionalIC50,(s.kd+s.tracer)*(1+occupied/s.reporterThreshold),1e-8);
  }
});
test("depletion solution matches combined equal-affinity ligand solution",()=>{
  for(const rt of [.1,1,10])for(const c of [.1,1,10]){
    const q=competitionState(c,2,1,rt,true),bound=singleBound(c+2,1,rt,true);
    near(q.boundTracer+q.boundCompetitor,bound);near(q.boundTracer/bound,2/(2+c));
  }
});
test("depletion diagnostic exists when approximation is selected",()=>{
  const r=analyzeContext({depletion:false,cells:1e7});
  assert.ok(r.states.raji.bindingDepletionFraction>.1);
  assert.ok(r.states.raji.exactBaselineTracerDepletion>.1);
  near(r.states.raji.bindingEC50,1);
});
test("diagnostic matches depletion enabled without changing selected mode",()=>{
  const a=analyzeContext({depletion:false}),b=analyzeContext({depletion:true});
  near(a.states.raji.exactBaselineTracerDepletion,b.states.raji.tracerDepletion);
  near(a.states.raji.bindingDepletionFraction,b.states.raji.rt/(2+b.states.raji.rt));
});
test("low cell load passes the diagnostic heuristic",()=>{
  const r=analyzeContext({cells:100});
  assert.ok(r.states.raji.bindingDepletionFraction<.1);
  assert.ok(r.states.raji.exactBaselineTracerDepletion<.1);
});
test("falling density reduces generic reserve without changing site K",()=>{
  const a=analyzeContext({passage:0,reporterThreshold:1000}),b=analyzeContext({passage:60,reporterThreshold:1000});
  near(a.states.current.bindingEC50,b.states.current.bindingEC50);
  assert.ok(b.states.current.functionalIC50<a.states.current.functionalIC50);
});
test("same fraction loss cancels normalized curves without depletion",()=>{
  const r=analyzeContext({lossMode:"fraction",depletion:false});
  near(r.states.current.competitionIC50,r.states.initial.competitionIC50);
  near(r.states.current.functionalIC50,r.states.initial.functionalIC50);
});
test("zero positive cells removes measurable endpoints",()=>{
  const r=analyzeContext({fraction0:0});
  assert.equal(r.states.current.bindingEC50,null);assert.equal(r.states.current.competitionIC50,null);
  assert.equal(r.curves.current[0].normalized,null);assert.equal(r.states.current.lowSignal,true);
});
test("complete expression underflow treated as no target",()=>{
  const r=analyzeContext({passage:200,densityHalfLife:.01,fractionHalfLife:.01});
  assert.equal(r.states.current.rt,0);assert.equal(r.states.current.bindingEC50,null);
});
test("model flags low signal without inventing precision",()=>{
  const r=analyzeContext({passage:100});assert.equal(r.states.current.lowSignal,true);assert.ok(r.states.current.bindingEC50>0);
});
test("binding increases and blocking increases with competitor",()=>{
  const r=analyzeContext({depletion:true});
  for(const k of ["raji","initial","current"]){
    const p=r.curves[k];
    for(let i=1;i<p.length;i++){assert.ok(p[i].binding>=p[i-1].binding);assert.ok(p[i].competition>=p[i-1].competition-1e-12);}
  }
});
for(const x of [null,[],"bad",{passage:-1},{fraction0:1.1},{kd:0},{tracer:0},{volume:0},{gate:"median"},{lossMode:"integration-proven"},{depletion:"yes"},{plot:"clinical"},{reporterHill:20}])
  test(`context rejects ${JSON.stringify(x)}`,()=>assert.throws(()=>validateContext(x)));
