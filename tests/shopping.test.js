import test from 'node:test';
import assert from 'node:assert/strict';
import {aggregateShopping} from '../web/shopping.js';
import {formatAmount} from '../web/scale.js';
// Source fixtures remain fixed so changing a personal recipe does not break publication.
const fixtures={
  formfranska:{slug:'formfranska',titel:'Formfranska',basantal:1,ingredienser:[{ingredienser:[
    {namn:'vetemjöl ',mängd:.5,enhet:'kg'},{namn:'salt',mängd:.0125,enhet:'kg'},{namn:'torrjäst',mängd:.007,enhet:'kg'},{namn:'olivolja ',mängd:.025,enhet:'kg'},{namn:'Socker',mängd:.005,enhet:'kg'},{namn:'vatten',mängd:.25,enhet:'kg'}]}]},
  honokaka:{slug:'honokaka',titel:'Hönökaka',basantal:1,ingredienser:[{ingredienser:[
    {namn:'Vetemjöl ',mängd:.16,enhet:'kg'},{namn:'Rågsikt',mängd:.16,enhet:'kg'},{namn:'salt',mängd:.004,enhet:'kg'},{namn:'torrjäst',mängd:.00466,enhet:'kg'},{namn:'Smör',mängd:.03333,enhet:'kg'},{namn:'Ljus sirap',mängd:.04666,enhet:'kg'},{namn:'Mjölk',mängd:.2,enhet:'kg'}]}]}
};
const load=slug=>fixtures[slug];

test('3 Formfranska och 2 Hönökaka summerar gemensamma ingredienser',()=>{
  const recipes=[load('formfranska'),load('honokaka')];
  const {items,warnings}=aggregateShopping(recipes,[{slug:'formfranska',antal:3},{slug:'honokaka',antal:2}]);
  const get=name=>items.find(i=>i.namn.toLowerCase()===name);
  assert.equal(get('vetemjöl').mängd,1.82);
  assert.equal(formatAmount(get('salt').mängd,'kg'),'45,5 g');
  assert.equal(formatAmount(get('torrjäst').mängd,'kg'),'30,32 g');
  assert.equal(get('vatten').mängd,.75);
  assert.equal(items.length,10);assert.deepEqual(warnings,[]);
});
const recipe=(slug,ingredients,extra={})=>({slug,titel:slug,basantal:1,skalningsenhet:'kg',ingredienser:[{ingredienser:ingredients}],...extra});
test('kg och g summeras, vikt och volym hålls isär och namn rättas inte',()=>{
  const a=recipe('a',[{namn:'Mjöl',mängd:1,enhet:'kg'},{namn:'mjöl ',mängd:250,enhet:'g'},{namn:'Mjöl',mängd:2,enhet:'dl'},{namn:'Mjöl special',mängd:.5,enhet:'kg'}]);
  const result=aggregateShopping([a],[{slug:'a',antal:1}]);
  assert.equal(result.items.length,3);
  assert.equal(result.items.find(i=>i.enhet==='kg'&&i.namn==='Mjöl').mängd,1.25);
  assert.equal(result.items.find(i=>i.enhet==='l').mängd,.2);
});
test('Delrecept ersätter den färdiga varan utan dubbelräkning',()=>{
  const a=recipe('brod',[{namn:'Surdeg',mängd:.5,enhet:'kg',delrecept:'surdeg'},{namn:'Mjöl',mängd:1,enhet:'kg'}]);
  const b=recipe('surdeg',[{namn:'Mjöl',mängd:.5,enhet:'kg'},{namn:'Vatten',mängd:.5,enhet:'kg'}]);
  const expanded=aggregateShopping([a,b],[{slug:'brod',antal:2}]);
  assert.equal(expanded.items.find(i=>i.namn==='Mjöl').mängd,2.5);
  assert.equal(expanded.items.find(i=>i.namn==='Vatten').mängd,.5);
  const prepared=aggregateShopping([a,b],[{slug:'brod',antal:2}],false);
  assert.equal(prepared.items.find(i=>i.namn==='Surdeg').mängd,1);
});
test('Saknade uppgifter och cirkulära delrecept är synliga',()=>{
  const a=recipe('a',[{namn:'Okänd',mängd:null,enhet:''},{namn:'b',mängd:1,enhet:'kg',delrecept:'b'}]);
  const b=recipe('b',[{namn:'a',mängd:1,enhet:'kg',delrecept:'a'}]);
  const result=aggregateShopping([a,b],[{slug:'a',antal:1}]);
  assert.equal(result.items.find(i=>i.namn==='Okänd').mängd,null);
  assert.ok(result.items.find(i=>i.namn==='a'));
  assert.ok(result.warnings.length>=2);
});
test('Endast vald variant räknas med',()=>{
  const a=recipe('pizza',[],{ingredienser:[{variant:'1',ingredienser:[{namn:'Mjöl',mängd:1,enhet:'kg'}]},{variant:'2',ingredienser:[{namn:'Mjöl',mängd:2,enhet:'kg'}]}]});
  assert.equal(aggregateShopping([a],[{slug:'pizza',antal:3,variant:'2'}]).items[0].mängd,6);
});
test('Två oklara rader får inte tappas bort eller summeras utan enhet',()=>{
  const a=recipe('a',[{namn:'Okänd',mängd:1,enhet:''},{namn:'Okänd',mängd:2,enhet:''}]);
  const result=aggregateShopping([a],[{slug:'a',antal:3}]);
  assert.deepEqual(result.items.map(i=>i.mängd),[3,6]);
});
