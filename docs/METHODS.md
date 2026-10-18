# Model and inference boundaries

Comparability Check is a deliberately bounded model. The historical mode illustrates structural non-identifiability; the cell-context mode exposes distinct biological and readout explanations; the bridge mode estimates like-endpoint contrasts from complete paired blocks.

## Claim audit

The audit is a deterministic reasoning checklist, not a classifier trained on assay data or a numerical evidence score. Inputs are user declarations about endpoints, design, common concentration scales, curve support, matched cell preparation, and expression tracking.

Different endpoint identities remain a gap even when units match. A complete crossed design may support assessment of method-dependent lot contrasts, but the checklist does not itself establish an effect or equivalence. The affinity, genomic-integration, functional-prediction and equivalence claims always retain evidence requirements beyond the audit's inputs.

The output supplies a scoped statement, unresolved evidence and a proposed next discriminating measurement. It does not inspect documents or curves, verify experimental independence, infer genomic causation, or issue a global “comparable” score.

## Cell state and signal population

The Raji reference has fixed accessible site density and positive fraction one, by explicit model assumption. For the engineered population, passage t determines:

\[
p(t)=p_0 2^{-t/H_p},\qquad \rho(t)=\rho_0 2^{-t/H_\rho}.
\]

Either decay can be disabled independently. These phenomenological trajectories represent loss of expression, not estimated DNA integration, silencing, or clonal-selection rates. Negative cells have zero accessible sites, and positive cells share a single site density; a continuous density distribution is not modeled.

For N cells in volume V (liters), accessible receptor concentration in nM is:

\[
R_T = \frac{N p \rho}{N_A V}\,10^9.
\]

The all-cell arithmetic-mean signal is proportional to pρ times occupancy. Positive-only arithmetic-mean signal is proportional to ρ times occupancy, while receptor mass balance still uses the full sample. Neither is median fluorescence, and the model does not implement a measured threshold-dependent gate.

All-cell signal can therefore decline while positive-only signal remains unchanged when only the positive fraction changes. Conversely, normalizing every curve to its own top can erase the amplitude difference. No measurement noise is simulated; an illustrative user-selected signal floor flags risk rather than estimating assay precision or a limit of quantification.

## One-site binding and ligand conservation

With fixed site-binding K and free ligand C:

\[
\theta(C)=\frac{C}{K+C}.
\]

Negligible depletion lets nominal concentration approximate free concentration, so normalized EC50 = K regardless of p and ρ. At finite receptor concentration, the model uses the equilibrium quadratic for bound ligand and distinguishes total added concentration from free concentration:

\[
B=\frac{2R_TC_T}{R_T+C_T+K+\sqrt{(R_T-C_T)^2+2K(R_T+C_T)+K^2}},
\qquad EC_{50,\mathrm{total}}=K+\frac{R_T}{2}.
\]

The midpoint relation follows from half occupancy plus ligand conservation and is documented in the equilibrium-assay literature ([Hulme and Trevethick, 2010](https://pmc.ncbi.nlm.nih.gov/articles/PMC3000649/)). Consequently, loss of target can lower the apparent total-dose EC50 while reducing the plateau, without any change in the antibody parameter.

Even when the negligible-depletion approximation is selected, the simulator calculates the finite-supply depletion fraction at the binding midpoint, RT/(2K+RT), and the exact unchallenged tracer-depletion fraction. The relevant view warns if the largest value across the simulated contexts exceeds 10%, a diagnostic heuristic motivated by equilibrium-assay guidance rather than an acceptance limit ([Hulme and Trevethick, 2010](https://pmc.ncbi.nlm.nih.gov/articles/PMC3000649/)). This diagnostic does not silently alter the selected curves or normalize away the discrepancy.

This is a limiting one-site system, not a full-length rituximab avidity model. Bivalency, receptor organization, heterogeneous positive-cell expression, internalization, epitope accessibility changes, nonequilibrium kinetics, and wash-dependent retention can make real cell-binding behavior depart from these predictions.

## Competitive blockade

The unlabeled competitor and homologous tracer share K and mutually exclusive sites. Labeling is assumed not to change tracer binding. Under negligible depletion:

\[
\theta_T(C)=\frac{T/K}{1+T/K+C/K},
\quad
\mathrm{block}(C)=1-\frac{\theta_T(C)}{\theta_T(0)},
\quad IC_{50}=K+T.
\]

This is a special case of the free-ligand competition relationship, not a universal conversion between binding EC50 and blocking IC50 ([Hulme and Trevethick, 2010](https://pmc.ncbi.nlm.nih.gov/articles/PMC3000649/)). When depletion is enabled, the model solves for free receptor R by bisection:

\[
R_T=R+\frac{T_TR}{K+R}+\frac{C_TR}{K+R}.
\]

Tracer and competitor complexes are the second and third terms. Both ligand totals and receptor total are conserved; the competition midpoint is found numerically relative to that context's own unblocked tracer baseline.

The real assay precedent is displacement of fluorescently labeled rituximab from Raji CD20, which measures competition binding, not downstream functional blockade ([Visser et al., 2013](https://d-nb.info/1196862753/34)).

## Generic functional transfer, not rituximab pharmacology

The optional reporter is an explicit hypothetical system in which occupied tracer sites act as an activating input. Let x(C) be occupied tracer sites per positive cell and define:

\[
F(x)=\frac{x^h}{S_{50}^h+x^h},
\qquad
\mathrm{inhibition}(C)=1-\frac{F(x(C))}{F(x(0))}.
\]

The absolute population signal is pF for all-cell averaging, or F for positive-only averaging. Fraction-positive loss cancels from self-normalized inhibition in the no-depletion case, whereas density loss changes the response reserve through x(0).

For h=1 without depletion, algebra gives:

\[
IC_{50,\mathrm{reporter}}=(K+T)\left(1+\frac{x(0)}{S_{50}}\right).
\]

This is a result of the stipulated transfer function, not an empirical law for rituximab. It shows that reducing receptor density can lower a functional midpoint by reducing response reserve while the binding midpoint and molecular parameter stay unchanged.

No CD20 ligand signaling mechanism, CDC, ADCC, viability mechanism, clinical outcome, or fitted biological reserve parameter is asserted. Binding alone cannot identify the correct response function for a real functional assay.

## Historical model

\[
E_{\ell,p}=\theta_\ell m_p,\qquad
R_{\rm observed}=\frac{E_{B,Q}}{E_{A,P}}
=\frac{\theta_B}{\theta_A}\frac{m_Q}{m_P}.
\]

Here, theta is a lot-associated EC50 scale under a chosen reference context, not intrinsic affinity. The method multiplier absorbs the testing-context effects accompanying the method.

For any positive assumed method multiplier M, the compatible conditional lot ratio is R/M. The continuum of possible factorizations proves that a diagonal-only archive does not identify the lot effect under this model. The model does not infer a probability distribution, plausible range, or calibrated uncertainty for M.

The slider ranges from 1/16 to 16 for convenient exploration only. It does not imply these are scientifically justified bounds. The model also does not assume that lot and method effects are actually separable; a lot-by-method interaction can invalidate the simple factorization.

## Complete-block bridge

For each independent block i:

\[
d_{P,i}=\ln E_{B,P,i}-\ln E_{A,P,i},
\quad d_{Q,i}=\ln E_{B,Q,i}-\ln E_{A,Q,i},
\quad d_{I,i}=d_{Q,i}-d_{P,i}.
\]

For each vector d:

\[
\widehat R=\exp(\overline d),\quad
SE(\overline d)=s_d/\sqrt n,\quad
CI_{1-\alpha}=\exp\!\left(\overline d\pm t_{1-\alpha/2,n-1}SE(\overline d)\right).
\]

The interaction estimate is the ratio of geometric within-method lot ratios. Its uncertainty comes from the observed within-block difference of log contrasts, preserving covariance.

Independent blocks, approximately normal block-level log contrasts, suitable EC50 fits, a common unit, and an appropriate paired design are required. Same labels or similar testing dates do not establish pairing.

The release does not include mixed models, independent-sample Welch intervals, partial blocks, raw-curve fitting, reference normalization, censoring, measurement-error weights, or a model of antibody degradation. Run-to-run EC50 variability enters the empirical contrasts; individual fitted EC50 covariance matrices are not explicitly propagated.

## Equivalence and uncertainty

The interval inclusion rule for TOST uses a 90% confidence interval for α = 0.05, with justified prespecified equivalence margins ([Lakens, 2017](https://pmc.ncbi.nlm.nih.gov/articles/PMC5502906/)). The implementation requires strict containment rather than accepting a boundary exactly touched.

The assay user must justify lot-ratio and interaction-ratio margins separately. An interaction ratio near one means the tested lot contrast is preserved within the specified tolerance, not that absolute EC50 values agree between methods.

The software's qualification declaration is self-attestation, not validation. Without it, even an interval inside the selected margins is labeled “Within exploratory margins.” With it, the label becomes “Conditional equivalence supported,” explicitly restricted to the endpoint, materials, model assumptions, and margins.

The three confidence intervals are not adjusted for simultaneous coverage. If planning multiple separate claims or a broader decision procedure, prespecify the relevant multiplicity strategy. A joint requirement that all specified criteria hold should also be prespecified; this app does not supply a global decision.

Zero observed log-contrast variation below 1e−24, or n=1, withholds uncertainty and equivalence rather than presenting degenerate intervals as strong evidence. Very small samples still rely heavily on unverified distributional assumptions. The model reports both 90% and 95% intervals and does not equate “not significantly different” with “equivalent.”

## Numerics

The Student t cumulative distribution is calculated with a regularized incomplete beta function, a Lanczos log-gamma approximation, and a continued fraction with convergence tolerance 3e−14. Quantiles use bounded expansion followed by 100 bisection iterations.

Unit tests compare t quantiles to SciPy reference values for degrees of freedom from 1 through 999. Additional tests cover known factorizations, invalid inputs, CSV handling, units invariance, geometric averaging, preservation of covariance, strict equivalence boundaries, interaction examples, and zero-variation safeguards.

## Scientific context

Rituximab–Raji cell-binding assays are used in published comparability work, but all bundled example numbers are constructed ([Xu et al., 2019](https://www.tandfonline.com/doi/full/10.1080/19420862.2019.1578147)). The Daudi-cell bivalency results are mechanistic context, not empirical parameters for this Raji model ([Bondza et al., 2020](https://doi.org/10.1080/19420862.2020.1792673)).

Incomplete equilibration and receptor abundance can complicate interpretation of live-cell binding endpoints, so an EC50 contrast is not automatically an affinity contrast ([Spiegelberg et al., 2021](https://link.springer.com/article/10.1007/s00249-021-01560-2)). A reference standard may improve agreement in a qualified assay framework; it is not interchangeable with evidence of biosimilarity or an automatic retrospective correction ([Prior et al., 2018](https://pmc.ncbi.nlm.nih.gov/articles/PMC5836816/)).
