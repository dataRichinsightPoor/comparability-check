# Simulation design and reference-run findings

Data-Rich, Insight-Poor CCLX · 99 Small Problems · No. 07

The repeated endpoint experiments and the paired-cell sensitivity ensemble answer different questions. Neither is calibrated to a commercial antibody or an observed passage series.

## Endpoint data-generating model

For each complete independent block, the four simulated natural-log endpoints are:

\[
\begin{aligned}
y_{AP}&=u+v_P+e_{AP}\\
y_{BP}&=\log\theta+u+v_P+z+e_{BP}\\
y_{AQ}&=\log m+\log a+u+v_Q+e_{AQ}\\
y_{BQ}&=\log\theta+\log m+\log i+u+v_Q+z+e_{BQ}.
\end{aligned}
\]

All stochastic terms are zero-mean normal. Their standard deviations are 0.15 for shared block state \(u\), 0.10 for each method-within-block state \(v\), 0.08 for differential lot response \(z\), and the scenario-specific \(\sigma\) for each endpoint error \(e\). The latent components are independent, except where the same variable is explicitly reused.

The paired contrasts are \(d_P=y_{BP}-y_{AP}\), \(d_Q=y_{BQ}-y_{AQ}\), and \(d_I=d_Q-d_P\). The shared differential lot term creates covariance between P and Q; forming \(d_I\) inside each block preserves it. Population targets are \(\theta\), \(\theta i/a\), and \(i/a\), respectively, on the ratio scale.

An intentionally unbridged historical comparison uses a separate draw:

\[
d_H=\log\theta+\log m+\log i+u_{\mathrm{new}}-u_{\mathrm{old}}+e_{\mathrm{new}}-e_{\mathrm{old}},
\]

where historical run-state SD is 0.25 and endpoint-error SD is \(\sigma\). The mean historical ratio is centered on \(\theta mi\), not necessarily \(\theta\). Historical coverage is deliberately scored against \(\theta\) to test the mistaken claim that this historical ratio identifies the lot contrast under P.

Each repeat contains 4, 8, or 16 independent blocks in the committed reference runs. All t intervals use the observed variance of the block-level contrast and \(n-1\) degrees of freedom; 90% CI inclusion inside 0.8–1.25 is the illustrative equivalence criterion, and 95% coverage is evaluated separately. These are per-contrast calculations, not a simultaneous familywise claim. The equivalence rule implements TOST at alpha 0.05, but the margins remain illustrative ([Lakens, 2017](https://pmc.ncbi.nlm.nih.gov/articles/PMC5502906/)).

## Scenarios and reproducibility

| Scenario | \(\theta\) | Method \(m\) | Interaction \(i\) | A-specific Q multiplier \(a\) | Endpoint SD \(\sigma\) |
|---|---:|---:|---:|---:|---:|
| Shared method shift | 1 | 0.25 | 1 | 1 | 0.12 |
| Masked lot shift | 2 | 0.5 | 1 | 1 | 0.12 |
| Lot-by-method interaction | 1 | 0.25 | 1.5 | 1 | 0.12 |
| Comparator-specific drift | 1 | 1 | 1 | 0.5 | 0.12 |
| Upper-margin boundary | 1.25 | 1 | 1 | 1 | 0.12 |
| Equal lots, noisy assay | 1 | 1 | 1 | 1 | 0.45 |

The PRNG is Mulberry32 with unsigned 32-bit state and midpoint-adjusted uniforms strictly inside (0,1); normal deviates use Box–Muller. Scenario \(j\), indexed from zero, uses `(seed + 1009*j) >>> 0`; the cell ensemble uses `(seed ^ 0xA53C91E7) >>> 0`. Streams are deterministic pseudorandom constructions, not a formal proof of statistical independence.

The committed primary run uses seed 26007, 8 blocks, and 100,000 iterations per scenario. Three additional configurations use a second seed (71260, 8 blocks) and 4/16 blocks with seed 26007, totaling 2,400,000 repeated endpoint experiments. Each configuration also evaluates 100,000 paired cell scenarios; block-count changes intentionally reuse the same cell draws, so the 400,000 cell evaluations are not 400,000 unique parameter sets.

## What the executed runs show

Under the primary seed, paired P 95% coverage ranges from 94.99% to 95.06% across scenarios. This is a software/model calibration check under normal log errors, not experimental validation.

- **Precision can support a defensible comparison:** In the shared-shift scenario, within-P equivalence declaration rises from 32.057% with 4 blocks to 83.177% with 8 and 99.573% with 16. The lots are equal under that conditional endpoint model.
- **Precision can strengthen an invalid comparison:** In the masked twofold-lot-shift scenario, the unjustified historical equivalence declaration rises from 2.869% to 7.830% to 40.589% as blocks increase from 4 to 8 to 16. The historical method shift cancels the real lot effect; more data sharpen the wrong target.
- **Boundary behavior is calibrated:** At the true upper-margin boundary, within-P false-equivalence rates are 4.819%, 4.995%, and 4.960%. The result is consistent with the expected approximately 5% boundary behavior of the implemented rule under its assumptions.
- **Nonsignificance is not equivalence:** In the noisy equal-lot primary scenario, the within-P equivalence declaration rate is only 0.415%, despite about 95% coverage of unity. The assay is too imprecise for these margins at this run count.
- **A second seed does not change the lesson:** For 8 blocks, the shared-shift within-P equivalence rate is 82.879% under seed 71260 versus 83.177% under seed 26007; masked historical declarations are 8.013% versus 7.830%. Monte Carlo intervals accompany every rate in the JSON.

The primary cell ensemble gives median engineered/reference ratios of 0.2004 for absolute binding plateau, 1 for negligible-depletion binding EC50, 0.8874 for finite-supply binding EC50, 1 for negligible-depletion competition IC50 at fixed tracer, and 0.5508 for the separate generic reporter. These values follow from the deliberately chosen input distributions, not a measured or predicted Raji population.

## What is not randomized or inferred

No noisy raw concentration-response data are generated or fitted. The normal log-endpoint errors summarize hypothetical independent-run uncertainty; they do not model fitting failures, censoring, unsuitable curves, concentration calibration error or selection of successful runs.

The cell ensemble is a sensitivity analysis over independent log-uniform ranges documented in every report. It does not assign probabilities to genomic mechanisms, validate endogenous-cell stability, or model avidity. The finite-supply binding and negligible-depletion reporter calculations are separate regimes; their medians are not claimed to coexist in one physically identical assay well.

Read [the comparison principles](COMPARABILITY-PRINCIPLES.md) before applying these demonstrations to an experimental decision. More simulation iterations reduce Monte Carlo error only.
