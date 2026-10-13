# Konverteringsrapport

Källa: Recept 2021.xlsx. Originalfilen har inte ändrats.

88 flikar, 83 recept. Uteslutna översikter: Kakor mm, Kallskurat 1, Röror, Sheet1, antal att baka.
Formler: 956, varav 401 arrayformler.

## Struktur och metod

Upptäckta mängdlayoutvarianter:
- B → F: 26 recept.
- A → D: 20 recept.
- Formelstyrt delrecept: 4 recept.
- B → E: 30 recept.
- A → E: 1 recept.
- B → G: 1 recept.
- B → D: 1 recept.

Mängder sparas per 1 st/sats/portion eller per 1 kg delrecept. Multiplikatorer från beställningsflikar används aldrig som basmängder. Numerisk bascell läses först, stödd aritmetik beräknas vid behov. Arrayformler läses via text. Okända formeltyper och luckor markeras. Ingen ekonomisk cellmatris exporteras. Alla pris- och kostnadskolumner, ekonomiska texter och totalrader är borttagna.

Fliknamnet används som stabil recepttitel. Andra rubriker i cellerna bevaras separat. Textens stavning och blanksteg har inte rättats.

## Granska manuellt

78 recept har minst en granskningspunkt. Även saknad arbetsbeskrivning och skillnader i rubrik räknas. Prioritera okända ingredienser/enheter och alternativa tabeller.

### Vörtlimpa

JSON: `recept/vortlimpa.json`

- Rad 7: enhet saknas; ingen enhet gissad.
- Rad 8: enhet saknas; ingen enhet gissad.
- Avvikande/extra rubriktext bevarad: 800g
- Misstänkt stavning ”Homung”. Originalet är inte rättat.
- Misstänkt stavning ”Ingerfära”. Originalet är inte rättat.

### Gotländskt slagbröd

JSON: `recept/gotlandskt-slagbrod.json`

- Kategorin hämtad via avvikande namn ”Gotlänskt slagbröd” i beställningsfliken.
- Skalning tolkad som st från brödkategorin; antal per sats bör granskas.
- Arbetsbeskrivning saknas i filen; ingen text har hittats på.
- Avvikande/extra rubriktext bevarad: Gotlänskt slagbröd / kg st

### Tebaguegette

JSON: `recept/tebaguegette.json`

- Kategorin hämtad via avvikande namn ”Tebaguette” i beställningsfliken.
- Avvikande/extra rubriktext bevarad: Tebaguette
- Misstänkt stavning ”Tebaguegette”. Originalet är inte rättat.
- Misstänkt stavning ”Socket”. Originalet är inte rättat.

### Pizza deg

JSON: `recept/pizza-deg.json`

- Alternativa tabeller visas som valbara varianter. Granska basantal och vilka anteckningar som hör till respektive variant.
- Avvikande/extra rubriktext bevarad: 1 sats = 1 pizza = 280 g

### Fisksås stark

JSON: `recept/fisksas-stark.json`

- Arbetsbeskrivning saknas i filen; ingen text har hittats på.
- Avvikande/extra rubriktext bevarad: Frissås stark

### Formfranska

JSON: `recept/formfranska.json`

- Arbetsbeskrivning saknas i filen; ingen text har hittats på.

### Mörk Sirapslimpa

JSON: `recept/mork-sirapslimpa.json`

- Avvikande/extra rubriktext bevarad: 800g

### Rågsiktskaka

JSON: `recept/ragsiktskaka.json`

- Rad 7: enhet saknas; ingen enhet gissad.
- Rad 8: enhet saknas; ingen enhet gissad.
- Rad 13: ingrediensnamn saknas. Mängden har behållits med tomt namn.
- Skalning tolkad som st från brödkategorin; antal per sats bör granskas.
- Misstänkt stavning ”Homung”. Originalet är inte rättat.

### Rågbröd

JSON: `recept/ragbrod.json`

- Skalning tolkad som st från brödkategorin; antal per sats bör granskas.
- Avvikande/extra rubriktext bevarad: kg per st

### Rågbröd Solros

JSON: `recept/ragbrod-solros.json`

- Skalning tolkad som st från brödkategorin; antal per sats bör granskas.
- Avvikande/extra rubriktext bevarad: Rågbröd  / 3 satser = 3 bröd ca 1,1 kg st

### Skollning rågmjöl fint

JSON: `recept/skollning-ragmjol-fint.json`

- Delrecept normaliserat till 1 kg med formelns proportioner. Kontrollera att detta är önskad skalningsenhet.
- Kategorin saknas i beställningsfliken; placerad i Övriga.

### Källarfranska

JSON: `recept/kallarfranska.json`

- Arbetsbeskrivning saknas i filen; ingen text har hittats på.

### Ciabatta

JSON: `recept/ciabatta.json`

- H8: extra text finns på ingrediensraden; bevarad i anteckningar.
- Skalning tolkad som st från brödkategorin; antal per sats bör granskas.

### Brioche bröd

JSON: `recept/brioche-brod.json`

- Skalning tolkad som st från brödkategorin; antal per sats bör granskas.
- Misstänkt stavning ”Vetamjöl”. Originalet är inte rättat.

### Tekaka

JSON: `recept/tekaka.json`

- Arbetsbeskrivning saknas i filen; ingen text har hittats på.
- Avvikande/extra rubriktext bevarad: Tekakor

### Grekiskt lantbröd 

JSON: `recept/grekiskt-lantbrod.json`

- Skalning tolkad som st från brödkategorin; antal per sats bör granskas.
- Arbetsbeskrivning saknas i filen; ingen text har hittats på.
- ”Surdeg” länkas till Surdeg vete med stöd av beställningsflikens J7-formel.

### Italenskt lantbröd 

JSON: `recept/italenskt-lantbrod.json`

- Skalning tolkad som st från brödkategorin; antal per sats bör granskas.
- Arbetsbeskrivning saknas i filen; ingen text har hittats på.
- Misstänkt stavning ”Italenskt”. Originalet är inte rättat.
- ”Surdeg” länkas till Surdeg vete med stöd av beställningsflikens J7-formel.

### Baugetter

JSON: `recept/baugetter.json`

- Skalning tolkad som st från brödkategorin; antal per sats bör granskas.
- Misstänkt stavning ”Baugetter”. Originalet är inte rättat.

### Rågbröd med frukt

JSON: `recept/ragbrod-med-frukt.json`

- Skalning tolkad som st från brödkategorin; antal per sats bör granskas.
- Avvikande/extra rubriktext bevarad: 3 satser = 3 bröd ca 1,1 kg st
- Misstänkt stavning ”Aprekos”. Originalet är inte rättat.

### Rågbröd med valnötter

JSON: `recept/ragbrod-med-valnotter.json`

- Skalning tolkad som st från brödkategorin; antal per sats bör granskas.
- Avvikande/extra rubriktext bevarad: 3 satser = 3 bröd ca 1,1 kg st

### Bullar

JSON: `recept/bullar.json`

- Rad 15: olika enheter i bas och uppskalning (g / kg). Basenheten behållen.
- Skalning benämns sats eftersom en tydlig enhet saknas. Granska utbytet.

### Glutenfritt grovtbröd

JSON: `recept/glutenfritt-grovtbrod.json`

- Skalning tolkad som st från brödkategorin; antal per sats bör granskas.
- Avvikande/extra rubriktext bevarad: Glutenfritt  / Grovtbröd
- Misstänkt stavning ”Pysllium”. Originalet är inte rättat.

### Skollning

JSON: `recept/skollning.json`

- Delrecept normaliserat till 1 kg med formelns proportioner. Kontrollera att detta är önskad skalningsenhet.
- Proportionerna hämtas från Rågsiktskaka. Ingen koppling till Vörtlimpas lokala skållning har antagits.
- Kategorin saknas i beställningsfliken; placerad i Övriga.
- Avvikande/extra rubriktext bevarad: Recept skollning

### Surdeg vete

JSON: `recept/surdeg-vete.json`

- Delrecept normaliserat till 1 kg med formelns proportioner. Kontrollera att detta är önskad skalningsenhet.
- Kategorin saknas i beställningsfliken; placerad i Övriga.
- Arbetsbeskrivning saknas i filen; ingen text har hittats på.
- Avvikande/extra rubriktext bevarad: Recept Surdeg

### Surdeg råg

JSON: `recept/surdeg-rag.json`

- Delrecept normaliserat till 1 kg med formelns proportioner. Kontrollera att detta är önskad skalningsenhet.
- Kategorin saknas i beställningsfliken; placerad i Övriga.
- Arbetsbeskrivning saknas i filen; ingen text har hittats på.
- Avvikande/extra rubriktext bevarad: Recept surdeg råg
- Misstänkt stavning ”Rågmjlö”. Originalet är inte rättat.

### fransk arlanda

JSON: `recept/fransk-arlanda.json`

- Arbetsbeskrivning saknas i filen; ingen text har hittats på.
- Avvikande/extra rubriktext bevarad: PÅSPOTATIS / FRANSK POTATISSALLAD / ARLANDA

### biffgryta

JSON: `recept/biffgryta.json`

- Avvikande/extra rubriktext bevarad: Biff gryta  / 1 portion = 4 portioner 
- Originalet säger ”1 portion = 4 portioner”. Skalningen följer en original-sats; utbytet är osäkert.

### Grek påse

JSON: `recept/grek-pase.json`

- Arbetsbeskrivning saknas i filen; ingen text har hittats på.
- Avvikande/extra rubriktext bevarad: PÅSPOTATIS / GREKISK POTATISSALLAD

### fransk påse

JSON: `recept/fransk-pase.json`

- Arbetsbeskrivning saknas i filen; ingen text har hittats på.
- Avvikande/extra rubriktext bevarad: PÅSPOTATIS / FRANSK POTATISSALLAD

### Fransk burk 7,7 kg

JSON: `recept/fransk-burk-7-7-kg.json`

- Arbetsbeskrivning saknas i filen; ingen text har hittats på.
- Avvikande/extra rubriktext bevarad: FRANSK POTATISSALLAD

### FRANSK.POT

JSON: `recept/fransk-pot.json`

- Arbetsbeskrivning saknas i filen; ingen text har hittats på.
- Avvikande/extra rubriktext bevarad: FRANSK POTATISSALLAD

### B-sås

JSON: `recept/b-sas.json`

- Arbetsbeskrivning saknas i filen; ingen text har hittats på.

### Pajdeg

JSON: `recept/pajdeg.json`

- D16 innehåller en trasig Excel-referens till Kongress massa. Ersatt med en riktig delreceptslänk; inte publicerad som instruktion.

### Havreflan

JSON: `recept/havreflan.json`

- Skalning benämns sats eftersom en tydlig enhet saknas. Granska utbytet.
- Misstänkt stavning ”Bakpullver”. Originalet är inte rättat.

### Kongress massa

JSON: `recept/kongress-massa.json`

- Avvikande/extra rubriktext bevarad: Kongressmassa/Pajdeg till 

### Mördeg

JSON: `recept/mordeg.json`

- Rad 10: olika enheter i bas och uppskalning (L / kg). Basenheten behållen.
- Skalning benämns sats eftersom en tydlig enhet saknas. Granska utbytet.
- Misstänkt stavning ”Hjortonsalt”. Originalet är inte rättat.

### Pepparkaks deg

JSON: `recept/pepparkaks-deg.json`

- Skalning benämns sats eftersom en tydlig enhet saknas. Granska utbytet.

### Hallon grotta

JSON: `recept/hallon-grotta.json`

- Skalning benämns sats eftersom en tydlig enhet saknas. Granska utbytet.

### Polynerer

JSON: `recept/polynerer.json`

- Skalning benämns sats eftersom en tydlig enhet saknas. Granska utbytet.
- Misstänkt stavning ”Polynerer”. Originalet är inte rättat.
- Misstänkt stavning ”massariner”. Originalet är inte rättat.
- Delrecept för ”Masarin massa” är inte entydigt identifierat; ingen länk gissad.

### Rulltårta

JSON: `recept/rulltarta.json`

- Skalning benämns sats eftersom en tydlig enhet saknas. Granska utbytet.

### Russin plättar

JSON: `recept/russin-plattar.json`

- Skalning benämns sats eftersom en tydlig enhet saknas. Granska utbytet.

### smet massariner

JSON: `recept/smet-massariner.json`

- Rad 8: olika enheter i bas och uppskalning (L / kg). Basenheten behållen.
- Skalning benämns sats eftersom en tydlig enhet saknas. Granska utbytet.
- Avvikande/extra rubriktext bevarad: Smet till massariner
- Misstänkt stavning ”massariner”. Originalet är inte rättat.

### stor påse

JSON: `recept/stor-pase.json`

- Arbetsbeskrivning saknas i filen; ingen text har hittats på.
- Avvikande/extra rubriktext bevarad: Påse 19 kg / POTATISSALLAD

### pot. burk

JSON: `recept/pot-burk.json`

- Arbetsbeskrivning saknas i filen; ingen text har hittats på.
- Avvikande/extra rubriktext bevarad: BURK POTATIS !! / POTATISSALLAD

### Pås pot

JSON: `recept/pas-pot.json`

- Arbetsbeskrivning saknas i filen; ingen text har hittats på.
- Avvikande/extra rubriktext bevarad: PÅS POTATIS !! / POTATISSALLAD / (10 sats=12påsar)

### POTATISSALLAD PÅS

JSON: `recept/potatissallad-pas.json`

- Arbetsbeskrivning saknas i filen; ingen text har hittats på.
- Avvikande/extra rubriktext bevarad: PÅS POTATIS !! / POTATISSALLAD

### POT.SALLAD BURK 7,7 KG

JSON: `recept/pot-sallad-burk-7-7-kg.json`

- Arbetsbeskrivning saknas i filen; ingen text har hittats på.
- Avvikande/extra rubriktext bevarad: POTATISSALLAD / Burk 7,7 kg

### Rödbetssallad

JSON: `recept/rodbetssallad.json`

- Arbetsbeskrivning saknas i filen; ingen text har hittats på.

### Ishavsröra

JSON: `recept/ishavsrora.json`

- Rad 3: separat mängd utan skalningsformel (Räkor). Behållen som basmängd; måste granskas.
- Arbetsbeskrivning saknas i filen; ingen text har hittats på.
- MAJZENA BLANDNING är bevarad som separat delsektion. Kontrollera hur den används i huvudtabellens Majzena; inget automatiskt utbyte har antagits.

### Skaldjursröra

JSON: `recept/skaldjursrora.json`

- Arbetsbeskrivning saknas i filen; ingen text har hittats på.

### LAX RÖRA

JSON: `recept/lax-rora.json`

- Arbetsbeskrivning saknas i filen; ingen text har hittats på.

### AIOLI

JSON: `recept/aioli.json`

- Arbetsbeskrivning saknas i filen; ingen text har hittats på.

### Pasta kyckling

JSON: `recept/pasta-kyckling.json`

- Rad 7: liten mängd 0.001 st för ”Dressing”; kontrollera enheten.
- Rad 10: liten mängd 0.002 st för ”Tomat klyfta”; kontrollera enheten.
- Rad 11: liten mängd 0.001 st för ”Paprika strimla”; kontrollera enheten.
- Avvikande/extra rubriktext bevarad: Pasta sallad Kyckling
- Dressingens mängder står i fritext och skalas inte automatiskt.

### Pasta Räkor

JSON: `recept/pasta-rakor.json`

- Rad 6: liten mängd 0.001 st för ”Dressing”; kontrollera enheten.
- Rad 9: liten mängd 0.002 st för ”Tomat klyfta”; kontrollera enheten.
- Rad 10: liten mängd 0.001 st för ”Ägg halva”; kontrollera enheten.
- Rad 11: liten mängd 0.001 st för ”Gaffel”; kontrollera enheten.
- Arbetsbeskrivning saknas i filen; ingen text har hittats på.
- Avvikande/extra rubriktext bevarad: Pasta sallad Räkor

### Grönsallad Räkor

JSON: `recept/gronsallad-rakor.json`

- Rad 5: liten mängd 0.001 st för ”Dressing”; kontrollera enheten.
- Rad 8: liten mängd 0.002 st för ”Tomat ”; kontrollera enheten.
- Rad 9: liten mängd 0.001 st för ”Ägg halva”; kontrollera enheten.
- Rad 10: liten mängd 0.001 st för ”Gaffel”; kontrollera enheten.
- Rad 11: ”Dill en nypa” har ingen mängd; lämnad tom.
- Arbetsbeskrivning saknas i filen; ingen text har hittats på.

### Kallskuret

JSON: `recept/kallskuret.json`

- Rad 9: olika enheter i bas och uppskalning (1/2st / st). Basenheten behållen.
- Delrecept för ”Potatissallad” är inte entydigt identifierat; ingen länk gissad.
- Delrecept för ”Ishavssallad m räkor” är inte entydigt identifierat; ingen länk gissad.

### Mimosasallad

JSON: `recept/mimosasallad.json`

- Avvikande/extra rubriktext bevarad: Mimosallad

### Räk & kräft

JSON: `recept/rak-kraft.json`

- Rad 8: liten mängd 0.012 st för ”Salt”; kontrollera enheten.
- Rad 11: liten mängd 0.012 st för ”Sparris spad”; kontrollera enheten.
- Rad 13: liten mängd 0.015 st för ”Dill”; kontrollera enheten.
- Arbetsbeskrivning saknas i filen; ingen text har hittats på.
- Avvikande/extra rubriktext bevarad: Räk & Kräft röra

### avr.tonfisk

JSON: `recept/avr-tonfisk.json`

- Arbetsbeskrivning saknas i filen; ingen text har hittats på.
- Avvikande/extra rubriktext bevarad: 3,150kg/burk / TONFISKMOJA  (SSP Arlanda)

### Tonfiskmoja

JSON: `recept/tonfiskmoja.json`

- Arbetsbeskrivning saknas i filen; ingen text har hittats på.
- Avvikande/extra rubriktext bevarad: TONFISKMOJA  (SSP Arlanda)

### Tonfisk

JSON: `recept/tonfisk.json`

- Avvikande/extra rubriktext bevarad: TONFISKRÖRA
- En separat 1/4-sats finns som fritext. Den skalas inte och skiljer sig delvis från huvudtabellen.

### skagernröra

JSON: `recept/skagernrora.json`

- Avvikande/extra rubriktext bevarad: SKAGERN RÖRA
- Misstänkt stavning ”skagern”. Originalet är inte rättat.

### Lax-phill

JSON: `recept/lax-phill.json`

- Avvikande/extra rubriktext bevarad: LAX / PHILADELPHIA RÖRA
- Misstänkt stavning ”Dionsenap”. Originalet är inte rättat.

### Skink röra

JSON: `recept/skink-rora.json`

- Misstänkt stavning ”Dionsenap”. Originalet är inte rättat.

### Ägg-räk röra

JSON: `recept/agg-rak-rora.json`

- Avvikande/extra rubriktext bevarad: ÄGG / RÄK RÖRA

### Kyckling  röra

JSON: `recept/kyckling-rora.json`

- Alternativa tabeller visas som valbara varianter. Granska basantal och vilka anteckningar som hör till respektive variant.
- Avvikande/extra rubriktext bevarad: KYCKLINGRÖRA MED CURRY

### Kyc.m garam marsala

JSON: `recept/kyc-m-garam-marsala.json`

- Arbetsbeskrivning saknas i filen; ingen text har hittats på.
- Avvikande/extra rubriktext bevarad: KYCKLING M GARAM MARSALA / (SSP Arlanda )

### Skinkmoja m keso

JSON: `recept/skinkmoja-m-keso.json`

- Rad 13: ”Förtjockningsm.” har ingen mängd; lämnad tom.
- Arbetsbeskrivning saknas i filen; ingen text har hittats på.
- Avvikande/extra rubriktext bevarad: (SSP Arlanda )

### Cole slaw m lök

JSON: `recept/cole-slaw-m-lok.json`

- Arbetsbeskrivning saknas i filen; ingen text har hittats på.
- Avvikande/extra rubriktext bevarad: COLE SLAW
- Misstänkt stavning ”Vitlkål”. Originalet är inte rättat.

### Cole slaw

JSON: `recept/cole-slaw.json`

- Arbetsbeskrivning saknas i filen; ingen text har hittats på.
- Avvikande/extra rubriktext bevarad: (SSP Arlanda )
- Misstänkt stavning ”Vitlkål”. Originalet är inte rättat.

### Legym sallad

JSON: `recept/legym-sallad.json`

- Avvikande/extra rubriktext bevarad: LEGYMSALLAD

### Lyx tallrik

JSON: `recept/lyx-tallrik.json`

- Rad 26: ”Sallad i botten” har ingen mängd; lämnad tom.
- Alternativa tabeller visas som valbara varianter. Granska basantal och vilka anteckningar som hör till respektive variant.
- Avvikande/extra rubriktext bevarad: (landgångsform) / Jimmy
- Delrecept för ”Potatissallad” är inte entydigt identifierat; ingen länk gissad.

### Bortschsallad

JSON: `recept/bortschsallad.json`

- Skalning benämns sats eftersom en tydlig enhet saknas. Granska utbytet.
- Arbetsbeskrivning saknas i filen; ingen text har hittats på.
- Avvikande/extra rubriktext bevarad: BORTSCH SALLAD

### Ketchupröra

JSON: `recept/ketchuprora.json`

- Rad 11: olika enheter i bas och uppskalning (liter / kg). Basenheten behållen.
- Skalning benämns sats eftersom en tydlig enhet saknas. Granska utbytet.
- Arbetsbeskrivning saknas i filen; ingen text har hittats på.

### curry

JSON: `recept/curry.json`

- Arbetsbeskrivning saknas i filen; ingen text har hittats på.
- Avvikande/extra rubriktext bevarad: CURRY DRESSING

### Rödbetor philiefiaost

JSON: `recept/rodbetor-philiefiaost.json`

- Rad 12: ”Salt” har ingen mängd; lämnad tom.
- Avvikande/extra rubriktext bevarad: Rödbetor med Philidelfiaost 
- Misstänkt stavning ”Philidelfia”. Originalet är inte rättat.

### vofflor

JSON: `recept/vofflor.json`

- Arbetsbeskrivning saknas i filen; ingen text har hittats på.
- Avvikande/extra rubriktext bevarad: Våfflor
- Misstänkt stavning ”vofflor”. Originalet är inte rättat.

### Albóndigas

JSON: `recept/albondigas.json`

- Avvikande/extra rubriktext bevarad: Albóndigas – köttbullar i tomatsås

## Formelspårning (endast ingrediensmängder)

Bas- och skalningscell per ingrediens, för jämförelse med Excel. Inga ekonomiska värden eller formler ingår.

- `vortlimpa`: rad 7: B7 → F7, antal B4; rad 8: B8 → F8, antal B4; rad 10: B10 → F10, antal B4; rad 11: B11 → F11, antal B4; rad 12: B12 → F12, antal B4; rad 13: B13 → F13, antal B4; rad 14: B14 → F14, antal B4; rad 15: B15 → F15, antal B4; rad 16: B16 → F16, antal B4; rad 17: B17 → F17, antal B4; rad 18: B18 → F18, antal B4; rad 19: B19 → F19, antal B4; rad 20: B20 → F20, antal B4
- `gotlandskt-slagbrod`: rad 7: B7 → F7, antal B4; rad 8: B8 → F8, antal B4; rad 9: B9 → F9, antal B4; rad 10: B10 → F10, antal B4; rad 12: B12 → F12, antal B4; rad 13: B13 → F13, antal B4; rad 14: B14 → F14, antal B4; rad 15: B15 → F15, antal B4
- `tebaguegette`: rad 4: A4 → D4, antal B2; rad 5: A5 → D5, antal B2; rad 6: A6 → D6, antal B2; rad 7: A7 → D7, antal B2; rad 8: A8 → D8, antal B2; rad 9: A9 → D9, antal B2; rad 10: A10 → D10, antal B2
- `pizza-deg`: rad 6: B6 → F6, antal B4; rad 7: B7 → F7, antal B4; rad 8: B8 → F8, antal B4; rad 9: B9 → F9, antal B4; rad 13: B13 → F13, antal B4; rad 14: B14 → F14, antal B4; rad 15: B15 → F15, antal B4; rad 16: B16 → F16, antal B4
- `fisksas-stark`: rad 5: A5 → D5, antal B3; rad 6: A6 → D6, antal B3; rad 7: A7 → D7, antal B3; rad 8: A8 → D8, antal B3; rad 9: A9 → D9, antal B3
- `formfranska`: rad 5: A5 → D5, antal B3; rad 6: A6 → D6, antal B3; rad 7: A7 → D7, antal B3; rad 8: A8 → D8, antal B3; rad 9: A9 → D9, antal B3; rad 10: A10 → D10, antal B3
- `grytbrod-vitt`: rad 5: A5 → D5, antal B3; rad 6: A6 → D6, antal B3; rad 7: A7 → D7, antal B3; rad 8: A8 → D8, antal B3; rad 9: A9 → D9, antal B3
- `honokaka`: rad 5: A5 → D5, antal B3; rad 6: A6 → D6, antal B3; rad 7: A7 → D7, antal B3; rad 8: A8 → D8, antal B3; rad 9: A9 → D9, antal B3; rad 10: A10 → D10, antal B3; rad 11: A11 → D11, antal B3
- `mork-sirapslimpa`: rad 7: B7 → F7, antal B4; rad 8: B8 → F8, antal B4; rad 11: B11 → F11, antal B4; rad 12: B12 → F12, antal B4; rad 13: B13 → F13, antal B4; rad 14: B14 → F14, antal B4; rad 15: B15 → F15, antal B4; rad 16: B16 → F16, antal B4; rad 17: B17 → F17, antal B4
- `ragsiktskaka`: rad 7: B7 → F7, antal B4; rad 8: B8 → F8, antal B4; rad 10: B10 → F10, antal B4; rad 11: B11 → F11, antal B4; rad 12: B12 → F12, antal B4; rad 13: B13 → F13, antal B4; rad 14: B14 → F14, antal B4; rad 15: B15 → F15, antal B4; rad 16: B16 → F16, antal B4; rad 17: B17 → F17, antal B4; rad 18: B18 → F18, antal B4; rad 19: B19 → F19, antal B4; rad 20: B20 → F20, antal B4
- `ragbrod`: rad 7: B7 → F7, antal B4; rad 8: B8 → F8, antal B4; rad 9: B9 → F9, antal B4; rad 10: B10 → F10, antal B4; rad 11: B11 → F11, antal B4; rad 12: B12 → F12, antal B4; rad 15: B15 → F15, antal B4; rad 16: B16 → F16, antal B4; rad 17: B17 → F17, antal B4; rad 18: B18 → F18, antal B4; rad 19: B19 → F19, antal B4; rad 20: B20 → F20, antal B4; rad 21: B21 → F21, antal B4; rad 22: B22 → F22, antal B4
- `ragbrod-solros`: rad 7: B7 → F7, antal B4; rad 8: B8 → F8, antal B4; rad 9: B9 → F9, antal B4; rad 10: B10 → F10, antal B4; rad 11: B11 → F11, antal B4; rad 14: B14 → F14, antal B4; rad 15: B15 → F15, antal B4; rad 16: B16 → F16, antal B4; rad 17: B17 → F17, antal B4; rad 18: B18 → F18, antal B4
- `skollning-ragmjol-fint`: rad 6: D6, normalisering mot D9; rad 7: D7, normalisering mot D9
- `kallarfranska`: rad 5: A5 → D5, antal B3; rad 6: A6 → D6, antal B3; rad 7: A7 → D7, antal B3; rad 8: A8 → D8, antal B3; rad 9: A9 → D9, antal B3; rad 10: A10 → D10, antal B3; rad 11: A11 → D11, antal B3
- `ciabatta`: rad 6: B6 → F6, antal B4; rad 7: B7 → F7, antal B4; rad 8: B8 → F8, antal B4; rad 9: B9 → F9, antal B4; rad 10: B10 → F10, antal B4; rad 11: B11 → F11, antal B4; rad 12: B12 → F12, antal B4
- `brioche-brod`: rad 7: B7 → E7, antal B4; rad 8: B8 → E8, antal B4; rad 9: B9 → E9, antal B4; rad 10: B10 → E10, antal B4; rad 11: B11 → E11, antal B4; rad 12: B12 → E12, antal B4; rad 13: B13 → E13, antal B4
- `tekaka`: rad 4: A4 → D4, antal B2; rad 5: A5 → D5, antal B2; rad 6: A6 → D6, antal B2; rad 7: A7 → D7, antal B2; rad 8: A8 → D8, antal B2; rad 9: A9 → D9, antal B2; rad 10: A10 → D10, antal B2
- `grekiskt-lantbrod`: rad 9: B9 → F9, antal B3; rad 10: B10 → F10, antal B3; rad 11: B11 → F11, antal B3; rad 12: B12 → F12, antal B3; rad 13: B13 → F13, antal B3; rad 15: B15 → F15, antal B3
- `italenskt-lantbrod`: rad 9: B9 → F9, antal B3; rad 10: B10 → F10, antal B3; rad 11: B11 → F11, antal B3; rad 12: B12 → F12, antal B3; rad 13: B13 → F13, antal B3; rad 14: B14 → F14, antal B3; rad 16: B16 → F16, antal B3
- `baugetter`: rad 8: A8 → E8, antal A2; rad 9: A9 → E9, antal A2; rad 10: A10 → E10, antal A2; rad 11: A11 → E11, antal A2
- `ragbrod-med-frukt`: rad 6: B6 → F6, antal B3; rad 7: B7 → F7, antal B3; rad 8: B8 → F8, antal B3; rad 9: B9 → F9, antal B3; rad 10: B10 → F10, antal B3; rad 11: B11 → F11, antal B3; rad 12: B12 → F12, antal B3; rad 13: B13 → F13, antal B3; rad 16: B16 → F16, antal B3; rad 17: B17 → F17, antal B3; rad 18: B18 → F18, antal B3; rad 19: B19 → F19, antal B3; rad 20: B20 → F20, antal B3; rad 21: B21 → F21, antal B3
- `ragbrod-med-valnotter`: rad 6: B6 → F6, antal B3; rad 7: B7 → F7, antal B3; rad 8: B8 → F8, antal B3; rad 9: B9 → F9, antal B3; rad 10: B10 → F10, antal B3; rad 13: B13 → F13, antal B3; rad 14: B14 → F14, antal B3; rad 15: B15 → F15, antal B3; rad 16: B16 → F16, antal B3; rad 17: B17 → F17, antal B3; rad 18: B18 → F18, antal B3
- `bullar`: rad 6: B6 → F6, antal B4; rad 7: B7 → F7, antal B4; rad 8: B8 → F8, antal B4; rad 9: B9 → F9, antal B4; rad 10: B10 → F10, antal B4; rad 11: B11 → F11, antal B4; rad 12: B12 → F12, antal B4; rad 13: B13 → F13, antal B4; rad 15: B15 → F15, antal B4
- `glutenfritt-grovtbrod`: rad 7: B7 → F7, antal B4; rad 8: B8 → F8, antal B4; rad 9: B9 → F9, antal B4; rad 10: B10 → F10, antal B4; rad 11: B11 → F11, antal B4; rad 13: B13 → F13, antal B4; rad 14: B14 → F14, antal B4; rad 15: B15 → F15, antal B4; rad 16: B16 → F16, antal B4; rad 17: B17 → F17, antal B4; rad 18: B18 → F18, antal B4; rad 19: B19 → F19, antal B4
- `skollning`: rad 5: D5, normalisering mot D9; rad 7: D7, normalisering mot D9
- `surdeg-vete`: rad 4: C4, normalisering mot C8; rad 6: C6, normalisering mot C8
- `surdeg-rag`: rad 5: C5, normalisering mot C9; rad 7: C7, normalisering mot C9
- `fransk-arlanda`: rad 4: B4 → E4, antal B3; rad 5: B5 → E5, antal B3; rad 6: B6 → E6, antal B3; rad 7: B7 → E7, antal B3; rad 8: B8 → E8, antal B3; rad 9: B9 → E9, antal B3; rad 10: B10 → E10, antal B3; rad 11: B11 → E11, antal B3
- `biffgryta`: rad 5: A5 → D5, antal A4; rad 7: A7 → D7, antal A4; rad 8: A8 → D8, antal A4; rad 9: A9 → D9, antal A4; rad 10: A10 → D10, antal A4; rad 11: A11 → D11, antal A4; rad 12: A12 → D12, antal A4; rad 13: A13 → D13, antal A4
- `grek-pase`: rad 4: B4 → E4, antal B3; rad 5: B5 → E5, antal B3; rad 6: B6 → E6, antal B3; rad 7: B7 → E7, antal B3; rad 8: B8 → E8, antal B3; rad 9: B9 → E9, antal B3; rad 10: B10 → E10, antal B3; rad 11: B11 → E11, antal B3; rad 12: B12 → E12, antal B3; rad 13: B13 → E13, antal B3
- `fransk-pase`: rad 4: B4 → E4, antal B3; rad 5: B5 → E5, antal B3; rad 6: B6 → E6, antal B3; rad 7: B7 → E7, antal B3; rad 8: B8 → E8, antal B3; rad 9: B9 → E9, antal B3; rad 10: B10 → E10, antal B3
- `fransk-burk-7-7-kg`: rad 4: B4 → E4, antal B3; rad 5: B5 → E5, antal B3; rad 6: B6 → E6, antal B3; rad 7: B7 → E7, antal B3; rad 8: B8 → E8, antal B3; rad 9: B9 → E9, antal B3; rad 10: B10 → E10, antal B3
- `fransk-pot`: rad 4: B4 → E4, antal B3; rad 5: B5 → E5, antal B3; rad 6: B6 → E6, antal B3; rad 7: B7 → E7, antal B3; rad 8: B8 → E8, antal B3; rad 9: B9 → E9, antal B3; rad 10: B10 → E10, antal B3
- `b-sas`: rad 5: B5 → E5, antal B4; rad 6: B6 → E6, antal B4; rad 8: B8 → E8, antal B4; rad 9: B9 → E9, antal B4; rad 10: B10 → E10, antal B4; rad 11: B11 → E11, antal B4; rad 12: B12 → E12, antal B4
- `pajdeg`: rad 6: B6 → F6, antal B4; rad 7: B7 → F7, antal B4; rad 8: B8 → F8, antal B4; rad 9: B9 → F9, antal B4
- `havreflan`: rad 6: B6 → F6, antal B4; rad 7: B7 → F7, antal B4; rad 8: B8 → F8, antal B4; rad 10: B10 → F10, antal B4; rad 11: B11 → F11, antal B4; rad 12: B12 → F12, antal B4; rad 13: B13 → F13, antal B4
- `kongress-massa`: rad 6: B6 → F6, antal B4; rad 7: B7 → F7, antal B4; rad 8: B8 → F8, antal B4; rad 18: B18 → F18, antal B4; rad 19: B19 → F19, antal B4; rad 20: B20 → F20, antal B4; rad 21: B21 → F21, antal B4
- `mordeg`: rad 6: B6 → F6, antal B4; rad 7: B7 → F7, antal B4; rad 8: B8 → F8, antal B4; rad 9: B9 → F9, antal B4; rad 10: B10 → F10, antal B4; rad 11: B11 → F11, antal B4
- `pepparkaks-deg`: rad 6: B6 → F6, antal B4; rad 7: B7 → F7, antal B4; rad 8: B8 → F8, antal B4; rad 9: B9 → F9, antal B4; rad 10: B10 → F10, antal B4; rad 11: B11 → F11, antal B4; rad 12: B12 → F12, antal B4; rad 13: B13 → F13, antal B4; rad 14: B14 → F14, antal B4; rad 15: B15 → F15, antal B4
- `hallon-grotta`: rad 6: B6 → F6, antal B4; rad 7: B7 → F7, antal B4; rad 8: B8 → F8, antal B4; rad 9: B9 → F9, antal B4
- `polynerer`: rad 6: B6 → F6, antal B4; rad 7: B7 → F7, antal B4; rad 8: B8 → F8, antal B4
- `rulltarta`: rad 6: B6 → F6, antal B4; rad 7: B7 → F7, antal B4; rad 8: B8 → F8, antal B4; rad 9: B9 → F9, antal B4; rad 11: B11 → F11, antal B4; rad 12: B12 → F12, antal B4
- `russin-plattar`: rad 6: B6 → F6, antal B4; rad 7: B7 → F7, antal B4; rad 8: B8 → F8, antal B4; rad 9: B9 → F9, antal B4; rad 11: B11 → F11, antal B4; rad 12: B12 → F12, antal B4
- `smet-massariner`: rad 6: B6 → F6, antal B4; rad 7: B7 → F7, antal B4; rad 8: B8 → F8, antal B4; rad 10: B10 → F10, antal B4; rad 11: B11 → F11, antal B4
- `stor-pase`: rad 6: A6 → D6, antal A4; rad 7: A7 → D7, antal A4; rad 8: A8 → D8, antal A4; rad 9: A9 → D9, antal A4; rad 10: A10 → D10, antal A4; rad 11: A11 → D11, antal A4; rad 12: A12 → D12, antal A4; rad 13: A13 → D13, antal A4; rad 14: A14 → D14, antal A4; rad 17: A17 → D17, antal A4
- `pot-burk`: rad 5: A5 → D5, antal A4; rad 6: A6 → D6, antal A4; rad 7: A7 → D7, antal A4; rad 8: A8 → D8, antal A4; rad 9: A9 → D9, antal A4; rad 10: A10 → D10, antal A4; rad 11: A11 → D11, antal A4; rad 12: A12 → D12, antal A4; rad 13: A13 → D13, antal A4; rad 15: A15 → D15, antal A4
- `pas-pot`: rad 5: A5 → D5, antal A4; rad 7: A7 → D7, antal A4; rad 8: A8 → D8, antal A4; rad 9: A9 → D9, antal A4; rad 11: A11 → D11, antal A4; rad 12: A12 → D12, antal A4; rad 13: A13 → D13, antal A4; rad 14: A14 → D14, antal A4; rad 15: A15 → D15, antal A4; rad 16: A16 → D16, antal A4
- `potatissallad-pas`: rad 5: A5 → D5, antal A4; rad 7: A7 → D7, antal A4; rad 8: A8 → D8, antal A4; rad 9: A9 → D9, antal A4; rad 10: A10 → D10, antal A4; rad 11: A11 → D11, antal A4; rad 12: A12 → D12, antal A4; rad 13: A13 → D13, antal A4; rad 14: A14 → D14, antal A4; rad 15: A15 → D15, antal A4; rad 16: A16 → D16, antal A4
- `pot-sallad-burk-7-7-kg`: rad 5: B5 → E5, antal B4; rad 7: B7 → E7, antal B4; rad 8: B8 → E8, antal B4; rad 9: B9 → E9, antal B4; rad 11: B11 → E11, antal B4; rad 12: B12 → E12, antal B4; rad 13: B13 → E13, antal B4; rad 14: B14 → E14, antal B4; rad 15: B15 → E15, antal B4; rad 16: B16 → E16, antal B4
- `rodbetssallad`: rad 6: B6 → E6, antal B4; rad 7: B7 → E7, antal B4; rad 8: B8 → E8, antal B4; rad 9: B9 → E9, antal B4; rad 10: B10 → E10, antal B4; rad 11: B11 → E11, antal B4; rad 12: B12 → E12, antal B4
- `ishavsrora`: rad 6: B6 → E6, antal B4; rad 7: B7 → E7, antal B4; rad 8: B8 → E8, antal B4; rad 9: B9 → E9, antal B4; rad 10: B10 → E10, antal B4; rad 11: B11 → E11, antal B4; rad 12: B12 → E12, antal B4; rad 13: B13 → E13, antal B4; rad 14: B14 → E14, antal B4; rad 15: B15 → E15, antal B4; rad 18: B18 → E18, antal B4; rad 22: B22 → E22, antal B4; rad 23: B23 → E23, antal B4
- `skaldjursrora`: rad 6: B6 → E6, antal B4; rad 7: B7 → E7, antal B4; rad 8: B8 → E8, antal B4; rad 9: B9 → E9, antal B4
- `lax-rora`: rad 6: B6 → E6, antal B4; rad 7: B7 → E7, antal B4; rad 9: B9 → E9, antal B4; rad 10: B10 → E10, antal B4
- `aioli`: rad 6: B6 → E6, antal B4; rad 7: B7 → E7, antal B4; rad 8: B8 → E8, antal B4; rad 9: B9 → E9, antal B4
- `pasta-kyckling`: rad 5: B5 → E5, antal B4; rad 6: B6 → E6, antal B4; rad 7: B7 → E7, antal B4; rad 8: B8 → E8, antal B4; rad 9: B9 → E9, antal B4; rad 10: B10 → E10, antal B4; rad 11: B11 → E11, antal B4
- `pasta-rakor`: rad 4: B4 → E4, antal B3; rad 5: B5 → E5, antal B3; rad 6: B6 → E6, antal B3; rad 7: B7 → E7, antal B3; rad 8: B8 → E8, antal B3; rad 9: B9 → E9, antal B3; rad 10: B10 → E10, antal B3; rad 11: B11 → E11, antal B3
- `gronsallad-rakor`: rad 4: B4 → E4, antal B3; rad 5: B5 → E5, antal B3; rad 6: B6 → E6, antal B3; rad 7: B7 → E7, antal B3; rad 8: B8 → E8, antal B3; rad 9: B9 → E9, antal B3; rad 10: B10 → E10, antal B3
- `kallskuret`: rad 4: B4 → E4, antal B3; rad 5: B5 → E5, antal B3; rad 6: B6 → E6, antal B3; rad 7: B7 → E7, antal B3; rad 8: B8 → E8, antal B3; rad 9: B9 → E9, antal B3; rad 10: B10 → E10, antal B3; rad 11: B11 → E11, antal B3; rad 12: B12 → E12, antal B3
- `mimosasallad`: rad 4: B4 → E4, antal B3; rad 5: B5 → E5, antal B3; rad 6: B6 → E6, antal B3; rad 7: B7 → E7, antal B3; rad 11: B11 → E11, antal B3; rad 12: B12 → E12, antal B3
- `rak-kraft`: rad 4: B4 → E4, antal B3; rad 5: B5 → E5, antal B3; rad 6: B6 → E6, antal B3; rad 7: B7 → E7, antal B3; rad 8: B8 → E8, antal B3; rad 9: B9 → E9, antal B3; rad 10: B10 → E10, antal B3; rad 11: B11 → E11, antal B3; rad 12: B12 → E12, antal B3; rad 13: B13 → E13, antal B3
- `avr-tonfisk`: rad 6: A6 → D6, antal A4; rad 7: A7 → D7, antal A4; rad 8: A8 → D8, antal A4; rad 9: A9 → D9, antal A4; rad 10: A10 → D10, antal A4; rad 11: A11 → D11, antal A4; rad 12: A12 → D12, antal A4; rad 13: A13 → D13, antal A4; rad 14: A14 → D14, antal A4; rad 16: A16 → D16, antal A4; rad 19: A19 → D19, antal A4
- `tonfiskmoja`: rad 6: A6 → D6, antal A4; rad 7: A7 → D7, antal A4; rad 8: A8 → D8, antal A4; rad 9: A9 → D9, antal A4; rad 10: A10 → D10, antal A4; rad 11: A11 → D11, antal A4; rad 12: A12 → D12, antal A4; rad 13: A13 → D13, antal A4; rad 14: A14 → D14, antal A4; rad 15: A15 → D15, antal A4; rad 19: A19 → D19, antal A4
- `tonfisk`: rad 6: B6 → E6, antal B4; rad 7: B7 → E7, antal B4; rad 8: B8 → E8, antal B4; rad 9: B9 → E9, antal B4; rad 10: B10 → E10, antal B4
- `rostbiffrora`: rad 6: B6 → E6, antal B4; rad 7: B7 → E7, antal B4; rad 8: B8 → E8, antal B4; rad 9: B9 → E9, antal B4; rad 10: B10 → E10, antal B4
- `skagernrora`: rad 6: B6 → E6, antal B4; rad 7: B7 → E7, antal B4; rad 8: B8 → E8, antal B4
- `lax-phill`: rad 6: B6 → E6, antal B4; rad 7: B7 → E7, antal B4; rad 8: B8 → E8, antal B4; rad 9: B9 → E9, antal B4
- `skink-rora`: rad 6: B6 → E6, antal B4; rad 7: B7 → E7, antal B4; rad 8: B8 → E8, antal B4; rad 9: B9 → E9, antal B4
- `agg-rak-rora`: rad 6: B6 → E6, antal B4; rad 7: B7 → E7, antal B4; rad 8: B8 → E8, antal B4
- `kyckling-rora`: rad 6: B6 → E6, antal B4; rad 7: B7 → E7, antal B4; rad 8: B8 → E8, antal B4; rad 9: B9 → E9, antal B4; rad 21: B21 → E21, antal B4; rad 22: B22 → E22, antal B4; rad 23: B23 → E23, antal B4; rad 24: B24 → E24, antal B4
- `veg-rora`: rad 6: B6 → E6, antal B4; rad 7: B7 → E7, antal B4; rad 8: B8 → E8, antal B4
- `kyc-m-garam-marsala`: rad 6: A6 → D6, antal A4; rad 7: A7 → D7, antal A4; rad 8: A8 → D8, antal A4; rad 9: A9 → D9, antal A4; rad 10: A10 → D10, antal A4; rad 11: A11 → D11, antal A4; rad 12: A12 → D12, antal A4; rad 13: A13 → D13, antal A4; rad 14: A14 → D14, antal A4; rad 15: A15 → D15, antal A4
- `skinkmoja-m-keso`: rad 6: A6 → D6, antal A4; rad 7: A7 → D7, antal A4; rad 8: A8 → D8, antal A4; rad 9: A9 → D9, antal A4; rad 10: A10 → D10, antal A4; rad 11: A11 → D11, antal A4; rad 12: A12 → D12, antal A4
- `cole-slaw-m-lok`: rad 6: A6 → D6, antal A4; rad 7: A7 → D7, antal A4; rad 8: A8 → D8, antal A4; rad 9: A9 → D9, antal A4; rad 10: A10 → D10, antal A4; rad 11: A11 → D11, antal A4; rad 12: A12 → D12, antal A4; rad 13: A13 → D13, antal A4
- `cole-slaw`: rad 6: A6 → D6, antal A4; rad 7: A7 → D7, antal A4; rad 8: A8 → D8, antal A4; rad 9: A9 → D9, antal A4; rad 10: A10 → D10, antal A4; rad 11: A11 → D11, antal A4; rad 12: A12 → D12, antal A4
- `legym-sallad`: rad 6: A6 → D6, antal A4; rad 7: A7 → D7, antal A4; rad 8: A8 → D8, antal A4; rad 9: A9 → D9, antal A4; rad 10: A10 → D10, antal A4; rad 11: A11 → D11, antal A4; rad 12: A12 → D12, antal A4; rad 13: A13 → D13, antal A4
- `lyx-tallrik`: rad 6: A6 → D6, antal A4; rad 7: A7 → D7, antal A4; rad 8: A8 → D8, antal A4; rad 9: A9 → D9, antal A4; rad 10: A10 → D10, antal A4; rad 11: A11 → D11, antal A4; rad 12: A12 → D12, antal A4; rad 18: A18 → D18, antal A4; rad 19: A19 → D19, antal A4; rad 20: A20 → D20, antal A4; rad 21: A21 → D21, antal A4; rad 22: A22 → D22, antal A4; rad 23: A23 → D23, antal A4; rad 24: A24 → D24, antal A4; rad 25: A25 → D25, antal A4
- `bortschsallad`: rad 4: B4 → G4, antal B3; rad 5: B5 → G5, antal B3; rad 6: B6 → G6, antal B3; rad 7: B7 → G7, antal B3; rad 8: B8 → G8, antal B3; rad 9: B9 → G9, antal B3; rad 10: B10 → G10, antal B3; rad 11: B11 → G11, antal B3; rad 12: B12 → G12, antal B3
- `ketchuprora`: rad 6: B6 → D6, antal B4; rad 7: B7 → D7, antal B4; rad 8: B8 → D8, antal B4; rad 9: B9 → D9, antal B4; rad 10: B10 → D10, antal B4; rad 11: B11 → D11, antal B4
- `curry`: rad 6: B6 → E6, antal B4; rad 7: B7 → E7, antal B4; rad 10: B10 → E10, antal B4; rad 11: B11 → E11, antal B4; rad 12: B12 → E12, antal B4; rad 13: B13 → E13, antal B4
- `rodbetor-philiefiaost`: rad 6: B6 → E6, antal B4; rad 7: B7 → E7, antal B4; rad 10: B10 → E10, antal B4; rad 11: B11 → E11, antal B4
- `vofflor`: rad 6: B6 → E6, antal B4; rad 7: B7 → E7, antal B4; rad 10: B10 → E10, antal B4; rad 11: B11 → E11, antal B4; rad 12: B12 → E12, antal B4; rad 13: B13 → E13, antal B4
- `ungersk-gulaschsoppa`: rad 6: B6 → F6, antal B4; rad 7: B7 → F7, antal B4; rad 8: B8 → F8, antal B4; rad 9: B9 → F9, antal B4; rad 10: B10 → F10, antal B4; rad 11: B11 → F11, antal B4; rad 12: B12 → F12, antal B4; rad 13: B13 → F13, antal B4; rad 14: B14 → F14, antal B4; rad 15: B15 → F15, antal B4; rad 16: B16 → F16, antal B4; rad 17: B17 → F17, antal B4; rad 18: B18 → F18, antal B4; rad 19: B19 → F19, antal B4; rad 20: B20 → F20, antal B4; rad 21: B21 → F21, antal B4; rad 22: B22 → F22, antal B4; rad 23: B23 → F23, antal B4
- `albondigas`: rad 7: B7 → F7, antal B4; rad 8: B8 → F8, antal B4; rad 9: B9 → F9, antal B4; rad 10: B10 → F10, antal B4; rad 11: B11 → F11, antal B4; rad 12: B12 → F12, antal B4; rad 13: B13 → F13, antal B4; rad 14: B14 → F14, antal B4; rad 17: B17 → F17, antal B4; rad 18: B18 → F18, antal B4; rad 19: B19 → F19, antal B4; rad 20: B20 → F20, antal B4; rad 21: B21 → F21, antal B4; rad 22: B22 → F22, antal B4
