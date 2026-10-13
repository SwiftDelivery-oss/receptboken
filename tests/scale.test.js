import test from 'node:test';
import assert from 'node:assert/strict';
import { formatAmount, parseAmount, scaledAmount } from '../web/scale.js';
// Fixed source-layout fixtures: manual changes to published recipes must remain possible.
const fixtures = {
  vortlimpa: { basantal: 1, ingredienser: [{ingredienser: [
    {namn:'Vetemjöl special',mängd:.3125}, {namn:'Nejlika',mängd:.0025}, {namn:'Surdeg vete',mängd:.075}
  ]}] },
  ishavsrora: { basantal:1, ingredienser:[{ingredienser:[
    {namn:'Crabbsticks',mängd:1},{namn:'Majonäs',mängd:1.5},{namn:'Räkor',mängd:1.5}
  ]},{rubrik:'MAJZENA BLANDNING',ingredienser:[]}] },
  'ungersk-gulaschsoppa': {basantal:1,ingredienser:[{ingredienser:[
    {namn:'Högrev',mängd:.15},{namn:'Köttbuljong',mängd:.1875},{namn:'Salt och svartpeppar',mängd:null}
  ]}]}
};
const recipe = slug => fixtures[slug];
const ingredient = (r, name) => r.ingredienser.flatMap(g => g.ingredienser).find(i => i.namn === name);

test('Vörtlimpa: 20 bröd använder basen, inte Excels 10 bröd', () => {
  const r = recipe('vortlimpa');
  assert.equal(scaledAmount(ingredient(r, 'Vetemjöl special'), 20, r.basantal), 6.25);
  assert.equal(formatAmount(ingredient(r, 'Nejlika').mängd, 'kg', 20), '50 g');
  assert.equal(scaledAmount(ingredient(r, 'Surdeg vete'), 20, r.basantal), 1.5);
});
test('Ishavsröra: halva och dubbla satser i arrayformellayout', () => {
  const r = recipe('ishavsrora');
  assert.equal(formatAmount(ingredient(r, 'Crabbsticks').mängd, 'kg', .5), '500 g');
  assert.equal(scaledAmount(ingredient(r, 'Majonäs'), 2, r.basantal), 3);
  assert.equal(r.ingredienser.at(-1).rubrik, 'MAJZENA BLANDNING');
  assert.equal(ingredient(r, 'Räkor').mängd, 1.5);
});
test('Gulasch: 20 portioner, volym och mängder efter smak', () => {
  const r = recipe('ungersk-gulaschsoppa');
  assert.equal(scaledAmount(ingredient(r, 'Högrev'), 20, r.basantal), 3);
  assert.equal(formatAmount(ingredient(r, 'Köttbuljong').mängd, 'l', 20), '3,75 l');
  assert.equal(formatAmount(ingredient(r, 'Salt och svartpeppar').mängd, 'efter smak', 20), 'efter smak');
});
test('Enheter, mycket små mängder och validering', () => {
  assert.equal(formatAmount(.025, 'kg'), '25 g');
  assert.equal(formatAmount(1.25, 'kg'), '1,25 kg');
  assert.equal(formatAmount(.0002, 'g'), '0,0002 g');
  assert.equal(formatAmount(1500, 'g'), '1,5 kg');
  assert.equal(parseAmount('0,5'), .5);
  for (const input of ['', '0', '-2','NaN','Infinity','1e3','1,2,3','1000001']) assert.equal(parseAmount(input), null);
});
