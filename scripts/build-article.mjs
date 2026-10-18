import {readFile,writeFile} from "node:fs/promises";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {marked} from "marked";
import katex from "katex";
import sharp from "sharp";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const resources=resolve(root,"web/resources");
// Crops retain the original panel labels, axes, legends, and data.
await sharp(resolve(resources,"lee-2019-figure-1-original.png"))
  .extract({left:615,top:0,width:585,height:478})
  .png().toFile(resolve(resources,"lee-2019-fcrn-density.png"));
await sharp(resolve(resources,"lee-2019-figure-3-original.png"))
  .extract({left:922,top:0,width:1066,height:488})
  .png().toFile(resolve(resources,"lee-2019-raji-function.png"));
const markdown=await readFile(resolve(root,"docs/COMPANION-ARTICLE.md"),"utf8");
await writeFile(resolve(resources,"to-be-or-not-to-be-comparable.md"),markdown.replaceAll("../web/resources/","./"));
const equations=[];
const withMath=markdown.replace(/\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/g,(_,display,inline)=>{
  const expr=display??inline;
  const math=katex.renderToString(expr.trim(),{displayMode:display!==undefined,output:"mathml",throwOnError:true})
    .replace(/<annotation[\s\S]*?<\/annotation>/g,"");
  equations.push(display!==undefined?`<div class="equation">${math}</div>`:math);
  return `MATHPLACEHOLDER${equations.length-1}END`;
});
let html=marked.parse(withMath);
html=html.replace(/<p>(MATHPLACEHOLDER\d+END)<\/p>/g,"$1")
 .replace(/MATHPLACEHOLDER(\d+)END/g,(_,n)=>equations[Number(n)]);
for (const name of ["misleading-historical-equivalence.png","lee-2019-fcrn-density.png","lee-2019-raji-function.png"]) {
  const bytes=await readFile(resolve(resources,name));
  html=html.replaceAll(`../web/resources/${name}`,`data:image/png;base64,${bytes.toString("base64")}`);
}
html=html.replace(/<p>(<img[^>]+>)<\/p>\s*<p>(Figure \d\.[\s\S]*?)<\/p>/g,
  '<figure>$1<figcaption>$2</figcaption></figure>');
// Stable anchors are derived only from headings authored in the Markdown.
html=html.replace(/<h2>(.*?)<\/h2>/g,(_,s)=>`<h2 id="${s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-$/,"")}">${s}</h2>`);
html=html.replace(/<h1>(.*?)<\/h1>\s*<p>(Data-Rich,[\s\S]*?)<\/p>/,
  '<header class="article-header"><p class="series">$2</p><h1>$1</h1><p class="deck">What can we compare when the antibody, the cells, and the assay no longer share a history?</p></header>');
const css=await readFile(resolve(root,"web/article.css"),"utf8");
const js=await readFile(resolve(root,"web/article-copy.js"),"utf8");
const document=`<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="An illustrated scientific essay on bioassay comparability, receptor expression, historical equivalence, and phase-appropriate QC.">
<title>To Be or Not to Be Comparable | Illustrated essay</title>
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=zodiak@400,500&f[]=satoshi@400,500,700&display=swap">
<style>${css}</style></head><body>
<a class="skip-link" href="#essay">Skip to article</a>
<nav class="reading-tools" aria-label="Article tools"><a href="index.html">Open interactive model</a><div><button id="copy-article">Copy article</button><button id="select-article">Select article</button><a href="resources/to-be-or-not-to-be-comparable.md" download>Markdown</a></div></nav>
<p id="copy-status" role="status">Private illustrated revision · Model v0.6.0 · Literature panels retain their stated licenses.</p>
<article id="essay">${html}</article>
<footer><p>Illustrated revision for review. The model, source code, and previously published release remain available through the links in the essay.</p><p>Copy includes embedded images and linked captions. Image and equation retention depends on the destination editor and should be checked after pasting.</p><a href="index.html#walkthrough">Continue with the guided cell-context walkthrough</a></footer>
<script>${js}</script></body></html>`;
await writeFile(resolve(root,"web/article.html"),document);
console.log(`Built illustrated article: ${markdown.split(/\s+/).length} words, ${equations.length} math expressions, 3 figures.`);
