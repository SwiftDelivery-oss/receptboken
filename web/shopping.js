// Names are combined only by case and whitespace. No spelling changes or guesses.
import { reviewPoints } from "./review.js";
const normalizeName = (name) =>
  name.trim().replace(/\s+/g, " ").toLocaleLowerCase("sv");
const units = {
  kg: ["kg", 1],
  g: ["kg", 0.001],
  gr: ["kg", 0.001],
  l: ["l", 1],
  liter: ["l", 1],
  dl: ["l", 0.1],
  cl: ["l", 0.01],
  ml: ["l", 0.001],
};
export function normalizeUnit(unit) {
  const name = unit.trim().toLocaleLowerCase("sv");
  return units[name] || [name, 1];
}
export function activeGroups(recipe, variant) {
  const defaultVariant = recipe.ingredienser.find((g) => g.variant)?.variant;
  return recipe.ingredienser.filter(
    (g) => !g.variant || g.variant === (variant || defaultVariant),
  );
}
export function aggregateShopping(recipes, selections, expand = true) {
  const lookup = new Map(recipes.map((r) => [r.slug, r]));
  const totals = new Map();
  const warnings = new Set();
  const add = (recipe, count, variant, path = []) => {
    for (const point of reviewPoints(recipe))
      warnings.add(`${recipe.titel.trim()}: ${point}`);
    if (path.includes(recipe.slug)) {
      warnings.add(
        `Delrecepten bildar en cirkel vid ${recipe.titel}. Kontrollera mängderna manuellt.`,
      );
      return;
    }
    for (const group of activeGroups(recipe, variant))
      for (const ingredient of group.ingredienser) {
        const amount =
          ingredient.mängd === null
            ? null
            : (ingredient.mängd * count) / recipe.basantal;
        const [unit, multiplier] = normalizeUnit(ingredient.enhet);
        const child = lookup.get(ingredient.delrecept);
        if (expand && child && amount !== null) {
          const [childUnit, childMultiplier] = normalizeUnit(
            child.skalningsenhet,
          );
          if (
            unit &&
            unit === childUnit &&
            !path.includes(child.slug) &&
            child.slug !== recipe.slug
          ) {
            add(child, (amount * multiplier) / childMultiplier, undefined, [
              ...path,
              recipe.slug,
            ]);
            continue;
          }
          warnings.add(
            `Delreceptet ${child.titel} kunde inte räknas ut från ${recipe.titel}. Det står kvar som egen vara.`,
          );
        }
        const name = ingredient.namn.trim() || "Ingrediensnamn saknas";
        const known = amount !== null && unit && ingredient.namn.trim();
        const key = known
          ? `${normalizeName(name)}\0${unit}`
          : `${recipe.slug}\0${name}\0${unit}\0okänd-${totals.size}`;
        if (!totals.has(key))
          totals.set(key, {
            namn: name,
            enhet: unit,
            mängd: known ? 0 : amount,
            källor: new Set(),
            osäker: !known,
          });
        const item = totals.get(key);
        if (known) item.mängd += amount * multiplier;
        item.källor.add(recipe.titel.trim());
        if (
          !ingredient.namn.trim() ||
          !unit ||
          (amount === null && unit !== "efter smak")
        )
          warnings.add(
            `${recipe.titel.trim()}: ${name} saknar namn, mängd eller enhet. Kontrollera originalreceptet.`,
          );
      }
  };
  for (const selection of selections) {
    const recipe = lookup.get(selection.slug);
    if (
      recipe &&
      Number.isFinite(selection.antal) &&
      selection.antal > 0 &&
      selection.antal <= 1000000
    )
      add(recipe, selection.antal, selection.variant);
  }
  return {
    items: [...totals.values()]
      .map((i) => ({
        ...i,
        mängd: i.mängd === null ? null : Number(i.mängd.toPrecision(12)),
        källor: [...i.källor],
      }))
      .sort((a, b) => a.namn.localeCompare(b.namn, "sv")),
    warnings: [...warnings],
  };
}
