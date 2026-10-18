# Comparability Check

Data-Rich, Insight-Poor CCLX · 99 Small Problems · No. 07

## To Be or Not to Be Comparable

An MIT-licensed, research-use model for comparing reported binding EC50 values without quietly turning a measurement difference into a lot effect. This numbered installment uses only synthetic examples and public literature.

[Open the model](https://datarichinsightpoor.github.io/comparability-check/) · [Read the companion essay](docs/COMPANION-ARTICLE.md) · [Inspect the simulation findings](docs/SIMULATION-DESIGN.md)

Version 0.6 adds a dedicated [QC & discovery guide](https://datarichinsightpoor.github.io/comparability-check/#guidance), including [late-stage QC](https://datarichinsightpoor.github.io/comparability-check/#guidance-qc), [early-discovery pitfalls](https://datarichinsightpoor.github.io/comparability-check/#guidance-early), and the [publication figure](https://datarichinsightpoor.github.io/comparability-check/#guidance-figure). The live app bundles the full essay, 600-dpi PNG, editable SVG, referenced caption and exact CSV data for download.

The guidance separates result suitability, procedure validation, product specifications and study-specific comparability. It also distinguishes [development stage, purpose and GMP execution](https://datarichinsightpoor.github.io/comparability-check/#guidance-pharma), with pharmaceutical-industry examples, USP chapter scope and FDA guidance. The figure remains pinned to the original v0.5.0 synthetic runs; it is not recalculated from current Simulation lab controls. Numerical algorithms and their assumptions are unchanged in v0.6.

This research-use tool begins with a claim audit, offers a guided cell-context walkthrough, and separates three inferential problems:

- **Claim audit:** Specify the intended conclusion, endpoint identities, design and declared evidence. Receive an unresolved-evidence checklist and a next discriminating measurement. It never evaluates raw data or converts declarations into proof.
- **Guided walkthrough:** Eight controlled Raji-versus-engineered examples hold the antibody's one-site parameter fixed while separating positive-fraction loss, density loss, normalization, gating, ligand depletion, tracer concentration and a generic functional-response mapping. Each step provides matched-axis before/after plots, numerical outputs, an optional interpretation reveal, inference limits and a next measurement.
- **Historical contrast:** Enter an earlier lot-A/method-P EC50 and a later lot-B/method-Q EC50. Explore different assumed method shifts that produce the same observed ratio. The lot effect remains unidentified; the slider is a sensitivity scenario, not an estimated correction.
- **Cells and endpoints:** Keep a shared one-site antibody binding parameter fixed while changing positive-cell fraction, target density per positive cell, passage, cell load, tracer concentration, and signal population. Compare absolute and normalized binding, competitive tracer blockade, and an explicitly separate generic functional-response sandbox.
- **Crossed bridge:** Enter complete, paired experimental blocks containing both lots under both methods. Estimate within-method geometric EC50 ratios, a ratio-of-ratios interaction, paired Student t confidence intervals, and endpoint-specific equivalence assessments under declared assumptions.
- **Simulation lab:** Repeat six seeded endpoint experiments and a separate paired Raji/engineered-cell sensitivity ensemble, with 1,000 to 1,000,000 iterations per scenario in the browser. Export settings, assumptions, coverage, bias, equivalence rates, Monte Carlo uncertainty, and cell-context quantiles. An analytic unequal-slope example shows why identical EC50 values need not imply a common relative potency.

## Start with the scientific argument

Read [what is and is not comparable](docs/COMPARABILITY-PRINCIPLES.md), then follow the eight-step walkthrough in the browser. The relevant earlier installment is [Data-Rich, Insight-Poor CCI: The Assay Got Better Because the Cells Got Worse](https://www.linkedin.com/pulse/assay-got-better-because-cells-worse-ermelinda-damko-6kvme), a synthesis of mechanisms and simulations rather than a measured longitudinal Raji dataset.

Version 0.5 adds large-iteration stress tests without treating simulation volume as biological evidence. See the [reference simulation report](results/SIMULATION-REPORT.md) and [machine-readable results](results/simulation-results.json). Each reference scenario uses 100,000 iterations, for 600,000 repeat endpoint experiments plus 100,000 paired cell-context draws; independent-seed and block-count checks are in `results/seed-check`, `results/blocks-4`, and `results/blocks-16`.

The [simulation design and findings](docs/SIMULATION-DESIGN.md) specify the generative equations, random streams, interpretation and excluded mechanisms. A shared cooperative generator keeps the browser responsive without worker-origin privileges; the CLI consumes the same generator synchronously.

All bundled numerical examples are synthetic. The rituximab–Raji illustration is motivated by a published cell-binding assay pairing, not by any measured lot discrepancy ([Xu et al., 2019](https://www.tandfonline.com/doi/full/10.1080/19420862.2019.1578147)).

## The coherent scientific question

Did the antibody change, did the cell substrate change, or did the readout change? The model does not collapse these into one potency parameter.

Version 0.3 opens with “Which conclusion are you trying to establish?” rather than a calculator. The audit separates a potentially suitable design from an actual result; it does not approve affinity, genomic causation, functional prediction or equivalence based on selections. Numerical calculation remains in the appropriate model, and the generic functional layer remains distinct from rituximab biology.

The cell simulator audits its own negligible-depletion approximation against finite-supply calculations. Above a 10% diagnostic threshold, a warning recommends testing mass balance; the threshold is a heuristic, not assay qualification. Plots adapt to narrow screens without horizontal scrolling.

Version 0.4 adds the guided walkthrough without changing sandbox inputs during browsing. “Copy after-state to sandbox” explicitly transfers only that step's cell-context parameters. Settings schema 4 preserves the walkthrough position and imports schemas 1–3; answer reveals reset when a step is loaded. The complete walkthrough can be downloaded as a source-cited Markdown handout and is also included at [docs/GUIDED-WALKTHROUGH.md](docs/GUIDED-WALKTHROUGH.md).

The lesson is a sequence of controlled paired thought experiments, not one continuous longitudinal dataset. Within each step, the changed factor is explicit and the charts share a concentration domain. The final functional reporter remains a conceptual extension, not a biological model of rituximab.

Under its one-site, negligible-depletion assumptions, loss of positive cells or accessible sites can reduce the binding plateau without shifting normalized binding EC50. With finite ligand supply, target loss can instead shift the total-concentration EC50 left while the antibody parameter is unchanged; the exact equilibrium relation is EC50 = K + RT/2 ([Hulme and Trevethick, 2010](https://pmc.ncbi.nlm.nih.gov/articles/PMC3000649/)).

A weakly maintained engineered phenotype is not automatically proof of poor integration. Integrated transgenes can lose expression through silencing, with distinct effects on the proportion of expressing cells and expression per cell ([Cabrera et al., 2022](https://www.cell.com/cell-systems/fulltext/S2405-4712(22)00464-1)). Here those trajectories are inputs, not inferred mechanisms.

The Raji comparator is held stable by assumption, not declared intrinsically stable: actual Raji-derived populations can alter CD20 expression under selection ([CD20 regulation study](https://pmc.ncbi.nlm.nih.gov/articles/PMC3288324/)). All site counts, loss rates, and binding parameters are constructed, not estimates from a Raji dataset.

“Blocking” is explicitly split into two meanings. Competitive fluorescent-rituximab displacement on Raji cells has experimental precedent, but is distinct from downstream functional activity ([Visser et al., 2013](https://d-nb.info/1196862753/34)). The optional functional reporter is an assumed mathematical transfer function illustrating response reserve; it is not CD20 signaling, CDC, ADCC, or a claim about rituximab's functional mechanism.

## Run it

Requires Node.js 20 or later for tests/CLI and Python 3 for the convenience web-server command. There are no npm dependencies or build steps.

```sh
git clone https://github.com/dataRichinsightPoor/comparability-check.git
cd comparability-check
npm test
npm run serve
```

Open `http://localhost:8080` in your browser. Serve the `web/` folder with any static HTTP server; opening `index.html` through `file://` is not supported because the app uses ES modules.

```sh
# Same historical ratio, two possible explanations:
node cli.mjs history 4 1 1
node cli.mjs history 4 1 0.125

# Run the paired bridge on synthetic complete blocks:
node cli.mjs bridge examples/common-shift.csv

# Optional separate lot and interaction margins:
node cli.mjs bridge examples/common-shift.csv 0.9 1.1 0.85 1.18

# Cell-context endpoints, not simulated data fitting:
node cli.mjs context
node cli.mjs context examples/cell-context.json

# Iterations per scenario, unsigned 32-bit seed, blocks, output directory:
node simulate.mjs 100000 26007 8 results
node simulate.mjs 100000 71260 8 results/seed-check
node simulate.mjs 100000 26007 4 results/blocks-4
node simulate.mjs 100000 26007 16 results/blocks-16
```

CLI output is always exploratory. The browser additionally lets the user declare that assay suitability, independence, and justified prespecified margins have been established outside the software; this changes conditional reporting language, not the numerical results.

## What can be compared?

| Input or design | Supported calculation | Unsupported leap |
|---|---|---|
| Two historical EC50 values from different lots and methods | Descriptive later/earlier ratio | Lot-specific effect, degradation, or stronger intrinsic affinity |
| Both lots within method P | B/A EC50 contrast under P | Transfer of that contrast to method Q |
| Complete paired P/Q bridge | Within-method contrasts and their method dependence | Universal method equivalence or reconstruction of the original old-lot state |
| Suitable bridge with justified prespecified margins and credible uncertainty | Conditional endpoint-specific equivalence assessment | Whole-product biosimilarity or clinical interchangeability |

The browser requires a complete crossed design for its uncertainty analysis. It does not currently accept a two-column single-method dataset, unpaired designs, or missing cells. Do not mix binding EC50 and blocking IC50 in the bridge; endpoint identity is a scientific prerequisite, not something the CSV values reveal.

## Input format

```csv
run,AP,BP,AQ,BQ
r1,4.0,4.08,1.0,1.03
r2,4.2,4.16,1.10,1.08
```

`AP` means lot A under method P, and similarly for the other columns. Each row must be one real, independent, complete experimental block containing all four combinations, not a group assembled by pairing unrelated historical runs.

- **Experimental unit:** Enter one supported EC50 per combination per independent block. Technical wells do not create independent blocks.
- **Units:** All values must be in one common concentration unit. The historical view's unit field is a label, not a conversion engine; the bridge reports dimensionless ratios.
- **Data type:** Exact, finite, positive EC50 values only. Bounds such as `>100`, missing fields, duplicate block identifiers, hex strings, and quoted CSV fields are rejected. No rows are silently dropped.
- **Limits:** Maximum 1,000 blocks and 200,000 CSV characters. The parser handles UTF-8 BOM, LF/CRLF, surrounding whitespace, and decimal/scientific notation.
- **Provenance:** The software cannot determine whether the blocks are independent, whether curves bracket their midpoints, or whether methods are scientifically fit for purpose.

## Statistical contract

For block i, define dP = ln(BP) − ln(AP), dQ = ln(BQ) − ln(AQ), and dI = dQ − dP. Each reported ratio is the exponential of the mean block-level log contrast, not an arithmetic mean of ratios.

Intervals are exp(mean(d) ± t × SD(d)/√n), with n−1 degrees of freedom. Computing dI within the block preserves the observed covariance rather than treating the four cells as independent.

The model assumes independent blocks and approximately normal log contrasts. It does not fit raw curves or explicitly propagate cell-level curve-fit uncertainty, handle heterogeneous precision, robustly model outliers, or account for informative missingness. Few blocks limit assessment of these assumptions.

A 90% interval strictly within both prespecified equivalence margins corresponds to TOST at α = 0.05; failure to meet this criterion does not prove non-equivalence ([Lakens, 2017](https://pmc.ncbi.nlm.nih.gov/articles/PMC5502906/)). The app also reports 95% intervals, separately from the equivalence decision.

Default margins of 0.80–1.25 are illustrative, not a bioassay standard or recommendation. Lot and interaction margins are independently configurable and require separate justification. Reported intervals and decisions are per contrast, not a multiplicity-adjusted family of individual claims.

Only one block, or effectively zero observed log-contrast variation, produces a point estimate without an uncertainty interval or equivalence claim. The variance floor is 1e−24 on the natural-log scale, a conservative numerical safeguard rather than a biological variability threshold.

## Guardrails

EC50 is an assay endpoint, not automatically an intrinsic affinity: kinetic equilibration and receptor concentration affect endpoint interpretation ([Spiegelberg et al., 2021](https://link.springer.com/article/10.1007/s00249-021-01560-2)). Rituximab binding on Daudi cells also exhibits bivalent stabilization and concentration-dependent dynamics; that result does not supply a correction for the synthetic Raji example ([Bondza et al., 2020](https://doi.org/10.1080/19420862.2020.1792673)).

A common reference can improve cross-laboratory agreement under qualified conditions, as shown in the rituximab standardization study, but reference normalization is not implemented in this release ([Prior et al., 2018](https://pmc.ncbi.nlm.nih.gov/articles/PMC5836816/)). Do not silently replace EC50 with normalized potency, whose endpoint and direction may differ.

Retained old material tested now does not necessarily represent its original state. A reconstructed protocol does not reproduce every historical condition. No output establishes manufacturing-history effects, clinical effectiveness, regulatory acceptance, or whole-product biosimilarity.

## Reproducibility and privacy

The browser and CLI share `web/model.mjs` and `web/context-model.mjs`; both modules are also directly importable from Node.js. The context CLI emits endpoint summaries, while the module additionally returns curves. Settings export/import and Markdown analysis reports preserve inputs, margins, version, assumptions, and results. Imported settings always reset the qualification declaration.

User-entered values are calculated in browser memory; no upload or persistent browser storage is used. External fonts are requested from Fontshare, with local fallback fonts if unavailable. The model and charts have no external runtime calculation dependency.

The repository includes [the companion essay](docs/COMPANION-ARTICLE.md), [mathematical methods](docs/METHODS.md), numerical tests, a GitHub Actions test workflow, and a command-line entry point. MIT licensed; cite using `CITATION.cff`.

Software tests verify implementation. They do not constitute biological validation.
