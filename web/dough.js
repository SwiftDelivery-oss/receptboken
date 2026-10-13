import {activeGroups} from './shopping.js';
import {formatAmount} from './scale.js';
export function doughWeight(recipe,variant) {
  if(recipe.kategori!=='Bröd'||recipe.skalningsenhet!=='st')return null;
  let grams=0;
  const ingredients=activeGroups(recipe,variant).flatMap(g=>g.ingredienser);
  if(!ingredients.length)return null;
  for(const i of ingredients){
    const unit=i.enhet.trim().toLowerCase();
    if(i.mängd===null||!['kg','g','gr'].includes(unit))return null;
    grams+=i.mängd*(unit==='kg'?1000:1);
  }
  return grams/recipe.basantal;
}
export function doughLabel(recipe,variant) {
  const weight=doughWeight(recipe,variant);
  return 'Degvikt per styck: '+(weight===null?'Kan inte beräknas – mängd eller viktenhet saknas.':formatAmount(weight,'g')+' (beräknad från ingredienserna)');
}
