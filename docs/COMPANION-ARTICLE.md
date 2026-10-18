# To Be or Not to Be Comparable

99 Small Problems in Bioassay

Did the antibody change, did the cells change, or did the readout change?

An older report gives a binding EC50 of 4 nM. A newer report gives 1 nM for another lot of the same antibody. Both curves look respectable, the concentration units agree, and the spreadsheet offers an uncomplicated conclusion: fourfold better binding.

Now change the comparison. The earlier assay used a cell line expressing its target endogenously. The later assay used an engineered line whose surface expression declined with passage. One report measured antibody binding; another measured something called blocking.

The numerical comparison remains possible. The biological comparison has become three different questions.

This model uses rituximab–Raji as a recognizable binding context, with an explicitly hypothetical engineered CD20-expressing comparator; published comparability work has used rituximab binding to Raji cells ([Xu and colleagues, 2019](https://www.tandfonline.com/doi/full/10.1080/19420862.2019.1578147)). All example values and expression trajectories are synthetic, not measurements of a commercial lot or a real engineered line.

## We can compare numbers without having identified their cause

A binding EC50 is a midpoint of a specified response curve. In a fitted increasing logistic curve, it is the concentration halfway between the fitted lower and upper plateaus.

An observation of 4 nM followed by 1 nM therefore supports a fourfold lower reported midpoint. If lot, protocol, and testing period changed together, it does not isolate a lot-specific effect.

The model makes that limitation inspectable. Let the measured EC50 equal a lot-associated scale multiplied by a method-context factor:

\[
E_{\ell,p}=\theta_\ell m_p.
\]

The historical ratio then satisfies:

\[
0.25=
\left(\frac{\theta_B}{\theta_A}\right)
\left(\frac{m_Q}{m_P}\right).
\]

One possible explanation is a lot ratio of 0.25 with no method effect. Another is no lot difference with a method multiplier of 0.25. Even a lot ratio of 2 combined with a method multiplier of 0.125 produces the same historical observation.

These are alternative factorizations, not competing findings about rituximab. They show why the original observations cannot determine even the direction of the lot-associated difference without additional evidence.

## We can observe expression loss without having diagnosed integration failure

For the cell-context experiment, hold the antibody parameter fixed. Treat Raji as a stable reference within the simulation, and let the engineered population change with passage.

The reference stability is an assumption, not an intrinsic property guaranteed by the cell-line name: Raji-derived populations can change CD20 expression under selection ([CD20 regulation study](https://pmc.ncbi.nlm.nih.gov/articles/PMC3288324/)). An endogenous cell line still requires characterization in the conditions and passage range being used.

The engineered population has two separately adjustable properties: the proportion of cells that remain positive, \(p\), and accessible sites per positive cell, \(\rho\). This distinction is biologically motivated: transgene silencing can appear as loss of expression in a fraction of cells or reduced expression within individual cells ([Cabrera and colleagues, 2022](https://www.cell.com/cell-systems/fulltext/S2405-4712(22)00464-1)).

Neither pattern, on its own, demonstrates poor genomic integration. Integrated transgenes can become silenced, so a decline in surface fluorescence is not sufficient evidence that the transgene was physically lost ([Cabrera and colleagues, 2022](https://www.cell.com/cell-systems/fulltext/S2405-4712(22)00464-1)).

The model therefore prescribes an expression trajectory without assigning its molecular cause. Establishing that cause would require evidence separating DNA copy and integrity, transcript abundance, protein production, surface accessibility, and changes in the population being sampled.

## We can lose signal without changing normalized binding EC50

Begin with the simplest useful limit: one class of accessible sites at equilibrium, one-site binding, and enough ligand that binding does not appreciably deplete the free concentration. The model's fractional occupancy is:

\[
\theta(C)=\frac{C}{K+C}.
\]

If signal is proportional to bound antibody, the arithmetic mean across the whole population is proportional to:

\[
S(C)\propto p\rho\theta(C).
\]

Reducing \(p\), \(\rho\), or both lowers the plateau. But dividing each curve by its own plateau removes \(p\rho\), leaving the same normalized curve and the same midpoint, \(K\).

This is the first important failure of intuitive interpretation. A substantial loss of cellular target can coexist with an unchanged normalized EC50.

Gating can conceal a different part of the change. If only the positive fraction declines, a positive-only arithmetic mean can remain unchanged while the all-cell mean falls; the retained positive cells have not necessarily changed, but the population has.

That calculation is not a model of median fluorescence or a threshold-defined positive gate. The exact summary statistic matters because it determines which aspect of the population survives into the reported endpoint.

## We can obtain a lower EC50 from a deteriorating assay substrate

Now conserve ligand. The total concentration added to the well need not equal the free concentration available for binding.

For a one-site equilibrium system with receptor concentration \(R_T\), the total ligand concentration at half occupancy is:

\[
EC_{50,\mathrm{total}}=K+\frac{R_T}{2}.
\]

This follows from free ligand equaling \(K\) at half occupancy, with half the receptor population holding bound ligand ([Hulme and Trevethick, 2010](https://pmc.ncbi.nlm.nih.gov/articles/PMC3000649/)).

In the model, \(R_T\) depends on cell number, positive fraction, sites per positive cell, and assay volume. Loss of accessible target reduces ligand consumption, allowing half occupancy at a lower total antibody concentration.

The signal can therefore fall while the apparent EC50 shifts left. The antibody parameter has not improved; the assay contains less target to consume it.

This is not a universal prediction for an unstable engineered line. The one-site model deliberately excludes full-length antibody avidity, receptor organization, trafficking, and nonequilibrium retention; rituximab binding studies on Daudi cells demonstrate bivalent stabilization and concentration-dependent dynamics that can complicate a simple molecular-affinity interpretation ([Bondza and colleagues, 2020](https://doi.org/10.1080/19420862.2020.1792673)).

The point is not that expression loss must shift EC50 left. It is that “lower EC50 means better antibody” fails even in a simple, physically interpretable system.

## We can compare binding and blocking only after defining what is blocked

Direct binding asks how much labeled or detected antibody associates with the cell as antibody concentration increases. Competitive blocking asks how an unlabeled competitor reduces the binding of a specified tracer.

These are related but distinct observables. Fluorescent-rituximab displacement from Raji CD20 has been used as a competition-binding assay, separately from downstream functional activities ([Visser and colleagues, 2013](https://d-nb.info/1196862753/34)).

For the model's ideal homologous tracer, with the same one-site \(K\), negligible depletion, and tracer concentration \(T\):

\[
EC_{50,\mathrm{binding}}=K,\qquad
IC_{50,\mathrm{competition}}=K+T.
\]

The competition relationship is a special case of the free-ligand competition equations, not a universal conversion using total concentrations under arbitrary assay conditions ([Hulme and Trevethick, 2010](https://pmc.ncbi.nlm.nih.gov/articles/PMC3000649/)).

Changing tracer concentration can change the blocking midpoint without changing the antibody or the direct-binding midpoint. With finite ligand supply, the model instead solves conservation of receptor, tracer, and competitor.

Calling both results “potency” does not make the endpoints interchangeable. Their relationship depends on the assay mechanism and the quantities held fixed.

## Functional blockade adds another biological map

A downstream inhibition assay needs something beyond occupancy: a relationship between occupied target and measured function. Binding alone does not specify that relationship.

To make the distinction executable, the model includes a separate, explicitly generic reporter. It assumes that occupied tracer sites per positive cell, \(x\), drive a response:

\[
F(x)=\frac{x^h}{S_{50}^h+x^h}.
\]

This is not CD20 signaling, CDC, ADCC, or rituximab pharmacology. It is an assumed transfer function used to examine what a functional readout adds to the inference.

For \(h=1\) without depletion, its normalized inhibition midpoint is:

\[
IC_{50,\mathrm{reporter}}
=(K+T)\left(1+\frac{x(0)}{S_{50}}\right).
\]

The extra factor represents response reserve in this constructed system. A high initial occupied-site count can support substantial response even after considerable displacement; reducing density reduces that reserve and can lower the reporter IC50 while the binding parameter stays unchanged.

An apparent gain in functional blocking potency can therefore accompany loss of cellular response capacity. Whether this explanation applies to a real assay requires the relevant response model and independent measurements, not a persuasive fit to a single midpoint.

## Comparable for which conclusion?

The useful comparison preserves the identity of the endpoint and the biological context. It does not erase them through normalization or a shared column heading.

| Question | Evidence that moves the comparison forward | What remains insufficient |
|---|---|---|
| Did the reported endpoint change? | Supported estimates, consistent units, full curves, and uncertainty. | A midpoint outside the adequately measured response range. |
| Did the antibody lot change? | Side-by-side lots under a shared, suitable assay context. | Different lots tested only in different eras or cells. |
| Did the engineered population change? | Positive fraction and per-positive-cell expression distributions tracked across passage. | A normalized EC50 alone. |
| Did genomic instability cause the change? | DNA-level evidence connected to expression and population history. | Surface signal loss alone. |
| Does a lot contrast transfer between methods? | A crossed bridge with overlapping materials and an appropriate common endpoint. | Similar-looking curves or unrelated historical runs. |
| Does binding predict functional blockade? | A defined blocking mechanism, controlled challenge, and a supported occupancy-to-response relationship. | Treating binding EC50 and functional IC50 as the same quantity. |

The crossed-bridge module estimates lot ratios within each method and then compares those ratios. It requires complete independent experimental blocks and does not allow the scientific interpretation that mixed binding and blocking endpoints constitute one equivalence analysis.

Equivalence additionally requires justified, prespecified margins and appropriate uncertainty; failure to detect a difference is not equivalent to demonstrating that a difference is acceptably small ([Lakens, 2017](https://pmc.ncbi.nlm.nih.gov/articles/PMC5502906/)).

The model's purpose is not to rescue every historical comparison with a correction. It is to identify which conclusion survives the experimental changes, which explanation remains untested, and what measurement would separate the alternatives.

To be or not to be comparable is an incomplete question. Comparable for which conclusion is the one the experiment must answer.
