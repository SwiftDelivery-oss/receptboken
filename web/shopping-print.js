import {activeGroups} from './shopping.js';
import {formatAmount} from './scale.js';

export function printRecipeModels(recipes,selections) {
  const lookup=new Map(recipes.map(r=>[r.slug,r]));
  return selections.flatMap(selection=>{
    const recipe=lookup.get(selection.slug);
    if(!recipe)return [];
    const variant=recipe.ingredienser.find(g=>g.variant&&g.variant===selection.variant);
    return [{titel:recipe.titel,antal:selection.antal,enhet:recipe.skalningsenhet,storlek:recipe.styckstorlek||'',variant:variant?.rubrik||'',
      grupper:activeGroups(recipe,selection.variant).map(group=>({rubrik:group.rubrik||'',ingredienser:group.ingredienser.map(ingredient=>({namn:ingredient.namn||'Ingrediensnamn saknas',mängd:formatAmount(ingredient.mängd,ingredient.enhet,selection.antal/recipe.basantal)}))})),
      anteckningar:recipe.anteckningar||[]}];
  });
}

export function renderPrintRecipes(container,recipes,selections) {
  container.replaceChildren();
  for(const recipe of printRecipeModels(recipes,selections)) {
    const article=document.createElement('article');article.className='printed-recipe';
    const title=document.createElement('h2');title.textContent=recipe.titel;
    const yieldText=document.createElement('p');yieldText.className='printed-yield';yieldText.textContent=`${String(recipe.antal).replace('.',',')} ${recipe.enhet}${recipe.storlek?' à '+recipe.storlek:''}${recipe.variant?' · '+recipe.variant:''}`;
    const layout=document.createElement('div');layout.className='printed-recipe-layout';
    const ingredients=document.createElement('section');const heading=document.createElement('h3');heading.textContent='Ingredienser';ingredients.append(heading);
    for(const group of recipe.grupper){if(group.rubrik){const subtitle=document.createElement('h4');subtitle.textContent=group.rubrik;ingredients.append(subtitle);}const list=document.createElement('ul');for(const ingredient of group.ingredienser){const item=document.createElement('li');const name=document.createElement('span');name.textContent=ingredient.namn;const amount=document.createElement('span');amount.textContent=ingredient.mängd;item.append(name,amount);list.append(item);}ingredients.append(list);}
    const instructions=document.createElement('section');const methodTitle=document.createElement('h3');methodTitle.textContent='Anteckningar och instruktioner';instructions.append(methodTitle);
    for(const note of recipe.anteckningar.length?recipe.anteckningar:['Ingen arbetsbeskrivning finns i originalreceptet.']){const p=document.createElement('p');p.textContent=note;instructions.append(p);}
    layout.append(ingredients,instructions);article.append(title,yieldText,layout);container.append(article);
  }
}
