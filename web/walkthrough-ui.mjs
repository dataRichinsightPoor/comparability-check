import {WALKTHROUGH_STEPS,walkthroughPair,walkthroughReport,validateWalkthrough} from "./walkthrough-model.mjs";
import {renderContextChart} from "./context-ui.mjs";
const $=id=>document.getElementById(id);
let index=0,pair=null;
const f=x=>Number(x.toPrecision(3)).toString();
export function walkthroughSettings(){return {step:index};}
export function applyWalkthrough(input){index=validateWalkthrough(input).step;render();}
export function redrawWalkthrough(){
  if(!pair)return;
  for(const key of ["before","after"])renderContextChart(pair[key],`walk-${key}-chart`,{kinds:["raji","current"],signalMax:pair.signalMax});
}
function render(){
  pair=walkthroughPair(index);
  const s=pair.step;
  $("walk-step-select").value=String(index);
  $("walk-progress").textContent=`Step ${index+1} of ${WALKTHROUGH_STEPS.length}`;
  $("walk-title").textContent=s.title;$("walk-changed").textContent=s.changed;$("walk-fixed").textContent=s.fixed;
  $("walk-before-title").textContent=s.beforeTitle;$("walk-after-title").textContent=s.afterTitle;
  $("walk-question").textContent=s.question;$("walk-answer").textContent=s.answer;
  $("walk-answer").hidden=true;$("walk-reveal").textContent="Reveal the interpretation";$("walk-reveal").setAttribute("aria-expanded","false");
  $("walk-establishes").textContent=s.establishes;$("walk-cannot").textContent=s.cannot;$("walk-next-measurement").textContent=s.next;$("walk-equation").textContent=s.equation;
  $("walk-boundary").hidden=!s.boundary;$("walk-boundary").textContent=s.boundary||"";
  $("walk-prev").disabled=index===0;$("walk-next").disabled=index===WALKTHROUGH_STEPS.length-1;
  $("walk-next-bottom").disabled=index===WALKTHROUGH_STEPS.length-1;
  $("walk-next-bottom").textContent=index===WALKTHROUGH_STEPS.length-1?"Last step":"Continue to next step";
  $("walk-summary").hidden=index!==WALKTHROUGH_STEPS.length-1;
  document.querySelectorAll("[data-walk-step]").forEach(b=>b.setAttribute("aria-current",Number(b.dataset.walkStep)===index?"step":"false"));
  const rows=[["Positive fraction",v=>f(v.fraction)],["Sites / positive cell",v=>f(v.density)],["Absolute plateau / Raji",v=>f(v.scale)+"×"],["Binding EC50",v=>f(v.bindingEC50)+" nM"]];
  if(index>=6)rows.push(["Tracer IC50",v=>f(v.competitionIC50)+" nM"]);
  if(index===7)rows.push(["Generic reporter IC50",v=>f(v.functionalIC50)+" nM"]);
  for(const side of ["before","after"]){
    const r=pair[side];
    $("walk-"+side+"-metrics").innerHTML=`<table><caption class="sr-only">${side==="before"?"Before":"After"} model outputs</caption><thead><tr><th>Modeled quantity</th><th>Raji</th><th>Engineered</th></tr></thead><tbody>${rows.map(([name,fn])=>`<tr><td>${name}</td><td>${fn(r.states.raji)}</td><td>${fn(r.states.current)}</td></tr>`).join("")}</tbody></table>`;
  }
  redrawWalkthrough();
}
export function initializeWalkthrough(download,setView,applyContext){
  const go=step=>{applyWalkthrough({step});$("walk-title").focus({preventScroll:true});$("walk-head").scrollIntoView({block:"start"});};
  $("walk-step-select").replaceChildren(...WALKTHROUGH_STEPS.map((s,i)=>new Option(`${i+1}. ${s.short}`,String(i))));
  const list=$("walk-step-list");
  list.replaceChildren(...WALKTHROUGH_STEPS.map((s,i)=>{const b=document.createElement("button");b.type="button";b.dataset.walkStep=String(i);b.textContent=`${String(i+1).padStart(2,"0")}  ${s.short}`;b.addEventListener("click",()=>go(i));return b;}));
  $("walk-step-select").addEventListener("change",()=>applyWalkthrough({step:Number($("walk-step-select").value)}));
  $("walk-prev").addEventListener("click",()=>{if(index>0)go(index-1);});
  for(const id of ["walk-next","walk-next-bottom"])$(id).addEventListener("click",()=>{if(index<WALKTHROUGH_STEPS.length-1)go(index+1);});
  $("walk-restart").addEventListener("click",()=>applyWalkthrough({step:0}));
  $("walk-reveal").addEventListener("click",()=>{const reveal=$("walk-answer").hidden;$("walk-answer").hidden=!reveal;$("walk-reveal").textContent=reveal?"Hide the interpretation":"Reveal the interpretation";$("walk-reveal").setAttribute("aria-expanded",String(reveal));});
  $("walk-copy").addEventListener("click",()=>{applyContext(pair.after.settings);setView("context");$("main").scrollIntoView({block:"start"});$("file-status").textContent="Walkthrough after-state copied to Cells & endpoints. Your other inputs are unchanged.";});
  $("walk-download").addEventListener("click",()=>download("raji-engineered-guided-walkthrough.md",walkthroughReport(),"text/markdown"));
  applyWalkthrough({step:0});
}
