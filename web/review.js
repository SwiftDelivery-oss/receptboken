export function reviewPoints(recipe) {
  return recipe.granskningspunkter?.length
    ? recipe.granskningspunkter
    : recipe.granska
      ? ["Uppgifter i receptet behöver granskas mot originalet."]
      : [];
}
