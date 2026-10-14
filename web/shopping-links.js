export const MAX_ENTRIES = 100;
export const MAX_COUNT = 10000;

export function shoppingUrl(base, origin, selections, recipes, expand = true) {
  const url = new URL(base + "inkopslista/", origin);
  url.searchParams.set("r", encodeSelections(selections, recipes));
  if (!expand) url.searchParams.set("d", "0");
  const variants = new Map();
  for (const selection of selections) {
    const recipe = recipes.find((r) => r.slug === selection.slug);
    const choices = recipe?.ingredienser.filter((g) => g.variant) || [];
    const index = choices.findIndex((g) => g.variant === selection.variant);
    if (index > 0 && !variants.has(recipe.id))
      variants.set(recipe.id, index + 1);
  }
  if (variants.size)
    url.searchParams.set(
      "v",
      [...variants].map(([id, index]) => `${id}-${index}`).join("_"),
    );
  return url.href;
}

export function encodeSelections(selections, recipes) {
  const lookup = new Map(recipes.map((r) => [r.slug, r]));
  const totals = new Map();
  for (const selection of selections) {
    const recipe = lookup.get(selection.slug);
    if (!recipe || !Number.isFinite(selection.antal) || selection.antal <= 0)
      continue;
    if (!totals.has(recipe.id) && totals.size >= MAX_ENTRIES) break;
    totals.set(
      recipe.id,
      Math.min(MAX_COUNT, (totals.get(recipe.id) || 0) + selection.antal),
    );
  }
  return [...totals]
    .map(([id, count]) => `${id}-${Number(count.toFixed(12))}`)
    .join("_");
}

export function decodeSelections(value, recipes, variantValue = "") {
  const lookup = new Map(recipes.map((r) => [String(r.id), r]));
  const totals = new Map();
  const notices = new Set();
  const parts = value ? value.split("_") : [];
  if (parts.length > MAX_ENTRIES)
    notices.add("Listan är lång. Bara de första 100 posterna togs med.");
  for (const part of parts.slice(0, MAX_ENTRIES)) {
    const match = /^(\d+)(?:-(\d+(?:\.\d+)?))?$/.exec(part);
    if (!match) {
      notices.add("En post i länken kunde inte läsas och hoppades över.");
      continue;
    }
    const recipe = lookup.get(String(Number(match[1])));
    if (!recipe) {
      notices.add("Ett recept i länken finns inte längre.");
      continue;
    }
    const count = match[2] === undefined ? 1 : Number(match[2]);
    if (!Number.isFinite(count) || count <= 0) {
      notices.add("Ett ogiltigt antal hoppades över.");
      continue;
    }
    const total = (totals.get(recipe.slug) || 0) + count;
    if (total > MAX_COUNT)
      notices.add("Antalet begränsades till 10 000 per recept.");
    totals.set(recipe.slug, Math.min(MAX_COUNT, total));
  }
  const variants = new Map(
    variantValue
      .split("_")
      .slice(0, MAX_ENTRIES)
      .map((part) => part.split("-")),
  );
  return {
    selections: [...totals].map(([slug, antal]) => {
      const recipe = recipes.find((r) => r.slug === slug);
      const choices = recipe.ingredienser.filter((g) => g.variant);
      const index = Number(variants.get(String(recipe.id)) || 1) - 1;
      const choice = choices[index] || choices[0];
      if (choices.length && !choices[index])
        notices.add(
          "En receptvariant finns inte längre. Grundvarianten används.",
        );
      return { slug, antal, ...(choice ? { variant: choice.variant } : {}) };
    }),
    notices: [...notices],
  };
}
