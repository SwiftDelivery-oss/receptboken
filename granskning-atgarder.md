# Åtgärder efter kod- och UI-granskning

- **1:** Delade listor visas separat; import eller ersättning kräver ett aktivt val. Ogiltiga recept, antal och varianter ger felmeddelande och ändrar inte lagringen.
- **2–3:** Konverteringsrapportens konkreta granskningspunkter ligger i receptens JSON och visas i recept, lista, kopierad text och utskrift. Ishavsröra och Pasta kyckling har särskilda varningar. Originalets mängder är oförändrade: det går inte att avgöra blandningens användning eller dressingens basmängd säkert.
- **4:** Vid expansion inkluderas proportionerade delrecept i utskriften. Upprepade delrecept summeras och cykler stoppas.
- **5:** Avbockningar behålls för oförändrade varor. Ändrade mängder återställs för ny kontroll.
- **6:** Ikoner utan synlig text behålls enligt ägarens uttryckliga önskemål. Tömning får Ångra.
- **7:** Listans plus/minus har 48 × 48 px tryckyta på mobil.
- **8:** Dataladdningsfel visas med Försök igen; sparade val påverkas inte.
- **9:** Integrationstester använder riktiga JSON-filer. Åtta återanvändbara webbläsarkontroller har körts för båda basadresserna. GitHub Actions testar automatiskt båda byggena.
- **10:** Service workern läser versionsbundna filer ur sin egen cache och skriver inte nya nätfiler till den. En komplett installation krävs innan byte.
- **11:** Minus från 1,5 ger 0,5 på receptsidan. Positiva antal under ett behålls när minus skulle ge noll; i listan tar noll bort receptet.
- **12:** Variant-ID kodas korrekt genom hela URL-kedjan, inklusive kolon, kommatecken och svenska bokstäver.
- **13:** CSS och JavaScript är formaterade; validering, avbockningar och granskningspunkter har separata hjälpfiler. Byggfel anger receptfilen. Historiska CSS-överstyrningar finns delvis kvar; de har inte tagits bort utan kontroll av varje regel.
- **14:** Mobilintroduktionen är kortare och receptsidans övre marginaler mindre.

## Verifiering

27 automatiska tester passerar för både rot och undermapp. Webbläsarkontroller täcker delningsskydd, ogiltiga länkar, avbockningar, tömning/ångra och delrecept i utskrift. Simulerat nätfel visar rätt felmeddelande och återförsöksknapp. Decimalsteget och mobila tryckytor har kontrollerats i webbläsaren. Publicerade filer kontrolleras för ekonomiska uppgifter.

Fysisk iPhone, VoiceOver och fysisk utskrift återstår. Receptägaren behöver bekräfta Ishavsrörans Majzena-blandning och Pasta kycklings dressing och styckmängder.
