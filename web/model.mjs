/**
 * Comparability Check v0.2.0
 * Model schema: history {earlier, later, methodMultiplier};
 * bridge [{run: string, AP, BP, AQ, BQ}], all EC50s positive in one common unit.
 * Complete rows are independent experimental blocks, NOT technical replicates.
 * Paired log contrasts preserve within-block covariance.
 */
export const VERSION = "0.2.0";
export function positive(x, name = "Value") {
  if (typeof x !== "number" || !Number.isFinite(x) || x <= 0)
    throw new Error(`${name} must be a finite positive number.`);
  return x;
}
function finiteResult(x) {
  if (!Number.isFinite(x) || x <= 0) throw new Error("Result is outside the numerical range. Rescale or check inputs.");
  return x;
}
export function historical(earlier, later, methodMultiplier = 1) {
  [earlier, later, methodMultiplier].forEach((x, i) => positive(x, ["Earlier EC50", "Later EC50", "Assumed method multiplier"][i]));
  const observedRatio = finiteResult(later / earlier);
  return {
    earlier, later, methodMultiplier, observedRatio,
    conditionalLotRatio: finiteResult(observedRatio / methodMultiplier),
    identifiable: false,
    statement: `The later/earlier measured EC50 ratio is ${observedRatio.toPrecision(4)}. Lot, method and era are confounded; a lot-specific effect is not identified.`
  };
}
export function parseCSV(text) {
  if (typeof text !== "string" || text.length > 200000)
    throw new Error("CSV must be text of at most 200,000 characters.");
  const lines = text.replace(/^\uFEFF/, "").trim().split(/\r?\n/);
  if (lines[0]?.trim().toLowerCase() !== "run,ap,bp,aq,bq")
    throw new Error("Expected header: run,AP,BP,AQ,BQ");
  if (lines.length < 2) throw new Error("Add at least one complete run.");
  if (lines.length > 1001) throw new Error("Maximum 1,000 runs.");
  const ids = new Set();
  return lines.slice(1).map((line, i) => {
    const p = line.split(",").map(s => s.trim());
    if (p.length !== 5 || p.some(x => x === "") || /["\r\n]/.test(p[0]))
      throw new Error(`Row ${i + 2}: five nonempty fields required; quoted fields are unsupported.`);
    if (ids.has(p[0])) throw new Error(`Row ${i + 2}: duplicate run identifier.`);
    if (p[0].length > 80) throw new Error(`Row ${i + 2}: run identifier is too long.`);
    ids.add(p[0]);
    const row = { run: p[0] };
    ["AP", "BP", "AQ", "BQ"].forEach((k, j) => {
      if (!/^[+]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(p[j + 1]))
        throw new Error(`Row ${i + 2}, ${k}: enter an exact positive EC50, not a bound or missing value.`);
      row[k] = positive(Number(p[j + 1]), `Row ${i + 2}, ${k}`);
    });
    return row;
  });
}
// Lanczos log-gamma, regularized incomplete beta via continued fraction.
// Used solely to invert the Student t CDF. No external runtime dependencies.
export function logGamma(z) {
  const p = [676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];
  if (z < 0.5) return Math.log(Math.PI) - Math.log(Math.sin(Math.PI*z)) - logGamma(1-z);
  z -= 1;
  let x = 0.99999999999980993;
  p.forEach((a, i) => { x += a / (z + i + 1); });
  const t = z + 7.5;
  return .5*Math.log(2*Math.PI)+(z+.5)*Math.log(t)-t+Math.log(x);
}
function betaFraction(a, b, x) {
  const tiny = 1e-300;
  let c = 1, d = 1 - (a+b)*x/(a+1);
  if (Math.abs(d)<tiny) d=tiny;
  d=1/d;
  let h=d;
  for (let m=1; m<=500; m++) {
    let aa=m*(b-m)*x/((a+2*m-1)*(a+2*m));
    d=1+aa*d; if(Math.abs(d)<tiny)d=tiny;
    c=1+aa/c; if(Math.abs(c)<tiny)c=tiny;
    d=1/d; h*=d*c;
    aa=-(a+m)*(a+b+m)*x/((a+2*m)*(a+2*m+1));
    d=1+aa*d; if(Math.abs(d)<tiny)d=tiny;
    c=1+aa/c; if(Math.abs(c)<tiny)c=tiny;
    d=1/d;
    const delta=d*c; h*=delta;
    if(Math.abs(delta-1)<3e-14)return h;
  }
  throw new Error("Statistical calculation did not converge.");
}
function betaI(x,a,b) {
  if(x<=0)return 0;
  if(x>=1)return 1;
  const bt=Math.exp(logGamma(a+b)-logGamma(a)-logGamma(b)+a*Math.log(x)+b*Math.log1p(-x));
  return x<(a+1)/(a+b+2) ? bt*betaFraction(a,b,x)/a : 1-bt*betaFraction(b,a,1-x)/b;
}
export function studentCDF(t,df) {
  positive(df,"Degrees of freedom");
  if (!Number.isFinite(t)) throw new Error("t must be finite.");
  if(t===0)return .5;
  const p=.5*betaI(df/(df+t*t),df/2,.5);
  return t>0?1-p:p;
}
export function studentQuantile(p,df) {
  positive(df,"Degrees of freedom");
  if(!(p>0&&p<1))throw new Error("Probability must be between zero and one.");
  if(p===.5)return 0;
  if(p<.5)return -studentQuantile(1-p,df);
  let lo=0,hi=1;
  while(studentCDF(hi,df)<p) {
    hi*=2;
    if(hi>1e12)throw new Error("Quantile outside supported range.");
  }
  for(let i=0;i<100;i++){
    const mid=(lo+hi)/2;
    if(studentCDF(mid,df)<p)lo=mid; else hi=mid;
  }
  return (lo+hi)/2;
}
export function summarizeLogs(logs) {
  if(!Array.isArray(logs)||logs.length<1||logs.some(x=>!Number.isFinite(x)))
    throw new Error("At least one finite log contrast is required.");
  const n=logs.length, mean=logs.reduce((a,b)=>a+b,0)/n;
  const estimate=finiteResult(Math.exp(mean));
  const out={n,estimate,logMean:mean,se:null,ci90:null,ci95:null,warning:null};
  if(n<2){out.warning="One independent block: no uncertainty interval.";return out;}
  const variance=logs.reduce((a,b)=>a+(b-mean)**2,0)/(n-1);
  // A zero-variance fixture cannot provide credible empirical uncertainty.
  if(variance<1e-24){out.warning="Zero observed log-contrast variation: uncertainty and equivalence withheld.";return out;}
  out.se=Math.sqrt(variance/n);
  for(const [key,p] of [["ci90",.95],["ci95",.975]]){
    const half=studentQuantile(p,n-1)*out.se;
    out[key]=[finiteResult(Math.exp(mean-half)),finiteResult(Math.exp(mean+half))];
  }
  return out;
}
export function intervalInside(ci,lower,upper) {
  positive(lower,"Lower margin");positive(upper,"Upper margin");
  if(!(lower<1&&upper>1))throw new Error("Equivalence margins must straddle 1.");
  if(!ci)return null;
  // Strict containment: a boundary exactly touched does not reject at alpha .05.
  return ci[0]>lower && ci[1]<upper;
}
export function analyzeBridge(rows, options={}) {
  const {lower=.8,upper=1.25,interactionLower=.8,interactionUpper=1.25,qualified=false}=options;
  intervalInside(null,lower,upper);intervalInside(null,interactionLower,interactionUpper);
  if(typeof qualified!=="boolean")throw new Error("Qualification flag must be boolean.");
  if(!Array.isArray(rows)||!rows.length||rows.length>1000)throw new Error("Supply 1 to 1,000 complete blocks.");
  const ids=new Set();
  rows.forEach((r,i)=>{
    if(!r||typeof r.run!=="string"||!r.run.trim()||ids.has(r.run.trim()))throw new Error(`Block ${i+1}: unique run identifier required.`);
    ids.add(r.run.trim());
    ["AP","BP","AQ","BQ"].forEach(k=>positive(r[k],`${r.run} ${k}`));
  });
  const p=rows.map(r=>Math.log(r.BP)-Math.log(r.AP));
  const q=rows.map(r=>Math.log(r.BQ)-Math.log(r.AQ));
  const result={n:rows.length,lower,upper,interactionLower,interactionUpper,qualified};
  for(const [key,logs] of [["P",p],["Q",q],["interaction",q.map((x,i)=>x-p[i])]]){
    const s=summarizeLogs(logs), isI=key==="interaction";
    const within=intervalInside(s.ci90,isI?interactionLower:lower,isI?interactionUpper:upper);
    result[key]={...s,withinMargins:within,decision:within===null?"Uncertainty unavailable":within?(qualified?"Conditional equivalence supported":"Within exploratory margins"):"Equivalence not established"};
  }
  result.scope="Paired geometric EC50 ratios for the tested present-day materials and implemented methods. No intrinsic-affinity, manufacturing-history, clinical, or universal-method-equivalence claim.";
  return result;
}
export const PRESETS={
  common: "run,AP,BP,AQ,BQ\nr1,4.0,4.08,1.0,1.03\nr2,4.2,4.16,1.10,1.08\nr3,3.8,3.91,0.95,0.97\nr4,4.1,4.02,1.04,1.05\nr5,3.9,3.94,0.98,0.96\nr6,4.05,4.09,1.02,1.04",
  interaction: "run,AP,BP,AQ,BQ\nr1,4.0,4.08,1.0,0.51\nr2,4.2,4.16,1.10,0.53\nr3,3.8,3.91,0.95,0.49\nr4,4.1,4.02,1.04,0.52\nr5,3.9,3.94,0.98,0.50\nr6,4.05,4.09,1.02,0.51",
  imprecise: "run,AP,BP,AQ,BQ\nr1,4,2.4,1,0.7\nr2,4,6.6,1,1.5\nr3,4,4.1,1,1.02"
};
