import { activeGroups, normalizeUnit } from "./shopping.js";
import { reviewPoints } from "./review.js";
import { formatAmount } from "./scale.js";
import { doughLabel } from "./dough.js";

export function printRecipeModels(recipes, selections, expand = false) {
  const lookup = new Map(recipes.map((r) => [r.slug, r]));
  const totals = new Map();
  const collect = (selection, path = []) => {
    const recipe = lookup.get(selection.slug);
    if (!recipe || path.includes(recipe.slug)) return;
    const key = selection.slug + "|" + (selection.variant || "");
    const old = totals.get(key);
    totals.set(key, {
      ...selection,
      antal: (old?.antal || 0) + selection.antal,
    });
    if (!expand) return;
    for (const group of activeGroups(recipe, selection.variant))
      for (const ingredient of group.ingredienser) {
        const child = lookup.get(ingredient.delrecept);
        if (!child || ingredient.mängd === null) continue;
        const [unit, multiplier] = normalizeUnit(ingredient.enhet);
        const [childUnit, childMultiplier] = normalizeUnit(
          child.skalningsenhet,
        );
        if (unit && unit === childUnit)
          collect(
            {
              slug: child.slug,
              antal:
                (((ingredient.mängd * selection.antal) / recipe.basantal) *
                  multiplier) /
                childMultiplier,
            },
            [...path, recipe.slug],
          );
      }
  };
  selections.forEach((s) => collect(s));
  return [...totals.values()].flatMap((selection) => {
    const recipe = lookup.get(selection.slug);
    if (!recipe) return [];
    const variant = recipe.ingredienser.find(
      (g) => g.variant && g.variant === selection.variant,
    );
    return [
      {
        titel: recipe.titel,
        antal: selection.antal,
        enhet: recipe.skalningsenhet,
        storlek: recipe.styckstorlek || "",
        variant: variant?.rubrik || "",
        grupper: activeGroups(recipe, selection.variant).map((group) => ({
          rubrik: group.rubrik || "",
          ingredienser: group.ingredienser.map((ingredient) => ({
            namn: ingredient.namn || "Ingrediensnamn saknas",
            mängd: formatAmount(
              ingredient.mängd,
              ingredient.enhet,
              selection.antal / recipe.basantal,
            ),
          })),
        })),
        granskningspunkter: reviewPoints(recipe),
        degvikt:
          recipe.kategori === "Bröd" && recipe.skalningsenhet === "st"
            ? doughLabel(recipe, selection.variant)
            : "",
        anteckningar: recipe.anteckningar || [],
      },
    ];
  });
}

export function renderPrintRecipes(
  container,
  recipes,
  selections,
  expand = false,
) {
  container.replaceChildren();
  for (const recipe of printRecipeModels(recipes, selections, expand)) {
    const article = document.createElement("article");
    article.className = "printed-recipe";
    const title = document.createElement("h2");
    title.textContent = recipe.titel;
    const yieldText = document.createElement("p");
    yieldText.className = "printed-yield";
    yieldText.textContent = `${String(recipe.antal).replace(".", ",")} ${recipe.enhet}${recipe.storlek ? " à " + recipe.storlek : ""}${recipe.variant ? " · " + recipe.variant : ""}`;
    const layout = document.createElement("div");
    layout.className = "printed-recipe-layout";
    const ingredients = document.createElement("section");
    const heading = document.createElement("h3");
    heading.textContent = "Ingredienser";
    ingredients.append(heading);
    for (const group of recipe.grupper) {
      if (group.rubrik) {
        const subtitle = document.createElement("h4");
        subtitle.textContent = group.rubrik;
        ingredients.append(subtitle);
      }
      const list = document.createElement("ul");
      for (const ingredient of group.ingredienser) {
        const item = document.createElement("li");
        const name = document.createElement("span");
        name.textContent = ingredient.namn;
        const amount = document.createElement("span");
        amount.textContent = ingredient.mängd;
        item.append(name, amount);
        list.append(item);
      }
      ingredients.append(list);
    }
    const instructions = document.createElement("section");
    const methodTitle = document.createElement("h3");
    methodTitle.textContent = "Anteckningar och instruktioner";
    instructions.append(methodTitle);
    for (const point of recipe.granskningspunkter) {
      const p = document.createElement("p");
      p.className = "review-note";
      p.textContent = "Kontrollera: " + point;
      instructions.append(p);
    }
    for (const note of recipe.anteckningar.length
      ? recipe.anteckningar
      : ["Ingen arbetsbeskrivning finns i originalreceptet."]) {
      const p = document.createElement("p");
      p.textContent = note;
      instructions.append(p);
    }
    layout.append(ingredients, instructions);
    article.append(title, yieldText);
    if (recipe.degvikt) {
      const p = document.createElement("p");
      p.textContent = recipe.degvikt;
      article.append(p);
    }
    article.append(layout);
    container.append(article);
  }
}
