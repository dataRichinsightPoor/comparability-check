# To Be or Not to Be Comparable

Data-Rich, Insight-Poor CCLX · 99 Small Problems · No. 07

Did the antibody change, did the cells change, or did the readout change?

An older report gives a binding EC50 of 4 nM. A newer report gives 1 nM for another lot of the same antibody. Both curves look respectable, the concentration units agree, and the spreadsheet offers an uncomplicated conclusion: fourfold better binding.

Now change the comparison. The earlier assay used a cell line expressing its target endogenously. The later assay used an engineered line whose surface expression declined with passage. One report measured antibody binding; another measured something called blocking.

The numerical comparison remains possible. The biological comparison has become three different questions.

This installment extends [Data-Rich, Insight-Poor CCI: The Assay Got Better Because the Cells Got Worse](https://www.linkedin.com/pulse/assay-got-better-because-cells-worse-ermelinda-damko-6kvme), which assembled mechanisms and simulations explaining why expression loss can improve an apparent blocking midpoint without improving the molecule. Here the question becomes operational: what comparison survives those possibilities, and what experiment could distinguish them?

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

## We can match midpoints without matching curves

A ratio of fitted midpoints is not automatically a relative potency. That interpretation requires sufficiently similar response curves, ideally differing only by a horizontal displacement; relevant slope and asymptote similarity must be supported for the intended use ([White et al., 2019](https://www.tandfonline.com/doi/full/10.2144/btn-2019-0031)).

Consider normalized curves with the same EC50 of 1 but Hill slopes of 1 and 2. At 50% response their dose ratio is 1; at 20% it is 2, and at 80% it is 0.5. These are exact values from the model's analytic counterexample. The midpoint agrees while the single-relative-potency interpretation fails.

The new simulation lab repeats six endpoint experiments and a separate paired-cell sensitivity ensemble. Repetition can measure how often a procedure gives the right conditional answer under its assumptions; it cannot turn confounded historical observations into an identified lot effect or establish that the chosen mechanisms describe an actual antibody lot.

## More data can strengthen the wrong comparison

The accompanying figure isolates this problem in the model's masked-lot scenario: a true within-method EC50 ratio of 2.0 is multiplied by a new/old method factor of 0.5, centering the historical ratio on 1.0 on the log scale ([versioned simulation design](https://github.com/dataRichinsightPoor/comparability-check/blob/v0.5.0/docs/SIMULATION-DESIGN.md)). The historical observation looks reassuring precisely because the method change cancels the lot contrast.

Across 100,000 simulated experiments at each run count, an unjustified historical lot-equivalence declaration occurred in 2.869% of experiments with 4 independent run-level contrasts, 7.830% with 8, and 40.589% with 16 ([4-run results](https://github.com/dataRichinsightPoor/comparability-check/blob/v0.5.0/results/blocks-4/simulation-results.json), [8-run results](https://github.com/dataRichinsightPoor/comparability-check/blob/v0.5.0/results/simulation-results.json), [16-run results](https://github.com/dataRichinsightPoor/comparability-check/blob/v0.5.0/results/blocks-16/simulation-results.json)). Each declaration used a 90% t confidence interval strictly inside illustrative ratio margins of 0.8–1.25; the figure's separate 95% Wilson intervals describe Monte Carlo uncertainty in the declaration rates, not uncertainty around an individual lot comparison ([simulation implementation](https://github.com/dataRichinsightPoor/comparability-check/blob/v0.5.0/web/simulation-model.mjs)).

The calculation has not become less accurate. It is estimating the wrong quantity for the biological claim more precisely. These synthetic results illustrate a failure of attribution, not a failure of statistical arithmetic, and they are not measured failure rates for an actual QC assay.

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

## Pharmaceutical practice: stage and GMP are not the same axis

Early-stage, late-stage and GMP are not three successive levels of scientific truth. Development stage describes how much product and method knowledge is available and which decisions the assay must support; GMP describes the quality-system controls governing applicable manufacturing and testing activities, including clinical manufacture ([White et al., 2019](https://www.tandfonline.com/doi/full/10.2144/btn-2019-0031), [FDA, CGMP for Phase 1 Investigational Drugs](https://www.fda.gov/media/70975/download)).

This distinction is grounded in pharmaceutical practice, not only in abstract guidance. White and colleagues' cross-company bioassay paper includes authors from organizations such as GSK, Pfizer, AbbVie, Takeda, Genentech and BioPhorum, and describes qualification as demonstrating suitability in early product development while full validation uses a preapproved protocol with acceptance criteria for later development and commercialization ([White et al., 2019](https://www.tandfonline.com/doi/full/10.2144/btn-2019-0031)). A CASSS-hosted workshop by AstraZeneca scientists Scott Umlauf and Patrick Hussmann illustrates the operational progression from development and method lock to qualification, transfer into clinical QC, release/stability testing and trending, then commercial transfer and validation ([Umlauf and Hussmann, Introduction to Bioassay Development](https://www.casss.org/docs/default-source/bioassays/2024-speaker-presentations/workshop-introduction-to-bioassay-development.pdf?sfvrsn=ce9702a3_6)).

### Why the standards differ

| Context | Decision being supported | Evidence and controls emphasized | What that context does not establish |
|---|---|---|---|
| Early discovery / exploratory assay | Which candidate, mechanism or experiment should be pursued? | Biological relevance, appropriate controls, supported concentration-response behavior, independent-run reproducibility sufficient for the decision, and transparent protocol/version history ([Assay Guidance Manual](https://www.ncbi.nlm.nih.gov/books/NBK83783/)). | A provisional ranking is not a release claim or proof that values transfer across methods, cells or years. |
| Late-stage product QC | Can the procedure support clinically informed product specifications, stability assessment and routine testing? | Defined intended use and reportable result; suitable reference material; documented validation, precision, accuracy, range and suitability; robustness, transfer capability and ongoing monitoring ([ICH Q6B](https://database.ich.org/sites/default/files/Q6B%20Guideline.pdf), [ICH Q2(R2)](https://database.ich.org/sites/default/files/ICH_Q2(R2)_Guideline_2023_1130_ErrorCorrection_2025.pdf), [ICH Q14](https://database.ich.org/sites/default/files/ICH_Q14_Guideline_2023_1130_ErrorCorrection_2025.pdf)). | Validation and passing specifications do not establish every proposed cross-assay or product-comparability claim ([ICH Q5E](https://database.ich.org/sites/default/files/Q5E%20Guideline.pdf)). |
| GMP laboratory execution, at applicable development stages | Can the reported result be trusted, reconstructed, reviewed and used within the applicable quality system? | Controlled procedures and equipment; attributable, contemporaneous and complete records; appropriate access controls and audit trails; review of all data; scientifically justified investigation of invalidated or unexpected results ([FDA, Phase 1 CGMP](https://www.fda.gov/media/70975/download), [FDA, Data Integrity and Compliance With Drug CGMP](https://www.fda.gov/media/119267/download)). | A controlled record does not resolve a confounded experimental design or make a biologically irrelevant endpoint relevant. |

The differences arise from intended use, consequence of error, accumulated knowledge and the need to transfer the method beyond its developers, not permission for one laboratory to be careless. Industry recommendations therefore emphasize understanding assay-critical reagents and steps early, using the intended QC equipment and loading order in relevant studies, and establishing a procedure that a receiving laboratory can operate reliably ([White et al.](https://www.tandfonline.com/doi/full/10.2144/btn-2019-0031)).

Early discovery must also be distinguished from early clinical lot testing. In the United States, most Phase 1 investigational drugs covered by FDA's guidance are exempt from 21 CFR part 211 under 21 CFR 210.2(c), but not from statutory CGMP; the guidance still calls for suitable and reliable tests, written methods, controlled testing conditions, calibrated equipment, records of all test results and procedural changes, and defined QC responsibilities, with stated exceptions to the exemption ([FDA, CGMP for Phase 1 Investigational Drugs](https://www.fda.gov/media/70975/download)). “Early stage” is therefore not a blanket justification for untraceable results or an unassessed clinical-release method.

### What GMP adds, and what it cannot repair

GMP adds a controlled and reconstructable path from sample to reportable result. FDA's data-integrity guidance addresses original data and metadata, access and audit trails, review, and retention of passing, failing and suspect data; invalidating a result requires a documented, scientifically sound justification, and testing repeatedly until a passing result is obtained is not an acceptable substitute ([FDA, Data Integrity and Compliance With Drug CGMP](https://www.fda.gov/media/119267/download)).

For bioassays, that discipline means the identity and history of cells, reference standards and critical reagents, the approved calculation and reportable-result definition, and the disposition of unsuitable runs cannot be replaced by a final EC50 spreadsheet. The AstraZeneca workshop makes these operational issues concrete through analyst and cell-culture training, equipment and software considerations, reference-standard bridging, independent assay-control trending, and a prespecified definition of the reportable value ([Umlauf and Hussmann](https://www.casss.org/docs/default-source/bioassays/2024-speaker-presentations/workshop-introduction-to-bioassay-development.pdf?sfvrsn=ce9702a3_6)).

These controls protect the record and the procedure, but do not identify a lot effect from an old-lot/old-method versus new-lot/new-method comparison. In the model's figure, a perfectly preserved record could still support the wrong biological attribution if the confounded historical ratio were interpreted as lot equivalence.

### Which references guide which part of the work

USP's complementary bioassay chapters provide a useful division of labor: ⟨1032⟩ addresses design and development, ⟨1033⟩ addresses intended-use validation of biological-activity methods, and ⟨1034⟩ addresses analysis ([USP ⟨1032⟩](https://doi.usp.org/USPNF/USPNF_M1354_01_01.html), [USP ⟨1033⟩](https://doi.usp.org/USPNF/USPNF_M912_02_01.html), [USP ⟨1034⟩](https://doi.usp.org/USPNF/USPNF_M5677_02_01.html)). The linked public previews establish that scope, not a substitute for checking the applicable current compendial text, product commitments and jurisdiction.

Industry workshops and best-practice papers help translate those principles into workable procedures; their example sample counts, acceptance windows and development timelines are not universal requirements. In particular, a nonsignificant difference test is not an equivalence demonstration, regardless of whether an example bridging workflow mentions paired testing; the comparison still needs an appropriate estimand, justified margins and a suitable statistical decision rule ([White et al.](https://www.tandfonline.com/doi/full/10.2144/btn-2019-0031), [Umlauf and Hussmann](https://www.casss.org/docs/default-source/bioassays/2024-speaker-presentations/workshop-introduction-to-bioassay-development.pdf?sfvrsn=ce9702a3_6), [Lakens, 2017](https://pmc.ncbi.nlm.nih.gov/articles/PMC5502906/)).

The relevant question is consequently not which laboratory label sounds most rigorous. It is whether the biological measurement, analytical performance, comparison design and quality-system controls jointly support the claim being made.

## In late-stage QC, comparability is a controlled claim

Late-stage development changes the burden of evidence, not the meaning of an EC50. ICH Q6B calls for a relevant, validated potency assay in the specifications for the biological drug substance and/or product, supported by appropriately characterized reference materials; Q2(R2) and Q14 principally address commercial release and stability procedures, with scientific principles applicable in a phase-appropriate manner during clinical development ([ICH Q6B](https://database.ich.org/sites/default/files/Q6B%20Guideline.pdf), [ICH Q2(R2), final with 2025 corrections](https://database.ich.org/sites/default/files/ICH_Q2(R2)_Guideline_2023_1130_ErrorCorrection_2025.pdf), [ICH Q14, final with 2025 corrections](https://database.ich.org/sites/default/files/ICH_Q14_Guideline_2023_1130_ErrorCorrection_2025.pdf)).

The practical framework is therefore not “use 80–125% and run more replicates.” It is to define what is being measured, establish that the procedure can measure it reliably enough for the decision, and maintain that capability as materials and methods change.

### Four decisions that must not be collapsed

- **Is the analytical result valid?** System suitability asks whether the measurement system and analytical operations performed acceptably; sample suitability, where required, asks whether the particular test sample gives an acceptable response, including relevant similarity to the reference ([ICH Q14](https://database.ich.org/sites/default/files/ICH_Q14_Guideline_2023_1130_ErrorCorrection_2025.pdf)).
- **Is the procedure fit for its intended use?** Validation evaluates predefined performance characteristics such as specificity/selectivity, accuracy, precision and reportable range; it is not a finding that any two lots are equivalent ([ICH Q2(R2)](https://database.ich.org/sites/default/files/ICH_Q2(R2)_Guideline_2023_1130_ErrorCorrection_2025.pdf)).
- **Does this lot meet its release specification?** Product specifications are justified in relation to relevant development, clinical, manufacturing-consistency and stability experience, rather than being generic similarity limits between two curves ([ICH Q6B](https://database.ich.org/sites/default/files/Q6B%20Guideline.pdf)).
- **Has a particular comparison been established?** Analytical-method bridging and manufacturing-change product comparability are distinct exercises: Q14 addresses the former, while Q5E addresses the latter and states that routine specification tests alone are generally not adequate to assess manufacturing-change impact ([ICH Q14](https://database.ich.org/sites/default/files/ICH_Q14_Guideline_2023_1130_ErrorCorrection_2025.pdf), [ICH Q5E](https://database.ich.org/sites/default/files/Q5E%20Guideline.pdf)).

Two passing lots are therefore not automatically equivalent, and two similar curves do not establish whole-product comparability. Q5E explicitly notes that results can remain within specifications yet move outside historical control trends in a way that warrants further investigation ([ICH Q5E](https://database.ich.org/sites/default/files/Q5E%20Guideline.pdf)).

### What makes the comparison defensible

Start with biological relevance. Binding assays may be acceptable potency procedures, but that choice needs a product-specific rationale; a binding midpoint should not be assumed to represent all functional activities of a molecule with multiple mechanisms ([ICH Q6B](https://database.ich.org/sites/default/files/Q6B%20Guideline.pdf), [ICH Q5E](https://database.ich.org/sites/default/files/Q5E%20Guideline.pdf)). Conversely, a cell-based readout is not automatically the better QC assay simply because it is more complex; the mechanism, discriminatory capability, variability and intended use determine the appropriate strategy ([White et al., 2019](https://www.tandfonline.com/doi/full/10.2144/btn-2019-0031)).

Reference continuity is equally important. Q6B describes a characterized in-house primary reference representative of production and clinical materials, working references calibrated against it, appropriate calibration to international or national standards when available, and documentation supporting reference-material stability ([ICH Q6B](https://database.ich.org/sites/default/files/Q6B%20Guideline.pdf)). A reference is not a timeless denominator: replacement, storage and response behavior belong to the measurement system, while controls and their curve characteristics should be monitored for stability ([White et al., 2019](https://www.tandfonline.com/doi/full/10.2144/btn-2019-0031)).

The result also needs a supported curve model. A single relative potency assumes an adequately similar response relationship between sample and reference; if slope or asymptote differences exceed justified suitability criteria, an inflection-point ratio is not enough ([White et al., 2019](https://www.tandfonline.com/doi/full/10.2144/btn-2019-0031)). Define the ratio direction explicitly: this model reports B/A EC50 ratios, whereas, under a supported horizontal-shift model, the relative potency of B versus A is conventionally proportional to the reciprocal concentration ratio.

Precision must correspond to the reportable result. Repeatability, intermediate precision across analysts/days/preparations, accuracy and acceptable response should be established across the intended range, not inferred from a tight triplicate at one nominal potency ([ICH Q2(R2)](https://database.ich.org/sites/default/files/ICH_Q2(R2)_Guideline_2023_1130_ErrorCorrection_2025.pdf)). The number of independent runs averaged into a reportable potency value should be justified using assay-performance information, with attention to correlations when runs share an analyst or day; counting more wells does not estimate the missing run-to-run component ([Li et al., online 2024; issue 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC11788244/)).

Finally, validation is not a permanent exemption from change. Q14 calls for an analytical procedure control strategy, recommends ongoing monitoring, and links the extent of bridging or revalidation to the risk and nature of the change; its biological-potency example explicitly considers cell density, viability and passage-dependent performance ([ICH Q14](https://database.ich.org/sites/default/files/ICH_Q14_Guideline_2023_1130_ErrorCorrection_2025.pdf)). A passage range, reagent lot, reference preparation, readout algorithm or replacement cell bank should therefore be evaluated for its effect on the intended measurement, not treated as harmless because the SOP title is unchanged.

These are a scientific framework, not a universal numerical recipe. Q2(R2)'s biological-assay examples and Q14's case-study criteria are illustrative, and neither establishes a general 0.8–1.25 lot-equivalence requirement; a formal analytical target profile can be useful, but Q14 does not make its formal documentation or submission universally mandatory ([ICH Q2(R2)](https://database.ich.org/sites/default/files/ICH_Q2(R2)_Guideline_2023_1130_ErrorCorrection_2025.pdf), [ICH Q14](https://database.ich.org/sites/default/files/ICH_Q14_Guideline_2023_1130_ErrorCorrection_2025.pdf)).

## In early discovery, a useful comparison is not yet a transferable one

Early-stage assays often exist to prioritize candidates, explore mechanism, or decide which experiment to run next. That is a different intended use from batch release, but it does not remove the need for biological relevance, appropriate controls and evidence that the assay can resolve the differences driving the decision ([Assay Guidance Manual, HTS Assay Validation](https://www.ncbi.nlm.nih.gov/books/NBK83783/)).

The central pitfall is borrowing the authority of late-stage QC while omitting the supporting measurement system. A precise-looking EC50, a familiar reference antibody and a low within-plate CV can make an exploratory comparison look settled even when the endpoint, population, normalization or protocol is still moving.

### Where early comparisons become overclaims

- **A good plate is mistaken for reproducible potency.** Z′ evaluates control-signal separation, whereas potency reproducibility and agreement across runs are separate questions; the Assay Guidance Manual treats these through separate plate-uniformity and replicate-experiment assessments ([Assay Guidance Manual](https://www.ncbi.nlm.nih.gov/books/NBK83783/)).
- **Technical replication is mistaken for independent evidence.** Within-run and between-run variation contribute differently to comparisons, and cross-run ranking must account for both; adding wells to one preparation cannot demonstrate robustness across days, reagent preparations or cell states ([Assay Guidance Manual](https://www.ncbi.nlm.nih.gov/books/NBK83783/), [Li et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC11788244/)).
- **A benchmark is treated as a universal correction factor.** In this model, a shared method multiplier cancels in a within-method ratio, but differential responses to the method do not. The benchmark's apparent stability is therefore a reason to investigate transferability, not proof that every test antibody is equally insensitive to the changed context.
- **Different curves are forced into one ranking.** Candidate molecules may differ in maximal response, curve shape or binding behavior; a ratio of midpoints cannot carry a single relative-potency interpretation when the required response similarity is unsupported ([White et al., 2019](https://www.tandfonline.com/doi/full/10.2144/btn-2019-0031)). Preserve those differences as observations rather than normalizing them away to create an apparently uniform potency column.
- **Historical results are pooled before the assays are bridged.** The Assay Guidance Manual specifically calls for assay-comparison work when changed methods will be combined with earlier results, and advises against combining data into one set when the assays are not equivalent for that purpose ([Assay Guidance Manual](https://www.ncbi.nlm.nih.gov/books/NBK83783/)).
- **A screening threshold is imported into QC, or vice versa.** The manual's MSR and agreement-limit recommendations address its specified HTS/lead-optimization use case; they are not generic biologic-product specifications, just as this figure's 0.8–1.25 margins are not regulatory acceptance criteria ([Assay Guidance Manual](https://www.ncbi.nlm.nih.gov/books/NBK83783/), [ICH Q6B](https://database.ich.org/sites/default/files/Q6B%20Guideline.pdf)).

For Raji versus an unstable engineered population, the practical early-stage question is not initially “are these EC50s equivalent?” It is “does the ranking or mechanistic conclusion survive the changes in positive fraction, receptor density, ligand availability and endpoint definition?” Those are the deliberately separated interventions in the model, not claims that a single cellular mechanism explains all observed shifts.

As a practical recommendation, preserve the full curves and assay metadata, retain suitable comparison materials where possible, and run overlapping samples under both versions before pooling their results. Choose an informative panel rather than only the most convenient reference, and define in advance which differences would alter the next development decision; this follows the distinction between reproducibility studies and assay-change comparisons in the Assay Guidance Manual, without treating its example designs as universal templates ([Assay Guidance Manual](https://www.ncbi.nlm.nih.gov/books/NBK83783/)).

For an archive comparison years apart, retained material is useful only if its current condition can be interpreted. Storage, aging and freeze–thaw history can add a material-state contrast to the lot and method contrasts, so a re-test needs to consider sample and reference stability rather than assume that an old vial recreates the old experiment ([ICH Q6B](https://database.ich.org/sites/default/files/Q6B%20Guideline.pdf), [White et al., 2019](https://www.tandfonline.com/doi/full/10.2144/btn-2019-0031)).

The defensible early conclusion may be conditional: “under this method, with these cells and controls, this preparation required a lower concentration to reach the defined response.” That can be sufficient to choose the next experiment. It is not yet a claim of intrinsic affinity, transferable potency, or QC comparability.

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
