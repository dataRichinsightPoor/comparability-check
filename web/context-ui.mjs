import {analyzeContext,validateContext,CONTEXT_DEFAULTS} from "./context-model.mjs";
import {VERSION} from "./model.mjs";
const $=id=>document.getElementById(id);
const f=x=>x===null?"Not defined":x===0?"0":Math.abs(x)>=10000||Math.abs(x)<.01?x.toExponential(2):Number(x.toPrecision(3)).toString();
const numeric=["passage","fraction0","fractionHalfLife","densityHalfLife","rajiDensity","engineeredDensity","cells","volume","kd","tracer","signalFloor","reporterThreshold","reporterHill"];
let result=null;
export function contextSettings(){
  return {...Object.fromEntries(numeric.map(k=>[k,Number($(k).value)])),lossMode:$("lossMode").value,gate:$("gate").value,depletion:$("depletion").checked,plot:$("context-plot").value};
}
export function applyContext(input,preset="custom"){
  const s=validateContext(input);
  numeric.forEach(k=>$(k).value=s[k]);$("lossMode").value=s.lossMode;$("gate").value=s.gate;$("depletion").checked=s.depletion;$("context-plot").value=s.plot;
  $("context-preset").value=preset;
  updateContext();
}
export function redrawContext(){if(result)draw(result);}
function draw(r){
  const key={absolute:"binding",normalized:"normalized",competition:"competition",functional:"functional"}[r.settings.plot];
  const W=Math.max(300,$("context-chart").clientWidth||680),compact=W<520,H=280,L=compact?52:86,R=32,T=compact?38:16,B=56;
  const logMin=Math.log10(r.doses[0]),logMax=Math.log10(r.doses.at(-1));
  const vmax=key==="binding"?Math.ceil(Math.max(1,...Object.values(r.states).map(s=>s.scale))*2)/2:1;
  const x=v=>L+(Math.log10(v)-logMin)/(logMax-logMin)*(W-L-R),y=v=>T+(vmax-v)/vmax*(H-T-B);
  let svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Synthetic dose-response curves with the same antibody binding parameter in three cell contexts."><title>Cell context changes signal and endpoints</title>`;
  for(let i=0;i<=4;i++){
    const v=vmax*i/4;
    svg+=`<line class="axis" x1="${L}" y1="${y(v)}" x2="${W-R}" y2="${y(v)}"/><text x="${L-10}" y="${y(v)+4}" text-anchor="end">${f(v)}</text>`;
    if(!compact||i%2===0){
      const d=10**(logMin+(logMax-logMin)*i/4);
      svg+=`<text x="${x(d)}" y="${H-B+24}" text-anchor="middle">${f(d)}</text>`;
    }
  }
  for(const [k,color,dash] of [["raji","var(--accent)",""],["initial","var(--muted)","6 4"],["current","var(--rust)",""]]){
    const pts=r.curves[k].filter(v=>v[key]!==null);
    if(pts.length)svg+=`<path d="${pts.map((v,i)=>`${i?"L":"M"}${x(v.dose)},${y(v[key])}`).join(" ")}" fill="none" stroke="${color}" stroke-width="2.5" stroke-dasharray="${dash}"/>`;
  }
  const label=key==="binding"?"Signal / Raji saturation":key==="normalized"?"Fraction of own saturation":key==="competition"?"Fraction tracer blocked":"Fraction reporter inhibited";
  svg+=`<text x="${(L+W-R)/2}" y="${H-5}" text-anchor="middle">${compact?(r.settings.depletion?"Total nM (log scale)":"Nominal nM (log scale)"):`${r.settings.depletion?"Total added":"Nominal ≈ free"} antibody concentration · nM (log scale)`}</text>${compact?`<text x="${L}" y="16">${label}</text>`:`<text transform="translate(16 ${(T+H-B)/2}) rotate(-90)" text-anchor="middle">${label}</text>`}</svg>`;
  $("context-chart").innerHTML=svg;
}
export function updateContext(){
  try{
    const r=analyzeContext(contextSettings());result=r;
    $("context-error").hidden=true;$("context-output").hidden=false;
    const s=r.settings,c=r.states.current,a=r.states.raji;
    $("passage-value").textContent=String(s.passage);
    $("metric-fraction").textContent=f(c.fraction*100)+"%";
    $("metric-density").textContent=f(c.density);
    $("metric-signal").textContent=f(c.scale)+"×";
    if(s.plot==="functional"){
      $("context-headline").textContent="A functional midpoint needs a response model.";
      $("context-insight").textContent="In this generic reporter, the same occupancy change can produce different inhibition curves because response reserve changes with the number of occupied sites. This is not a model of rituximab's functional mechanism.";
    }else if(s.plot==="competition"){
      $("context-headline").textContent="Binding and blocking are different questions.";
      $("context-insight").textContent=s.depletion?"Competitive IC50 reflects tracer concentration and finite ligand supply as well as the shared site-binding parameter. The solver conserves both ligands and receptor.":"Here the binding midpoint is K, while the competitive midpoint is K + tracer concentration. An unchanged antibody can therefore have different EC50 and IC50 values.";
    }else if(s.depletion){
      $("context-headline").textContent="A lower EC50 can accompany loss of target.";
      $("context-insight").textContent="Finite receptor concentration consumes ligand. With fewer accessible sites, less total antibody is needed for half occupancy, even though the site-binding parameter stays fixed. Compare the actual curves; the direction across cell types depends on their target load.";
    }else{
      $("context-headline").textContent="Less signal does not require weaker binding.";
      $("context-insight").textContent="Without depletion in this one-site model, expression loss changes the plateau, not the normalized binding EC50. Normalize each curve and the amplitude information disappears.";
    }
    $("plot-boundary").textContent=s.plot==="functional"?"Generic functional sandbox only. The tracer is treated as a hypothetical activating ligand for an assumed reporter. This is not CD20 signaling, CDC, ADCC, or a validated rituximab blocking assay.":"One-site equilibrium thought experiment, not a calibrated full-length rituximab model. Tracer competition means displacement of labeled antibody, not downstream functional blockade.";
    const diagnosticKey=["competition","functional"].includes(s.plot)?"exactBaselineTracerDepletion":"bindingDepletionFraction";
    const worst=Math.max(...Object.values(r.states).map(v=>v[diagnosticKey]));
    $("depletion-audit").hidden=s.depletion||worst<=.1;
    $("depletion-audit").textContent=`Approximation warning: finite-supply equations predict up to ${f(worst*100)}% ${diagnosticKey==="bindingDepletionFraction"?"ligand depletion at the binding midpoint":"tracer depletion before competition"} across these cell contexts. The current curves ignore this. Enable mass balance to check the consequence; 10% is a diagnostic heuristic, not an assay acceptance limit.`;
    draw(r);
    $("context-caption").textContent=s.plot==="normalized"?"Overlapping self-normalized curves can conceal substantial loss of positive cells or accessible target. No noise is simulated, and no EC50 is fitted.":s.plot==="absolute"?"Signal is an arithmetic mean, scaled to the Raji reference saturation. A positive-only gate can conceal population loss; it does not remove ligand consumption by the full sample.":"Curves are normalized to each population's own unblocked baseline. Inspect absolute baseline signal as well as the normalized midpoint; a weak baseline can make a real assay uninterpretable.";
    const generic=s.plot==="functional";
    $("context-table").innerHTML=`<table><thead><tr><th>Cell context</th><th>Site load RT · nM</th><th>Binding EC50 · nM</th><th>Tracer IC50 · nM</th>${generic?"<th>Generic reporter IC50 · nM</th>":""}</tr></thead><tbody>${[["raji","Raji · fixed"],["initial","Engineered · P0"],["current",`Engineered · P${s.passage}`]].map(([k,label])=>{const v=r.states[k];return `<tr><td>${label}</td><td class="numeric">${f(v.rt)}</td><td class="numeric">${f(v.bindingEC50)}</td><td class="numeric">${f(v.competitionIC50)}</td>${generic?`<td class="numeric">${f(v.functionalIC50)}</td>`:""}</tr>`;}).join("")}</tbody></table>`;
    $("context-table").insertAdjacentHTML("beforeend",`<div class="mobile-results">${[["raji","Raji · fixed"],["initial","Engineered · P0"],["current",`Engineered · P${s.passage}`]].map(([k,label])=>{const v=r.states[k];return `<section><h3>${label}</h3><p>Site load: ${f(v.rt)} nM<br>Binding EC50: ${f(v.bindingEC50)} nM<br>Tracer IC50: ${f(v.competitionIC50)} nM${generic?`<br>Generic reporter IC50: ${f(v.functionalIC50)} nM`:""}</p></section>`;}).join("")}</div>`);
    const low=s.plot==="functional"?c.lowReporterSignal:s.plot==="competition"?c.lowBlockingSignal:c.lowSignal;
    const baseline=s.plot==="functional"?`Generic reporter baseline / Raji: ${f(c.relativeReporterSignal)}.`:s.plot==="competition"?`Tracer baseline / Raji: ${f(c.relativeTracerSignal)}.`:`Saturation signal / Raji: ${f(c.scale)}.`;
    $("context-signal-warning").textContent=`Model endpoints are deterministic, not fitted experimental estimates. ${baseline} ${low?"The selected endpoint is below the illustrative relative-signal floor: its calculated midpoint is model-only, not evidence of a usable assay.":"Passing the illustrative relative-signal floor does not establish assay precision or suitability."}${s.depletion&&["competition","functional"].includes(s.plot)?` Raji baseline tracer depletion: ${f(a.tracerDepletion*100)}%; engineered: ${f(c.tracerDepletion*100)}%.`:""}`;
    $("context-can").textContent=`The prescribed positive fraction is ${f(c.fraction)} and accessible sites per positive cell are ${f(c.density)}. Antibody site K is ${f(s.kd)} nM in every context. ${s.gate==="positive"?"Positive-only signal excludes antigen-negative cells from the arithmetic mean, but not from the experimental sample.":"All-cell signal retains the effect of the positive fraction."}`;
  }catch(e){result=null;$("context-error").textContent=e.message;$("context-error").hidden=false;$("context-output").hidden=true;}
}
export function initializeContext(download){
  const changed=()=>{$("context-preset").value="custom";updateContext();};
  for(const k of numeric)$(k).addEventListener("input",changed);
  for(const k of ["lossMode","gate","depletion","context-plot"])$(k).addEventListener("change",changed);
  $("context-preset").addEventListener("change",()=>{
    const p=$("context-preset").value;
    applyContext({...CONTEXT_DEFAULTS,...({
      amplitude:{plot:"absolute"},
      depletion:{depletion:true,cells:1e6,plot:"normalized"},
      tracer:{tracer:10,plot:"competition"},
      reserve:{plot:"functional",reporterThreshold:1000,reporterHill:1}
    }[p])},p);
  });
  $("download-context").addEventListener("click",()=>{
    if(!result)return;
    const r=result,s=r.settings;
    const text=`# Comparability Check: cell and endpoint context\n\nModel v${VERSION}. All outputs below are deterministic synthetic calculations, not empirical EC50 estimates or evidence about a real antibody lot.\n\n## Model outputs\n\n| Context | Positive fraction | Sites/positive cell | RT (nM) | Plateau/Raji | Binding EC50 (nM) | Tracer IC50 (nM) | Generic reporter IC50 (nM) |\n|---|---:|---:|---:|---:|---:|---:|---:|\n${Object.entries(r.states).map(([k,v])=>`| ${k} | ${f(v.fraction)} | ${f(v.density)} | ${f(v.rt)} | ${f(v.scale)} | ${f(v.bindingEC50)} | ${f(v.competitionIC50)} | ${f(v.functionalIC50)} |`).join("\n")}\n\n## What these results mean\n\n${r.scope}\n\nThe antibody site-binding parameter is fixed across cell contexts. Fraction-positive and per-positive-cell density decline independently according to prescribed half-lives, not an inferred genomic mechanism. Raji is held constant by assumption. Positive-only gating changes the arithmetic signal summary, not the receptor mass balance.\n\nBinding midpoint = K when depletion is neglected, and K + RT/2 when mass balance is enforced. Homologous competitive midpoint = K + tracer without depletion; the finite-supply calculation solves conservation equations ([Hulme and Trevethick, 2010](https://pmc.ncbi.nlm.nih.gov/articles/PMC3000649/)).\n\nThe generic reporter is an explicitly assumed response to occupied tracer sites. It is not rituximab pharmacology and must not be interpreted as a functional CD20 blocking result. Curves contain no measurement noise, avidity, heterogeneous positive-cell densities, internalization, or kinetic effects. A low modeled signal is flagged by an illustrative floor, not a validated limit of quantification.\n\nIntegration status cannot be inferred from expression loss alone: stable integration can coexist with silencing ([Cabrera et al., 2022](https://www.cell.com/cell-systems/fulltext/S2405-4712(22)00464-1)).\n\n## Reproducible parameters\n\n\`\`\`json\n${JSON.stringify(s,null,2)}\n\`\`\`\n`;
    const diagnostic=`## Approximation audit\n\nFinite-supply diagnostics are calculated even when the curves ignore depletion. These are model-based checks, not observed depletion measurements; 10% is a warning heuristic, not assay validation.\n\n| Context | Depletion at binding midpoint | Unchallenged tracer depletion |\n|---|---:|---:|\n${Object.entries(r.states).map(([k,v])=>`| ${k} | ${f(v.bindingDepletionFraction*100)}% | ${f(v.exactBaselineTracerDepletion*100)}% |`).join("\n")}\n\n`;
    download("comparability-check-cell-context.md",text.replace("## What these results mean",diagnostic+"## What these results mean"),"text/markdown");
  });
  applyContext(CONTEXT_DEFAULTS,"amplitude");
}
