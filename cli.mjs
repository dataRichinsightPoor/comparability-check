import {readFile} from "node:fs/promises";
import {parseCSV,analyzeBridge,historical} from "./web/model.mjs";
try {
  const [command,...args]=process.argv.slice(2);
  if(command==="history"&&args.length===3){
    console.log(JSON.stringify(historical(...args.map(Number)),null,2));
  } else if(command==="bridge"&&[1,5].includes(args.length)){
    const options=args.length===5?{lower:Number(args[1]),upper:Number(args[2]),interactionLower:Number(args[3]),interactionUpper:Number(args[4])}:{};
    console.log(JSON.stringify(analyzeBridge(parseCSV(await readFile(args[0],"utf8")),options),null,2));
  } else {
    console.error("Usage:\n  node cli.mjs history EARLIER LATER ASSUMED_METHOD_MULTIPLIER\n  node cli.mjs bridge FILE.csv [LOT_LOWER LOT_UPPER INTERACTION_LOWER INTERACTION_UPPER]\nCLI output is exploratory; margins do not imply assay qualification.");
    process.exitCode=1;
  }
}catch(error){console.error(error.message);process.exitCode=1;}
