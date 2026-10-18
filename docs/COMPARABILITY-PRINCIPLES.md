# What we can and cannot compare

Data-Rich, Insight-Poor CCLX · 99 Small Problems · No. 07

The useful question is not whether two numbers can be divided. It is whether that division estimates the biological contrast being claimed, and whether the design distinguishes that contrast from the measurement system.

This guide accompanies a synthetic rituximab–Raji example and a hypothetical engineered comparator. It does not diagnose any actual lot or cell line.

## Begin with the claim, not the spreadsheet

| Intended claim | What can support it | What is insufficient |
|---|---|---|
| The reported midpoint changed | Defined endpoints, units, provenance, and supported curves | An unexplained “EC50” column |
| Lots differ under a specified method | Side-by-side lots, suitable reference/controls, independent runs, uncertainty, and curve similarity | Old lot/old method versus new lot/new method alone |
| A lot contrast transfers across methods | Crossed lot-by-method measurements and uncertainty on the interaction, with justified margins | A shared shift in the reference alone |
| Preparations are endpoint-equivalent | Fit-for-purpose assay, supported similar curves, justified prespecified margins, sufficiently precise equivalence analysis | Nonsignificance or close point estimates |
| Expression loss changed the measurement | Joint expression-distribution, signal, assay-geometry and endpoint tracking, with discriminating perturbations | A passage-associated IC50 trajectory alone |
| The transgene was lost from the genome | DNA-level evidence distinguished from transcription, protein and surface expression | Declining fluorescence alone |
| Binding predicts blockade or function | A defined endpoint relationship tested across relevant perturbations and samples | Binding EC50 and blocking IC50 sharing units |
| Microscopic affinity changed | A supported mechanistic binding experiment accounting for equilibrium and available ligand | A cell-binding EC50 alone |

This is an inference checklist, not a regulatory acceptance standard. Relative potency requires supported curve similarity, and equivalence margins must be justified for the assay rather than borrowed from a generic range ([White et al., 2019](https://www.tandfonline.com/doi/full/10.2144/btn-2019-0031)).

## Three different comparisons

### Numerical description

“The reported EC50 was fourfold lower” can be an accurate description. It does not by itself identify a changed molecule, an improved assay, stronger intrinsic affinity, or greater functional activity.

In the model, the old/new ratio is a product of lot and method-context factors. More precise repeated observations of the same confounded design narrow uncertainty about that product; they do not uniquely identify its factors.

### Relative potency within an assay

A defensible single relative potency is a horizontal displacement between sufficiently similar response curves, not merely the ratio of arbitrary fitted inflection points ([White et al., 2019](https://www.tandfonline.com/doi/full/10.2144/btn-2019-0031)). The app's counterexample fixes both midpoints at 1 but changes the normalized Hill slope from 1 to 2: dose ratios at 20%, 50%, and 80% response become 2, 1, and 0.5.

Normalization may remove an amplitude difference by construction. Keep absolute plateaus, backgrounds, slopes, residuals, concentration coverage and exclusions visible; the curve-similarity assessment must match the endpoint and intended use ([White et al., 2019](https://www.tandfonline.com/doi/full/10.2144/btn-2019-0031)).

### Transfer between assays

A common method multiplier cancels from within-method ratios in the simplified model. A lot-by-method interaction does not, and a ratio-of-ratios can expose its presence without assigning its molecular cause.

Rituximab standardization provides an empirical reason not to declare all cross-protocol comparison impossible: laboratories using different qualified methods achieved improved agreement when referencing a common preparation ([Prior et al., 2018](https://pmc.ncbi.nlm.nih.gov/articles/PMC5836816/)). The binding subset was small, five laboratories overall; sample C's reported interlaboratory GCV was 29% with local references and 7% against the common candidate, but the contributing laboratory sets were four and five, respectively, so this is not a perfectly paired universal improvement estimate ([Prior et al., 2018](https://pmc.ncbi.nlm.nih.gov/articles/PMC5836816/)).

A shared standard supports traceability and harmonization, not an automatic declaration of whole-product biosimilarity or interchangeability of binding, CDC and ADCC endpoints ([Prior et al., 2018](https://pmc.ncbi.nlm.nih.gov/articles/PMC5836816/)). The Monte Carlo comparator-drift scenario shows how a changed comparator can alter a relative contrast without a change to the test material.

## Raji versus an engineered population

“Endogenous” and “engineered” describe origin, not guaranteed assay stability. Raji-derived populations can change CD20 expression under selection; treating Raji as constant here is a stipulated counterfactual control, not a factual claim about every passage series ([CD20 regulation study](https://pmc.ncbi.nlm.nih.gov/articles/PMC3288324/)).

Transgene silencing can occur after stable integration and can appear as fewer expressing cells or lower expression within cells ([Cabrera et al., 2022](https://www.cell.com/cell-systems/fulltext/S2405-4712(22)00464-1)). Therefore “poor integration” is a hypothesis requiring evidence, not a conclusion supplied by falling surface signal.

In the model's all-cell arithmetic mean, the plateau scales with positive fraction times sites per positive cell. Under homogeneous one-site equilibrium with negligible depletion, amplitude loss can leave the normalized EC50 unchanged; under finite ligand supply, total-concentration EC50 equals K + RT/2, so falling total target can move the midpoint left with K fixed ([Hulme and Trevethick, 2010](https://pmc.ncbi.nlm.nih.gov/articles/PMC3000649/)).

That direction is not a universal prediction for a full IgG. Rituximab's live-cell binding can involve bivalent stabilization and concentration-dependent dynamics, so changes in avidity, accessibility, receptor organization or kinetics can violate the one-site model; the cited experiment used Daudi, not the synthetic Raji population in this app ([Bondza et al., 2020](https://doi.org/10.1080/19420862.2020.1792673)).

The discriminating measurements proposed here are distributions of positive fraction and per-positive-cell expression, viable-cell counts, assay volume, tracer concentration, absolute plateaus, and time-to-equilibrium checks. Genomic causation requires a separate DNA/RNA/protein investigation rather than a more elaborate fit to IC50 alone.

## Binding, competitive blocking, and functional blocking

Fluorescent rituximab displacement on Raji cells is a competition-binding assay, not itself a downstream effector-function measurement ([Visser et al., 2013](https://d-nb.info/1196862753/34)). Under the app's equal-affinity homologous, mutually exclusive, equilibrium and negligible-depletion assumptions, competitive IC50 = K + free tracer; changing tracer changes that endpoint while leaving the one-site binding parameter fixed ([Hulme and Trevethick, 2010](https://pmc.ncbi.nlm.nih.gov/articles/PMC3000649/)).

With depletion, added and free ligand are different quantities, so conservation of ligand and receptor must be modeled rather than applying a free-ligand formula directly to total concentrations ([Hulme and Trevethick, 2010](https://pmc.ncbi.nlm.nih.gov/articles/PMC3000649/)). Equilibration time also matters, and competition may equilibrate more slowly than tracer binding alone ([Hulme and Trevethick, 2010](https://pmc.ncbi.nlm.nih.gov/articles/PMC3000649/)).

The optional generic reporter maps occupied sites through a saturating mathematical transfer function. It is not a CD20 signaling model, CDC, ADCC, or a prediction of rituximab efficacy.

Binding-to-function bridging should evaluate the relevant mechanism and discriminatory behavior, including degraded or otherwise perturbed samples, not merely correlation across a narrow group of intact preparations ([White et al., 2019](https://www.tandfonline.com/doi/full/10.2144/btn-2019-0031)). Correlation is not agreement: proportional bias can preserve correlation while preventing numerical interchangeability ([Bland and Altman, 1986](https://pubmed.ncbi.nlm.nih.gov/2868172/)).

## What a large simulation adds, and what it cannot add

The simulation lab estimates bias, coverage, and decision rates under a declared data-generating model. Each experimental replicate contains independent complete blocks; wells are not substituted for independent runs.

The bridge uses 90% confidence intervals inside illustrative margins as the interval form of TOST at alpha 0.05, and reports 95% intervals separately; a 95% interval containing unity does not establish equivalence ([Lakens, 2017](https://pmc.ncbi.nlm.nih.gov/articles/PMC5502906/)). Margins 0.8–1.25 are deliberately labeled illustrative throughout this project, not adopted as accepted bioassay criteria.

Every estimated rate includes Monte Carlo standard error and a Wilson 95% interval in the JSON. These quantify the finite simulation sample, not assay validation, biological uncertainty, or uncertainty about the input distributions.

The paired cell ensemble varies independent log-uniform inputs over declared ranges. Its 5th–95th percentile bands are sensitivity summaries, not confidence intervals or a claim about the prevalence of those conditions in Raji or engineered cultures.

The simulation does not fit noisy concentration-response curves, propagate individual curve-fit covariance, model concentration errors or censoring, generate heterogeneous positive-cell density distributions, or estimate genomic instability. It also does not simulate avidity, internalization, nonequilibrium kinetics, Fc-effector biology or assay-selection bias. These exclusions limit the conclusions even if millions of iterations converge.

## Connection to the earlier installment

[Data-Rich, Insight-Poor CCI: The Assay Got Better Because the Cells Got Worse](https://www.linkedin.com/pulse/assay-got-better-because-cells-worse-ermelinda-damko-6kvme) developed the possibility that expression loss makes a blocking midpoint look stronger without improving the molecule. That essay also describes opposing mechanisms, amplitude-only changes, and the conditional protection offered by a co-assayed reference; its passage trajectories are simulations and synthesis, not a measured longitudinal antibody dataset ([Damko, CCI](https://www.linkedin.com/pulse/assay-got-better-because-cells-worse-ermelinda-damko-6kvme)).

The present installment turns that caution into a comparison audit. It asks which conclusion survives the design, which assumptions create the apparent agreement, and which additional measurement could separate the explanations.
