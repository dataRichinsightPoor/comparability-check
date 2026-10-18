import test from "node:test";
import assert from "node:assert/strict";
import {historical,parseCSV,studentCDF,studentQuantile,summarizeLogs,intervalInside,analyzeBridge,PRESETS} from "../web/model.mjs";
const near=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
test("historical ratio is descriptive, never identified",()=>{
  const h=historical(4,1,1);near(h.observedRatio,.25);near(h.conditionalLotRatio,.25);assert.equal(h.identifiable,false);
});
for(const [m,lot] of [[1,.25],[.25,1],[.5,.5],[.125,2]])
  test(`confounding alternative multiplier=${m}`,()=>near(historical(4,1,m).conditionalLotRatio,lot));
for(const x of [0,-1,NaN,Infinity,"4",null])
  test(`reject bad numeric input ${String(x)}`,()=>assert.throws(()=>historical(x,1,1)));
test("reject numerical overflow",()=>assert.throws(()=>historical(1e-300,1e300,1)));
test("CSV parse accepts whitespace CRLF BOM",()=>assert.equal(parseCSV("\ufeffrun,AP,BP,AQ,BQ\r\n a, 4, 4, 1, 1 ").length,1));
for(const csv of [
  "", "run,A,B\nr,1,2", "run,AP,BP,AQ,BQ", "run,AP,BP,AQ,BQ\nr,4,,1,1",
  "run,AP,BP,AQ,BQ\nr,4,>4,1,1","run,AP,BP,AQ,BQ\nr,4,0,1,1",
  "run,AP,BP,AQ,BQ\nr,4,NaN,1,1","run,AP,BP,AQ,BQ\nr,4,Infinity,1,1",
  "run,AP,BP,AQ,BQ\nr,4,1,1,1\nr,4,1,1,1",
  "run,AP,BP,AQ,BQ\nr,4,0x10,1,1",
  'run,AP,BP,AQ,BQ\n"r",4,1,1,1'
])test(`strict CSV rejection ${csv.slice(-30)}`,()=>assert.throws(()=>parseCSV(csv)));
// Reference values from scipy.stats.t.ppf, retained at full useful precision.
for(const [df,p,want] of [[1,.95,6.313751514800932],[2,.95,2.919985580355516],[5,.95,2.0150483733330233],[5,.975,2.570581835636314],[10,.975,2.2281388519649385],[30,.95,1.6972608865939574],[999,.975,1.9623414611334487]])
  test(`Student t quantile df=${df} p=${p}`,()=>near(studentQuantile(p,df),want,1e-8));
test("Student t symmetry",()=>{near(studentCDF(0,5),.5);near(studentCDF(-2,5),1-studentCDF(2,5));near(studentQuantile(.025,5),-studentQuantile(.975,5));});
test("bad t parameters rejected",()=>{assert.throws(()=>studentQuantile(1,5));assert.throws(()=>studentCDF(0,0));});
test("one block withholds uncertainty",()=>assert.equal(summarizeLogs([0]).ci90,null));
test("zero variance withholds equivalence",()=>assert.equal(summarizeLogs([0,0,0]).ci90,null));
test("negative log means valid",()=>near(summarizeLogs([-2,-1]).estimate,Math.exp(-1.5)));
test("CI strict boundary, missing, inside and outside",()=>{
  assert.equal(intervalInside([.9,1.1],.8,1.25),true);
  assert.equal(intervalInside([.8,1.1],.8,1.25),false);
  assert.equal(intervalInside([.9,1.3],.8,1.25),false);
  assert.equal(intervalInside(null,.8,1.25),null);
});
test("invalid margins fail",()=>{assert.throws(()=>intervalInside(null,1.1,1.25));assert.throws(()=>intervalInside(null,.8,.9));});
test("common-shift preset meets exploratory margins",()=>{
  const r=analyzeBridge(parseCSV(PRESETS.common));
  assert.equal(r.n,6);
  for(const k of ["P","Q","interaction"]){assert.equal(r[k].withinMargins,true);assert.equal(r[k].decision,"Within exploratory margins");}
});
test("qualification changes language not statistics",()=>{
  const a=analyzeBridge(parseCSV(PRESETS.common)),b=analyzeBridge(parseCSV(PRESETS.common),{qualified:true});
  assert.deepEqual(a.P.ci90,b.P.ci90);assert.equal(b.P.decision,"Conditional equivalence supported");
});
test("interaction preset changes contrast",()=>{
  const r=analyzeBridge(parseCSV(PRESETS.interaction));
  assert.equal(r.P.withinMargins,true);assert.equal(r.Q.withinMargins,false);assert.equal(r.interaction.withinMargins,false);
  assert.ok(r.interaction.ci95[1]<1);
});
test("imprecision does not become equivalence",()=>{
  const r=analyzeBridge(parseCSV(PRESETS.imprecise));assert.equal(r.P.withinMargins,false);assert.equal(r.Q.withinMargins,false);
});
test("geometric rather than arithmetic mean ratio",()=>{
  const r=analyzeBridge([{run:"1",AP:1,BP:1,AQ:1,BQ:1},{run:"2",AP:1,BP:4,AQ:1,BQ:2}]);near(r.P.estimate,2);
});
test("shared unit rescaling invariant",()=>{
  const rows=parseCSV(PRESETS.common), a=analyzeBridge(rows);
  const b=analyzeBridge(rows.map(r=>({...r,AP:r.AP*1000,BP:r.BP*1000,AQ:r.AQ*1000,BQ:r.BQ*1000})));
  near(a.interaction.estimate,b.interaction.estimate);near(a.P.ci90[0],b.P.ci90[0]);
});
test("method common multipliers cancel from lot contrasts",()=>{
  const rows=parseCSV(PRESETS.common),a=analyzeBridge(rows);
  const b=analyzeBridge(rows.map(r=>({...r,AP:r.AP*7,BP:r.BP*7,AQ:r.AQ*.1,BQ:r.BQ*.1})));
  near(a.interaction.estimate,b.interaction.estimate);
});
test("paired interaction preserves covariance",()=>{
  const rows=parseCSV(PRESETS.common),r=analyzeBridge(rows);
  const expected=summarizeLogs(rows.map(x=>Math.log(x.BQ)-Math.log(x.AQ)-Math.log(x.BP)+Math.log(x.AP)));
  near(r.interaction.se,expected.se);
});
test("all identical block contrasts do not produce equivalence",()=>{
  const r=analyzeBridge([{run:"1",AP:4,BP:4,AQ:1,BQ:1},{run:"2",AP:8,BP:8,AQ:2,BQ:2}],{qualified:true});
  assert.equal(r.P.withinMargins,null);assert.equal(r.interaction.decision,"Uncertainty unavailable");
});
test("direct API rejects duplicate runs and absent cells",()=>{
  assert.throws(()=>analyzeBridge([{run:"1",AP:1,BP:1,AQ:1,BQ:1},{run:"1",AP:1,BP:1,AQ:1,BQ:1}]));
  assert.throws(()=>analyzeBridge([{run:"1",AP:1,BP:1,AQ:1}]));
});
test("separate interaction margins",()=>{
  const a=analyzeBridge(parseCSV(PRESETS.common),{interactionLower:.9999,interactionUpper:1.0001});
  assert.equal(a.P.withinMargins,true);assert.equal(a.interaction.withinMargins,false);
});
