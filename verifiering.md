# Verifiering av Receptboken

Kontrollerad 2026-10-13. Det färdiga `dist/` är byggt för `/`. Publicering görs av projektägaren.

## Senaste justeringar: fokus, knappar och utskrift med recept

21 automatiska tester passerar. Tre nya tester kontrollerar utskriftsreceptens basantal, valda antal, varianter, okända mängder och bevarade instruktioner.

- Kopiering verifierades med ett fångat clipboard-anrop: knappen fick en bock och det synliga statusfältet förblev tomt.
- På inköpslistans separata sida var rubrikens, innehållets och knappfältets horisontella padding samma (24 px). I mobilfönstret var den 20 px, utan överströmning. Alla fem knappar har ikoner och tömningsknappen ligger till höger med röd ton.
- Numrets fokus-outline är borttagen; tilläggsknappen flyttar fokus till plus, inte till textfältet. Tangentbordsfokus finns kvar. Sökfältet visar ett enda rensningskryss och ingen extra orange ram.
- Utskrift med recept simulerades i webbläsaren: inköpslistan och de två valda recepten visas medan sidan bakom och knappfältet döljs. Formfranska hade 3 st och Hönökaka 2 st med korrekt skalade ingredienser.
- Alternativet för utskrift av recept kan avmarkeras för att skriva ut enbart inköpslistan.

## Senaste uppdatering: välj på korten och öppna flytande lista

18 automatiska tester passerar: fem Python-tester och tretton JavaScript-tester. Den senaste ändringen har även kontrollerats i webbläsaren:

- Inköpslisteikonen på Formfranska ersattes med minus/antal/plus och började på 1. Plus till 3 och tillägg av 2 Hönökaka gav åter 1,82 kg vetemjöl.
- På mobilen visades listan över hela skärmen utan horisontell överströmning. På datorn visades ett flytande fönster nere till höger och en separat öppningsknapp under det.
- Ändring till 4 Formfranska gav direkt 2,32 kg vetemjöl. Sparade antal följde med vid byte till receptsidan och ökades inte av sidbytet.
- Escape stängde fönstret och återställde fokus till öppningsknappen. Tömning stängde fönstret, dolde öppningsknappen och återställde kortens ikoner.
- Kopierings- och delningsflöden verifierades med fångade API-anrop; länken innehöll rätt recept och antal. Ingen verklig delning gjordes.
- Utskriftsreglerna simulerades: bakomliggande sida och knappar doldes, listan fick vanligt dokumentflöde och intern scrollning togs bort.

Kontrollerna nedan avser tidigare versioner av sidan och finns kvar som historik.

## Uppdatering: inköpslista och utseende

Startsidan använder nu systemtypsnitt utan seriffer. De två genvägarna till receptlistan har tagits bort från startsidan; sidhuvudet leder till inköpslistan.

15 automatiska tester passerar efter uppdateringen. Sex nya tester täcker inköpslistan: flera recept, summering av g/kg, separation av vikt och volym, delrecept, varianter, cirklar och oklara mängder.

Inköpslistans formulär har testats i webbläsaren med 3 Formfranska och 2 Hönökaka. Resultatet blev 10 varor, bland annat 1,82 kg vetemjöl, 45,5 g salt och 30,32 g torrjäst. Ändring till 4 Formfranska räknade direkt om vetemjölet till 2,32 kg och behöll inmatningsfokus. Mobilvyn vid 390 pixlar hade ingen överströmning. Listan sparas nu i lokal lagring; den tidigare kontrollen om tom localStorage nedan avser första versionen.

## Resultat

- 88 Excel-flikar lästa, 83 recept skapade. Beställningsöversikter och den tomma fliken är uteslutna.
- Kategorier: Bröd 20, Kakor mm 11, Röror 27, Kallskuret 4, Övriga 21.
- 956 formler identifierade, varav 401 arrayformler. Fyra delrecept har proportioner normaliserade till 1 kg.
- Nio automatiska tester passerar: fem Python-tester och fyra JavaScript-tester.
- Både `/` och `/receptboken/` har byggts och kontrollerats. Alla statiska HTML-länkar och tillgångar finns, och varje sida har `lang="sv"` och `noindex`.
- Sökning på ingrediensen ”Högrev” gav Ungersk gulaschsoppa.
- Vörtlimpa med `?antal=20`: vetemjöl 6,25 kg, nejlika 50 g och surdeg 1,5 kg. Ingrediensens delreceptslänk fick `?antal=1.5`.
- Ishavsröra med `?antal=2`: crabbsticks 2 kg och majonnäs 3 kg. Den osäkra räkraden och den separata blandningen är bevarade för granskning.
- Ungersk gulaschsoppa med `?antal=20`: högrev 3 kg och köttbuljong 3,75 l. Ingredienser ”efter smak” behöll sin text.
- Svensk inmatning `0,5` räknades om direkt och gav `?antal=0.5`. Små massor visades i gram. Felaktiga och icke positiva antal avvisas.
- Pizza deg med `?antal=3&variant=2` visade bara varianten Vetemjöl Special.
- Kopiera-länk-flödet verifierades med en fångad clipboard-payload: aktuellt antal följde med. Ingen riktig delning till någon annan gjordes.
- Offline verifierades genom att stänga av den lokala webbservern och öppna Albóndigas, en tidigare obesökt receptsida, med `?antal=8`. Sidan fungerade och visade 600 g blandfärs.
- Responsiv vy kontrollerades vid 320, 390, 794 och 1440 CSS-pixlar. Ingen horisontell överströmning upptäcktes på granskade sidor.
- Utskriftsreglerna inspekterades i en simulerad A4-vy. Meny och knappar doldes; Vörtlimpas aktuella ingredienser och instruktioner rymdes i vyn. Ingen fysisk utskrift gjordes.
- Textkontraster för använda huvudfärger är 5,46–13,53:1; grönt på sidbakgrunden är 9,22:1. Etiketter och synlig tangentbordsfokus finns.
- Webbplatsen laddade inga externa resurser och satte inga cookies eller localStorage-värden. Offlinefilerna använder service workerns Cache Storage.
- Sökning i alla textfiler i `dist/` gav inga fristående `kr`, kronor, SEK, pris- eller kostnadsfält. Delsträngen `kr` förekom i vanliga ord som ”kryddor”, ”krossade”, ”kräftor” och ”Skriv”.
- Webbbygget omfattar cirka 725 kB. Källfilen och konverteringsrapporten publiceras inte i `dist/`.

## Kvar för granskning

78 recept har granskningspunkter, även när enda punkten gäller saknad arbetsbeskrivning, oklart utbyte eller avvikande rubrik. Alla finns i [konvertering-rapport.md](konvertering-rapport.md). Prioritera saknade namn/enheter, motstridiga enheter, räkraden i Ishavsröra, alternativa tabeller och delreceptens normalisering.

Den inbyggda mobilens delningsmeny och installation på en verklig hemskärm behöver provas på den enhet som ska användas. Publicering och DNS har lämnats till projektägaren enligt önskemål. Instruktioner finns i [README.md](README.md).
