# Comparability Check: simulation stress tests

Data-Rich, Insight-Poor CCLX · 99 Small Problems · No. 07

Version 0.5.0; seed 26007; 100,000 iterations per scenario; 16 independent blocks per repeated experiment. Total: 600,000 repeat experiments and 100,000 paired cell-context draws.

Synthetic demonstrations, not biological validation. More iterations reduce simulation error, not confounding, model error, or uncertainty about an actual antibody lot.

## Endpoint experiments

Six separately seeded scenario streams. Normal log-endpoint errors; 8 blocks by default; complete paired bridges; shared block SD .15, method-within-block SD .10, differential lot SD .08, endpoint residual SD per scenario. Historical eras have independent run SD .25. All uncertainty is at endpoint/block level, not a raw-curve fit. Illustrative margins 0.8–1.25; 90% CI inclusion implements TOST. Per-contrast 95% coverage is not simultaneous coverage.

Coverage is evaluated against the conditional contrast's true log ratio. For the historical column only, coverage is deliberately evaluated against the lot contrast under P: this tests the invalid interpretation of the historical ratio as that lot effect. “Contains 1” is a nonsignificant difference, not equivalence. The historical equivalence rate is an unjustified claim rate, not valid TOST power. The JSON contains Wilson 95% Monte Carlo intervals and Monte Carlo standard errors for every rate.

| Scenario | Contrast | Target ratio | Mean estimate¹ | Log bias | 95% coverage | 90% CI inside margins | 95% CI contains 1 |
|---|---|---:|---:|---:|---:|---:|---:|
| Shared method shift | historical | 1.000 | 0.250 | -1.386 | 0.00% | 0.00% | 0.00% |
| Shared method shift | P | 1.000 | 1.000 | -0.000 | 94.95% | 99.57% | 94.95% |
| Shared method shift | Q | 1.000 | 1.000 | -0.000 | 95.02% | 99.64% | 95.02% |
| Shared method shift | interaction | 1.000 | 1.000 | 0.000 | 94.92% | 94.24% | 94.92% |
| A real lot shift hidden by method | historical | 2.000 | 1.000 | -0.693 | 0.00% | 40.59% | 94.95% |
| A real lot shift hidden by method | P | 2.000 | 2.000 | -0.000 | 95.01% | 0.00% | 0.00% |
| A real lot shift hidden by method | Q | 2.000 | 2.000 | 0.000 | 94.94% | 0.00% | 0.00% |
| A real lot shift hidden by method | interaction | 1.000 | 1.000 | 0.000 | 94.96% | 94.18% | 94.96% |
| Lot-by-method interaction | historical | 1.000 | 0.375 | -0.980 | 0.00% | 0.00% | 0.00% |
| Lot-by-method interaction | P | 1.000 | 1.000 | 0.000 | 94.92% | 99.59% | 94.92% |
| Lot-by-method interaction | Q | 1.500 | 1.500 | -0.000 | 95.08% | 0.00% | 0.00% |
| Lot-by-method interaction | interaction | 1.500 | 1.500 | -0.000 | 94.97% | 0.00% | 0.00% |
| Comparator-specific drift | historical | 1.000 | 1.000 | 0.000 | 94.90% | 40.49% | 94.90% |
| Comparator-specific drift | P | 1.000 | 1.000 | 0.000 | 94.91% | 99.57% | 94.91% |
| Comparator-specific drift | Q | 2.000 | 2.000 | 0.000 | 94.91% | 0.00% | 0.00% |
| Comparator-specific drift | interaction | 2.000 | 2.000 | 0.000 | 94.86% | 0.00% | 0.00% |
| Exactly on the upper margin | historical | 1.250 | 1.249 | -0.000 | 95.04% | 4.66% | 43.41% |
| Exactly on the upper margin | P | 1.250 | 1.250 | -0.000 | 95.03% | 4.96% | 0.63% |
| Exactly on the upper margin | Q | 1.250 | 1.250 | 0.000 | 94.99% | 4.91% | 0.64% |
| Exactly on the upper margin | interaction | 1.000 | 1.000 | 0.000 | 95.09% | 94.42% | 95.09% |
| Equal lots, noisy assay | historical | 1.000 | 1.000 | -0.000 | 94.96% | 0.45% | 94.96% |
| Equal lots, noisy assay | P | 1.000 | 1.000 | 0.000 | 94.98% | 1.72% | 94.98% |
| Equal lots, noisy assay | Q | 1.000 | 1.000 | 0.000 | 95.06% | 1.73% | 95.06% |
| Equal lots, noisy assay | interaction | 1.000 | 1.000 | 0.000 | 94.98% | 0.04% | 94.98% |

¹ Exponential of the mean estimated log ratio, not the arithmetic mean ratio.

- **Shared method shift:** A fourfold common method shift cancels in paired lot contrasts, not in an unbridged historical contrast.
- **A real lot shift hidden by method:** A twofold lot effect and a compensating method shift produce matching historical midpoints.
- **Lot-by-method interaction:** A contrast established under P does not transport to Q; the ratio of ratios isolates the interaction.
- **Comparator-specific drift:** A shifts only under Q. The bridge detects a changed contrast but cannot attribute it uniquely to A, B, or their context.
- **Exactly on the upper margin:** Equality to an acceptance boundary is not equivalence. The rejection rate should be no more than about 5% under this model.
- **Equal lots, noisy assay:** A confidence interval containing 1 is not positive evidence of equivalence. Low precision often leaves both questions unresolved.

## Raji versus engineered-cell scenarios

Independent log-uniform ranges; K 0.3–3 nM, rho 30,000–300,000 sites, retained p 0.2–1, density retention 0.2–1, cells 50,000–1,000,000, volume 50–200 µL, tracer 0.3–10 nM, S50 1,000–30,000 occupied sites.

Each draw compares initially matched Raji and engineered cells; Raji is held fixed. p and density retention apply only to the engineered after-state. Competition and reporter use negligible depletion, equal before/after tracer, and h=1; they are separate regimes from the finite-supply binding calculation. No avidity or genomic mechanism is simulated.

| Engineered after / unchanged reference | 5th percentile | Median | 95th percentile |
|---|---:|---:|---:|
| plateauRatio | 0.0665 | 0.2004 | 0.6023 |
| bindingNoDepletionRatio | 1.0000 | 1.0000 | 1.0000 |
| bindingFiniteSupplyRatio | 0.5111 | 0.8874 | 0.9868 |
| competitionRatio | 1.0000 | 1.0000 | 1.0000 |
| reporterRatio | 0.2687 | 0.5508 | 0.9382 |

These are sensitivity-distribution quantiles under chosen input ranges, not confidence intervals or estimated population frequencies. Expression loss can reduce the signal plateau without moving the normalized midpoint; finite ligand supply changes that result ([Hulme and Trevethick, 2010](https://pmc.ncbi.nlm.nih.gov/articles/PMC3000649/)). The generic reporter is not rituximab signaling, CDC, or ADCC.

## Equal EC50 does not imply a common dose ratio

Both normalized curves have EC50 = 1, lower/upper asymptotes 0/1, and slopes 1 versus 2. The dose ratios B/A at 20%, 50%, and 80% response are 2.00, 1.00, 0.50. A single horizontal displacement cannot describe these curves; relative-potency interpretation requires supported curve similarity ([White et al., 2019](https://www.tandfonline.com/doi/full/10.2144/btn-2019-0031)).

## Prior installment and interpretation

This extends [Data-Rich, Insight-Poor CCI: The Assay Got Better Because the Cells Got Worse](https://www.linkedin.com/pulse/assay-got-better-because-cells-worse-ermelinda-damko-6kvme). That essay assembles mechanisms and simulations, not a measured longitudinal rituximab/Raji passage series.

The 90% confidence-interval inclusion rule is the interval form of two one-sided tests at alpha 0.05; nonsignificance alone does not demonstrate equivalence ([Lakens, 2017](https://pmc.ncbi.nlm.nih.gov/articles/PMC5502906/)). The 0.8–1.25 margins here are illustrative, not bioassay acceptance criteria.
