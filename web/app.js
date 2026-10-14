import { parseAmount, formatAmount, scaledAmount } from "./scale.js";
import { setupShopping } from "./shopping-ui.js";
import { doughLabel } from "./dough.js";

const $ = (selector) => document.querySelector(selector);
const base = document.body.dataset.base;
const data = JSON.parse($("#page-data")?.textContent || "null");
// Safari can retain :focus-visible after a tap. Track pointer use explicitly.
document.addEventListener("pointerdown", () => {
  document.documentElement.dataset.focusInput = "pointer";
}, { capture: true });
document.addEventListener("keydown", (event) => {
  if (!event.metaKey && !event.ctrlKey && !event.altKey) {
    document.documentElement.dataset.focusInput = "keyboard";
  }
}, { capture: true });
const normalize = (text) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("sv");

setupShopping(base).catch(() => {
  $("#shopping-empty-plan").textContent =
    "Receptuppgifterna kunde inte laddas. Din sparade lista är kvar.";
  const retry = document.createElement("button");
  retry.className = "button";
  retry.textContent = "Försök igen";
  retry.addEventListener("click", () => location.reload());
  $("#shopping-empty-plan").after(retry);
  $("#shopping-status").textContent =
    "Kontrollera internetanslutningen och försök igen.";
  document.querySelectorAll(".recipe-shopping-control").forEach((slot) => {
    slot.replaceChildren();
    const link = document.createElement("a");
    link.className = "button";
    link.href = base + "inkopslista/";
    link.textContent = "Öppna inköpslista";
    slot.append(link);
  });
});

if (document.body.dataset.page === "home" && data) {
  const search = $("#search");
  let category = "";
  const entries = new Map(
    data.map((r) => [r.slug, { ...r, text: normalize(r.söktext) }]),
  );
  const update = () => {
    const terms = normalize(search.value).trim().split(/\s+/).filter(Boolean);
    let total = 0;
    document.querySelectorAll(".recipe-card").forEach((card) => {
      const entry = entries.get(card.dataset.slug);
      card.hidden = !!(
        (category && entry.kategori !== category) ||
        !terms.every((term) => entry.text.includes(term))
      );
      if (!card.hidden) total++;
    });
    document.querySelectorAll(".category-section").forEach((section) => {
      section.hidden = !section.querySelector(".recipe-card:not([hidden])");
    });
    $("#empty-search").hidden = total !== 0;
    $("#clear-search").hidden = !search.value;
    $("#search-status").hidden = !terms.length && !category;
    $("#search-status").textContent =
      `${total} recept${category ? " i " + category : ""}${terms.length ? " matchar sökningen" : ""}`;
    const params = new URLSearchParams();
    if (search.value) params.set("sök", search.value);
    if (category) params.set("kategori", category);
    history.replaceState(
      null,
      "",
      location.pathname + (params.size ? "?" + params : "") + location.hash,
    );
  };
  const activateCategory = (next) => {
    category = next;
    document.querySelectorAll(".category-chip").forEach((chip) => {
      const selected = chip.dataset.category === category;
      chip.classList.toggle("active", selected);
      if (selected) chip.setAttribute("aria-current", "true");
      else chip.removeAttribute("aria-current");
    });
  };
  const params = new URLSearchParams(location.search);
  search.value = params.get("sök") || "";
  activateCategory(
    data.some((r) => r.kategori === params.get("kategori"))
      ? params.get("kategori")
      : "",
  );
  search.addEventListener("input", update);
  document.querySelectorAll(".category-chip").forEach((chip) =>
    chip.addEventListener("click", (event) => {
      event.preventDefault();
      activateCategory(chip.dataset.category);
      update();
    }),
  );
  $("#clear-search").addEventListener("click", () => {
    search.value = "";
    update();
    search.focus();
  });
  $("#reset-search").addEventListener("click", () => {
    search.value = "";
    activateCategory("");
    update();
    search.focus();
  });
  update();
}

if (document.body.dataset.page === "recipe" && data) {
  const input = $("#amount");
  const params = new URLSearchParams(location.search);
  let count =
    parseAmount(params.get("antal") || "") ||
    data.standardantal ||
    data.basantal;
  const variant = $("#variant");
  if (
    variant &&
    [...variant.options].some(
      (option) => option.value === params.get("variant"),
    )
  )
    variant.value = params.get("variant");
  input.value = String(count).replace(".", ",");
  const update = () => {
    const value = parseAmount(input.value);
    $("#scaling-error").hidden = value !== null;
    input.setAttribute("aria-invalid", String(value === null));
    if (value === null) return false;
    count = value;
    document
      .querySelectorAll(".ingredients-panel .amount")
      .forEach((element) => {
        const ingredient =
          data.ingredienser[Number(element.dataset.group)].ingredienser[
            Number(element.dataset.ingredient)
          ];
        element.textContent = formatAmount(
          ingredient.mängd,
          ingredient.enhet,
          count / data.basantal,
        );
        const link = element.closest("li").querySelector("[data-subrecipe]");
        if (link) {
          const amount = scaledAmount(ingredient, count, data.basantal);
          const byWeight = link.dataset.subrecipeUnit === "kg";
          link.href =
            base +
            "recept/" +
            link.dataset.subrecipe +
            "/" +
            (byWeight &&
            ingredient.enhet.trim().toLowerCase() === "kg" &&
            amount > 0
              ? "?antal=" + Number(amount.toPrecision(12))
              : "");
        }
      });
    $("#yield").textContent =
      `${String(count).replace(".", ",")} ${data.skalningsenhet}${data.styckstorlek ? " à " + data.styckstorlek : ""}`;
    if ($("#dough-weight"))
      $("#dough-weight").textContent = doughLabel(data, variant?.value);
    document.querySelectorAll("[data-variant]").forEach((group) => {
      group.hidden = !!variant && group.dataset.variant !== variant.value;
    });
    $("#decrease").disabled = count <= 1;
    $("#increase").disabled = count >= 1000000;
    const url = new URL(location.href);
    url.searchParams.set("antal", String(count));
    if (variant) url.searchParams.set("variant", variant.value);
    document.dispatchEvent(new CustomEvent("recipe-scaling-change"));
    history.replaceState(null, "", url.pathname + url.search + url.hash);
    return true;
  };
  input.addEventListener("input", update);
  variant?.addEventListener("change", update);
  for (const [id, step] of [
    ["decrease", -1],
    ["increase", 1],
  ]) {
    $("#" + id).addEventListener("click", () => {
      const value = parseAmount(input.value) || count;
      input.value = String(
        step < 0
          ? value > 1
            ? value - 1
            : value
          : Math.min(1000000, value + 1),
      ).replace(".", ",");
      update();
    });
  }
  $("#print").addEventListener("click", () => {
    if (update()) window.print();
  });
  const copy = async () => {
    if (!update()) {
      input.focus();
      return;
    }
    try {
      if (navigator.clipboard && window.isSecureContext)
        await navigator.clipboard.writeText(location.href);
      else {
        const area = document.createElement("textarea");
        area.value = location.href;
        area.style.cssText = "position:fixed;top:0;left:0;opacity:0";
        document.body.append(area);
        area.select();
        const success = document.execCommand("copy");
        area.remove();
        if (!success) throw new Error("copy");
      }
      $("#share-status").textContent =
        "Länken är kopierad. Klistra in den där du vill dela receptet.";
    } catch {
      $("#share-status").textContent =
        "Kopiera länken från adressfältet: " + location.href;
    }
  };
  $("#copy-link").addEventListener("click", copy);
  $("#share").addEventListener("click", async () => {
    if (!update()) {
      input.focus();
      return;
    }
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.titel + " · Receptboken",
          url: location.href,
        });
      } catch (error) {
        if (error.name !== "AbortError") await copy();
      }
    } else await copy();
  });
  update();
}

if ("serviceWorker" in navigator) {
  const offline = $("#offline-status");
  navigator.serviceWorker
    .register(base + "sw.js", { scope: base })
    .then(async (registration) => {
      const worker = registration.installing;
      worker?.addEventListener("statechange", () => {
        if (worker.state === "redundant" && !registration.active)
          offline.textContent =
            "Offlinelagring kunde inte aktiveras. Försök igen vid nästa besök.";
      });
      await navigator.serviceWorker.ready;
      offline.textContent = "Receptboken finns nu tillgänglig offline.";
    })
    .catch(() => {
      offline.textContent = "Offlinelagring kunde inte aktiveras.";
    });
}
