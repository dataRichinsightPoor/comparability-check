export const VIEWS=Object.freeze(["audit","walkthrough","history","context","bridge","simulation","guidance","methods"]);
export const GUIDANCE_ANCHORS=Object.freeze(["guidance-pharma","guidance-qc","guidance-early","guidance-figure"]);
export function routeForHash(hash){
  if(typeof hash!=="string"||!hash.startsWith("#"))return null;
  let id;
  try{id=decodeURIComponent(hash.slice(1));}catch{return null;}
  if(VIEWS.includes(id))return {view:id,anchor:id};
  if(GUIDANCE_ANCHORS.includes(id))return {view:"guidance",anchor:id};
  return null;
}
