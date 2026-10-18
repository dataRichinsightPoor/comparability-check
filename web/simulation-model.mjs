import {studentQuantile, VERSION, SERIES_LINE} from "./model.mjs";

// Summary-endpoint experiments, not raw-curve fitting or a biological calibration.
export const SCENARIOS = [
  {id:"shared",name:"Shared method shift",theta:1,method:.25,interaction:1,reference:1,sigma:.12,
    lesson:"A fourfold common method shift cancels in paired lot contrasts, not in an unbridged historical contrast."},
  {id:"masked",name:"A real lot shift hidden by method",theta:2,method:.5,interaction:1,reference:1,sigma:.12,
    lesson:"A twofold lot effect and a compensating method shift produce matching historical midpoints."},
  {id:"interaction",name:"Lot-by-method interaction",theta:1,method:.25,interaction:1.5,reference:1,sigma:.12,
    lesson:"A contrast established under P does not transport to Q; the ratio of ratios isolates the interaction."},
  {id:"reference",name:"Comparator-specific drift",theta:1,method:1,interaction:1,reference:.5,sigma:.12,
    lesson:"A shifts only under Q. The bridge detects a changed contrast but cannot attribute it uniquely to A, B, or their context."},
  {id:"boundary",name:"Exactly on the upper margin",theta:1.25,method:1,interaction:1,reference:1,sigma:.12,
    lesson:"Equality to an acceptance boundary is not equivalence. The rejection rate should be no more than about 5% under this model."},
  {id:"imprecise",name:"Equal lots, noisy assay",theta:1,method:1,interaction:1,reference:1,sigma:.45,
    lesson:"A confidence interval containing 1 is not positive evidence of equivalence. Low precision often leaves both questions unresolved."}
];

export function validateSimulation(input={}) {
  const o={iterations:10000,seed:26007,blocks:8,...input};
  if(!Number.isInteger(o.iterations)||o.iterations<100||o.iterations>1000000)throw Error("Iterations must be an integer from 100 to 1,000,000.");
  if(!Number.isInteger(o.seed)||o.seed<0||o.seed>4294967295)throw Error("Seed must be an integer from 0 to 4,294,967,295.");
  if(!Number.isInteger(o.blocks)||o.blocks<3||o.blocks>100)throw Error("Independent blocks must be an integer from 3 to 100.");
  return {iterations:o.iterations,seed:o.seed,blocks:o.blocks};
}
export function generator(seed) {
  let a=seed>>>0;
  const uniform=()=>{
    a=(a+0x6D2B79F5)>>>0;
    let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);
    return (((t^(t>>>14))>>>0)+.5)/4294967296;
  };
  let spare=null;
  const normal=()=>{
    if(spare!==null){const z=spare;spare=null;return z;}
    const r=Math.sqrt(-2*Math.log(uniform())),t=2*Math.PI*uniform();
    spare=r*Math.sin(t);return r*Math.cos(t);
  };
  return {uniform,normal};
}
function rate(count,n) {
  const p=count/n,z=1.959963984540054,d=1+z*z/n;
  const center=(p+z*z/(2*n))/d,half=z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n))/d;
  return {count,rate:p,mcSE:Math.sqrt(p*(1-p)/n),mc95Wilson:[Math.max(0,center-half),Math.min(1,center+half)]};
}
function* scenarioSteps(s,input={}) {
  const o=validateSimulation(input),rng=generator(o.seed),n=o.blocks;
  const t90=studentQuantile(.95,n-1),t95=studentQuantile(.975,n-1);
  const theta=Math.log(s.theta),method=Math.log(s.method),interaction=Math.log(s.interaction),ref=Math.log(s.reference);
  const targets=[theta,theta,theta+interaction-ref,interaction-ref];
  const expected=[theta+method+interaction,theta,theta+interaction-ref,interaction-ref];
  const names=["historical","P","Q","interaction"];
  const sums=names.map(()=>({mean:0,squaredError:0,coverage:0,equivalent:0,containsOne:0}));
  const lo=Math.log(.8),hi=Math.log(1.25);
  for(let j=0;j<o.iterations;j++){
    if(j%100===0)yield j/o.iterations;
    const sum=[0,0,0,0],sq=[0,0,0,0];
    for(let b=0;b<n;b++){
      // Shared differential lot response makes P and Q correlated within each
      // complete block. Distinct historical eras have independent run noise.
      const common=.15*rng.normal(),p=.1*rng.normal(),q=.1*rng.normal(),lot=.08*rng.normal();
      const ap=common+p+s.sigma*rng.normal();
      const bp=theta+common+p+lot+s.sigma*rng.normal();
      const aq=method+ref+common+q+s.sigma*rng.normal();
      const bq=theta+method+interaction+common+q+lot+s.sigma*rng.normal();
      const hist=theta+method+interaction+.25*rng.normal()-.25*rng.normal()+s.sigma*rng.normal()-s.sigma*rng.normal();
      const d=[hist,bp-ap,bq-aq,(bq-aq)-(bp-ap)];
      for(let k=0;k<4;k++){sum[k]+=d[k];sq[k]+=d[k]*d[k];}
    }
    for(let k=0;k<4;k++){
      const m=sum[k]/n,se=Math.sqrt(Math.max(0,(sq[k]-sum[k]*m)/(n-1))/n),a=sums[k];
      a.mean+=m;a.squaredError+=(m-targets[k])**2;
      a.coverage+=Math.abs(m-targets[k])<=t95*se;
      a.equivalent+=m-t90*se>lo&&m+t90*se<hi;
      a.containsOne+=Math.abs(m)<=t95*se;
    }
  }
  return {...s,contrasts:Object.fromEntries(names.map((name,k)=>{
    const a=sums[k],truthInside=targets[k]>lo&&targets[k]<hi;
    return [name,{
      targetRatio:Math.exp(targets[k]),expectedObservedRatio:Math.exp(expected[k]),
      geometricMeanEstimate:Math.exp(a.mean/o.iterations),
      logBias:a.mean/o.iterations-targets[k],logRMSE:Math.sqrt(a.squaredError/o.iterations),
      coverage95:rate(a.coverage,o.iterations),
      equivalence90:rate(a.equivalent,o.iterations),
      containsOne95:rate(a.containsOne,o.iterations),
      truthInsideMargins:truthInside,
      equivalenceMeaning:name==="historical"?"Unjustified historical lot-equivalence declaration":truthInside?"Power for this conditional endpoint contrast":"False-equivalence rate for this contrast"
    }];
  }))};
}
export function simulateScenario(s,input={}) {
  const steps=scenarioSteps(s,input);let item;
  do{item=steps.next();}while(!item.done);
  return item.value;
}

export function effectLevelRatios(ecA=1,ecB=1,hA=1,hB=2) {
  if(![ecA,ecB,hA,hB].every(x=>Number.isFinite(x)&&x>0))throw Error("Midpoints and slopes must be finite and positive.");
  return [.2,.5,.8].map(f=>{
    const a=ecA*(f/(1-f))**(1/hA),b=ecB*(f/(1-f))**(1/hB);
    return {responseFraction:f,doseA:a,doseB:b,doseRatioBA:b/a};
  });
}
function quantiles(values) {
  values.sort((a,b)=>a-b);
  const at=p=>{const x=(values.length-1)*p,i=Math.floor(x);return values[i]+(values[Math.ceil(x)]-values[i])*(x-i);};
  return {q05:at(.05),median:at(.5),q95:at(.95)};
}
function* cellSteps(input={}) {
  const o=validateSimulation(input),r=generator((o.seed^0xA53C91E7)>>>0);
  const out={plateauRatio:[],bindingNoDepletionRatio:[],bindingFiniteSupplyRatio:[],competitionRatio:[],reporterRatio:[]};
  for(let j=0;j<o.iterations;j++){
    if(j%1000===0)yield j/o.iterations;
    // Independent log-uniform uncertainty scenarios, not estimated biological distributions.
    const logU=(a,b)=>Math.exp(Math.log(a)+r.uniform()*Math.log(b/a));
    const K=logU(.3,3),rho=logU(30000,300000),p=logU(.2,1),densityRetention=logU(.2,1);
    const cells=logU(50000,1000000),volume=logU(50,200)*1e-6,T=logU(.3,10),S50=logU(1000,30000);
    const rt=cells*rho/(6.02214076e23*volume)*1e9,afterRT=rt*p*densityRetention;
    const x0=rho*T/(K+T),x1=x0*densityRetention;
    out.plateauRatio.push(p*densityRetention);
    out.bindingNoDepletionRatio.push(1);
    out.bindingFiniteSupplyRatio.push((K+afterRT/2)/(K+rt/2));
    out.competitionRatio.push(1);
    out.reporterRatio.push((1+x1/S50)/(1+x0/S50));
  }
  return {draws:o.iterations,parameters:"Independent log-uniform ranges; K 0.3–3 nM, rho 30,000–300,000 sites, retained p 0.2–1, density retention 0.2–1, cells 50,000–1,000,000, volume 50–200 µL, tracer 0.3–10 nM, S50 1,000–30,000 occupied sites.",
    scope:"Each draw compares initially matched Raji and engineered cells; Raji is held fixed. p and density retention apply only to the engineered after-state. Competition and reporter use negligible depletion, equal before/after tracer, and h=1; they are separate regimes from the finite-supply binding calculation. No avidity or genomic mechanism is simulated.",
    summaries:Object.fromEntries(Object.entries(out).map(([k,v])=>[k,quantiles(v)]))};
}
export function simulateCells(input={}) {
  const steps=cellSteps(input);let item;
  do{item=steps.next();}while(!item.done);
  return item.value;
}
function suiteResult(options,scenarios,cells) {
  return {version:VERSION,publication:SERIES_LINE,options,totalRepeatExperiments:options.iterations*SCENARIOS.length,totalCellScenarios:options.iterations,
    assumptions:"Six separately seeded scenario streams. Normal log-endpoint errors; 8 blocks by default; complete paired bridges; shared block SD .15, method-within-block SD .10, differential lot SD .08, endpoint residual SD per scenario. Historical eras have independent run SD .25. All uncertainty is at endpoint/block level, not a raw-curve fit. Illustrative margins 0.8–1.25; 90% CI inclusion implements TOST. Per-contrast 95% coverage is not simultaneous coverage.",
    scenarios,cells,shapeCounterexample:effectLevelRatios()};
}
export function runSuite(input={},onProgress=()=>{}) {
  const options=validateSimulation(input);
  const scenarios=SCENARIOS.map((s,i)=>{
    const result=simulateScenario(s,{...options,seed:(options.seed+i*1009)>>>0});
    onProgress(i+1,SCENARIOS.length+1);return result;
  });
  const cells=simulateCells(options);onProgress(7,7);
  return suiteResult(options,scenarios,cells);
}
export async function runSuiteAsync(input={},onProgress=()=>{},isCancelled=()=>false) {
  const options=validateSimulation(input),scenarios=[];
  async function consume(steps,index) {
    let deadline=performance.now()+16;
    while(true){
      if(isCancelled())throw Error("Cancelled");
      const item=steps.next();
      if(item.done)return item.value;
      if(performance.now()>=deadline){
        onProgress(index+item.value,7);
        await new Promise(resolve=>setTimeout(resolve,0));
        deadline=performance.now()+16;
      }
    }
  }
  for(let i=0;i<SCENARIOS.length;i++){
    scenarios.push(await consume(scenarioSteps(SCENARIOS[i],{...options,seed:(options.seed+i*1009)>>>0}),i));
    onProgress(i+1,7);
  }
  const cells=await consume(cellSteps(options),6);onProgress(7,7);
  return suiteResult(options,scenarios,cells);
}
export function simulationReport(r) {
  const pct=x=>(100*x).toFixed(2)+"%";
  return `# Comparability Check: simulation stress tests

${SERIES_LINE}

Version ${r.version}; seed ${r.options.seed}; ${r.options.iterations.toLocaleString("en-US")} iterations per scenario; ${r.options.blocks} independent blocks per repeated experiment. Total: ${r.totalRepeatExperiments.toLocaleString("en-US")} repeat experiments and ${r.totalCellScenarios.toLocaleString("en-US")} paired cell-context draws.

Synthetic demonstrations, not biological validation. More iterations reduce simulation error, not confounding, model error, or uncertainty about an actual antibody lot.

## Endpoint experiments

${r.assumptions}

Coverage is evaluated against the conditional contrast's true log ratio. For the historical column only, coverage is deliberately evaluated against the lot contrast under P: this tests the invalid interpretation of the historical ratio as that lot effect. “Contains 1” is a nonsignificant difference, not equivalence. The historical equivalence rate is an unjustified claim rate, not valid TOST power. The JSON contains Wilson 95% Monte Carlo intervals and Monte Carlo standard errors for every rate.

| Scenario | Contrast | Target ratio | Mean estimate¹ | Log bias | 95% coverage | 90% CI inside margins | 95% CI contains 1 |
|---|---|---:|---:|---:|---:|---:|---:|
${r.scenarios.flatMap(s=>Object.entries(s.contrasts).map(([k,c])=>`| ${s.name} | ${k} | ${c.targetRatio.toFixed(3)} | ${c.geometricMeanEstimate.toFixed(3)} | ${c.logBias.toFixed(3)} | ${pct(c.coverage95.rate)} | ${pct(c.equivalence90.rate)} | ${pct(c.containsOne95.rate)} |`)).join("\n")}

¹ Exponential of the mean estimated log ratio, not the arithmetic mean ratio.

${r.scenarios.map(s=>`- **${s.name}:** ${s.lesson}`).join("\n")}

## Raji versus engineered-cell scenarios

${r.cells.parameters}

${r.cells.scope}

| Engineered after / unchanged reference | 5th percentile | Median | 95th percentile |
|---|---:|---:|---:|
${Object.entries(r.cells.summaries).map(([k,q])=>`| ${k} | ${q.q05.toFixed(4)} | ${q.median.toFixed(4)} | ${q.q95.toFixed(4)} |`).join("\n")}

These are sensitivity-distribution quantiles under chosen input ranges, not confidence intervals or estimated population frequencies. Expression loss can reduce the signal plateau without moving the normalized midpoint; finite ligand supply changes that result ([Hulme and Trevethick, 2010](https://pmc.ncbi.nlm.nih.gov/articles/PMC3000649/)). The generic reporter is not rituximab signaling, CDC, or ADCC.

## Equal EC50 does not imply a common dose ratio

Both normalized curves have EC50 = 1, lower/upper asymptotes 0/1, and slopes 1 versus 2. The dose ratios B/A at 20%, 50%, and 80% response are ${r.shapeCounterexample.map(x=>x.doseRatioBA.toFixed(2)).join(", ")}. A single horizontal displacement cannot describe these curves; relative-potency interpretation requires supported curve similarity ([White et al., 2019](https://www.tandfonline.com/doi/full/10.2144/btn-2019-0031)).

## Prior installment and interpretation

This extends [Data-Rich, Insight-Poor CCI: The Assay Got Better Because the Cells Got Worse](https://www.linkedin.com/pulse/assay-got-better-because-cells-worse-ermelinda-damko-6kvme). That essay assembles mechanisms and simulations, not a measured longitudinal rituximab/Raji passage series.

The 90% confidence-interval inclusion rule is the interval form of two one-sided tests at alpha 0.05; nonsignificance alone does not demonstrate equivalence ([Lakens, 2017](https://pmc.ncbi.nlm.nih.gov/articles/PMC5502906/)). The 0.8–1.25 margins here are illustrative, not bioassay acceptance criteria.
`;
}
