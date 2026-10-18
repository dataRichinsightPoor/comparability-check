import {AUDIT_DEFAULTS,CLAIM_LABELS,ENDPOINT_LABELS,validateAudit,auditComparison} from "./audit-model.mjs";
import {VERSION} from "./model.mjs";
const $=id=>document.getElementById(id);
const keys=Object.keys(AUDIT_DEFAULTS);
let result;
export function auditSettings(){return Object.fromEntries(keys.map(k=>[k,$(`audit-${k}`).value]));}
export function applyAudit(input){const s=validateAudit(input);keys.forEach(k=>$(`audit-${k}`).value=s[k]);updateAudit();}
export function updateAudit(){
  result=auditComparison(auditSettings());
  $("audit-status").textContent=result.status;$("audit-title").textContent=result.title;$("audit-statement").textContent=result.statement;
  $("audit-gaps").replaceChildren(...(result.gaps.length?result.gaps:["No structural gap was flagged from the declarations. This does not verify the declarations or establish a statistical result."]).map(text=>{const li=document.createElement("li");li.textContent=text;return li;}));
  $("audit-next").textContent=result.next;
  $("audit-preflight").replaceChildren(...result.actions.map(text=>{const li=document.createElement("li");li.textContent=text;return li;}));
  $("audit-preflight-section").hidden=result.actions.length===0;
  $("audit-boundary").textContent=result.boundary;
}
export function initializeAudit(download,setView){
  for(const [key,labels] of [["claim",CLAIM_LABELS],["endpointA",ENDPOINT_LABELS],["endpointB",ENDPOINT_LABELS]]){
    $(`audit-${key}`).replaceChildren(...Object.entries(labels).map(([value,text])=>new Option(text,value)));
  }
  keys.forEach(k=>$(`audit-${k}`).addEventListener("change",updateAudit));
  $("audit-route").addEventListener("click",()=>{setView(result.route);$("main").scrollIntoView({block:"start"});});
  $("audit-download").addEventListener("click",()=>{
    const r=result;
    download("comparability-check-claim-audit.md",`# Comparability Check: claim audit\n\nModel version ${VERSION}. Claim: ${r.claim}.\n\n${r.status}\n\n${r.statement}\n\n## Unresolved evidence\n\n${r.gaps.length?r.gaps.map(x=>"- "+x).join("\n"):"No structural gap flagged from the declarations; no statistical or causal result is established."}\n\n## Next discriminating measurement\n\n${r.next}\n\n## Measurement checks\n\n${r.actions.length?r.actions.map(x=>"- "+x).join("\n"):"The user declared supported midpoints and common concentration scales; the software did not verify them."}\n\n## Scope\n\n${r.boundary}\n\n## Declarations\n\n\`\`\`json\n${JSON.stringify(r.settings,null,2)}\n\`\`\`\n`,"text/markdown");
  });
  applyAudit(AUDIT_DEFAULTS);
}
