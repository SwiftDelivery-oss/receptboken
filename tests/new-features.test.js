import test from 'node:test';
import assert from 'node:assert/strict';
import {encodeSelections,decodeSelections} from '../web/shopping-links.js';
import {doughWeight} from '../web/dough.js';
test('Degvikt per styck delar med basantal och blandar g och kg',()=>{
 const recipe={kategori:'Bröd',skalningsenhet:'st',basantal:2,ingredienser:[{ingredienser:[{mängd:1,enhet:'kg'},{mängd:100,enhet:'g'}]}]};
 assert.equal(doughWeight(recipe),550);
 recipe.ingredienser[0].ingredienser[1].enhet='dl';assert.equal(doughWeight(recipe),null);
 recipe.ingredienser[0].ingredienser[1].enhet='';assert.equal(doughWeight(recipe),null);
});
