export function parseAmount(raw) {
  if (typeof raw !== "string" || !/^\d+(?:[.,]\d+)?$/.test(raw.trim()))
    return null;
  const value = Number(raw.trim().replace(",", "."));
  return Number.isFinite(value) && value > 0 && value <= 1000000 ? value : null;
}

export function formatAmount(base, unit, factor = 1) {
  if (base === null) return unit || "Mängd saknas";
  let amount = base * factor;
  const normalized = unit.trim().toLowerCase();
  if (normalized === "kg" && Math.abs(amount) > 0 && Math.abs(amount) < 1) {
    amount *= 1000;
    unit = "g";
  } else if (["g", "gr"].includes(normalized) && Math.abs(amount) >= 1000) {
    amount /= 1000;
    unit = "kg";
  }
  const digits = amount
    ? Math.min(12, Math.max(3, -Math.floor(Math.log10(Math.abs(amount))) + 2))
    : 3;
  const value = new Intl.NumberFormat("sv-SE", {
    maximumFractionDigits: digits,
    useGrouping: false,
  }).format(amount);
  return `${value}${unit ? " " + unit : " (enhet saknas)"}`;
}

export function scaledAmount(ingredient, count, baseCount) {
  return ingredient.mängd === null
    ? null
    : (ingredient.mängd * count) / baseCount;
}
