// Run in the collaborative browser console on the local preview.
// Each case opens the real generated page in a same-origin frame.
async function runBrowserFlows(base = "/") {
  const frame = document.createElement("iframe");
  frame.style.cssText = "width:390px;height:844px";
  document.body.append(frame);
  const recipes=await (await fetch(base+'assets/receptdata.json')).json();
  const id=slug=>recipes.find(r=>r.slug===slug).id;
  const key = "receptboken-inkopslista:" + base;
  const original = localStorage.getItem(key);
  const originalChecks = localStorage.getItem(key + ":avbockat");
  const results = [];
  const assert = (condition, name) => {
    if (!condition) throw Error(name);
    results.push(name);
  };
  const open = async (path) => {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(Error("Sidan laddades inte")),
        8000,
      );
      frame.onload = () => {
        clearTimeout(timer);
        resolve();
      };
      frame.src = base + path;
    });
    for (let i = 0; i < 80; i++) {
      if (frame.contentDocument.querySelector("#shopping-summary")?.textContent)
        return frame.contentDocument;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    throw Error("Inköpslistan blev inte klar");
  };
  try {
    const own = [
      { slug: "formfranska", antal: 3 },
      { slug: "honokaka", antal: 2 },
    ];
    localStorage.setItem(key, JSON.stringify(own));
    localStorage.setItem(key + ":avbockat", "[]");
    let doc = await open('inkopslista/?r='+id('ishavsrora')+'-1');
    assert(
      localStorage.getItem(key) === JSON.stringify(own),
      "Delad lista skyddar egen lista",
    );
    assert(
      !!doc.querySelector(".shared-list-banner"),
      "Import kräver aktivt val",
    );
    doc = await open('inkopslista/?r=999999-2_'+id('formfranska')+'-text');
    assert(
      localStorage.getItem(key) === JSON.stringify(own),
      "Ogiltig länk skyddar egen lista",
    );
    assert(
      doc.querySelector(".shared-list-banner").textContent.includes("finns inte längre"),
      "Ogiltig länk har felmeddelande",
    );
    doc = await open("inkopslista/");
    const milk = () =>
      [...doc.querySelectorAll("#shopping-items li")]
        .find((row) => row.textContent.includes("Mjölk"))
        .querySelector("input");
    milk().click();
    doc
      .querySelector("#shopping-selected .cart-stepper button:last-child")
      .click();
    assert(milk().checked, "Oförändrad vara behåller avbockning");
    doc.querySelector("#shopping-clear").click();
    assert(
      doc.querySelector("#shopping-selected").children.length === 0,
      "Tömning fungerar",
    );
    [...doc.querySelectorAll(".list-footer button")]
      .find((b) => b.textContent === "Ångra tömning")
      .click();
    assert(
      doc.querySelector("#shopping-selected").children.length === 2,
      "Ångra återställer recepten",
    );
    doc = await open('inkopslista/?r='+id('ragbrod-solros')+'-2');
    assert(
      [...doc.querySelectorAll(".printed-recipe>h2")].some(
        (h) => h.textContent === "Skållning rågmjöl fint",
      ),
      "Utskrift innehåller delrecept",
    );
    return results;
  } finally {
    frame.remove();
    if (original === null) localStorage.removeItem(key);
    else localStorage.setItem(key, original);
    if (originalChecks === null) localStorage.removeItem(key + ":avbockat");
    else localStorage.setItem(key + ":avbockat", originalChecks);
  }
}
