// Stable slugs keep shared lists valid when recipes are added or reordered.
export function encodeSelections(selections) {
  return selections.map(s=>`${s.slug}:${s.antal}${s.variant?':'+encodeURIComponent(s.variant):''}`).join(',');
}
export function decodeSelections(value) {
  if (!value) return [];
  return value.split(',').map(part=>{
    const [slug,antal,variant,...extra]=part.split(':');
    if(extra.length) throw Error('Ogiltig länk');
    return {slug,antal:Number(antal),...(variant?{variant:decodeURIComponent(variant)}:{})};
  });
}
