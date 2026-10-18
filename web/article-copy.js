const article=document.getElementById("essay");
const status=document.getElementById("copy-status");
function selectArticle(){
  const selection=window.getSelection();
  const range=document.createRange();
  range.selectNodeContents(article);selection.removeAllRanges();selection.addRange(range);
  status.textContent="Article selected. Use your browser's Copy command, then verify figures and equations in the destination editor.";
}
function copyPayload(){
  const clone=article.cloneNode(true);
  clone.querySelectorAll("a").forEach(a=>a.href=new URL(a.getAttribute("href"),location.href).href);
  clone.querySelectorAll("figure a:has(img)").forEach((a,i)=>{
    a.href=i===0
      ?"https://datarichinsightpoor.github.io/comparability-check/resources/misleading-historical-equivalence.png"
      :"https://pmc.ncbi.nlm.nih.gov/articles/PMC6834678/";
  });
  clone.querySelectorAll("img").forEach(img=>{img.style.maxWidth="100%";img.style.height="auto";});
  clone.querySelectorAll("figure").forEach(figure=>{figure.style.margin="24px 0";});
  clone.querySelectorAll("figcaption").forEach(caption=>{caption.style.fontSize="14px";caption.style.lineHeight="1.6";});
  clone.querySelectorAll("pre").forEach(pre=>{pre.style.whiteSpace="pre-wrap";});
  return {html:clone.outerHTML,text:article.innerText};
}
document.getElementById("select-article").addEventListener("click",selectArticle);
document.getElementById("copy-article").addEventListener("click",async()=>{
  try{
    const payload=copyPayload();
    if(!navigator.clipboard?.write||typeof ClipboardItem==="undefined")throw new Error("Clipboard unavailable");
    await navigator.clipboard.write([new ClipboardItem({
      "text/html":new Blob([payload.html],{type:"text/html"}),
      "text/plain":new Blob([payload.text],{type:"text/plain"})
    })]);
    status.textContent="Article copied with embedded figures and linked captions. Check image and equation retention after pasting.";
  }catch{selectArticle();}
});
// Native image opening keeps the original figure readable on narrow screens.
article.querySelectorAll("figure img").forEach(img=>{
  const link=document.createElement("a");
  link.href=img.src;link.target="_blank";link.rel="noopener";link.setAttribute("aria-label",`Enlarge figure: ${img.alt}`);
  // Data-URL top-level navigation is restricted in some browsers. A local
  // asset path provides the reliable enlargement route instead.
  const names=["misleading-historical-equivalence.png","lee-2019-fcrn-density.png","lee-2019-raji-function.png"];
  link.href=`resources/${names[[...article.querySelectorAll("figure img")].indexOf(img)]}`;
  img.replaceWith(link);link.append(img);
});
