# Verification record

## Scope

Verification concerns numerical implementation, input handling, and the browser interface. No biological validation or assay qualification is claimed.

## Browser QA inventory

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

Run `npm test` to execute the dependency-free Node.js numerical suite. The GitHub Actions workflow repeats the suite and both CLI smoke tests on each push and pull request.

## Release 0.2.0 results

Verification completed on 2026-10-17. The results below describe software behavior, not scientific validation of an assay.

- **Numerical suite:** 101/101 tests passed on Node.js 22. Tests include the historical confounding examples, Student t intervals, equivalence boundaries, CSV validation, zero-variation safeguards, expression trajectories, gating, ligand mass balance, analytic midpoint limits, and generic response-reserve behavior.
- **Independent numerical cross-check:** Forty Student t quantiles were compared against SciPy, over degrees of freedom 1, 2, 3, 5, 10, 30, 100, and 999, and probabilities 0.9, 0.95, 0.975, 0.99, and 0.999. Maximum absolute error was 1.74e−11.
- **CLI:** Historical, paired bridge, and cell-context smoke tests completed. Source syntax checks and `git diff --check` passed.
- **Functional browser checks:** All four views, all synthetic scenarios, historical sensitivity controls, equal/zero EC50 handling, cell-context parameters, gate changes, passage endpoints, all loss patterns, depletion toggling, invalid tracer input, all bridge presets, one-block/zero-variation/missing-cell handling, qualification behavior, report/CSV downloads, settings round-trip, and malformed settings rejection were exercised.
- **Responsive checks:** Desktop 1440×1000 and mobile 375×812 were inspected, including desktop–mobile–desktop transitions. No document-level horizontal overflow was found. Scientific charts and the cell-endpoint table intentionally scroll horizontally on narrow screens; bridge decisions also have a readable mobile card presentation.
- **Accessibility checks:** Visible tab states use literal aria-pressed values; invalid input uses alert regions; output regions announce updates. The minimum measured contrast among the checked secondary/status text combinations was 6.22:1. Source-link activation reached the cited destination. Keyboard access was checked for range controls, and the settings-import label supports Enter/Space.
- **Runtime:** No page JavaScript errors were observed during these checks.

External papers, GitHub authentication, font-provider availability, biological assumptions, and user data provenance are not under the model's control. This record is not an exhaustive accessibility audit, a validation of all possible numerical inputs, or an assay qualification.
