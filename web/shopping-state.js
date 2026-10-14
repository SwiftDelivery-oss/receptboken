import { cleanSelections } from "./shopping-store.js";
export function validateShared(value, recipes) {
  if (!Array.isArray(value)) throw Error("Ogiltig lista");
  const lookup = new Map(recipes.map((r) => [r.slug, r]));
  for (const s of value) {
    const recipe = lookup.get(s?.slug);
    if (
      !recipe ||
      !Number.isFinite(Number(s.antal)) ||
      Number(s.antal) <= 0 ||
      Number(s.antal) > 1000000
    )
      throw Error("Ogiltigt recept eller antal");
    if (
      s.variant &&
      !recipe.ingredienser.some((g) => g.variant === String(s.variant))
    )
      throw Error("Okänd variant");
  }
  return cleanSelections(value, recipes);
}
export const itemKey = (item) =>
  item.namn.toLocaleLowerCase("sv") +
  "|" +
  item.enhet +
  "|" +
  item.källor.join("|");
export function retainChecked(checked, before, after) {
  const old = new Map(before.map((i) => [itemKey(i), i.mängd]));
  return new Set(
    after
      .filter(
        (i) =>
          checked.has(itemKey(i)) &&
          old.has(itemKey(i)) &&
          old.get(itemKey(i)) === i.mängd,
      )
      .map(itemKey),
  );
}
