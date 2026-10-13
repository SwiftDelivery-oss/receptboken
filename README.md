# Receptboken

En svensk, statisk receptsamling med 83 recept från **Recept 2021.xlsx**. Inga servrar, databaser, cookies, externa typsnitt eller externa resurser behövs. Recepten ligger som redigerbara JSON-filer i `recept/`. Läs [konvertering-rapport.md](konvertering-rapport.md) innan recepten används.

## Första granskningen

`granska: true` visar en påminnelse i receptet. Flaggan gäller även saknad arbetsbeskrivning eller avvikande rubriker. Prioritera:

- Vörtlimpa: enhet saknas för två ingredienser i skållningen.
- Rågsiktskaka: ingrediensnamnet på rad 13 saknas.
- Ishavsröra: räkraden saknar skalningsformel. Dess 1,5 kg har behållits som bas men behöver bekräftas. Kontrollera även hur MAJZENA BLANDNING används.
- Bullar, Mördeg, smet massariner och Ketchupröra: basenhet och uppskalad enhet skiljer sig. Basenheten är behållen.
- Biffgryta: originalet säger ”1 portion = 4 portioner”. Bekräfta utbytet.
- Pizza deg, Kyckling röra och Lyx tallrik: tabellerna visas som separata varianter; kontrollera tillhörande anteckningar.
- Skållning och surdegar: delrecept normaliseras till 1 kg enligt formlernas proportioner. Vörtlimpas skållning har inte ersatts med fliken Skollning.
- Fritextmängder i exempelvis Tonfisk och Pasta kyckling bevaras som anteckningar och skalas inte. Flytta dem till ingredienser efter granskning av basantalet.

Stavningar som ”Baugetter”, ”Polynerer” och ”Homung” är bevarade. Saknade instruktioner har inte hittats på. Ekonomiska uppgifter har uteslutits. Excel-filen ingår inte i webbbygget eller i Git.

## Lägg till eller ändra ett recept

Vanliga ändringar kan göras direkt på GitHub: öppna en fil i `recept/`, klicka på pennan, ändra och spara på `main`. GitHub Actions bygger och publicerar automatiskt när Pages har aktiverats. Excel-konverteringen behöver inte köras igen.

För ett nytt recept kopierar du [exempel/nytt-recept.json](exempel/nytt-recept.json) till `recept/mitt-nya-recept.json` och ändrar innehållet. Exemplet publiceras bara om det läggs i `recept/`.

- `slug`: adressen, endast små bokstäver a–z, siffror och bindestreck. Behåll befintliga slugs så att delningslänkar fungerar.
- `titel`: receptnamnet, med svenska tecken.
- `kategori`: exakt `Bröd`, `Kakor mm`, `Röror`, `Kallskuret` eller `Övriga`.
- `basantal`: hur mycket ingrediensmängderna räcker till. Importerade recept har **1**, alltså per st, sats, portion eller kg delrecept.
- `skalningsenhet`: exempelvis `st`, `sats`, `portioner` eller `kg`.
- `standardantal`: antalet som visas när receptet öppnas utan `?antal=`.
- `styckstorlek`: valfri text, exempelvis `800g`; visas som `10 st à 800g`.
- `ingredienser`: lista med grupper. `rubrik` kan vara tom eller exempelvis `Skållning`. Varje ingrediens har `mängd`, `enhet` och `namn`. Skriv **decimalpunkt i JSON**, exempelvis `0.025`. Webbplatsen visar svenska decimaler. Saknad mängd skrivs `null`, exempelvis med enhet `efter smak`.
- `anteckningar`: textstycken i visningsordning. Dessa skalas inte.
- `delrecept`: lista med slugs, exempelvis `["surdeg-vete"]`. För länk direkt från en ingrediens lägger du också `"delrecept": "surdeg-vete"` i den ingrediensen. Viktbaserade delrecept får mängden i länken.
- `originalrubriker`: kompletterande rubriker från Excel. Nya recept kan använda `[]`.
- `granska`: ändra till `false` efter granskning.

Behåll citattecken, kommatecken och parenteser. Felaktig JSON eller ekonomiska uppgifter stoppar publiceringen; den tidigare sidan ligger kvar. Läs felmeddelandet under **Actions** på GitHub.

Alternativa tabeller har `variant` i respektive grupp, exempelvis `"variant": "1"` och `"variant": "2"`. Bara vald variant visas och skrivs ut. Grupper utan `variant` används alltid. Anteckningar är gemensamma. Delning bevarar både variant och antal.

## Bygg och öppna lokalt

Installera Python 3.12 eller senare. Bygget kräver bara standardbiblioteket:

```powershell
python scripts/build.py
python -m http.server 5173 --bind 127.0.0.1 --directory dist
```

Öppna `http://localhost:5173`. Avsluta servern med Ctrl+C. Bygget ligger i `dist/`, med `index.html` i en egen mapp för varje recept. Använd en webbserver eftersom JavaScript-moduler och PWA kräver HTTP/HTTPS.

`http://127.0.0.1:5173/` fungerar också. Om en server visar `0.0.0.0` i terminalen ska du ändå öppna `localhost` eller `127.0.0.1`; `0.0.0.0` är en lyssningsadress.

Med Node.js kan du även använda `npm run dev`. Inget `npm install` behövs. Tester kräver Node.js 22 eller senare och openpyxl:

```powershell
python -m pip install -r requirements.txt
npm test
```

Bygg först. Testerna kontrollerar skalning av Vörtlimpa, Ishavsröra och Ungersk gulaschsoppa, delreceptsproportioner, arrayformler, prisfiltrering och interna länkar.

## Basadress

För `https://receptboken.st/` eller webbhotellets rot:

```powershell
python scripts/build.py --base /
```

För `https://användarnamn.github.io/receptboken/`:

```powershell
python scripts/build.py --base /receptboken/
```

Basadressen börjar och slutar med `/`. Alla sidor, tillgångar, manifest och service worker följer den. Domänen är inte hårdkodad. En delad länk för 20 bröd är exempelvis `/recept/vortlimpa/?antal=20`.

## Publicera på GitHub Pages

1. Skapa ett GitHub-repository, exempelvis `receptboken`, och ladda upp projektet. Ladda **inte** upp Excel-filen. `dist/` behöver inte ligga i Git.
2. Använd grenen `main` eller ändra grennamnet i `.github/workflows/pages.yml`.
3. Välj **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Spara en ändring på `main` eller starta **Publicera Receptboken** under **Actions**. Arbetsflödet bygger med Pages-inställningarnas basadress, testar och publicerar `dist/`.
5. Adressen visas under Pages och i arbetsflödets resultat.

För egen domän: ange `receptboken.st` under **Settings → Pages → Custom domain**, konfigurera DNS enligt [GitHubs Pages-anvisningar](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) och aktivera HTTPS. Arbetsflödet bygger sedan för roten. Domänregistrering och DNS görs i ditt domänkonto; bygget registrerar ingen domän automatiskt. Basadressen hämtas från [configure-pages](https://github.com/actions/configure-pages).

## Publicera via FTP/SFTP

1. Bygg med rätt `--base`.
2. Ladda upp **innehållet** i `dist/` till webbhotellets dokumentrot, vanligen `public_html/` eller `www/`. Använd gärna SFTP och behåll undermapparna.
3. Aktivera HTTPS, som krävs för PWA i produktion.
4. Kontrollera startsidan, en direkt receptlänk och en länk med `?antal=20`. Inga serverregler behövs.

Ladda upp HTML, tillgångar och JSON först och `sw.js` sist, så att en ny offlineversion får alla sina filer. Säkerhetskopiera den gamla publicerade mappen. Radera gamla filer för borttagna recept; vanlig FTP-uppladdning tar inte alltid bort dessa. Se till att `robots.txt` också finns på domänens rot om du publicerar i en undermapp.

## Kör om Excel-konverteringen

Konverteringen läser cachade värden med `data_only=True` och formler, inklusive arrayformler. Mängdkolumner och skalningsceller upptäcks genom formelreferenser. Stödd aritmetik beräknas vid behov, okända uttryck markeras. Tre extra beställningsöversikter utesluts. Kategorier hämtas endast från ”antal att baka”.

```powershell
python -m pip install -r requirements.txt
python scripts/convert_excel.py "C:\sökväg\Recept 2021.xlsx" --out recept-ny --report konvertering-rapport-ny.md
```

Använd en **ny mapp**. Skriptet vägrar skriva över befintliga recept för att skydda manuella ändringar. Jämför de nya filerna med `recept/`, granska rapporten och kopiera bara de recept som ska ersättas. Originalfilen ändras aldrig. Git-historiken kan användas för återställning.

## Offline, utskrift och integritet

### Inköpslista

Tryck på **inköpslisteikonen på ett receptkort**. Ikonen ersätts av **minus, antal och plus**, där du väljer antal satser eller stycken. Du kan också skriva antalet direkt. Minus från 1 till 0 tar bort receptet och återställer ikonen. På receptsidan finns samma funktion och aktuellt antal används vid tillägg. Varianter hålls isär.

När listan innehåller något visas en **flytande knapp nere till höger på datorn** och ett **fält längs nederkanten på mobilen**. Tryck där för att öppna listan. På datorn öppnas ett flytande fönster; på mobilen används hela skärmen. Stäng med krysset eller Escape på tangentbordet. Listan öppnas även via sidhuvudets **Inköpslista**.

Antalet kan ändras direkt på kortet eller under **Dina recept** i listan. Ingredienser räknas om direkt. Till exempel ger 3 Formfranska och 2 Hönökaka tillsammans 1,82 kg vetemjöl. Samma ingrediensnamn summeras även när stora/små bokstäver eller blanksteg skiljer sig. Gram och kilogram räknas ihop; vikt och volym hålls isär. Olika stavningar och olika sorters mjöl slås inte ihop automatiskt.

Varor kan bockas av. Listan kan **skrivas ut**, **kopieras som text**, **delas** med enhetens delningsmeny eller genom **Kopiera länk**. Knapparna har ikoner och kopiering bekräftas med en kortvarig bock på knappen. **Töm listan** är rödtonad och ligger till höger. Om en delningsmeny inte stöds kopieras länken. Delade länkar öppnar en separat statisk sida på `/inkopslista/` med samma recept, antal och varianter.

**Skriv även ut recepten** är aktiverat från början. Då skrivs inköpslistan ut först och därefter de valda recepten med rätt antal, variant, ingredienser och originalinstruktioner. Varje recept börjar på en ny sida. Avmarkera för att bara skriva ut inköpslistan. Valet sparas lokalt i webbläsaren. Bakomliggande receptkort och knappar skrivs aldrig ut från listfönstret.

**Ta med ingredienser till delrecept** räknar ut exempelvis mjöl och vatten till en surdeg. Avmarkera om du redan har det färdiga delreceptet. Delrecept räknas bara ut när enheterna passar ihop. Saknade mängder eller enheter visas tydligt och behöver kontrolleras.

Inköpslistan och avbockade varor sparas bara i din webbläsares lokala lagring, så att de finns kvar när du återkommer. Inga cookies, konton eller spårning används och inget skickas till en server. **Töm listan** tar bort dina val. En delningslänk innehåller valda recept och antal, men inte avbockningarna.

Alla recept och tillgångar sparas efter det första lyckade besöket. Vänta tills sidfoten säger **Receptboken finns nu tillgänglig offline** innan nätet kopplas bort. HTTPS krävs, förutom på localhost. Varje nytt bygge får en egen cache; gamla versioner rensas bara inom denna basadress. Misslyckad installation visas i sidfoten och ett senare besök försöker igen.

Lägg till sidan på hemskärmen med webbläsarens funktion. Dela använder telefonens delningsmeny där den stöds, med **Kopiera länk** som reserv. Antal och variant följer med länken. Utskrift använder de aktuella mängderna. Långa recept kan behöva flera sidor.

`noindex` och `robots.txt` ber sökmotorer att inte indexera sidan. **Det är inget åtkomstskydd:** alla som känner till adressen kan läsa och dela recepten. Sidan är helt statisk och har ingen inloggning.

## Projektfiler

| Fil/mapp | Innehåll |
| --- | --- |
| `recept/` | Redigerbara recept |
| `exempel/nytt-recept.json` | Mall för nya recept |
| `konvertering-rapport.md` | Osäkerheter och formelspårning |
| `scripts/convert_excel.py` | Excel-import, enda openpyxl-beroendet |
| `scripts/build.py` | Statisk HTML och PWA-bygge |
| `web/` | Lokal CSS, JavaScript och ikoner |
| `.github/workflows/pages.yml` | Automatisk publicering |
| `dist/` | Filer att ladda upp |

Originalets stavning är bevarad. Webbplatsen har semantisk HTML, svenska etiketter, tangentbordsstöd, synliga fokusmarkeringar, hög kontrast och stora tryckytor. Inga tredjepartsanrop sker från sidan.
# receptboken
