"""Bygg en helt statisk Receptbok med endast Pythons standardbibliotek."""
import argparse
import hashlib
from html import escape as h
import json
import math
from pathlib import Path
import re
import shutil
from common import CATEGORIES, assert_no_money
from recipe_ids import ensure_ids

ROOT = Path(__file__).resolve().parents[1]
BOOK = '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 7C11 3 6 4 3 5v21c5-2 9-1 13 2 4-3 8-4 13-2V5c-3-1-8-2-13 2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M16 7v21M7 10l5 1m-5 4 5 1m8-5 5-1m-5 6 5-1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
ARROW = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
SEARCH = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
LIST = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 5h10v16H5V5h2M9 3h6v4H9zM9 11l1 1 2-2m2 1h2m-7 5 1 1 2-2m2 1h2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
ACTION_PATHS = {
    'print': '<path d="M7 8V3h10v5M7 17H4V9h16v8h-3M7 14h10v7H7zM16 11h1"/>',
    'copy': '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 8V3H3v13h5"/>',
    'share': '<path d="M12 16V3m-4 4 4-4 4 4M6 12H4v9h16v-9h-2"/>',
    'link': '<path d="m10 14 4-4m-6 6-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 2 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0"/>',
    'trash': '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>'
}


def action_icon(kind):
    return '<span class="action-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+ACTION_PATHS[kind]+'</svg></span>'


def shopping_control(recipe, default=1, detail=False):
    return f'<div class="recipe-shopping-control" data-recipe="{recipe["slug"]}" data-default-count="{default}"{(" data-detail=\"true\"" if detail else "")}><button class="add-to-list" type="button" aria-label="Lägg till {h(recipe["titel"],quote=True)} i inköpslistan" disabled>{LIST}</button></div>'


def shopping_content():
    return '''<div class="list-heading"><div><span class="eyebrow">PLANERA BAKNING OCH MATLAGNING</span><h2 id="list-title" tabindex="-1">Din inköpslista</h2></div><button id="list-close" class="list-close" type="button" aria-label="Stäng inköpslistan">×</button></div>
<div class="list-scroll"><section class="list-plan"><h3>Dina recept</h3><p id="shopping-empty-plan">Listan är tom. Lägg till recept med inköpslisteikonen på receptkorten.</p><ul id="shopping-selected" class="shopping-selected"></ul>
<label class="shopping-option"><input id="expand-subrecipes" type="checkbox" checked><span>Ta med ingredienser till delrecept</span></label></section>
<section class="list-result" aria-labelledby="shopping-result-heading"><h3 id="shopping-result-heading">Det här behöver du</h3><p id="shopping-summary" role="status" aria-live="polite"></p><ul id="shopping-items" class="shopping-items"></ul><div id="shopping-warnings" class="shopping-warnings" hidden></div>
<p id="shopping-footnote" class="shopping-footnote" hidden>Mängder som bara står i receptens anteckningar räknas inte med. Kontrollera anteckningarna när du planerar.</p></section></div>
<div class="list-footer"><label class="print-recipes-option"><input id="print-with-recipes" type="checkbox" checked><span>Skriv även ut recepten</span></label>
<div class="list-actions"><div class="list-actions-main">'''+f'''<button id="shopping-print" class="button" disabled>{action_icon('print')}<span>Skriv ut</span></button><button id="shopping-copy" class="button" disabled>{action_icon('copy')}<span>Kopiera</span></button><button id="shopping-share" class="button" disabled>{action_icon('share')}<span>Dela</span></button><button id="shopping-link" class="button" disabled>{action_icon('link')}<span>Kopiera länk</span></button></div><button id="shopping-clear" class="button danger-button" hidden>{action_icon('trash')}<span>Töm listan</span></button></div></div><p id="shopping-status" role="status" aria-live="polite"></p><section id="shopping-print-recipes" class="shopping-print-recipes" aria-label="Valda recept för utskrift"></section>'''


def formatted(amount, u):
    if amount is None: return u or 'Mängd saknas'
    norm = u.strip().lower()
    if norm == 'kg' and 0 < abs(amount) < 1: amount, u = amount*1000, 'g'
    elif norm in {'g','gr'} and abs(amount) >= 1000: amount, u = amount/1000, 'kg'
    precision = max(3, -math.floor(math.log10(abs(amount)))+2) if amount else 3
    value = f'{amount:.{min(precision,12)}f}'.rstrip('0').rstrip('.') if amount else '0'
    return value.replace('.', ',') + (' '+u if u else ' (enhet saknas)')


def validate(r):
    assert_no_money(r)
    if not re.fullmatch('[a-z0-9]+(?:-[a-z0-9]+)*', r['slug']): raise ValueError('Ogiltig slug')
    if r['kategori'] not in CATEGORIES: raise ValueError('Ogiltig kategori')
    if not r['titel'].strip(): raise ValueError('Titel saknas')
    for key in ('basantal','standardantal'):
        if not isinstance(r.get(key,1), (int,float)) or not math.isfinite(r.get(key,1)) or r.get(key,1) <= 0: raise ValueError(f'{key} måste vara positivt')
    if not r['ingredienser']: raise ValueError('Ingredienser saknas')
    for g in r['ingredienser']:
        for ing in g['ingredienser']:
            q = ing['mängd']
            if q is not None and (isinstance(q,bool) or not isinstance(q,(int,float)) or not math.isfinite(q) or q<0): raise ValueError('Ogiltig mängd')
            for field in ('namn','enhet'):
                if not isinstance(ing[field],str): raise ValueError(f'{field} måste vara text')


def build(base, dest):
    if not re.fullmatch(r'/(?:[A-Za-z0-9_-]+/)*', base):
        raise ValueError('--base måste vara / eller en sökväg som /receptboken/')
    if dest.resolve() != (ROOT/'dist').resolve(): raise ValueError('Byggkatalogen måste vara projektets dist/')
    ensure_ids(ROOT/'recept')
    data = []
    for source in sorted((ROOT/'recept').glob('*.json')):
        try:
            recipe = json.loads(source.read_text(encoding='utf-8'))
            validate(recipe)
            data.append(recipe)
        except (ValueError, KeyError, TypeError) as error:
            raise ValueError(f'recept/{source.name}: {error}') from error
    lookup = {r['slug']: r for r in data}
    if len(lookup) != len(data): raise ValueError('Dubblett av slug')
    for r in data:
        for slug in r['delrecept']:
            if slug not in lookup: raise ValueError(f'Delrecept saknas: {slug}')
        for g in r['ingredienser']:
            for ing in g['ingredienser']:
                if ing.get('delrecept') and ing['delrecept'] not in lookup: raise ValueError('Okänd ingredienslänk')
    # Rebuild only this checked output directory; never the JSON sources.
    if dest.exists(): shutil.rmtree(dest)
    dest.mkdir()
    (dest/'assets').mkdir()
    for path in (ROOT/'web').iterdir():
        if path.is_file(): shutil.copyfile(path, dest/'assets'/path.name)
    (dest/'assets/receptdata.json').write_text(json.dumps(data,ensure_ascii=False),encoding='utf-8')
    def url(path=''): return base+path
    def page(title, content, kind='home', embedded=None):
        recipe_nav = f'<a class="header-link" href="{url()}">Alla recept</a>' if kind != 'home' else ''
        shopping_ui = f'<button id="shopping-launcher" class="shopping-launcher" type="button" aria-haspopup="dialog" aria-controls="shopping-dialog" hidden>{LIST}<span>Inköpslista</span><span id="shopping-badge"></span></button><dialog id="shopping-dialog" class="shopping-dialog" aria-labelledby="list-title">{shopping_content()}</dialog><p id="cart-announcement" class="sr-only" role="status" aria-live="polite"></p>' if kind != 'shopping' else '<p id="cart-announcement" class="sr-only" role="status" aria-live="polite"></p>'
        payload = ''
        if embedded is not None:
            payload = '<script type="application/json" id="page-data">'+json.dumps(embedded,ensure_ascii=False).replace('<','\\u003c')+'</script>'
        return f'''<!doctype html>
<html lang="sv"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive"><meta name="theme-color" content="#234b3d">
<meta name="description" content="En personlig samling av recept för bakning och matlagning.">
<meta name="referrer" content="no-referrer"><title>{h(title)} · Receptboken</title>
<link rel="icon" href="{url('assets/icon.svg')}" type="image/svg+xml"><link rel="manifest" href="{url('manifest.webmanifest')}">
<link rel="stylesheet" href="{url('assets/style.css')}"><script type="module" src="{url('assets/app.js')}"></script></head>
<body data-page="{kind}" data-base="{base}"><a class="skip-link" href="#innehall">Hoppa till innehållet</a>
<header class="site-header"><div class="header-inner"><a class="brand" href="{url()}">{BOOK}<span>Receptboken</span></a>
<nav class="header-nav" aria-label="Huvudmeny">{recipe_nav}<a class="header-link" data-open-shopping href="{url('inkopslista/')}">Inköpslista</a></nav></div></header>
<main id="innehall">{content}</main>
<footer class="site-footer"><a class="footer-brand" href="{url()}">{BOOK} Receptboken</a><span>En receptsamling att dela och återvända till.</span>
<span id="offline-status" role="status">Utan cookies eller spårning.</span></footer>{shopping_ui}{payload}</body></html>'''
    cards = []
    category_links = []
    for cat in CATEGORIES:
        count = sum(r['kategori']==cat for r in data)
        category_links.append(f'<a class="category-chip" href="#kategori-{CATEGORIES.index(cat)}" data-category="{h(cat)}">{h(cat)}<span>{count}</span></a>')
    index = []
    for cat in CATEGORIES:
        items = sorted((r for r in data if r['kategori']==cat),key=lambda x: x['titel'].casefold())
        cat_cards = []
        for r in items:
            ings = [i['namn'] for g in r['ingredienser'] for i in g['ingredienser']]
            preview = ' · '.join(x.strip() for x in ings[:3] if x)
            cat_cards.append(f'''<article class="recipe-card" data-slug="{r['slug']}"><a class="recipe-card-link" href="{url('recept/'+r['slug']+'/')}">
<span class="card-category">{h(cat)}</span><h3>{h(r['titel'])}</h3><p>{h(preview)}</p>
</a><div class="card-bottom"><span>{len(ings)} ingredienser</span>{shopping_control(r)}</div></article>''')
            index.append({'slug':r['slug'],'titel':r['titel'],'kategori':cat,'söktext':' '.join([r['titel']]+ings)})
        cards.append(f'<section class="category-section" id="kategori-{CATEGORIES.index(cat)}" data-category="{h(cat)}"><h2 class="category-heading">{h(cat)} <span>{len(items)} recept</span></h2><div class="recipe-grid">'+''.join(cat_cards)+'</div></section>')
    hero = f'''<section class="hero container"><div class="hero-copy"><span class="eyebrow">DEN PERSONLIGA RECEPTSAMLINGEN</span>
<h1>Vad vill du<br><em>laga idag?</em></h1><p>Från nybakat bröd till en god röra.<br>Hitta ett recept och anpassa mängden efter dig.</p>
</div>
<div class="book-art" aria-hidden="true"><div class="book-shadow"></div><div class="book-cover"><span class="book-small">BAKA · LAGA · DELA</span>{BOOK}<span class="book-title">Recept<br>boken</span><span class="book-rule"></span><span class="book-count">{len(data)} recept att återvända till</span></div><span class="book-mark"></span></div></section>'''
    home = hero+f'''<section class="collection container" id="recept"><div class="collection-top"><div><span class="eyebrow">I RECEPTBOKEN</span><h2>Hitta ditt recept</h2></div><span class="collection-count">{len(data)} recept i samlingen</span></div>
<div class="search-box">{SEARCH}<label class="sr-only" for="search">Sök på recept eller ingrediens</label><input id="search" type="search" placeholder="Sök på recept eller ingrediens…" autocomplete="off"><button id="clear-search" class="clear-search" hidden aria-label="Rensa sökningen">×</button></div>
<nav class="categories" aria-label="Receptkategorier"><a href="#recept" class="category-chip active" data-category="" aria-current="true">Alla recept <span>{len(data)}</span></a>{''.join(category_links)}</nav>
<p id="search-status" class="search-status" role="status" aria-live="polite" hidden></p>
<div id="recipe-sections">{''.join(cards)}</div><div id="empty-search" class="empty-search" hidden><h3>Inga recept hittades</h3><p>Prova ett annat namn eller en annan ingrediens.</p><button id="reset-search" class="button">Visa alla recept</button></div>
<noscript><p>Sökningen behöver JavaScript. Alla recept och kategorier finns i listan ovan.</p></noscript></section>'''
    (dest/'index.html').write_text(page('Alla recept', home, embedded=index),encoding='utf-8')
    shopping_html = f'<section class="shopping list-page container">{shopping_content()}<a class="button" href="{url()}">Välj fler recept</a><noscript><p>Aktivera JavaScript för att skapa en inköpslista.</p></noscript></section>'
    shopping_dir = dest/'inkopslista'
    shopping_dir.mkdir()
    (shopping_dir/'index.html').write_text(page('Inköpslista',shopping_html,'shopping',data),encoding='utf-8')
    for r in data:
        count = r.get('standardantal',1)
        u = r['skalningsenhet']
        variants = [g for g in r['ingredienser'] if g.get('variant')]
        selector = ''
        if variants:
            selector = '<div class="variant-control"><label for="variant">Välj variant</label><select id="variant">'+''.join(f'<option value="{h(g["variant"])}">{h(g["rubrik"])}</option>' for g in variants)+'</select></div>'
        groups_html = []
        for gi,g in enumerate(r['ingredienser']):
            variant_attr = f' data-variant="{h(g["variant"])}"' if g.get('variant') else ''
            # Show all variants without JavaScript; the script then selects one.
            lines = []
            for ii,ing in enumerate(g['ingredienser']):
                ingredient_name = h(ing['namn']) if ing['namn'] else '<span class="missing">Ingrediensnamn saknas</span>'
                if ing.get('delrecept'):
                    linked = lookup[ing['delrecept']]
                    quantity = (ing['mängd'] or 0)*count/r['basantal']
                    suffix = '?antal='+str(round(quantity,12)) if ing['enhet'].strip().lower()=='kg' and linked['skalningsenhet']=='kg' and quantity>0 else ''
                    ingredient_name = f'<a class="ingredient-link" data-subrecipe="{ing["delrecept"]}" data-subrecipe-unit="{h(linked["skalningsenhet"])}" href="{url("recept/"+ing["delrecept"]+"/")+suffix}">{ingredient_name}</a>'
                amount = formatted(ing['mängd']*count/r['basantal'] if ing['mängd'] is not None else None,ing['enhet'])
                lines.append(f'<li class="ingredient"><span class="ingredient-name">{ingredient_name}</span><span class="amount" data-group="{gi}" data-ingredient="{ii}">{h(amount)}</span></li>')
            heading = f'<h3>{h(g["rubrik"])}</h3>' if g['rubrik'] else ''
            groups_html.append(f'<section class="ingredient-group"{variant_attr}>{heading}<ul>'+''.join(lines)+'</ul></section>')
        notes = ''.join(f'<p>{h(x)}</p>' for x in r['anteckningar']) or '<p class="muted">Ingen arbetsbeskrivning finns i originalreceptet.</p>'
        links = ''.join(f'<a class="related-link" href="{url("recept/"+slug+"/")}">{h(lookup[slug]["titel"])} {ARROW}</a>' for slug in r['delrecept'])
        related = '<section class="related"><h2>Delrecept</h2>'+links+'</section>' if links else ''
        points = r.get('granskningspunkter',[]) or (['Det här receptet har uppgifter som behöver granskas mot originalet.'] if r.get('granska') else [])
        review = '<aside class="review-note"><h3>Kontrollera receptuppgifterna</h3><ul>'+''.join('<li>'+h(point)+'</li>' for point in points)+'</ul></aside>' if points else ''
        original = ' · '.join(x for x in r.get('originalrubriker',[]) if x.strip().casefold()!=r['titel'].strip().casefold())
        original = f'<p class="original-title">{h(original)}</p>' if original else ''
        size = f' à {h(r["styckstorlek"])}' if r.get('styckstorlek') else ''
        dough = ''
        if r['kategori'] == 'Bröd' and u == 'st':
            first = next((g.get('variant') for g in r['ingredienser'] if g.get('variant')), None)
            ingredients = [i for g in r['ingredienser'] if not g.get('variant') or g.get('variant') == first for i in g['ingredienser']]
            complete = ingredients and all(i['mängd'] is not None and i['enhet'].strip().lower() in {'g','gr','kg'} for i in ingredients)
            weight = sum(i['mängd'] * (1000 if i['enhet'].strip().lower() == 'kg' else 1) for i in ingredients) / r['basantal'] if complete else None
            text = formatted(weight, 'g') + ' (beräknad från ingredienserna)' if complete else 'Kan inte beräknas – mängd eller viktenhet saknas.'
            dough = '<p id="dough-weight" class="dough-weight">Degvikt per styck: '+h(text)+'</p>'
        label = {'st':'Antal','portioner':'Antal portioner','portion':'Antal portioner','kg':'Mängd i kg'}.get(u,'Antal satser')
        recipe_html = f'''<article class="recipe container"><nav class="breadcrumb" aria-label="Brödsmulor"><a href="{url()}">Alla recept</a><span aria-hidden="true">/</span><a href="{url('#kategori-'+str(CATEGORIES.index(r['kategori'])))}">{h(r['kategori'])}</a></nav>
<div class="recipe-heading"><span class="eyebrow">{h(r['kategori'])}</span><h1>{h(r['titel'])}</h1>{original}
<div class="recipe-actions">{shopping_control(r,count,True)}<button class="button" id="share">Dela recept {ARROW}</button><button class="button" id="copy-link">Kopiera länk</button><button class="button" id="print">Skriv ut</button></div><p id="share-status" role="status" aria-live="polite"></p></div>
<div class="recipe-layout"><section class="ingredients-panel"><div class="ingredients-heading"><h2>Ingredienser</h2><span id="yield" class="yield">{h(str(count))} {h(u)}{size}</span></div>
<div class="scaling"><label for="amount">{label}</label><div class="stepper"><button id="decrease" aria-label="Minska antal">−</button><input id="amount" type="text" inputmode="decimal" value="{h(str(count))}" aria-describedby="scaling-help scaling-error" autocomplete="off"><button id="increase" aria-label="Öka antal">+</button></div><p id="scaling-help">Ändra antalet så räknas mängderna om.</p><p id="scaling-error" class="error" role="alert" hidden>Ange ett antal större än 0, högst 1 000 000.</p>{selector}</div>
{dough}{''.join(groups_html)}<noscript><p>Aktivera JavaScript för att ändra antalet. Listan visar {count} {h(u)}. Alla alternativa tabeller visas.</p></noscript></section>
<div class="method-column"><section class="method"><span class="eyebrow">I KÖKET</span><h2>Anteckningar &amp; instruktioner</h2><div class="notes">{notes}</div></section>{related}{review}</div></div>
<div class="back-to-recipes"><a href="{url('#recept')}">← Tillbaka till alla recept</a></div></article>'''
        target = dest/'recept'/r['slug']
        target.mkdir(parents=True)
        (target/'index.html').write_text(page(r['titel'],recipe_html,'recipe',r),encoding='utf-8')
        (dest/'recept'/(r['slug']+'.json')).write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    (dest/'404.html').write_text(page('Sidan hittades inte','<section class="container not-found"><h1>Sidan hittades inte</h1><p>Receptet kan ha flyttats. Du hittar alla recept i samlingen.</p><a class="button" href="'+url()+'">Öppna Receptboken</a></section>'),encoding='utf-8')
    manifest = {'name':'Receptboken','short_name':'Receptboken','lang':'sv','id':base,'start_url':base,'scope':base,'display':'standalone','background_color':'#faf8f2','theme_color':'#234b3d','icons':[{'src':url('assets/icon-192.png'),'sizes':'192x192','type':'image/png','purpose':'any'},{'src':url('assets/icon-512.png'),'sizes':'512x512','type':'image/png','purpose':'any maskable'}]}
    (dest/'manifest.webmanifest').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
    (dest/'robots.txt').write_text('User-agent: *\nDisallow: /\n',encoding='utf-8')
    (dest/'.nojekyll').touch()
    files = sorted(p for p in dest.rglob('*') if p.is_file())
    digest = hashlib.sha256()
    for p in files:
        digest.update(p.relative_to(dest).as_posix().encode()); digest.update(p.read_bytes())
    urls = [url(p.relative_to(dest).as_posix()) for p in files if p.name not in {'robots.txt','.nojekyll','404.html'}]
    # Include directory URLs so offline navigation works without server redirects.
    urls += [base,url('inkopslista/')]+[url('recept/'+r['slug']+'/') for r in data]
    sw = (ROOT/'templates/service-worker.js').read_text(encoding='utf-8').replace('__CACHE__',json.dumps('receptboken-'+hashlib.sha256(base.encode()).hexdigest()[:8]+'-'+digest.hexdigest()[:16])).replace('__BASE__',json.dumps(base)).replace('__FILES__',json.dumps(urls,ensure_ascii=False))
    (dest/'sw.js').write_text(sw,encoding='utf-8')
    print(f'Byggt {len(data)} recept i {dest}, basadress {base}')


if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--base',default='/')
    args = p.parse_args()
    build(args.base, ROOT/'dist')
