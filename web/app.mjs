import {VERSION,SERIES_LINE,historical,parseCSV,analyzeBridge,PRESETS} from "./model.mjs";
import {contextSettings,applyContext,initializeContext} from "./context-ui.mjs";
import {validateContext,CONTEXT_DEFAULTS} from "./context-model.mjs";
import {redrawContext} from "./context-ui.mjs";
import {auditSettings,applyAudit,initializeAudit} from "./audit-ui.mjs";
import {validateAudit,AUDIT_DEFAULTS} from "./audit-model.mjs";
import {walkthroughSettings,applyWalkthrough,initializeWalkthrough,redrawWalkthrough} from "./walkthrough-ui.mjs";
import {validateWalkthrough} from "./walkthrough-model.mjs";
import {initializeSimulation} from "./simulation-ui.mjs";
const $=id=>document.getElementById(id);
let view="audit", bridgeResult=null, historyResult=null;
const f=x=>x===null?"Unavailable":(Math.abs(x)>=1000||Math.abs(x)<.01?x.toExponential(2):Number(x.toPrecision(3)).toString());
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function setView(v){
  if(!["audit","walkthrough","history","context","bridge","simulation","methods"].includes(v))return;
  view=v;
  document.querySelectorAll(".view").forEach(e=>e.hidden=e.id!==v);
  document.querySelectorAll("[data-view]").forEach(e=>e.setAttribute("aria-pressed",String(e.dataset.view===v)));
  redrawActive();
}
function redrawActive(){
  if(view==="history"&&historyResult)drawHistory(historyResult);
  if(view==="bridge"&&bridgeResult)drawBridge(bridgeResult);
  if(view==="context")redrawContext();
  if(view==="walkthrough")redrawWalkthrough();
}
let resizeFrame;
window.addEventListener("resize",()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(redrawActive);});
document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>setView(b.dataset.view)));
$("import-trigger").addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();$("import-settings").click();}});
$("csv").value=PRESETS.common;
function drawHistory(r){
  const W=Math.max(300,$("history-chart").clientWidth||680),compact=W<520,H=260,L=compact?72:88,R=32,T=compact?40:18,B=52;
  const center=Math.log2(r.observedRatio), x=v=>L+(v+4)/8*(W-L-R),y=v=>T+(center+4-v)/8*(H-T-B);
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Log-scale compatible-explanations plot. Lot ratio times method ratio equals the observed ratio."><title>Compatible lot and method ratios</title>`;
  for(const t of compact?[-4,0,4]:[-4,-2,0,2,4]){
    s+=`<line class="axis" x1="${x(t)}" y1="${T}" x2="${x(t)}" y2="${H-B}"/><text x="${x(t)}" y="${H-B+24}" text-anchor="middle">${f(2**t)}×</text>`;
    const ly=center+t;
    s+=`<line class="axis" x1="${L}" y1="${y(ly)}" x2="${W-R}" y2="${y(ly)}"/><text x="${L-10}" y="${y(ly)+5}" text-anchor="end">${f(2**ly)}×</text>`;
  }
  s+=`<path class="curve" d="M${x(-4)},${y(center+4)} L${x(4)},${y(center-4)}"/>`;
  const xm=Math.log2(r.methodMultiplier),ym=Math.log2(r.conditionalLotRatio);
  s+=`<circle class="point" cx="${x(xm)}" cy="${y(ym)}" r="6"/><text x="${(W+L-R)/2}" y="${H-6}" text-anchor="middle">${compact?"Assumed Q/P (log scale)":"Assumed method multiplier Q/P (log scale)"}</text>${compact?`<text x="${L}" y="16">Conditional lot ratio B/A</text>`:`<text transform="translate(16 ${(H-B+T)/2}) rotate(-90)" text-anchor="middle">Conditional lot ratio B/A</text>`}</svg>`;
  $("history-chart").innerHTML=s;
}
function updateHistory(){
  try{
    const r=historical(Number($("earlier").value),Number($("later").value),2**Number($("multiplier").value));historyResult=r;
    $("history-error").hidden=true;$("history-output").hidden=false;
    $("observed").textContent=f(r.observedRatio)+"×";$("conditional").textContent=f(r.conditionalLotRatio)+"×";$("assumed").textContent=f(r.methodMultiplier)+"×";
    $("multiplier-label").textContent=f(r.methodMultiplier)+"×";
    $("history-statement").textContent=r.statement;
    document.querySelector("#history .verdict h2").innerHTML=r.observedRatio===1?"The numbers match.<br>The lot effect is still unresolved.":"The numbers differ.<br>The lot effect is unresolved.";
    const unit=$("unit").value.trim()||"common units";
    $("can-say").textContent=`The reported EC50 changed from ${f(r.earlier)} to ${f(r.later)} ${unit}. The later/earlier ratio is ${f(r.observedRatio)}.`;
    document.querySelectorAll(".matrix label small").forEach(e=>e.textContent=`EC50 · ${unit}`);
    drawHistory(r);
  }catch(e){historyResult=null;$("history-error").textContent=e.message;$("history-error").hidden=false;$("history-output").hidden=true;}
}
for(const id of ["earlier","later","multiplier","unit"])$(id).addEventListener("input",updateHistory);
document.querySelectorAll("[data-m]").forEach(b=>b.addEventListener("click",()=>{$("multiplier").value=Math.log2(Number(b.dataset.m));updateHistory();}));
function options(){return {lower:Number($("lower").value),upper:Number($("upper").value),interactionLower:Number($("ilower").value),interactionUpper:Number($("iupper").value),qualified:$("qualified").checked};}
function drawBridge(r){
  const W=Math.max(300,$("bridge-chart").clientWidth||680),compact=W<520,H=compact?285:220,L=compact?32:160,R=32,T=compact?48:30,B=44,keys=["P","Q","interaction"],names=["Lot B/A · method P","Lot B/A · method Q","Interaction Q/P"];
  const vals=[1,r.lower,r.upper,r.interactionLower,r.interactionUpper,...keys.flatMap(k=>r[k].ci90||[r[k].estimate])];
  let lo=Math.min(...vals.map(Math.log2))-.25,hi=Math.max(...vals.map(Math.log2))+.25;
  if(hi-lo<1){const mid=(lo+hi)/2;lo=mid-.5;hi=mid+.5;}
  const x=v=>L+(Math.log2(v)-lo)/(hi-lo)*(W-L-R);
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Forest plot of within-method lot ratios and interaction. Points are geometric means, bars are 90 percent confidence intervals, and shaded bands are margins."><title>Lot contrasts and method dependence</title>`;
  for(let i=0;i<3;i++){
    const y=T+i*(compact?78:55), lower=i===2?r.interactionLower:r.lower,upper=i===2?r.interactionUpper:r.upper,v=r[keys[i]];
    s+=`<rect x="${x(lower)}" y="${y-17}" width="${x(upper)-x(lower)}" height="34" fill="var(--soft)"/><text x="${compact?L:L-12}" y="${compact?y-25:y+5}" text-anchor="${compact?"start":"end"}">${names[i]}</text>`;
    if(compact)s+=`<line x1="${x(1)}" y1="${y-18}" x2="${x(1)}" y2="${y+18}" stroke="var(--muted)" stroke-dasharray="3 4"/>`;
    if(v.ci90)s+=`<line x1="${x(v.ci90[0])}" y1="${y}" x2="${x(v.ci90[1])}" y2="${y}" stroke="var(--accent)" stroke-width="3"/><line x1="${x(v.ci90[0])}" y1="${y-6}" x2="${x(v.ci90[0])}" y2="${y+6}" stroke="var(--accent)"/><line x1="${x(v.ci90[1])}" y1="${y-6}" x2="${x(v.ci90[1])}" y2="${y+6}" stroke="var(--accent)"/>`;
    s+=`<circle class="point" cx="${x(v.estimate)}" cy="${y}" r="5"/>`;
  }
  if(!compact)s+=`<line x1="${x(1)}" y1="8" x2="${x(1)}" y2="${H-B}" stroke="var(--muted)" stroke-dasharray="3 4"/>`;
  const ticks=compact?2:4;
  for(let i=0;i<=ticks;i++){const v=2**(lo+(hi-lo)*i/ticks);s+=`<text x="${x(v)}" y="${H-B+22}" text-anchor="middle">${f(v)}</text>`;}
  s+=`<text x="${(L+W-R)/2}" y="${H-2}" text-anchor="middle">Ratio (log scale); dashed line = 1</text></svg>`;
  $("bridge-chart").innerHTML=s;
}
function updateBridge(){
  try{
    const rows=parseCSV($("csv").value),r=analyzeBridge(rows,options());bridgeResult=r;
    $("bridge-error").hidden=true;$("bridge-output").hidden=false;
    $("bridge-status").textContent=r.qualified?"CONDITIONAL ON YOUR DECLARED ASSUMPTIONS":"EXPLORATORY MARGINS";
    $("bridge-summary").textContent=`${r.n} complete independent block${r.n===1?"":"s"}. Each method gets its own lot comparison; the interaction asks whether that contrast changes with method.`;
    drawBridge(r);
    const ci=v=>v?`${f(v[0])}–${f(v[1])}`:"Unavailable";
    const contrasts=[["P","B/A · P"],["Q","B/A · Q"],["interaction","Interaction"]];
    $("bridge-table").innerHTML=`<table><thead><tr><th>Contrast</th><th>Estimate</th><th>90% CI</th><th>95% CI</th><th>Assessment</th></tr></thead><tbody>${contrasts.map(([k,name])=>`<tr><td>${name}</td><td class="numeric">${f(r[k].estimate)}</td><td class="numeric">${ci(r[k].ci90)}</td><td class="numeric">${ci(r[k].ci95)}</td><td>${r[k].decision}${r[k].warning?`<br><small>${esc(r[k].warning)}</small>`:""}</td></tr>`).join("")}</tbody></table><div class="mobile-results">${contrasts.map(([k,name])=>`<section><h3>${name} · ${f(r[k].estimate)}×</h3><p>90% CI: ${ci(r[k].ci90)}<br>95% CI: ${ci(r[k].ci95)}</p><strong>${r[k].decision}</strong>${r[k].warning?`<p>${esc(r[k].warning)}</p>`:""}</section>`).join("")}</div>`;
    const warnings=[...new Set(["P","Q","interaction"].map(k=>r[k].warning).filter(Boolean))];
    $("bridge-warning").textContent=[...warnings, r.n<5?"Few blocks: log-normality and outlier sensitivity cannot be reliably assessed from this sample.":"", "A retained old lot is today's material. This bridge does not reconstruct its original condition or prove intrinsic-affinity equivalence."].filter(Boolean).join(" ");
  }catch(e){bridgeResult=null;$("bridge-error").textContent=e.message;$("bridge-error").hidden=false;$("bridge-output").hidden=true;}
}
for(const id of ["csv","lower","upper","ilower","iupper"])$(id).addEventListener("input",()=>{$("qualified").checked=false;$("preset").value="custom";updateBridge();});
$("qualified").addEventListener("change",updateBridge);
$("preset").addEventListener("change",()=>{$("csv").value=PRESETS[$("preset").value];$("qualified").checked=false;updateBridge();});
function download(name,text,type){
  if(type==="text/markdown"&&!text.includes(SERIES_LINE))text=text.replace(/^(# [^\n]+\n)/,`$1\n${SERIES_LINE}\n`);
  const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement("a");
  a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function settings(){return {schemaVersion:4,modelVersion:VERSION,publication:SERIES_LINE,view,history:{earlier:$("earlier").value,later:$("later").value,unit:$("unit").value,log2Multiplier:$("multiplier").value},bridge:{csv:$("csv").value,...options()},context:contextSettings(),audit:auditSettings(),walkthrough:walkthroughSettings()};}
$("export-settings").addEventListener("click",()=>download("comparability-check-settings.json",JSON.stringify(settings(),null,2),"application/json"));
$("download-csv").addEventListener("click",()=>download("comparability-check-blocks.csv",$("csv").value,"text/csv"));
$("import-settings").addEventListener("change",async e=>{
  try{
    const file=e.target.files[0];if(!file)return;
    if(file.size>250000)throw new Error("Settings file is too large.");
    const s=JSON.parse(await file.text());
    if(![1,2,3,4].includes(s.schemaVersion)||!s.history||!s.bridge)throw new Error("Unrecognized settings format.");
    const h=s.history,b=s.bridge;
    if(typeof h.unit!=="string"||h.unit.length>24)throw new Error("Invalid unit label.");
    for(const k of ["lower","upper","interactionLower","interactionUpper"])
      if(typeof b[k]!=="number"||!Number.isFinite(b[k]))throw new Error("Settings must include four finite numerical margins.");
    if(!["audit","walkthrough","history","context","bridge","simulation","methods"].includes(s.view))throw new Error("Unrecognized view.");
    const exponent=Number(h.log2Multiplier);
    if(!Number.isFinite(exponent)||exponent < -4||exponent>4)throw new Error("Method slider must be between −4 and 4 in log2 units.");
    historical(Number(h.earlier),Number(h.later),2**exponent);
    analyzeBridge(parseCSV(b.csv),{...b,qualified:false});
    if(s.schemaVersion>=2&&(!s.context||typeof s.context!=="object"))throw new Error("Cell-context settings are missing.");
    if(s.schemaVersion>=3&&(!s.audit||typeof s.audit!=="object"))throw new Error("Claim-audit settings are missing.");
    const cs=validateContext(s.schemaVersion>=2?s.context:CONTEXT_DEFAULTS);
    const au=validateAudit(s.schemaVersion>=3?s.audit:AUDIT_DEFAULTS);
    if(s.schemaVersion>=4&&!s.walkthrough)throw new Error("Walkthrough state is missing.");
    const walk=validateWalkthrough(s.schemaVersion>=4?s.walkthrough:{step:0});
    $("earlier").value=h.earlier;$("later").value=h.later;$("unit").value=h.unit;$("multiplier").value=exponent;
    $("csv").value=b.csv;
    for(const [id,key] of [["lower","lower"],["upper","upper"],["ilower","interactionLower"],["iupper","interactionUpper"]])$(id).value=b[key];
    $("qualified").checked=false;$("preset").value="custom";applyContext(cs);applyAudit(au);applyWalkthrough(walk);updateHistory();updateBridge();setView(s.view);
    $("file-status").textContent="Settings loaded. Reconfirm assay assumptions before making a conditional equivalence claim.";
  }catch(err){$("file-status").textContent=`Could not load settings: ${err.message}`;}
  e.target.value="";
});
$("download-report").addEventListener("click",()=>{
  if(!bridgeResult)return;
  const r=bridgeResult,interval=x=>x?x.map(v=>v.toPrecision(6)).join(" to "):"unavailable";
  const text=`# Comparability Check analysis\n\nModel version: ${VERSION}. Analysis: paired, complete-block EC50 contrasts. Qualification declaration: ${r.qualified}.\n\n${r.n} independent blocks declared by the user. Lot margins: ${r.lower} to ${r.upper}. Interaction margins: ${r.interactionLower} to ${r.interactionUpper}. These are user settings, not universal acceptance limits.\n\n| Contrast | Geometric ratio | 90% CI | 95% CI | Assessment |\n|---|---:|---|---|---|\n${["P","Q","interaction"].map(k=>`| ${k} | ${r[k].estimate.toPrecision(6)} | ${interval(r[k].ci90)} | ${interval(r[k].ci95)} | ${r[k].decision}${r[k].warning?"; "+r[k].warning:""} |`).join("\n")}\n\n## Scope and assumptions\n\n${r.scope}\n\nThe calculation assumes independent complete blocks, approximately normal block-level log contrasts, supported EC50 estimates in a common unit, and no selectively omitted runs. It does not fit dose-response curves, propagate individual curve-fit uncertainty, model missing cells, or validate assay suitability. Confidence intervals are per contrast. A 90% interval strictly inside prespecified margins implements the interval form of TOST at alpha 0.05 ([Lakens, 2017](https://pmc.ncbi.nlm.nih.gov/articles/PMC5502906/)).\n\nA retained old vial reflects its current state, not necessarily its original state. Software verification is not biological validation. Qualification is a user declaration, not an audit performed by this software.\n\n## Input\n\n\`\`\`csv\n${$("csv").value}\n\`\`\`\n`;
  download("comparability-check-analysis.md",text,"text/markdown");
});
// Stable test identifiers for the complete control surface.
initializeContext(download);
initializeAudit(download,setView);
initializeWalkthrough(download,setView,applyContext);
initializeSimulation(download);
document.querySelectorAll("button,input,select,textarea,a").forEach((e,i)=>{e.dataset.testid=e.id||e.dataset.view||`control-${i}`;});
updateHistory();updateBridge();
