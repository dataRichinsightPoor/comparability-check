import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {receptorConcentration} from "../web/context-model.mjs";
const html=await readFile(new URL("../web/article.html",import.meta.url),"utf8");
const md=await readFile(new URL("../docs/COMPANION-ARTICLE.md",import.meta.url),"utf8");
test("illustrated article embeds three figures with captions and alt descriptions",()=>{
  assert.equal((html.match(/<figure>/g)||[]).length,3);
  assert.equal((html.match(/src="data:image\/png;base64,/g)||[]).length,3);
  assert.equal((html.match(/<figcaption>/g)||[]).length,3);
  for(const [,alt] of html.matchAll(/<img[^>]*alt="([^"]*)"/g))assert.ok(alt.length>20);
});
test("equations render as MathML rather than raw source delimiters",()=>{
  assert.equal((html.match(/<math /g)||[]).length,29);
  assert.ok(!html.includes("MATHPLACEHOLDER"));
  assert.ok(!html.includes("<annotation"));
  assert.ok(!html.includes("katex-error"));
});
test("literature captions state provenance, modifications and scientific limits",()=>{
  for(const token of ["CC BY 4.0","panels cropped","not rituximab","not lots","nor represent functional","not general QC"])assert.ok(md.includes(token),token);
});
test("article calculation uses explicit model units",()=>{
  const high=receptorConcentration(100000,100000,1,100);
  const low=receptorConcentration(100000,10000,1,100);
  assert.ok(Math.abs(high-.16605390671738465)<1e-12);
  assert.ok(Math.abs(high/low-10)<1e-12);
  assert.equal((1+high/2).toFixed(3),"1.083");
  assert.equal((1+low/2).toFixed(3),"1.008");
});
test("reader retains copy, selection fallback, model and source-code access",()=>{
  for(const s of ['id="copy-article"','id="select-article"','href="index.html"',"context-model.mjs","simulation-model.mjs","npm test","git checkout v0.6.0"])assert.ok(html.includes(s),s);
});
test("series connections explain interpretation rather than append a reading list",()=>{
  for(const slug of [
    "assay-got-better-because-cells-worse",
    "number-carries-its-protocol",
    "threshold-part-measurement",
    "ic50-belongs-plate",
    "mechanistic-void-molecular-glue-design"
  ])assert.ok(md.includes(slug),slug);
  assert.ok(md.includes("Insight becomes useful"));
  assert.ok(md.includes("rather than supplying a general reason to distrust measurements"));
  assert.ok(!md.includes("## Related"));
});
