# More data can strengthen the wrong comparison

Data-Rich, Insight-Poor CCLX · 99 Small Problems · No. 07

## Publication caption

**Figure. Replication increases misleading historical lot-equivalence declarations when a method shift masks a true lot difference.** **A**, In the synthetic masked-lot scenario, the true within-method EC50 ratio for lot B versus lot A is 2.0, while the new/old method multiplier is 0.5. Their product centers the unbridged historical comparison, new lot under new method versus old lot under old method, on a ratio of 1.0; the lot effect remains confounded with method ([Comparability Check v0.5.0, simulation design](https://github.com/dataRichinsightPoor/comparability-check/blob/v0.5.0/docs/SIMULATION-DESIGN.md)).

**B**, Across 100,000 repeated experiments at each run count, the proportion of historical comparisons satisfying the numerical equivalence criterion increased from 2.869% with 4 independent runs to 7.830% with 8 and 40.589% with 16; declaring lot equivalence from that historical contrast is unjustified because the true lot ratio is 2.0 ([4-run results](https://github.com/dataRichinsightPoor/comparability-check/blob/v0.5.0/results/blocks-4/simulation-results.json), [8-run results](https://github.com/dataRichinsightPoor/comparability-check/blob/v0.5.0/results/simulation-results.json), [16-run results](https://github.com/dataRichinsightPoor/comparability-check/blob/v0.5.0/results/blocks-16/simulation-results.json)). Bars show the simulated declaration rates; whiskers show 95% Wilson Monte Carlo intervals, which quantify finite-simulation uncertainty and are narrow at this iteration count. These whiskers are not the experimental confidence intervals used to make the equivalence decision.

Within each repeated experiment, the decision rule requires the 90% Student t confidence interval for the mean log historical ratio, exponentiated to the ratio scale, to lie strictly within 0.8–1.25, using n−1 degrees of freedom; the margins are illustrative rather than validated assay acceptance limits ([simulation implementation](https://github.com/dataRichinsightPoor/comparability-check/blob/v0.5.0/web/simulation-model.mjs)). Confidence-interval inclusion is the interval form of two one-sided equivalence tests at alpha 0.05, but the statistical rule does not make a confounded contrast identify a lot effect ([Lakens, 2017](https://pmc.ncbi.nlm.nih.gov/articles/PMC5502906/)).

More independent runs increase precision around the method-confounded target; they do not establish comparability of the lots. The displayed values are synthetic model outputs, not observed antibody-lot measurements.

The historical ratio is centered at one on the log scale: its population geometric mean is one, not necessarily its arithmetic mean under lognormal noise. The failure illustrated here is attribution of a correctly estimated historical contrast to the wrong biological quantity, not failure of the t-interval calculation.

## What the figure means for late-stage QC

The equivalence rule shown here is not a universal batch-release rule. ICH Q6B calls for a relevant, validated potency assay and appropriately characterized reference materials; ICH Q2(R2) addresses intended-purpose validation, while Q14 addresses development, control strategy, monitoring and analytical-procedure changes ([ICH Q6B](https://database.ich.org/sites/default/files/Q6B%20Guideline.pdf), [ICH Q2(R2), final with 2025 corrections](https://database.ich.org/sites/default/files/ICH_Q2(R2)_Guideline_2023_1130_ErrorCorrection_2025.pdf), [ICH Q14, final with 2025 corrections](https://database.ich.org/sites/default/files/ICH_Q14_Guideline_2023_1130_ErrorCorrection_2025.pdf)).

System/sample suitability, analytical validation criteria, product-release specifications and study-specific comparability criteria answer different questions; the model's illustrative 0.8–1.25 interval must not be substituted for those decisions ([ICH Q14](https://database.ich.org/sites/default/files/ICH_Q14_Guideline_2023_1130_ErrorCorrection_2025.pdf), [ICH Q2(R2)](https://database.ich.org/sites/default/files/ICH_Q2(R2)_Guideline_2023_1130_ErrorCorrection_2025.pdf)). In a manufacturing-change comparability exercise, routine specification tests alone are generally not adequate, even if pre- and post-change lots pass them ([ICH Q5E](https://database.ich.org/sites/default/files/Q5E%20Guideline.pdf)).

A midpoint ratio can represent relative potency only when the response-curve relationship supports that interpretation; slope and asymptote differences cannot simply be discarded ([White et al., 2019](https://www.tandfonline.com/doi/full/10.2144/btn-2019-0031)). Independent-run precision, the reportable-result format, and potential correlation among runs must also be understood; additional technical wells do not substitute for estimation of run-to-run variability ([Li et al., online 2024; issue 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC11788244/)).

## What the figure means for early-stage assays

Early discovery can use assays for provisional ranking or hypothesis generation without claiming commercial-release readiness, but it still requires biological relevance and decision-appropriate evidence of reproducibility ([Assay Guidance Manual, HTS Assay Validation](https://www.ncbi.nlm.nih.gov/books/NBK83783/)). A good Z′ describes control-signal separation, not by itself potency reproducibility; combining results from changed assays requires an appropriate comparison study, and the manual advises against pooling results when the assays are not equivalent for that purpose ([Assay Guidance Manual](https://www.ncbi.nlm.nih.gov/books/NBK83783/)).

The practical lesson is to match the claim to the evidence: provisional within-assay ranking is not a bridge across methods, cell backgrounds or years. For the full distinction between late-stage QC standards and early-stage comparison pitfalls, see the accompanying revised essay, “To Be or Not to Be Comparable.”

## Exact plotted values

| Independent runs, n | Declarations / repeats | Declaration rate | 95% Wilson Monte Carlo interval |
|---:|---:|---:|---:|
| 4 | 2,869 / 100,000 | 2.869% | 2.7673–2.9743% |
| 8 | 7,830 / 100,000 | 7.830% | 7.6651–7.9981% |
| 16 | 40,589 / 100,000 | 40.589% | 40.2850–40.8937% |

Values and intervals are taken directly from the versioned [4-run](https://github.com/dataRichinsightPoor/comparability-check/blob/v0.5.0/results/blocks-4/simulation-results.json), [8-run](https://github.com/dataRichinsightPoor/comparability-check/blob/v0.5.0/results/simulation-results.json), and [16-run](https://github.com/dataRichinsightPoor/comparability-check/blob/v0.5.0/results/blocks-16/simulation-results.json) output files. The graphic rounds rates to two decimal places; no interval widths are exaggerated for visibility.

## Model details and limits

For each historical replicate, the natural-log contrast is the sum of log lot ratio, log method multiplier, two independent historical run-state terms with SD 0.25 each (new minus old), and two independent endpoint errors with SD 0.12 each (new minus old); thus the true log contrast is zero although the within-method lot ratio is two ([data-generating model](https://github.com/dataRichinsightPoor/comparability-check/blob/v0.5.0/docs/SIMULATION-DESIGN.md)). The plotted configurations use base seed 26007 and masked-scenario seed 27016; n counts independent run-level contrasts, not technical wells or Monte Carlo iterations ([implementation](https://github.com/dataRichinsightPoor/comparability-check/blob/v0.5.0/web/simulation-model.mjs)).

No noisy dose-response curves are fitted, and the simulation does not propagate curve-fit covariance, evaluate parallelism, or model avidity, receptor biology, expression drift, or genomic instability in this historical scenario ([simulation boundaries](https://github.com/dataRichinsightPoor/comparability-check/blob/v0.5.0/docs/SIMULATION-DESIGN.md)). A second seed at n=8 yielded an 8.013% historical declaration rate, supporting the stability of the illustrative result but not its biological generality ([independent-seed check](https://github.com/dataRichinsightPoor/comparability-check/blob/v0.5.0/results/seed-check/simulation-results.json)).

## Alt text

Two-panel scientific figure titled “More data can strengthen the wrong comparison.” Panel A shows a true lot EC50 ratio of 2.0 multiplied by a method shift of 0.5, centering the historical ratio on 1.0 on the log scale while lot and method remain confounded. Panel B is a zero-based bar chart, with a vertical axis from 0% to 50%, showing misleading historical lot-equivalence declaration rates of 2.87%, 7.83%, and 40.59% for 4, 8, and 16 independent run-level contrasts. Each condition contains 100,000 simulated experiments. Thin whiskers are 95% Wilson Monte Carlo intervals. The figure distinguishes these from the 90% t confidence interval used for each equivalence declaration and labels the results synthetic, not biological validation.

## Files and intended use

- **PNG:** 4,320 × 3,360 pixels at 600 dpi, corresponding to 7.2 × 5.6 inches. White background for print and article placement.
- **SVG:** Vector artwork with editable text, embedded Lato fonts and their license, source URL, accessibility title/description, and exact data in metadata. The nominal size is also 7.2 × 5.6 inches.
- **CSV and JSON:** Unrounded plotted values, Monte Carlo intervals, counts, seeds, and version-pinned source URLs.

Keep the synthetic-data caveat and the distinction between the two types of interval when cropping or adapting the figure. The figure is a fixed reference result from model v0.5.0, even when displayed in a newer version of the live model.
