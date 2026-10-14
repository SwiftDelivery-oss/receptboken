import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {validateShared,retainChecked,itemKey} from '../web/shopping-state.js';
import {aggregateShopping} from '../web/shopping.js';
import {printRecipeModels} from '../web/shopping-print.js';
const recipes=readdirSync(new URL('../recept/',import.meta.url)).filter(n=>n.endsWith('.json')).map(n=>JSON.parse(readFileSync(new URL('../recept/'+n,import.meta.url),'utf8')));
test('Delade listor avvisar okända recept, antal och varianter',()=>{
 assert.throws(()=>validateShared([{slug:'unknown',antal:2}],recipes));
 assert.throws(()=>validateShared([{slug:'formfranska',antal:'no'}],recipes));
 assert.throws(()=>validateShared([{slug:'formfranska',antal:2,variant:'unknown'}],recipes));
 assert.deepEqual(validateShared([{slug:'formfranska',antal:3}],recipes),[{slug:'formfranska',antal:3}]);
});
test('Oförändrade varor behåller avbockning, ändrade mängder återställs',()=>{
 const a={namn:'Salt',enhet:'kg',mängd:1,källor:['A']};const b={namn:'Mjöl',enhet:'kg',mängd:2,källor:['B']};
 const result=retainChecked(new Set([itemKey(a),itemKey(b)]),[a,b],[a,{...b,mängd:3}]);
 assert.deepEqual([...result],[itemKey(a)]);
});
test('Riktiga receptdata summeras och specifika varningar följer med',()=>{
 const result=aggregateShopping(recipes,[{slug:'formfranska',antal:3},{slug:'honokaka',antal:2}]);
 assert.equal(result.items.find(i=>i.namn.toLowerCase()==='vetemjöl').mängd,1.82);
 const warnings=aggregateShopping(recipes,[{slug:'ishavsrora',antal:1},{slug:'pasta-kyckling',antal:1}]).warnings.join(' ');
 assert.match(warnings,/MAJZENA BLANDNING/);assert.match(warnings,/ingår inte i listan/);
});
test('Utskrift inkluderar summerade delrecept och granskningspunkter',()=>{
 const selection=[{slug:'ragbrod-solros',antal:2},{slug:'ragbrod-solros',antal:3}];
 const models=printRecipeModels(recipes,selection,true);
 assert.equal(models.filter(r=>r.titel==='Rågbröd Solros').length,1);
 assert.equal(models[0].antal,5);
 assert.ok(models.length>1);
 assert.ok(models.some(r=>r.titel.toLowerCase().includes('skållning')));
 assert.ok(printRecipeModels(recipes,[{slug:'ishavsrora',antal:1}])[0].granskningspunkter.length);
 assert.equal(printRecipeModels(recipes,selection,false).length,1);
});
