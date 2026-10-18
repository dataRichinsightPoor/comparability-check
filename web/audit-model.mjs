/**
 * Deterministic reasoning checklist, not an evidence-scoring or validation model.
 * Inputs are user declarations. No curve, document or biological mechanism is
 * verified by selecting an option.
 */
export const AUDIT_DEFAULTS={claim:"lot",endpointA:"binding",endpointB:"binding",design:"historical",units:"unknown",curves:"unknown",cells:"unknown",expression:"unknown"};
export const CLAIM_LABELS={lot:"A lot-specific difference",cell:"A change in the cell substrate",transfer:"A lot contrast transfers across methods",equivalence:"Endpoint-specific lot equivalence",affinity:"A change in intrinsic affinity",integration:"Poor integration caused expression loss",function:"Binding predicts functional blocking"};
export const ENDPOINT_LABELS={binding:"Direct-binding EC50",competition:"Tracer-competition IC50",functional:"Functional-blocking IC50"};
const allowed={claim:Object.keys(CLAIM_LABELS),endpointA:Object.keys(ENDPOINT_LABELS),endpointB:Object.keys(ENDPOINT_LABELS),design:["historical","sideBySide","crossed"],units:["yes","no","unknown"],curves:["yes","no","unknown"],cells:["matched","changed","unknown"],expression:["tracked","untracked","unknown"]};
export function validateAudit(input={}){
  if(input===null||typeof input!=="object"||Array.isArray(input))throw new Error("Audit settings must be an object.");
  const s={...AUDIT_DEFAULTS,...input};
  for(const [key,values] of Object.entries(allowed))if(!values.includes(s[key]))throw new Error(`Unrecognized audit setting: ${key}.`);
  return s;
}
export function auditComparison(input={}){
  const s=validateAudit(input),gaps=[],actions=[],sameEndpoint=s.endpointA===s.endpointB;
  const boundary="This is a design audit based on your declarations. It does not inspect raw curves, verify provenance, estimate a contrast, or validate a causal mechanism.";
  if(!sameEndpoint){
    gaps.push("Endpoint identity differs. A binding midpoint, tracer-displacement midpoint and functional-inhibition midpoint do not estimate one interchangeable quantity.");
    actions.push("Define the endpoint-specific question; analyze each response separately before testing a mechanistic relationship between them.");
  }
  if(s.units!=="yes"){
    gaps.push(s.units==="no"?"Concentration scales are not yet harmonized.":"Common concentration units and active-species definitions are not established.");
    actions.push("Verify molar versus mass units, active species and concentration provenance; convert only where the required molecular definition is known.");
  }
  if(s.curves!=="yes"){
    gaps.push(s.curves==="no"?"The declared curves do not support a reliable midpoint.":"Curve coverage and midpoint support have not been established.");
    actions.push("Inspect raw curves, range coverage, plateaus, fit constraints, baseline signal and independent-run uncertainty before interpreting a midpoint.");
  }
  let title,statement,next,route;
  switch(s.claim){
    case "lot":
      title="Separate the lot contrast from its context.";
      statement="Report an observed endpoint difference with its assay context; do not attribute it to lot alone while design or measurement conditions remain unresolved.";
      if(s.design==="historical")gaps.push("Lot and testing context are not separated by the historical design.");
      if(s.cells!=="matched")gaps.push("The cell substrate is not declared matched within each intended lot contrast.");
      next="Test both available lots side by side on the same qualified cell preparation, using the same endpoint and an appropriate reference. This compares present-day materials, not necessarily their original manufactured state.";
      route=s.design==="crossed"?"bridge":"history";break;
    case "cell":
      title="Measure the changing substrate, not only its midpoint.";
      statement="A cell-associated change can be described if the cell phenotype is measured; an antibody defect or genomic cause does not follow from that observation.";
      if(s.expression!=="tracked")gaps.push("Positive fraction and per-positive-cell surface expression are not tracked across the relevant samples or passages.");
      if(s.design==="historical")gaps.push("Historical measurements leave assay drift and cell-state drift entangled.");
      next="Use the same antibody aliquot across defined cell states and passage points, and measure positive fraction, per-positive-cell expression distribution, viability and absolute signal alongside the response curves.";
      route="context";break;
    case "transfer":
      title="Test whether the lot contrast survives the method change.";
      statement="Transfer concerns preservation of a specified contrast over the evaluated conditions, not universal method interchangeability.";
      if(s.design!=="crossed")gaps.push("Both lots under both methods have not been declared in a complete crossed design.");
      if(s.cells!=="matched")gaps.push("Cell preparation must be matched between lots within each method, or its contribution separately modeled.");
      next="Measure both lots under both implemented methods in independent complete blocks; estimate each within-method lot ratio and the ratio of those ratios with uncertainty.";
      route="bridge";break;
    case "equivalence":
      title="Equivalence is a decision with margins, not visual similarity.";
      statement="No equivalence result can be issued from this checklist. A compatible design still requires a supported contrast and a confidence interval inside justified, prespecified margins.";
      gaps.push("This audit has not evaluated an effect estimate, independent-run uncertainty, or the justification and timing of equivalence margins.");
      if(s.design==="historical")gaps.push("An unbridged historical design does not isolate the intended lot comparison.");
      if(s.cells!=="matched")gaps.push("The cell substrate is not declared matched within the intended lot contrast.");
      next="Prespecify the endpoint, acceptable difference and uncertainty procedure, then collect the corresponding side-by-side or crossed data. Never mix binding EC50 and blocking IC50 in one equivalence contrast.";
      route="bridge";break;
    case "affinity":
      title="An endpoint midpoint does not identify intrinsic affinity.";
      statement="Describe the measured EC50 or IC50. Do not relabel it as an intrinsic Kd solely because the units are concentration.";
      gaps.push("This audit has not established equilibrium, free ligand, a supported valency/stoichiometry model, or separation of avidity and target-density effects.");
      next="Choose measurements and a binding model that support the intended affinity parameter, and test equilibrium, ligand depletion and valency assumptions independently.";
      route="context";break;
    case "integration":
      title="Expression loss does not establish integration failure.";
      statement="Describe expression instability if observed. Distinguish loss of DNA, transcriptional silencing, altered surface presentation and population selection before assigning a genomic cause.";
      gaps.push("DNA integration/copy/integrity evidence and its connection to transcript and surface phenotype have not been evaluated by this tool.");
      if(s.expression!=="tracked")gaps.push("The surface-expression trajectory itself is not yet documented in the audit.");
      next="Link longitudinal surface-expression distributions to independently assessed DNA copy/integrity and transcript evidence; account for selection or changes in population composition.";
      route="context";break;
    case "function":
      title="Occupancy and function need an experimentally supported connection.";
      statement="Binding, tracer displacement and downstream inhibition can be compared as distinct endpoints, not treated as one potency measurement.";
      gaps.push("The blocked interaction, challenge concentration, downstream readout and occupancy-to-response relationship have not been established here.");
      next="Define what is blocked and measure binding and function under linked conditions. Assess absolute baseline response, maximal inhibition, stimulus dependence and timing before interpreting midpoint differences.";
      route="context";break;
  }
  const ready=gaps.length===0;
  if(ready)statement="Your declarations describe a design potentially suitable for the requested endpoint comparison. This is not a result: estimates, uncertainty and assay suitability still need to be evaluated.";
  return {settings:s,claim:CLAIM_LABELS[s.claim],sameEndpoint,title,statement,gaps,actions,next,route,
    status:ready?"DESIGN MAY SUPPORT THE COMPARISON":"CLAIM NOT ESTABLISHED BY THIS AUDIT",boundary};
}
