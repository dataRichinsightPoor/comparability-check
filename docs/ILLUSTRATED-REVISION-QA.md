# Illustrated revision QA

Scope: private article revision, model algorithm unchanged. Public GitHub and Pages remain at v0.6.0 pending approval of the illustrated revision.

## Inventory

- Desktop and 375px reading layout: opening, all three figures, rendered equations, code, closing section; no page-level horizontal overflow.
- Copy article: rich HTML contains three embedded PNGs, source citations, MathML, and readable prose. No localhost or private-preview figure links in copied content.
- Select article: explicit fallback selects article body without navigation or status text.
- Clipboard-unavailable path: copying falls back to selection rather than claiming success.
- Navigation: article-to-model, model-to-article, walkthrough link, representative source citation, and figure enlargement.
- Markdown download: same maintained text with image paths adjusted to the resource directory.
- Mobile: control wrapping, equation containment, full captions, tap-to-enlarge figures.
- Numerical reproduction: 100,000 experiments for each of six scenarios at each of 4, 8, and 16 blocks. Reproduced masked historical declaration counts: 2,869; 7,830; 40,589. All scenario objects match the checked-in outputs exactly.
- Scientific boundaries: one-site toy model distinguished from full-IgG binding; generic reporter distinguished from CD20 function; FcRn SPR and rituximab Fc-variant data distinguished from lot and passage experiments.
- Licensing: CC BY literature-panel provenance, cropping, and correction note; no NC-ND figures reproduced or relicensed.

## Reproduction

`npm ci && npm run build:article && npm test` builds the illustrated page and runs model and article checks. The static site has no runtime package dependency.

The three simulation reruns constitute 1.8 million summary-endpoint experiments. Their same-seed cell ensembles are reused, not three independent datasets.

## Deliberate limitations

Copy/paste retention in LinkedIn, Substack, or another destination editor is not verified by sandbox clipboard tests. The preview states that figures and equations should be checked after pasting. Literature-panel image dimensions reflect downloaded source artwork; no artificial resolution claim is made.

## Completed checks

All 196 tests pass. The refreshed development dependencies report zero known
vulnerabilities in the audit performed for this revision. Chromium checks at
1440px and 375px found no page-level horizontal overflow or broken images.
Screenshots were inspected for the opening, mathematical expressions, the
simulation and literature figures, code blocks, and closing prose.

The rich clipboard contains all three base64 PNG images and all 29 MathML
expressions, with no localhost URLs. Selection fallback also succeeds when
clipboard access is unavailable. Article/model round-trip navigation, the
walkthrough destination, Markdown download, figure enlargement, and a literature
source click were exercised. Secondary text, links, and buttons exceed 4.5:1
contrast against their backgrounds.

The final editorial pass integrates five related Data-Rich, Insight-Poor essays
around scientific interpretation, measurement selection, response architecture,
and productive mechanism. “The Number Carries Its Protocol” uses the URL
previously supplied by the user and its preserved editorial context; LinkedIn's
public fetch blocked access, so current live-page content was not reverified.
The other newly added Threshold, IC50, and Molecular Glue pages were fetched.
