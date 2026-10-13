import test from 'node:test';
import assert from 'node:assert/strict';
import {cleanSelections,setSelectionCount,steppedCount} from '../web/shopping-store.js';
const recipes=[{slug:'brod',ingredienser:[{}]},{slug:'pizza',ingredienser:[{variant:'1'},{variant:'2'}]}];
test('Antal sätts till valt antal och ökas inte vid sidbyte',()=>{
  let list=setSelectionCount([],'brod',undefined,1);
  list=setSelectionCount(list,'brod',undefined,3);
  assert.deepEqual(list,[{slug:'brod',antal:3}]);
  assert.deepEqual(cleanSelections(JSON.parse(JSON.stringify(list)),recipes),list);
  assert.deepEqual(setSelectionCount(list,'brod',undefined,0),[]);
});
test('Minus återgår till tomt och plus respekterar gränsen',()=>{
  assert.equal(steppedCount(1,-1),0);
  assert.equal(steppedCount(.5,-1),0);
  assert.equal(steppedCount(2,-1),1);
  assert.equal(steppedCount(1000000,1),1000000);
});
test('Varianter hålls isär och gamla sparade val normaliseras',()=>{
  let list=setSelectionCount([],'pizza','1',2);
  list=setSelectionCount(list,'pizza','2',3);
  assert.equal(list.length,2);
  assert.deepEqual(cleanSelections([{slug:'pizza',antal:4,variant:'fel'},{slug:'okand',antal:1},{slug:'brod',antal:-1}],recipes),[{slug:'pizza',antal:4,variant:'1'}]);
  assert.deepEqual(setSelectionCount(list,'pizza','1',NaN),list);
});
