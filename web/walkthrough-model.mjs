import {CONTEXT_DEFAULTS,analyzeContext,contextDose} from "./context-model.mjs";
import {VERSION,SERIES_LINE} from "./model.mjs";
const base={...CONTEXT_DEFAULTS,fraction0:1,passage:0,lossMode:"both",plot:"absolute"};
const later={...base,passage:20};
const fraction={...later,lossMode:"fraction"};
const depleted={...later,cells:1000000,plot:"normalized"};
const competition={...later,plot:"competition",reporterThreshold:1000};
const labels={raji:"Raji reference",current:"Engineered population"};
export const WALKTHROUGH_STEPS=[
  {
    title:"Establish the reference comparison",short:"Matched starting point",
    changed:"No property differs yet. Both modeled populations begin with 100% positive cells and 100,000 accessible sites per positive cell.",
    fixed:"The same one-site antibody K = 1 nM, cell count, volume, detection summary and equilibrium assumptions apply.",
    beforeTitle:"Raji and engineered, passage 0",afterTitle:"The same matched starting state",
    before:base,after:base,
    question:"If these curves overlap, have we proved that the real cell lines are interchangeable?",
    answer:"No. The curves overlap because their relevant properties were set equal in this synthetic model. Agreement under stipulated conditions is not experimental evidence of equivalence.",
    establishes:"The model starts from a transparent common reference. It provides a controlled baseline for the later changes, not validation of either cell line.",
    cannot:"Raji stability, real engineered-line stability, intrinsic affinity of a full-length antibody, or interchangeability across assays.",
    next:"Characterize the actual positive fraction, expression distribution, viable-cell count and assay performance over the intended passage range.",
    equation:"Signal ∝ positive fraction × sites per positive cell × occupancy. The one-site binding midpoint is K when depletion is negligible."
  },
  {
    title:"Lose positive cells, not binding strength",short:"Fewer positive cells",
    changed:"The engineered positive fraction falls from 1 to 0.5 over 20 modeled passages. Sites per remaining positive cell stay at 100,000.",
    fixed:"Antibody K, per-positive-cell site density, cell count and negligible-depletion approximation remain fixed.",
    beforeTitle:"Engineered population at passage 0",afterTitle:"Half the cells remain positive",
    before:{...fraction,passage:0},after:fraction,
    question:"Must the normalized binding EC50 increase when half the cells lose expression?",
    answer:"No. In this model, the all-cell signal plateau halves while the binding EC50 remains 1 nM. The remaining positive cells retain the same binding curve.",
    establishes:"Loss of positive cells can reduce population-mean binding signal without changing the antibody binding parameter or the normalized midpoint.",
    cannot:"That a measured signal loss came from poor integration, rather than silencing, selection, altered accessibility or another change.",
    next:"Measure positive fraction and the distribution within positive cells separately; retain absolute signal and a consistent gating definition.",
    equation:"Smax ∝ pρ. Reducing p from 1 to 0.5 halves the all-cell arithmetic-mean plateau."
  },
  {
    title:"Now reduce expression within positive cells",short:"Lower density as well",
    changed:"At the same passage and positive fraction, the modeled density halves from 100,000 to 50,000 accessible sites per positive cell.",
    fixed:"Positive fraction stays at 0.5; antibody K, cell count, volume and all-cell signal summary remain unchanged.",
    beforeTitle:"Half positive, original density",afterTitle:"Half positive, half density",
    before:fraction,after:later,
    question:"What happens to the plateau when both fraction and density are half their starting values?",
    answer:"It becomes one quarter of the Raji reference plateau: 0.5 × 0.5 = 0.25. The normalized binding EC50 is still 1 nM under the negligible-depletion assumption.",
    establishes:"Positive fraction and density contribute separately to the same population-mean signal. Their effects multiply in this deliberately simple signal model.",
    cannot:"Which process changed from a single mean-fluorescence value, or which genomic mechanism produced the phenotype.",
    next:"Track the full expression distribution across passage and use independent DNA/transcript evidence if integration or silencing is the claim.",
    equation:"Smax / Raji = p × (ρ / ρRaji) = 0.5 × 0.5 = 0.25."
  },
  {
    title:"Normalize the curves and lose the amplitude information",short:"Normalization hides loss",
    changed:"Only the displayed response changes: absolute relative signal becomes the fraction of each curve's own saturation signal.",
    fixed:"Every biological and assay parameter is identical before and after. This is a change of representation, not a rescue of the engineered cells.",
    beforeTitle:"Absolute relative binding signal",afterTitle:"Each curve normalized to its own top",
    before:later,after:{...later,plot:"normalized"},
    question:"Does the overlap after normalization mean the engineered population has recovered?",
    answer:"No. The underlying engineered plateau is still 0.25 of the reference. Normalization divides away that amplitude difference, leaving overlapping occupancy curves.",
    establishes:"Normalized binding curves can agree while their absolute signal and cell-expression distributions differ substantially.",
    cannot:"Equivalent cell substrates, adequate assay dynamic range, or biological recovery.",
    next:"Keep the absolute plateaus, background, positive fraction and signal-to-noise evidence beside the normalized curves.",
    equation:"S(C) / Smax = C / (K + C). The pρ amplitude factor cancels.",
    boundary:"These panels show different y-axis quantities. Their matching numerical scale does not make absolute signal and fractional occupancy the same measurement."
  },
  {
    title:"Change the gate, not the cells",short:"Gating hides population loss",
    changed:"The arithmetic mean is now calculated only among positive cells instead of across all cells.",
    fixed:"The engineered population remains 50% positive with 50,000 sites per positive cell. Ligand consumption still depends on the full sample.",
    beforeTitle:"Arithmetic mean across all cells",afterTitle:"Arithmetic mean among positive cells",
    before:later,after:{...later,gate:"positive"},
    question:"If the plateau rises from 0.25 to 0.5 after gating, has target expression increased?",
    answer:"No. The summary population changed. Positive-only averaging removes the factor for the 50% negative cells but retains the lower per-positive-cell density.",
    establishes:"A gating change can increase reported signal without improving the cells or the antibody.",
    cannot:"A biological increase in expression, a change in affinity, or a result about median fluorescence or threshold-based gates.",
    next:"Report the gate, its population fraction and the within-gate distribution. Compare like summaries before attributing changes to biology.",
    equation:"All-cell plateau ∝ pρ; positive-only plateau ∝ ρ. This model uses arithmetic means, not medians."
  },
  {
    title:"Account for the antibody consumed by the cells",short:"Finite ligand supply",
    changed:"At a deliberately higher load of 1,000,000 cells per 100 µL, replace the negligible-depletion approximation with explicit ligand mass balance.",
    fixed:"Both panels use the same high cell load, antibody K and cell states. The before panel is an approximation check, not a second experiment.",
    beforeTitle:"High cell load, depletion ignored",afterTitle:"Same load, mass balance enforced",
    before:depleted,after:{...depleted,depletion:true},
    question:"Can lower target abundance produce a lower total-dose binding EC50 with the same antibody?",
    answer:"Yes, in this one-site equilibrium model. Fewer sites consume less ligand, so half occupancy requires less total added antibody. The lower midpoint does not show stronger intrinsic binding.",
    establishes:"Finite ligand supply can create a cell-context EC50 difference while K stays fixed. The engineered population has less target and therefore a smaller depletion shift.",
    cannot:"That depletion explains a particular real experiment, or that lower expression always shifts an intact antibody's apparent EC50 left.",
    next:"Check cell number, accessible target load and volume; test equilibrium and depletion assumptions while retaining absolute signal.",
    equation:"EC50,total = K + RT/2. The finite-supply solver conserves both ligand and receptor.",
    boundary:"The left panel intentionally uses a strained approximation. Interpret the right panel as the same stipulated system with conservation enforced, not as observed experimental truth."
  },
  {
    title:"Change the tracer, not the antibody",short:"Binding versus competition",
    changed:"The homologous tracer concentration increases from 1 to 10 nM in an ideal competitive-displacement assay.",
    fixed:"Antibody K, cells, passage and negligible-depletion approximation remain fixed. Labeling is assumed not to change the tracer's binding.",
    beforeTitle:"Tracer concentration: 1 nM",afterTitle:"Tracer concentration: 10 nM",
    before:competition,after:{...competition,tracer:10},
    question:"Does the higher competition IC50 mean the antibody binds more weakly?",
    answer:"No. The model's competition IC50 rises from 2 to 11 nM because IC50 = K + tracer, while the direct-binding EC50 remains 1 nM.",
    establishes:"Binding and competitive-displacement midpoints depend on different assay conditions, even for the same antibody.",
    cannot:"Loss of antibody quality, downstream functional blockade, or a universal conversion between binding EC50 and blocking IC50.",
    next:"Specify the tracer, its concentration and binding behavior, and check depletion and equilibrium before comparing competition endpoints.",
    equation:"For the ideal homologous, nondepleting case: binding EC50 = K; competition IC50 = K + T.",
    boundary:"Tracer displacement is a binding assay. It is not a measurement of downstream CD20 function."
  },
  {
    title:"Ask what converts occupancy into function",short:"Function needs another model",
    changed:"The output changes from tracer displacement to an explicitly hypothetical reporter driven by occupied tracer sites, with a half-response threshold of 1,000 occupied sites.",
    fixed:"Antibody K, tracer, cell states and occupancy are unchanged. Only an additional occupancy-to-response mapping is introduced.",
    beforeTitle:"Fraction of tracer displaced",afterTitle:"Generic reporter inhibition",
    before:competition,after:{...competition,plot:"functional"},
    question:"Must a functional IC50 equal the binding or displacement midpoint?",
    answer:"No. In this hypothetical h = 1 reporter, response reserve gives a 102 nM IC50 for the reference and 52 nM for the lower-density engineered cells, while both direct-binding EC50s remain 1 nM. These are model outputs, not rituximab functional measurements.",
    establishes:"An assumed response function can separate functional and occupancy midpoints. Lower density can reduce response reserve rather than improve the antibody.",
    cannot:"Rituximab's CD20 signaling, CDC, ADCC, therapeutic efficacy, or the correct response law for a real blocking assay.",
    next:"Define what is blocked and measure baseline function, maximal inhibition, stimulus dependence and timing. Test a biological occupancy-to-response relationship rather than borrowing this toy function.",
    equation:"For h = 1: IC50,reporter = (K + T) × (1 + x(0)/S50). This follows from the chosen transfer function, not from a CD20 mechanism.",
    boundary:"Conceptual extension only. The reporter is NOT CD20 signaling, CDC, ADCC or a validated rituximab functional-blocking assay."
  }
];
export function validateWalkthrough(input={step:0}){
  if(!input||typeof input!=="object"||Array.isArray(input)||!Number.isInteger(input.step)||input.step<0||input.step>=WALKTHROUGH_STEPS.length)throw new Error("Walkthrough step must be an integer from 0 to 7.");
  return {step:input.step};
}
export function walkthroughPair(index){
  validateWalkthrough({step:index});
  const step=WALKTHROUGH_STEPS[index],before=analyzeContext(step.before),after=analyzeContext(step.after);
  const endpoint=r=>r.settings.plot==="competition"?"competitionIC50":r.settings.plot==="functional"?"functionalIC50":"bindingEC50";
  const mids=[before,after].flatMap(r=>["raji","current"].map(k=>r.states[k][endpoint(r)]));
  const domain=[Math.min(...mids)/100,Math.max(...mids)*100];
  const doses=Array.from({length:81},(_,i)=>domain[0]*(domain[1]/domain[0])**(i/80));
  for(const r of [before,after]){
    r.doses=doses;
    r.curves=Object.fromEntries(["raji","current"].map(k=>[k,doses.map(d=>({dose:d,...contextDose(r.settings,k,d)}))]));
  }
  const max=Math.max(1,...[before,after].flatMap(r=>["raji","current"].map(k=>r.states[k].scale)));
  return {step,index,before,after,domain,signalMax:Math.ceil(max*2)/2,labels};
}
export function walkthroughReport(){
  const f=x=>Number(x.toPrecision(6)).toString();
  let text=`# Raji versus engineered cells: a guided comparison\n\n${SERIES_LINE}\n\nComparability Check v${VERSION}. All numbers are synthetic and generated by the shared model. Raji is held stable by assumption, and no observed genomic cause or antibody defect is inferred. The final reporter is a generic conceptual extension, not rituximab biology.\n\nEach paired step declares what changes and what stays fixed. Steps are controlled thought experiments, not an uninterrupted longitudinal dataset; later steps may reset settings explicitly.\n`;
  WALKTHROUGH_STEPS.forEach((s,i)=>{
    const pair=walkthroughPair(i);
    text+=`\n## ${s.title}\n\nChanged: ${s.changed}\n\nFixed: ${s.fixed}\n\n${s.boundary?`${s.boundary}\n\n`:""}Question: ${s.question}\n\nAnswer: ${s.answer}\n\n| State | Cell context | Positive fraction | Sites / positive cell | Plateau / Raji | Binding EC50, nM | Tracer IC50, nM | Generic reporter IC50, nM |\n|---|---|---:|---:|---:|---:|---:|---:|\n`;
    for(const [name,r] of [["Before",pair.before],["After",pair.after]])for(const k of ["raji","current"]){const v=r.states[k];text+=`| ${name} | ${labels[k]} | ${f(v.fraction)} | ${f(v.density)} | ${f(v.scale)} | ${f(v.bindingEC50)} | ${i>=6?f(v.competitionIC50):"not interpreted"} | ${i===7?f(v.functionalIC50):"not interpreted"} |\n`;}
    text+=`\nWhat this establishes in the model: ${s.establishes}\n\nWhat it does not establish: ${s.cannot}\n\nNext measurement: ${s.next}\n\n${s.equation}\n\n<details><summary>Reproducible parameters</summary>\n\n\`\`\`json\n${JSON.stringify({before:pair.before.settings,after:pair.after.settings},null,2)}\n\`\`\`\n\n</details>\n`;
  });
  text+=`\n## Scientific boundaries\n\nExpression loss can arise in integrated transgenes and does not by itself diagnose integration failure ([Cabrera et al., 2022](https://www.cell.com/cell-systems/fulltext/S2405-4712(22)00464-1)). The one-site depletion and competition equations require their stated equilibrium and concentration assumptions ([Hulme and Trevethick, 2010](https://pmc.ncbi.nlm.nih.gov/articles/PMC3000649/)). Fluorescent rituximab displacement on Raji cells has experimental precedent as competition binding, separate from downstream activity ([Visser et al., 2013](https://d-nb.info/1196862753/34)). The generic reporter used here is a stipulated mathematical transfer function, not an empirical finding about rituximab.\n`;
  return text;
}
