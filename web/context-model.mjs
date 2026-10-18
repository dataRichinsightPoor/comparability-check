/**
 * Synthetic cell-context and assay-endpoint model.
 * One-site, mutually exclusive equilibrium binding; NOT a full-length
 * rituximab avidity model, inferred integration mechanism, or CD20 signaling model.
 * Concentrations: nM; volumes: microliters; density: accessible sites/positive cell.
 */
import {positive} from "./model.mjs";
const NA=6.02214076e23;
export const CONTEXT_DEFAULTS={
  passage:20,lossMode:"both",fraction0:.95,fractionHalfLife:20,densityHalfLife:20,
  rajiDensity:100000,engineeredDensity:100000,cells:100000,volume:100,
  kd:1,tracer:1,depletion:false,gate:"all",signalFloor:.05,
  plot:"absolute",reporterThreshold:20000,reporterHill:1
};
function nonnegative(x,name){
  if(typeof x!=="number"||!Number.isFinite(x)||x<0)throw new Error(`${name} must be finite and nonnegative.`);
  return x;
}
export function validateContext(input={}){
  if(input===null||typeof input!=="object"||Array.isArray(input))throw new Error("Cell-context settings must be an object.");
  const s={...CONTEXT_DEFAULTS,...input};
  nonnegative(s.passage,"Passage");
  if(s.passage>200)throw new Error("Passage must not exceed 200.");
  if(!["both","fraction","density","none"].includes(s.lossMode))throw new Error("Unknown expression-loss mode.");
  nonnegative(s.fraction0,"Initial positive fraction");
  if(s.fraction0>1)throw new Error("Positive fraction must be between 0 and 1.");
  for(const k of ["fractionHalfLife","densityHalfLife","rajiDensity","engineeredDensity","cells","volume","kd","tracer","signalFloor","reporterThreshold","reporterHill"])positive(s[k],k);
  if(s.signalFloor>=1)throw new Error("Signal floor must be below 1.");
  if(s.reporterHill>8)throw new Error("Reporter Hill exponent must not exceed 8.");
  if(s.kd<1e-6||s.kd>1e6||s.tracer<1e-6||s.tracer>1e6)throw new Error("K and tracer must be 1e-6 to 1e6 nM.");
  if(s.rajiDensity>1e8||s.engineeredDensity>1e8||s.cells>1e9||s.volume<.01||s.volume>1e6)throw new Error("Cell density or volume outside the supported teaching range.");
  if(typeof s.depletion!=="boolean")throw new Error("Depletion setting must be boolean.");
  if(!["all","positive"].includes(s.gate))throw new Error("Unknown signal population.");
  if(!["absolute","normalized","competition","functional"].includes(s.plot))throw new Error("Unknown plot endpoint.");
  return s;
}
export function receptorConcentration(cells,density,fraction,volume){
  positive(cells);nonnegative(density,"Density");nonnegative(fraction,"Fraction");positive(volume);
  if(fraction>1)throw new Error("Fraction must not exceed 1.");
  return cells*density*fraction/(volume*1e-6*NA)*1e9;
}
export function cellState(input,kind="current"){
  const s=validateContext(input);
  if(!["raji","initial","current"].includes(kind))throw new Error("Unknown cell context.");
  const passage=kind==="current"?s.passage:0;
  const fraction=kind==="raji"?1:s.fraction0*(["fraction","both"].includes(s.lossMode)?2**(-passage/s.fractionHalfLife):1);
  const density=kind==="raji"?s.rajiDensity:s.engineeredDensity*(["density","both"].includes(s.lossMode)?2**(-passage/s.densityHalfLife):1);
  const rt=receptorConcentration(s.cells,density,fraction,s.volume);
  const scale=s.gate==="positive"?(fraction>0?density/s.rajiDensity:0):fraction*density/s.rajiDensity;
  return {kind,passage,fraction,density,rt,scale};
}
export function singleBound(total,k,rt,depletion=true){
  nonnegative(total,"Total concentration");positive(k);nonnegative(rt,"Receptor concentration");
  if(total===0||rt===0)return 0;
  if(!depletion)return rt*total/(k+total);
  const sum=rt+total+k;
  const root=Math.sqrt((rt-total)**2+2*k*(rt+total)+k*k);
  return 2*rt*total/(sum+root);
}
export function competitionState(competitor,tracer,k,rt,depletion=true){
  nonnegative(competitor,"Competitor");positive(tracer);positive(k);nonnegative(rt,"Receptor concentration");
  if(rt===0)return {freeReceptor:0,boundTracer:0,boundCompetitor:0,freeTracer:tracer,freeCompetitor:competitor};
  if(!depletion){
    const denom=1+tracer/k+competitor/k,freeReceptor=rt/denom;
    return {freeReceptor,boundTracer:rt*(tracer/k)/denom,boundCompetitor:rt*(competitor/k)/denom,freeTracer:tracer,freeCompetitor:competitor};
  }
  // Equal-affinity homologous tracer/competitor. Receptor conservation is
  // monotonic in free receptor R: RT = R + LT*R/(K+R) + CT*R/(K+R).
  let lo=0,hi=rt;
  for(let i=0;i<100;i++){
    const r=(lo+hi)/2,used=r+tracer*r/(k+r)+competitor*r/(k+r);
    if(used>rt)hi=r;else lo=r;
  }
  const r=(lo+hi)/2,bt=tracer*r/(k+r),bc=competitor*r/(k+r);
  return {freeReceptor:r,boundTracer:bt,boundCompetitor:bc,freeTracer:tracer-bt,freeCompetitor:competitor-bc};
}
export function hillResponse(occupiedSites,threshold,hill){
  nonnegative(occupiedSites,"Occupied sites");positive(threshold);positive(hill);
  if(occupiedSites===0)return 0;
  return 1/(1+Math.exp(hill*(Math.log(threshold)-Math.log(occupiedSites))));
}
function doseValues(c,s,cell){
  if(cell.rt===0)return {binding:0,normalized:null,competition:null,functional:null,tracerSignal:0,reporterSignal:0};
  const occ=singleBound(c,s.kd,cell.rt,s.depletion)/cell.rt;
  const base=competitionState(0,s.tracer,s.kd,cell.rt,s.depletion).boundTracer;
  const tracer=competitionState(c,s.tracer,s.kd,cell.rt,s.depletion).boundTracer;
  const r0=hillResponse(cell.density*base/cell.rt,s.reporterThreshold,s.reporterHill);
  const rc=hillResponse(cell.density*tracer/cell.rt,s.reporterThreshold,s.reporterHill);
  const population=s.gate==="positive"?1:cell.fraction;
  return {
    binding:cell.scale*occ,normalized:occ,
    competition:1-tracer/base,functional:r0>0?1-rc/r0:null,
    tracerSignal:cell.scale*tracer/cell.rt,reporterSignal:population*rc
  };
}
export function contextDose(input,kind,c){
  nonnegative(c,"Dose");
  const s=validateContext(input);
  return doseValues(c,s,cellState(s,kind));
}
function midpoint(fn,scale){
  let lo=0,hi=scale;
  for(let i=0;fn(hi)<.5;i++){
    hi*=10;if(i>30||!Number.isFinite(hi))throw new Error("Model midpoint outside supported range.");
  }
  for(let i=0;i<90;i++){const mid=(lo+hi)/2;if(fn(mid)<.5)lo=mid;else hi=mid;}
  return (lo+hi)/2;
}
export function analyzeContext(input={}){
  const s=validateContext(input),states={};
  for(const kind of ["raji","initial","current"]){
    const cell=cellState(s,kind),base=doseValues(0,s,cell);
    const bindingEC50=cell.rt>0?s.kd+(s.depletion?cell.rt/2:0):null;
    const competitionIC50=cell.rt>0?midpoint(c=>doseValues(c,s,cell).competition,s.kd+s.tracer+cell.rt):null;
    const functionalIC50=cell.rt>0?midpoint(c=>doseValues(c,s,cell).functional,s.kd+s.tracer+cell.rt):null;
    const tracerDepletion=cell.rt>0&&s.depletion?competitionState(0,s.tracer,s.kd,cell.rt,true).boundTracer/s.tracer:0;
    const bindingDepletionFraction=cell.rt/(2*s.kd+cell.rt);
    const exactBaselineTracerDepletion=cell.rt>0?competitionState(0,s.tracer,s.kd,cell.rt,true).boundTracer/s.tracer:0;
    states[kind]={...cell,bindingEC50,competitionIC50,functionalIC50,baselineTracer:base.tracerSignal,baselineReporter:base.reporterSignal,tracerDepletion,bindingDepletionFraction,exactBaselineTracerDepletion};
  }
  const r=states.raji;
  for(const cell of Object.values(states)){
    cell.relativeTracerSignal=r.baselineTracer>0?cell.baselineTracer/r.baselineTracer:0;
    cell.relativeReporterSignal=r.baselineReporter>0?cell.baselineReporter/r.baselineReporter:0;
    cell.lowSignal=cell.scale<s.signalFloor;
    cell.lowBlockingSignal=cell.relativeTracerSignal<s.signalFloor;
    cell.lowReporterSignal=cell.relativeReporterSignal<s.signalFloor;
  }
  const mids=Object.values(states).flatMap(c=>[c.bindingEC50,c.competitionIC50,c.functionalIC50]).filter(x=>x!==null);
  const min=Math.max(1e-12,Math.min(...mids)/100),max=Math.max(...mids)*100;
  const doses=Array.from({length:81},(_,i)=>min*(max/min)**(i/80));
  return {settings:s,states,doses,curves:Object.fromEntries(Object.entries(states).map(([k,c])=>[k,doses.map(d=>({dose:d,...doseValues(d,s,c)}))])),scope:"Deterministic one-site equilibrium thought experiment. No fit to rituximab data; no inference of integration mechanism. Generic reporter output is not validated CD20 signaling."};
}
