import test from 'node:test';
import assert from 'node:assert/strict';
import {printRecipeModels} from '../web/shopping-print.js';

test('Utskriftsrecept använder valt antal och behåller originalinstruktioner',()=>{
  const recipe={slug:'brod',titel:'Bröd',basantal:1,skalningsenhet:'st',styckstorlek:'800g',ingredienser:[{rubrik:'Deg',ingredienser:[{namn:'Mjöl',mängd:.5,enhet:'kg'},{namn:'Salt',mängd:.0125,enhet:'kg'}]}],anteckningar:['Blanda länge \nGrädda sedan.']};
  const [printed]=printRecipeModels([recipe],[{slug:'brod',antal:3}]);
  assert.equal(printed.antal,3);
  assert.equal(printed.grupper[0].ingredienser[0].mängd,'1,5 kg');
  assert.equal(printed.grupper[0].ingredienser[1].mängd,'37,5 g');
  assert.deepEqual(printed.anteckningar,recipe.anteckningar);
  assert.equal(recipe.ingredienser[0].ingredienser[0].mängd,.5);
});
test('Utskrift tar bara med vald variant och hanterar okända mängder',()=>{
  const recipe={slug:'pizza',titel:'Pizza',basantal:1,skalningsenhet:'st',ingredienser:[{variant:'1',rubrik:'A',ingredienser:[{namn:'Mjöl',mängd:100,enhet:'g'}]},{variant:'2',rubrik:'B',ingredienser:[{namn:'Mjöl',mängd:150,enhet:'g'},{namn:'Salt',mängd:null,enhet:'efter smak'}]}]};
  const [printed]=printRecipeModels([recipe],[{slug:'pizza',antal:2,variant:'2'}]);
  assert.equal(printed.variant,'B');assert.equal(printed.grupper.length,1);
  assert.equal(printed.grupper[0].ingredienser[0].mängd,'300 g');
  assert.equal(printed.grupper[0].ingredienser[1].mängd,'efter smak');
});
test('Ett utskriftsrecept per valt recept och korrekt basantal',()=>{
  const recipes=['a','b'].map(slug=>({slug,titel:slug,basantal:10,skalningsenhet:'st',ingredienser:[{ingredienser:[{namn:'Mjöl',mängd:1,enhet:'kg'}]}]}));
  const models=printRecipeModels(recipes,[{slug:'a',antal:5},{slug:'b',antal:20},{slug:'saknas',antal:1}]);
  assert.equal(models.length,2);assert.equal(models[0].grupper[0].ingredienser[0].mängd,'500 g');assert.equal(models[1].grupper[0].ingredienser[0].mängd,'2 kg');
});
