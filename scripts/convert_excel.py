"""Konvertera heterogena Excel-recept. Originalfilen ändras aldrig.

Mängdkolumn och skalningscell upptäcks genom formlernas referenser, inte en
fast kolumnmall. Endast receptinnehåll kopieras: ingen rå cellmatris exporteras.
ArrayFormula.text stöds. Formler körs aldrig med eval.
"""
import argparse
import ast
from collections import Counter
import json
from pathlib import Path
import re
import openpyxl
from openpyxl.utils import get_column_letter
from common import CATEGORIES, MONEY, assert_no_money, slugify

SKIP = {'antal att baka', 'Sheet1', 'Röror', 'Kallskurat 1', 'Kakor mm'}
UNITS = {'kg', 'g', 'gr', 'l', 'liter', 'dl', 'cl', 'ml', 'st', 'msk', 'tsk', 'klyfta', 'skivor', '1/2st'}
TOTAL = re.compile(r'^(?:total\w*|summa\w*|tolal)\b', re.I)
REF = re.compile(r"(?:(?:'(?P<quoted>[^']+)'|(?P<sheet>[\w åäöÅÄÖ.]+))!)?(?P<cell>\$?[A-Z]{1,3}\$?\d+)")
# Evidensbaserade undantag: dessa fyra flikar beskriver viktbaserade delrecept.
SUB_TOTALS = {'Skollning rågmjöl fint': 'D9', 'Skollning': 'D9', 'Surdeg vete': 'C8', 'Surdeg råg': 'C9'}
# Alternativa tabeller, inte ingredienser som ska blandas ihop.
VARIANTS = {'Pizza deg': [(5, 'Tipo "00"'), (12, 'Vetemjöl Special')],
            'Kyckling  röra': [(6, 'KYCKLINGRÖRA MED CURRY'), (21, '1 omg= 1 sandwich')],
            'Lyx tallrik': [(6, '(landgångsform)'), (18, '(rund form)')]}
LINK_ALIASES = {'surdeg på vete': 'Surdeg vete', 'skollat rågmjöl fint': 'Skollning rågmjöl fint',
                'curry majonäs': 'curry'}
SUSPECT = ['Baugetter', 'Polynerer', 'Tebaguegette', 'Italenskt', 'Homung', 'Ingerfära',
           'Socket', 'Rågmjlö', 'Pysllium', 'Vetamjöl', 'Bakpullver', 'Hjortonsalt',
           'Dionsenap', 'Philidelfia', 'Vitlkål', 'Aprekos', 'massariner', 'skagern', 'vofflor']


def formula(cell):
    return getattr(cell.value, 'text', cell.value) if cell.data_type == 'f' else None


def number(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool)


def unit(value):
    return isinstance(value, str) and value.strip().lower() in UNITS


class FormulaReader:
    """Begränsad aritmetik, SUM/PRODUCT och cellreferenser med cirkelskydd."""
    def __init__(self, values, formulas, overrides=None):
        self.values, self.formulas = values, formulas
        self.overrides = overrides or {}
        self.active = set()

    def read(self, sheet, address):
        address = address.replace('$', '')
        key = (sheet, address)
        if key in self.overrides:
            return self.overrides[key]
        if key in self.active:
            raise ValueError('Cirkulär formel')
        c = self.formulas[sheet][address]
        f = formula(c)
        if not f:
            if not number(c.value):
                raise ValueError('Ingen numerisk mängd')
            return c.value
        self.active.add(key)
        try:
            # Ranges expand only in a SUM/PRODUCT context.
            expr = f.lstrip('=')
            expr = re.sub(r'(\$?[A-Z]+\$?\d+):(\$?[A-Z]+\$?\d+)',
                          lambda m: ','.join(x.coordinate for row in self.formulas[sheet][m[0].replace('$', '')] for x in row), expr)
            env = {}
            def replace(m):
                name = f'v{len(env)}'
                target = m['quoted'] or m['sheet'] or sheet
                env[name] = self.read(target, m['cell'])
                return name
            expr = REF.sub(replace, expr)
            return self.walk(ast.parse(expr, mode='eval').body, env)
        finally:
            self.active.remove(key)

    def walk(self, node, env):
        if isinstance(node, ast.Constant) and number(node.value):
            return node.value
        if isinstance(node, ast.Name) and node.id in env:
            return env[node.id]
        if isinstance(node, ast.UnaryOp) and isinstance(node.op, (ast.USub, ast.UAdd)):
            return (-1 if isinstance(node.op, ast.USub) else 1) * self.walk(node.operand, env)
        if isinstance(node, ast.BinOp):
            a, b = self.walk(node.left, env), self.walk(node.right, env)
            if isinstance(node.op, ast.Add): return a + b
            if isinstance(node.op, ast.Sub): return a - b
            if isinstance(node.op, ast.Mult): return a * b
            if isinstance(node.op, ast.Div): return a / b
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name):
            args = [self.walk(x, env) for x in node.args]
            if node.func.id.upper() == 'SUM': return sum(args)
            if node.func.id.upper() == 'PRODUCT':
                result = 1
                for arg in args: result *= arg
                return result
        raise ValueError('Formeltypen stöds inte')


def products(sheet):
    rows = {}
    for row in sheet:
        for c in row:
            f = formula(c)
            if not f or '!' in f: continue
            clean = f.upper().replace('$', '').replace(' ', '')
            clean = re.sub(r'^=SUM\((.*)\)$', r'=\1', clean)
            m = re.fullmatch(r'=([A-Z]+\d+)\*([A-Z]+\d+)', clean)
            if not m: continue
            a, b = (sheet[x] for x in m.groups())
            if a.row == c.row and b.row < c.row:
                rows[c.row] = (a, b, c)
            elif b.row == c.row and a.row < c.row:
                rows[c.row] = (b, a, c)
    return rows


def categories(values, names, issues):
    mapping = {}
    by_normal = {x.strip().casefold(): x for x in names}
    current = 'Bröd'
    for row in values['antal att baka']:
        val = row[1].value if len(row) > 1 else None
        if not isinstance(val, str): continue
        val = val.strip()
        if val == 'Kallskurat': current = 'Kallskuret'; continue
        if val in CATEGORIES and (val.casefold() not in by_normal or row[4].value == 'Antal st.'):
            current = val; continue
        name = re.sub(r' \(portioner\)$', '', val).casefold()
        matched = by_normal.get(name)
        if not matched:
            # Two spelling differences have direct cell-reference evidence.
            aliases = {'tebaguette': 'Tebaguegette', 'gotlänskt slagbröd': 'Gotländskt slagbröd'}
            matched = aliases.get(name)
            if matched: issues[matched].append(f'Kategorin hämtad via avvikande namn ”{val}” i beställningsfliken.')
        if matched: mapping[matched] = current
    return mapping


def convert(path, out, report, source_name=None):
    values = openpyxl.load_workbook(path, data_only=True)
    formulas = openpyxl.load_workbook(path, data_only=False)
    names = [x for x in values.sheetnames if x not in SKIP]
    issues = {x: [] for x in names}
    cats = categories(values, names, issues)
    recipes, layouts, audit = [], Counter(), {}
    for name in names:
        s, fs = values[name], formulas[name]
        warnings = issues[name]
        summary_col = min((c.column for row in s for c in row if c.value == 'Sammanställning'), default=s.max_column+1)
        pairs = products(fs)
        lanes = Counter((a.column, z.column) for a, _, z in pairs.values())
        main_lane = lanes.most_common(1)[0][0] if lanes else None
        pairs = {r: p for r, p in pairs.items() if (p[0].column, p[2].column) == main_lane}
        control = Counter(p[1].coordinate for p in pairs.values()).most_common(1)
        ctrl = control[0][0] if control else None
        if main_lane: layouts[f'{get_column_letter(main_lane[0])} → {get_column_letter(main_lane[1])}'] += 1
        else: layouts['Formelstyrt delrecept'] += 1
        reader = FormulaReader(values, formulas, {(name, ctrl): 1} if ctrl else {})
        rows = {}
        used = set()
        quantity_audit = []
        extra_notes = []
        for r, (base, ctl, scaled) in pairs.items():
            # Name is a literal text cell on the same row, excluding all units.
            text_cells = [c for c in s[r] if isinstance(c.value, str) and c.value.strip()
                          and c.column < summary_col
                          and not unit(c.value) and not c.value.startswith('#')
                          and not MONEY.search(c.value) and not formula(fs[c.coordinate])]
            if any(TOTAL.match(c.value.strip()) for c in text_cells): continue
            if not text_cells and base.value is None and not formula(base): continue  # empty template row
            title_cell = text_cells[0] if text_cells else None
            try:
                amount = reader.read(name, base.coordinate)
            except (ValueError, ZeroDivisionError, SyntaxError, KeyError):
                amount = None
                warnings.append(f'{base.coordinate}: basmängden kunde inte räknas ut; lämnad tom.')
            u = s.cell(r, base.column + 1).value
            u = u if unit(u) else ''
            su = s.cell(r, scaled.column + 1).value
            if not u and unit(su): u = su
            if u and unit(su) and u.strip().lower() != su.strip().lower():
                warnings.append(f'Rad {r}: olika enheter i bas och uppskalning ({u} / {su}). Basenheten behållen.')
            if not u: warnings.append(f'Rad {r}: enhet saknas; ingen enhet gissad.')
            if not title_cell: warnings.append(f'Rad {r}: ingrediensnamn saknas. Mängden har behållits med tomt namn.')
            ing = {'mängd': round(amount, 12) if amount is not None else None, 'enhet': u, 'namn': title_cell.value if title_cell else ''}
            rows[r] = ing
            quantity_audit.append({'rad': r, 'bas': base.coordinate, 'skalad': scaled.coordinate, 'styrning': ctl.coordinate})
            used.update(c.coordinate for c in s[r] if c.column <= max(scaled.column + 1, (title_cell.column if title_cell else 0)))
            if title_cell:
                for extra in text_cells[1:]:
                    if not MONEY.search(extra.value):
                        extra_notes.append(extra.value)
                        warnings.append(f'{extra.coordinate}: extra text finns på ingrediensraden; bevarad i anteckningar.')
            if u.strip().lower() == 'st' and amount is not None and 0 < amount < .02:
                warnings.append(f'Rad {r}: liten mängd {amount:g} st för ”{ing["namn"]}”; kontrollera enheten.')
        # Weight-based subrecipes: normalize proportions to exactly one kg.
        if name in SUB_TOTALS:
            total = SUB_TOTALS[name]
            reader = FormulaReader(values, formulas, {(name, total): 1})
            if name == 'Skollning':
                bread_pairs = products(formulas['Rågsiktskaka'])
                overrides = {('Rågsiktskaka', p[1].coordinate): 1 for p in bread_pairs.values()}
                bread_reader = FormulaReader(values, formulas, overrides)
                weights = {c.coordinate: bread_reader.read(name, c.coordinate) for row in s for c in row
                           if formula(fs[c.coordinate]) and c.coordinate != total}
                weights = {k: v/sum(weights.values()) for k,v in weights.items()}
            for row in s:
                label = next((c for c in row if isinstance(c.value, str) and c.value.strip()
                              and not unit(c.value) and not TOTAL.match(c.value.strip()) and c.column == 2), None)
                q = next((c for c in row if formula(fs[c.coordinate]) and c.coordinate != total), None)
                if not label or not q: continue
                try:
                    amount = weights[q.coordinate] if name == 'Skollning' else reader.read(name, q.coordinate)
                except (ValueError, ZeroDivisionError, SyntaxError, KeyError):
                    amount = None
                    warnings.append(f'{q.coordinate}: delreceptets proportion kunde inte tolkas; mängden är tom.')
                rows[label.row] = {'mängd': round(amount, 12) if amount is not None else None, 'enhet': 'kg', 'namn': label.value}
                used.update(c.coordinate for c in row)
                quantity_audit.append({'rad': label.row, 'normaliserad': q.coordinate, 'total': total})
            warnings.append('Delrecept normaliserat till 1 kg med formelns proportioner. Kontrollera att detta är önskad skalningsenhet.')
            if name == 'Skollning': warnings.append('Proportionerna hämtas från Rågsiktskaka. Ingen koppling till Vörtlimpas lokala skållning har antagits.')
        if not rows:
            warnings.append('Inga ingredienser kunde tolkas.')
        first, last = (min(rows), max(rows)) if rows else (fs.max_row + 1, 0)
        # Unscaled, isolated quantities (e.g. Ishavsröra's separate shrimp line).
        name_col = Counter(s[r][next((i for i,c in enumerate(s[r]) if c.value == x['namn']), 0)].column for r,x in rows.items() if x['namn']).most_common(1)
        nc = name_col[0][0] if name_col else 4
        for row in s:
            r = row[0].row
            if r in rows: continue
            label = s.cell(r, nc)
            if not isinstance(label.value, str) or not label.value.strip() or unit(label.value) or MONEY.search(label.value) or TOTAL.match(label.value.strip()): continue
            adjacent = s.cell(r, nc + 1)
            if number(adjacent.value) and unit(s.cell(r, nc + 2).value) and not formula(fs[adjacent.coordinate]):
                rows[r] = {'mängd': adjacent.value, 'enhet': s.cell(r, nc + 2).value, 'namn': label.value}
                used.update(c.coordinate for c in row if c.column <= nc + 2)
                warnings.append(f'Rad {r}: separat mängd utan skalningsformel ({label.value}). Behållen som basmängd; måste granskas.')
            elif first <= r <= last + 1 and r != (fs[ctrl].row if ctrl else -1):
                left = s.cell(r, nc-1).value if nc > 1 else None
                if left == 'efter smak' or (not any(number(c.value) or formula(fs[c.coordinate]) for c in row) and len(label.value) < 35 and ':' not in label.value and r == last + 1):
                    rows[r] = {'mängd': None, 'enhet': left if left == 'efter smak' else '', 'namn': label.value}
                    used.update(c.coordinate for c in row)
                    if left != 'efter smak': warnings.append(f'Rad {r}: ”{label.value}” har ingen mängd; lämnad tom.')
        first, last = (min(rows), max(rows)) if rows else (first, last)
        groups, notes, headers = [], [], []
        group = {'rubrik': '', 'ingredienser': []}
        groups.append(group)
        variants = VARIANTS.get(name, [])
        variant_rows = dict(variants)
        for r in range(1, fs.max_row + 1):
            texts = [c for c in s[r] if isinstance(c.value, str) and c.value.strip() and c.coordinate not in used
                     and not formula(fs[c.coordinate]) and not MONEY.search(c.value)
                     and not unit(c.value) and not TOTAL.match(c.value.strip()) and not c.value.startswith('#')
                     and c.column < summary_col
                     and c.column <= (max(main_lane[1]+2, nc) if main_lane else 4)]
            # Never copy cost-only headers, Excel references or calculated summaries.
            texts = [c for c in texts if not re.search(r"!\$?[A-Z]+\d+", c.value) and c.value.strip().lower() not in {'per portion','enhet','ingrediens','antal bröd'}]
            if r in variant_rows:
                group = {'rubrik': variant_rows[r], 'variant': str(len([g for g in groups if 'variant' in g])+1), 'ingredienser': []}
                groups.append(group)
                texts = [c for c in texts if c.value != variant_rows[r]]
            if r in rows:
                # End an early subsection after a blank separator without inventing a heading.
                if group['ingredienser'] and group['rubrik'] and not variants and r - previous_ing > 1 and not between_heading:
                    group = {'rubrik': '', 'ingredienser': []}; groups.append(group)
                group['ingredienser'].append(rows[r])
                previous_ing, between_heading = r, False
            else:
                text = '\n'.join(c.value for c in texts)
                if not text: continue
                is_scale = ctrl and r == fs[ctrl].row
                if is_scale:
                    headers.extend(c.value for c in texts if c.value.strip().lower() not in {'st','sats','portion','portioner'})
                    continue
                future_ing = any(rr > r for rr in rows)
                is_section = first-1 <= r < last and future_ing and len(text) < 100 and not re.search(r'blanda|grädda|koka|OBS|\bmin\b|\bgrader\b|surdegen', text, re.I)
                if is_section and not variants:
                    group = {'rubrik': text, 'ingredienser': []}; groups.append(group); between_heading = True
                elif r < first: headers.extend(c.value for c in texts)
                else: notes.extend(c.value for c in texts)
        groups = [g for g in groups if g['ingredienser']]
        notes = list(dict.fromkeys(extra_notes + notes))
        if variants: warnings.append('Alternativa tabeller visas som valbara varianter. Granska basantal och vilka anteckningar som hör till respektive variant.')
        scaling_unit = 'kg' if name in SUB_TOTALS else 'sats'
        size = ''
        default = 1
        if ctrl:
            cc = s[ctrl]
            uv = s.cell(cc.row, cc.column+1).value
            if isinstance(uv, str) and uv.strip().lower() in {'st','sats','portion','portioner'}: scaling_unit = uv.strip().lower()
            elif cats.get(name) == 'Bröd':
                scaling_unit = 'st'
                if isinstance(uv, str) and re.fullmatch(r'\d+\s*g', uv.strip(), re.I): size = uv
                else: warnings.append('Skalning tolkad som st från brödkategorin; antal per sats bör granskas.')
            else: warnings.append('Skalning benämns sats eftersom en tydlig enhet saknas. Granska utbytet.')
            if number(cc.value) and cc.value > 0 and not formula(fs[ctrl]): default = cc.value
        if name not in cats:
            warnings.append('Kategorin saknas i beställningsfliken; placerad i Övriga.')
        if not notes: warnings.append('Arbetsbeskrivning saknas i filen; ingen text har hittats på.')
        distinct_headers = [x for x in headers if x != name]
        meaningful_headers = [x for x in distinct_headers if x.strip().casefold() != name.strip().casefold()]
        if meaningful_headers: warnings.append('Avvikande/extra rubriktext bevarad: '+ ' / '.join(meaningful_headers))
        if name == 'biffgryta': warnings.append('Originalet säger ”1 portion = 4 portioner”. Skalningen följer en original-sats; utbytet är osäkert.')
        if name == 'Tonfisk': warnings.append('En separat 1/4-sats finns som fritext. Den skalas inte och skiljer sig delvis från huvudtabellen.')
        if name == 'Pasta kyckling': warnings.append('Dressingens mängder står i fritext och skalas inte automatiskt.')
        if name == 'Ishavsröra': warnings.append('MAJZENA BLANDNING är bevarad som separat delsektion. Kontrollera hur den används i huvudtabellens Majzena; inget automatiskt utbyte har antagits.')
        text = json.dumps([name, rows, notes], ensure_ascii=False)
        for word in SUSPECT:
            if word.casefold() in text.casefold(): warnings.append(f'Misstänkt stavning ”{word}”. Originalet är inte rättat.')
        recipe = {'slug': slugify(name), 'titel': name, 'kategori': cats.get(name, 'Övriga'),
                  'ingredienser': groups, 'basantal': 1, 'skalningsenhet': scaling_unit,
                  'standardantal': default, 'styckstorlek': size, 'originalrubriker': distinct_headers,
                  'anteckningar': notes, 'delrecept': [], 'granska': bool(warnings)}
        recipes.append(recipe)
        audit[recipe['slug']] = quantity_audit
    # Exact matches and documented aliases only; ambiguous matches stay in report.
    lookup = {r['titel'].strip().casefold(): r['slug'] for r in recipes}
    for r in recipes:
        links = set()
        for group in r['ingredienser']:
            for ing in group['ingredienser']:
                key = ing['namn'].strip().casefold()
                target = lookup.get(key) or lookup.get(LINK_ALIASES.get(key, '').casefold())
                if key == 'surdeg' and r['titel'].strip() in {'Grekiskt lantbröd', 'Italenskt lantbröd'}:
                    target = lookup['surdeg vete']
                    issues[r['titel']].append('”Surdeg” länkas till Surdeg vete med stöd av beställningsflikens J7-formel.')
                if target and target != r['slug']:
                    ing['delrecept'] = target; links.add(target)
                if key in {'potatissallad','ishavssallad m räkor','masarin massa'}:
                    issues[r['titel']].append(f'Delrecept för ”{ing["namn"]}” är inte entydigt identifierat; ingen länk gissad.')
        # Literal cross-sheet note in Pajdeg links to an existing recipe.
        if r['titel'] == 'Pajdeg':
            links.add(lookup['kongress massa'])
            issues[r['titel']].append('D16 innehåller en trasig Excel-referens till Kongress massa. Ersatt med en riktig delreceptslänk; inte publicerad som instruktion.')
        r['delrecept'] = sorted(links)
        r['granska'] = bool(issues[r['titel']])
        r['granskningspunkter'] = list(dict.fromkeys(issues[r['titel']]))
        assert_no_money(r)
    out.mkdir(parents=True, exist_ok=True)
    for r in recipes:
        target = out / (r['slug']+'.json')
        if target.exists(): raise FileExistsError(f'{target} finns redan. Använd en ny --out-mapp för att skydda manuella ändringar.')
    for r in recipes:
        previous = Path(__file__).resolve().parents[1]/'recept'/(r['slug']+'.json')
        if previous.exists():
            previous_data = json.loads(previous.read_text(encoding='utf-8'))
            if previous_data.get('id') is not None: r['id'] = previous_data['id']
        (out/(r['slug']+'.json')).write_text(json.dumps(r, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    from recipe_ids import ensure_ids
    ensure_ids(out)
    formula_count = Counter(type(c.value).__name__ for s in formulas for row in s for c in row if c.data_type == 'f')
    source_name = source_name or path.name
    lines = ['# Konverteringsrapport', '', f'Källa: {source_name}. Originalfilen har inte ändrats.', '',
             f'{len(values.sheetnames)} flikar, {len(recipes)} recept. Uteslutna översikter: '+', '.join(sorted(SKIP))+'.',
             f'Formler: {sum(formula_count.values())}, varav {formula_count["ArrayFormula"]} arrayformler.', '',
             '## Struktur och metod', '', 'Upptäckta mängdlayoutvarianter:']
    lines += [f'- {k}: {v} recept.' for k,v in layouts.items()]
    lines += ['', 'Mängder sparas per 1 st/sats/portion eller per 1 kg delrecept. Multiplikatorer från beställningsflikar används aldrig som basmängder. Numerisk bascell läses först, stödd aritmetik beräknas vid behov. Arrayformler läses via text. Okända formeltyper och luckor markeras. Ingen ekonomisk cellmatris exporteras. Alla pris- och kostnadskolumner, ekonomiska texter och totalrader är borttagna.', '',
              'Fliknamnet används som stabil recepttitel. Andra rubriker i cellerna bevaras separat. Textens stavning och blanksteg har inte rättats.', '',
              '## Granska manuellt', '', f'{sum(bool(x) for x in issues.values())} recept har minst en granskningspunkt. Även saknad arbetsbeskrivning och skillnader i rubrik räknas. Prioritera okända ingredienser/enheter och alternativa tabeller.', '']
    for r in recipes:
        if not issues[r['titel']]: continue
        lines += [f'### {r["titel"]}', '', f'JSON: `recept/{r["slug"]}.json`', '']
        lines += ['- '+x for x in dict.fromkeys(issues[r['titel']])]
        lines.append('')
    lines += ['## Formelspårning (endast ingrediensmängder)', '', 'Bas- och skalningscell per ingrediens, för jämförelse med Excel. Inga ekonomiska värden eller formler ingår.', '']
    for slug, rows in audit.items():
        lines.append(f'- `{slug}`: '+ '; '.join(f'rad {x["rad"]}: '+(f'{x["bas"]} → {x["skalad"]}, antal {x["styrning"]}' if 'bas' in x else f'{x["normaliserad"]}, normalisering mot {x["total"]}') for x in rows))
    report.write_text('\n'.join(lines)+'\n', encoding='utf-8')
    print(f'{len(recipes)} recept skrivna till {out}. {sum(bool(x) for x in issues.values())} behöver granskas. Rapport: {report}')


if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('excel', type=Path)
    p.add_argument('--out', type=Path, default=Path('recept'))
    p.add_argument('--report', type=Path, default=Path('konvertering-rapport.md'))
    p.add_argument('--source-name', help='Visningsnamn i rapporten om filen har ett tekniskt bilagenamn')
    args = p.parse_args()
    convert(args.excel, args.out, args.report, args.source_name)
