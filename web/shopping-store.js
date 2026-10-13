import {parseAmount} from './scale.js';

export function selectionKey(slug,variant='') {
  return slug+'|'+variant;
}
export function cleanSelections(value,recipes) {
  if(!Array.isArray(value)) return [];
  const lookup=new Map(recipes.map(r=>[r.slug,r]));
  const result=[];
  for(const item of value) {
    const recipe=lookup.get(item?.slug);
    const count=parseAmount(String(item?.antal));
    if(!recipe||count===null) continue;
    const choices=recipe.ingredienser.filter(g=>g.variant);
    const variant=(choices.find(g=>g.variant===String(item.variant))||choices[0])?.variant;
    const existing=result.find(s=>selectionKey(s.slug,s.variant)===selectionKey(recipe.slug,variant));
    if(existing) existing.antal=Math.min(1000000,existing.antal+count);
    else result.push({slug:recipe.slug,antal:count,...(variant?{variant}:{})});
  }
  return result;
}
export function setSelectionCount(selections,slug,variant,count) {
  if(!Number.isFinite(count)||count<0||count>1000000) return selections;
  const key=selectionKey(slug,variant);
  const result=selections.filter(s=>selectionKey(s.slug,s.variant)!==key);
  if(count>0) {
    const next={slug,antal:count,...(variant?{variant}:{})};
    const index=selections.findIndex(s=>selectionKey(s.slug,s.variant)===key);
    result.splice(index<0?result.length:index,0,next);
  }
  return result;
}
export function steppedCount(count,step) {
  return step<0?Math.max(0,count-1):Math.min(1000000,count+1);
}
