import {writeFileSync,mkdirSync} from "node:fs";
import {runSuite,simulationReport} from "./web/simulation-model.mjs";
const [iterations="100000",seed="26007",blocks="8",directory="results"]=process.argv.slice(2);
try{
  const result=runSuite({iterations:Number(iterations),seed:Number(seed),blocks:Number(blocks)});
  mkdirSync(directory,{recursive:true});
  writeFileSync(`${directory}/simulation-results.json`,JSON.stringify(result,null,2)+"\n");
  writeFileSync(`${directory}/SIMULATION-REPORT.md`,simulationReport(result));
  console.log(JSON.stringify({directory,options:result.options,repeatExperiments:result.totalRepeatExperiments,cellDraws:result.totalCellScenarios}));
}catch(e){console.error(e.message);process.exitCode=1;}
