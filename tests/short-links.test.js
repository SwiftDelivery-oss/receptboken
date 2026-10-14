import test from 'node:test';
import assert from 'node:assert/strict';
import {encodeSelections,decodeSelections,shoppingUrl,MAX_COUNT} from '../web/shopping-links.js';
const recipes=Array.from({length:6},(_,i)=>({id:i+1,slug:'recept-'+(i+1),ingredienser:[]}));
test('Sex recept får en kort länk utan URL-kodning',()=>{
 const selections=recipes.map((r,i)=>({slug:r.slug,antal:i+2}));
 const url=new URL(shoppingUrl('/receptboken/','https://example.test',selections,recipes));
 assert.equal(url.search,'?r=1-2_2-3_3-4_4-5_5-6_6-7');
 assert.ok(url.search.length<60);assert.ok(!url.href.includes('%'));
 assert.deepEqual(decodeSelections(url.searchParams.get('r'),recipes).selections,selections);
});
test('Decimalantal och dubbletter summeras',()=>{
 assert.equal(encodeSelections([{slug:'recept-1',antal:.5},{slug:'recept-1',antal:2}],recipes),'1-2.5');
 assert.deepEqual(decodeSelections('1-0.5_1-2',recipes).selections,[{slug:'recept-1',antal:2.5}]);
});
test('Okända ID och ogiltiga antal påverkar inte giltiga poster',()=>{
 const result=decodeSelections('999-2_1-0_2--2_3-text_4_5-2',recipes);
 assert.deepEqual(result.selections,[{slug:'recept-4',antal:1},{slug:'recept-5',antal:2}]);
 assert.match(result.notices.join(' '),/finns inte längre/);
});
test('Antal och poster har övre gränser',()=>{
 assert.equal(decodeSelections('1-999999_1-2',recipes).selections[0].antal,MAX_COUNT);
 const result=decodeSelections(Array(101).fill('1-1').join('_'),recipes);
 assert.equal(result.selections[0].antal,100);assert.ok(result.notices.length);
});
test('Vald variant följer med i separat kompakt parameter',()=>{
 const r={id:1,slug:'variant',ingredienser:[{variant:'råg:1,2'},{variant:'vete'}]};
 const url=new URL(shoppingUrl('/','https://example.test',[{slug:'variant',antal:2,variant:'vete'}],[r]));
 assert.equal(url.search,'?r=1-2&v=1-2');
 assert.equal(decodeSelections(url.searchParams.get('r'),[r],url.searchParams.get('v')).selections[0].variant,'vete');
});
