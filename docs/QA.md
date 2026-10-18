# Verification record

## Version 0.6 guidance-update QA inventory

The requested public update adds the QC/discovery guide and the previously reviewed figure and manuscript. It does not alter numerical algorithms; the figure's data provenance remains pinned to v0.5.0.

Checks for this release cover:

- All eight view routes, four guidance anchors, malformed-hash rejection and unique DOM IDs.
- Late-stage QC's four distinct decisions, linked sources, illustrative-margin caveat, and early-discovery pitfalls.
- Figure loading, exact counts/intervals, fixed-reference labeling, full-size view, and five downloads.
- Cross-links into and out of guidance; direct-entry hashes, reload, back navigation, and selected-view settings roundtrip.
- Desktop, mobile and short-window layout, readable numerical fallback for the figure, scrollable table and keyboard navigation.
- Standalone and opaque-origin iframe navigation, with existing simulation and walkthrough smoke checks.

The automated suite includes 190 tests, all passing after the pharmaceutical-practice addition. Browser verification passed for direct entry and reload into the new section; anchor navigation and back navigation; cross-links to bridge, walkthrough and simulation; selected-view settings roundtrip; and all five downloadable files.

The fixed figure loads at its intended aspect ratio, its full-size SVG opens, and the numerical table retains all three exact rates. The 1,000-iteration simulation smoke test completes after navigation without page errors. Representative FDA, CASSS and USP links were activated and opened at their intended destinations.

Desktop (1440px), mobile (375px) and short-window (1280×600) inspections found no document-level horizontal overflow or persistent content clipping. The mobile numerical table scrolls within a labeled region. The sticky navigation fits the short viewport. Measured contrast for secondary labels, links and eyebrow labels against the page background was respectively 6.23:1, 6.81:1 and 14.72:1.

The guide also opens and navigates within an opaque-origin sandbox iframe. Repeated same-hash links work after leaving and returning to the guide, and its CSV download succeeds. Numerical algorithms and the v0.5.0 reference-run outputs were not changed.

## Version 0.5 public-release verification

The latest user request authorizes public GitHub publication under MIT, superseding the earlier private-preview-only scope. This section records local verification of the release candidate; older private-review entries below are historical milestones, not the current publication instruction.

- **Numerical suite:** 170/170 tests pass, including deterministic seeds, input rejection, equal-midpoint/unequal-slope counterexample, calibration, interaction/comparator drift, cell limits, asynchronous/synchronous equivalence, and cancellation.
- **Executed simulations:** Four configurations, each with 100,000 iterations for six endpoint scenarios and 100,000 paired cell evaluations. There are 2.4 million endpoint experiments in total. The same-seed block-count checks reuse cell draws; they do not create new unique cell parameter sets.
- **Calibration:** All 18 paired-contrast 95% coverage estimates in the primary run fall between 94.5% and 95.5%. This tests implementation under the stipulated data-generating distribution, not biological validity.
- **Browser/CLI:** A 100,000-iteration browser run reproduced every decision-rate count in the primary CLI report. Across all numerical fields, the largest observed browser-versus-Node difference was less than 1e-16, reflecting floating-point math-library differences; cross-runtime bitwise identity is not promised.
- **New control inventory:** Iteration selection, seed zero, block-count changes, run, cancel, invalid block count, JSON download, Markdown download, simulation-view settings roundtrip, and prior-article outbound link were exercised through real controls. The simulation settings/results export separately from the main model settings; the main settings preserve the selected view.
- **Preview isolation:** A direct worker failed in an opaque-origin iframe. It was removed in favor of a cooperative generator runner shared with the CLI. The final runner completes and cancels in a sandboxed allow-scripts/allow-downloads iframe.
- **Responsive inspection:** Simulation controls and results inspected at 1440px and 375px. No document-level horizontal overflow; wide results tables scroll inside labeled, keyboard-focusable regions. The complete assumptions remain visible, not line-clamped. No page JavaScript errors were observed in the final standalone run.
- **Publication hygiene:** Tracked files and prior commit diffs were inspected for credential patterns and employer/patient material. Bundled inputs are synthetic; sources are public. MIT license and citation metadata are included.

The reference calculations and independent-seed/run-count interpretation are in [SIMULATION-DESIGN.md](SIMULATION-DESIGN.md). Historical walkthrough checks remain documented below.

## Scope

Verification concerns numerical implementation, input handling, and the browser interface. No biological validation or assay qualification is claimed.

## Browser QA inventory

- **Guided walkthrough:** All eight steps; outline and mobile selector; previous/next/bottom-next boundaries; optional reveal and reset; restart; matched plot axes; numeric outputs; changing endpoint warnings; final functional boundary; preserved sandbox state during browsing; explicit after-state copy; source-cited handout export; schema 4 progress and schema 1–3 migration; malformed step rejection; desktop/mobile transitions.
- **Claim audit:** All seven claims; same and mixed endpoints; historical/side-by-side/crossed designs; unknown/no/yes measurement declarations; matched versus changed cells; expression tracking; actionable navigation; report export; settings persistence. A complete checklist must not issue an empirical or causal result.
- **Approximation audit:** High cell load with depletion disabled must expose a warning; enabling finite supply clears that approximation warning without claiming assay validation.
- **Historical mode:** Default ratio 0.25, sensitivity slider, all three scenario buttons, EC50 edits, unit-label changes, invalid/zero input, recovery, and reset by settings import.
- **Bridge mode:** All three synthetic presets, editable CSV, duplicate/incomplete/censored input rejection, zero-variation and one-block uncertainty handling, independent lot and interaction margins, qualification toggle and reset on edits.
- **Evidence display:** Plot values agree with tabulated results, no equivalence claim for an unsupported historical contrast, limits visible, method/lot ratio direction explicit.
- **Files:** Settings JSON download/import, invalid JSON rejection without partial mutation, CSV download, Markdown report download.
- **Navigation:** All views, keyboard focus, source link and code link behavior.
- **Responsive rendering:** Desktop and 375 px, initial historical mode, populated bridge, methods, full-page overflow, and desktop–mobile–desktop transitions.
- **Cell context:** All four scenarios; passage; independent fraction/density loss modes and half-lives; all-cell/positive-only mean; density, volume and cell number; depletion toggle; tracer; signal floor; zero-positive case; all four readouts; generic reporter parameters; context report and settings round-trip.
- **Scientific interpretation:** Constant molecular parameter across cells; normalization can hide signal loss; depletion changes total-concentration midpoint; tracer changes competition midpoint; generic reporter is visibly not a CD20 mechanism; stability and integration are not inferred from expression.
- **Exploratory failures:** Malformed settings, missing CSV cells, extreme margins, duplicate runs, and zero variation.

## Automated verification

Run `npm test` to execute the dependency-free Node.js model and rule suite. The GitHub Actions workflow repeats the suite and all three CLI smoke tests on each push and pull request.

## Private preview 0.4.0 results

The user requested the guided Raji-versus-engineered walkthrough and explicitly assigned the installment label “Data-Rich, Insight-Poor CCLX · 99 Small Problems · No. 07.” The preview and repository remain private; numbering is not evidence of publication.

- **Automated suite:** 159 tests cover the existing models plus all eight walkthrough steps, fixed antibody K, matched concentration axes, stated numerical outputs, no shared-state mutation, malformed progress settings, and synchronization of the repository handout with the downloadable report.
- **Guidance:** Every step declares changes, fixed assumptions, an interpretation question, scoped conclusions, inference limits and a next measurement. Tracer competition is distinct from the final generic reporter, whose non-CD20 scope is visible before the curves.
- **Interactions:** All outline steps, Previous/Next, bottom navigation, boundary disabling, restart, reveal/hide and reveal reset were exercised. Mobile selection and desktop–mobile–desktop transitions were checked.
- **State isolation:** Browsing all eight steps left custom sandbox K and passage unchanged. Explicit “Copy after-state to sandbox” transferred only the selected cell-context parameters.
- **Persistence:** Schema 4 retained walkthrough position; schema 3 migrated to the initial lesson step. An invalid step was rejected without changing the current state. Earlier schema migrations remain covered by the prior checks.
- **Exports and identity:** The full Markdown handout contains all eight lessons, generated outputs, parameter settings and scientific references. Settings and report exports include the requested CCLX / No. 07 designation exactly once. The designation remains visible at mobile width.
- **Visual and runtime:** Matched before/after plots and output tables were inspected at desktop and 375 px. No page-level or chart-level horizontal overflow was found across the eight mobile steps. Final browser checks reported no JavaScript errors.

## Private preview 0.3.0 results

The user requested continued private refinement. Neither public publication nor a change in repository visibility is part of this update.

- **Automated suite:** 133/133 tests passed on Node.js 20.20.2. Added coverage includes seven claim routes, endpoint mismatch, unknown evidence, refusal to approve mechanistic claims from declarations, finite-supply diagnostics with the approximation still selected, and malformed cell-context settings.
- **Claim audit:** All seven claims were exercised in the browser. A suitable declared design produces a conditional design assessment, never an empirical result; mixed endpoints restore an explicit evidence gap. Navigation and Markdown audit export were checked.
- **Approximation diagnostic:** High cell load with depletion disabled displayed the warning. Enabling mass balance removed that approximation warning without changing the stated biological limits.
- **Provenance and imports:** Edits mark examples as custom. Schema 3 preserves audit settings; schemas 1 and 2 migrate using audit defaults. Passage 150 round-tripped through the slider, whose range now matches the model's 0–200 range. Malformed context arrays were rejected without partial state mutation.
- **Responsive plots:** Historical, cell-context and bridge plots were inspected at 375 px and desktop width. Plot labels and axes reflow without horizontal scrolling; cell and bridge results use readable mobile cards. Desktop/mobile transitions and document-level overflow were checked.
- **Runtime:** No page JavaScript errors were observed. File import checks waited for the asynchronous load to complete before asserting the restored state.

## Release 0.2.0 results

Verification completed on 2026-10-17. The results below describe software behavior, not scientific validation of an assay.

- **Numerical suite:** 101/101 tests passed on Node.js 20.20.2. Tests include the historical confounding examples, Student t intervals, equivalence boundaries, CSV validation, zero-variation safeguards, expression trajectories, gating, ligand mass balance, analytic midpoint limits, and generic response-reserve behavior.
- **Independent numerical cross-check:** Forty Student t quantiles were compared against SciPy, over degrees of freedom 1, 2, 3, 5, 10, 30, 100, and 999, and probabilities 0.9, 0.95, 0.975, 0.99, and 0.999. Maximum absolute error was 1.74e−11.
- **CLI:** Historical, paired bridge, and cell-context smoke tests completed. Source syntax checks and `git diff --check` passed.
- **Functional browser checks:** All four views, all synthetic scenarios, historical sensitivity controls, equal/zero EC50 handling, cell-context parameters, gate changes, passage endpoints, all loss patterns, depletion toggling, invalid tracer input, all bridge presets, one-block/zero-variation/missing-cell handling, qualification behavior, report/CSV downloads, settings round-trip, and malformed settings rejection were exercised.
- **Responsive checks:** Desktop 1440×1000 and mobile 375×812 were inspected, including desktop–mobile–desktop transitions. No document-level horizontal overflow was found. Scientific charts and the cell-endpoint table intentionally scroll horizontally on narrow screens; bridge decisions also have a readable mobile card presentation.
- **Accessibility checks:** Visible tab states use literal aria-pressed values; invalid input uses alert regions; output regions announce updates. The minimum measured contrast among the checked secondary/status text combinations was 6.22:1. Source-link activation reached the cited destination. Keyboard access was checked for range controls, and the settings-import label supports Enter/Space.
- **Runtime:** No page JavaScript errors were observed during these checks.

External papers, GitHub authentication, font-provider availability, biological assumptions, and user data provenance are not under the model's control. This record is not an exhaustive accessibility audit, a validation of all possible numerical inputs, or an assay qualification.
