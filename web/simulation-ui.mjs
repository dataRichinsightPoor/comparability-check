import {validateSimulation,simulationReport,effectLevelRatios,runSuiteAsync} from "./simulation-model.mjs";
export function initializeSimulation(download) {
  const $=id=>document.getElementById(id);
  let job=0,result=null;
  const percent=x=>x>0&&x<.0001?"<0.01%":(100*x).toFixed(2)+"%";
  const setBusy=b=>{$("sim-run").disabled=b;$("sim-cancel").disabled=!b;};
  $("sim-shape").textContent=effectLevelRatios().map(x=>`${x.responseFraction*100}% response: ${x.doseRatioBA.toFixed(2)}×`).join(" · ");
  $("sim-run").addEventListener("click",async()=>{
    const runId=++job;
    try{
      const o=validateSimulation({iterations:Number($("sim-iterations").value),blocks:Number($("sim-blocks").value),seed:Number($("sim-seed").value)});
      result=null;$("sim-result").hidden=true;$("sim-json").disabled=true;$("sim-report").disabled=true;
      setBusy(true);$("sim-status").textContent="Running seeded experiments…";
      // Cooperative chunks work in opaque preview frames without worker-origin
      // privileges. The synchronous CLI consumes the exact same generators.
      const completed=await runSuiteAsync(o,(done,total)=>{
        if(job===runId)$("sim-status").textContent=`Running: ${(100*done/total).toFixed(0)}% of scenario work…`;
      },()=>job!==runId);
      if(job!==runId)return;
          result=completed;setBusy(false);$("sim-result").hidden=false;$("sim-json").disabled=false;$("sim-report").disabled=false;
          $("sim-status").textContent=`Complete: ${result.totalRepeatExperiments.toLocaleString()} repeat experiments + ${result.totalCellScenarios.toLocaleString()} cell draws. Seed ${result.options.seed}; ${result.options.blocks} blocks per experiment.`;
          $("sim-table").innerHTML=result.scenarios.map(s=>`<tr><th scope="row">${s.name}<small>${s.lesson}</small></th>${["historical","P","Q","interaction"].map(k=>{const c=s.contrasts[k];return `<td>${percent(c.equivalence90.rate)}<small>MC 95%: ${c.equivalence90.mc95Wilson.map(percent).join(" to ")}</small></td>`;}).join("")}</tr>`).join("");
          $("sim-cells").innerHTML=Object.entries(result.cells.summaries).map(([k,q])=>`<tr><th scope="row">${({plateauRatio:"Absolute binding plateau",bindingNoDepletionRatio:"Binding EC50 · negligible depletion",bindingFiniteSupplyRatio:"Binding EC50 · finite supply",competitionRatio:"Competition IC50 · negligible depletion",reporterRatio:"Generic reporter IC50 · negligible depletion"})[k]}</th><td>${q.q05.toFixed(3)}</td><td>${q.median.toFixed(3)}</td><td>${q.q95.toFixed(3)}</td></tr>`).join("");
    }catch(e){if(job===runId){$("sim-status").textContent=e.message;setBusy(false);}}
  });
  $("sim-cancel").addEventListener("click",()=>{job++;setBusy(false);$("sim-status").textContent="Cancelled. No partial result reported.";});
  $("sim-json").addEventListener("click",()=>{if(result)download("comparability-simulations.json",JSON.stringify(result,null,2),"application/json");});
  $("sim-report").addEventListener("click",()=>{if(result)download("comparability-simulations.md",simulationReport(result),"text/markdown");});
}
