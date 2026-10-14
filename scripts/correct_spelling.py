"""Rätta granskade stavfel utan att ändra receptmängder, ID eller adresser."""
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
REPLACEMENTS = {
    'Baugetter':'Baguetter', 'Tebaguegette':'Tebaguette', 'Polynerer':'Polynéer',
    'Italenskt':'Italienskt', 'Gotlänskt':'Gotländskt', 'vofflor':'våfflor',
    'Vetamjöl':'Vetemjöl', 'Rågmjlö':'Rågmjöl', 'Vitlkål':'Vitkål',
    'Morötter':'Morötter', 'Morätter':'Morötter', 'Persillja':'Persilja',
    'Homung':'Honung', 'Ingerfära':'Ingefära', 'Aprekos':'Aprikos',
    'Pyslliumfröskal':'Psylliumfröskal', 'Bakpullver':'Bakpulver',
    'Hjortonsalt':'Hjorthornssalt', 'Dionsenap':'Dijonsenap',
    'Philidelfiaost':'Philadelphiaost', 'philiefiaost':'Philadelphiaost',
    'Philadelfia':'Philadelphia', 'Majonäs':'Majonnäs', 'Majsena':'Maizena',
    'Majzena':'Maizena', 'Crabbsticks':'Crabsticks', 'Socket':'Socker',
    'Cremfrach':'Crème fraiche', 'Creme Fraiche':'Crème fraiche',
    'Svartpepper':'Svartpeppar', 'Vanljkrämen':'Vaniljkrämen',
    'Masarin massa':'Mazarinmassa', 'Massarin massa':'Mazarinmassa',
    'Massariner':'Mazariner', 'massariner':'mazariner',
    'Skollning':'Skållning', 'skollat':'skållat', 'skjuda':'sjuda',
    'tempraturen':'temperaturen', 'ytligare':'ytterligare', 'tvina':'tvinna',
    'varluft':'varmluft', 'diamerter':'diameter', 'Garam Marsala':'Garam masala',
    'Ägg gula':'Äggula', 'Ägg vita':'Äggvita', 'ägg halva':'ägghalva',
    'Vit lök':'Vitlök', 'vitlöks klyftor':'vitlöksklyftor', 'vitlök klyftor':'vitlöksklyftor',
    'Citron koncentrat':'Citronkoncentrat', 'Mjölk pulver':'Mjölkpulver',
    'Vanilj pulver':'Vaniljpulver', 'Yoghurt pulver':'Yoghurtpulver',
    'Råg kross':'Rågkross', 'Torr jäsT':'Torrjäst', 'Torr jäst':'Torrjäst',
    'Jäst torr':'Torrjäst', 'ljussirap':'ljus sirap', 'Sparris spad':'Sparrisspad',
    'Skaldjurs paté':'Skaldjurspaté', 'Peppar salami':'Pepparsalami',
    'Persilja kvist':'Persiljekvist', 'Tomat klyfta':'Tomatklyfta',
    'Paprika strimla':'Paprikastrimla', 'fin hackad':'finhackad',
    'Finger varm':'Fingervarm', 'Italiensksalladskrydda':'Italiensk salladskrydda',
    'Brioche bröd':'Briochebröd', 'Hallon grotta':'Hallongrotta',
    'Kongress massa':'Kongressmassa', 'Legym sallad':'Legymsallad',
    'Lyx tallrik':'Lyxtallrik', 'Pepparkaks deg':'Pepparkaksdeg',
    'Pizza deg':'Pizzadeg', 'Russin plättar':'Russinplättar', 'Skink röra':'Skinkröra',
    'Ägg-räk röra':'Ägg- och räkröra', 'skagernröra':'Skagenröra',
    'Grädde':'Grädde', 'Grädde':'Grädde', 'Boston gurka':'Bostongurka',
    'Lax röra':'Laxröra', 'Kyckling  röra':'Kycklingröra',
    'varm luft':'varmluft', 'saffrans deg':'saffransdeg', 'deg vätska':'degvätska',
    'Inne temp':'Innertemperatur', 'torr kryddor':'torra kryddor',
    'Bland allt':'Blanda allt', 'bakas lättast':'bakas lättast',
}
REPLACEMENTS = {a:b for a,b in REPLACEMENTS.items() if a!=b}


def correct(text):
    for before, after in sorted(REPLACEMENTS.items(), key=lambda pair:-len(pair[0])):
        def replace(match):
            old=match.group()
            if old.isupper(): return after.upper()
            if old.islower(): return after.lower()
            return after
        text=re.sub(r'(?<!\w)'+re.escape(before)+r'(?!\w)',replace,text,flags=re.I)
    return text.strip()


def main():
    changes=[]
    for path in sorted((ROOT/'recept').glob('*.json')):
        recipe=json.loads(path.read_text(encoding='utf-8'))
        before=json.dumps(recipe,ensure_ascii=False)
        def field(obj,key,location):
            old=obj[key];new=correct(old)
            if path.stem=='havreflan' and key=='titel':new='Havreflarn'
            if new!=old:
                changes.append((path.name,location,old,new));obj[key]=new
        field(recipe,'titel','titel')
        for index,group in enumerate(recipe['ingredienser']):
            field(group,'rubrik',f'grupp {index+1}')
            for ingredient in group['ingredienser']:
                field(ingredient,'namn','ingrediens')
        for key in ['anteckningar','originalrubriker']:
            for index,text in enumerate(recipe.get(key,[])):
                item={'text':text};field(item,'text',key);recipe[key][index]=item['text']
        recipe['granskningspunkter']=[point for point in recipe.get('granskningspunkter',[]) if not (point.startswith('Misstänkt stavning') and any(re.search(re.escape(word),point,re.I) for word in REPLACEMENTS))]
        if path.stem=='havreflan':
            point='Ingrediensen ”Havreflan” behöver identifieras. Bekräfta om originalet avser havregryn eller något annat; ingen ingrediens har ersatts på antagande.'
            if point not in recipe['granskningspunkter']:recipe['granskningspunkter'].append(point)
        recipe['granska']=bool(recipe.get('granskningspunkter'))
        if json.dumps(recipe,ensure_ascii=False)!=before:
            path.write_text(json.dumps(recipe,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    if changes:
        report=['# Rättade stavfel','', 'Mängder, enheter, ID:n, slugs och delreceptslänkar är oförändrade. Excel-originalet och den historiska konverteringsrapporten är bevarade.','', '| Receptfil | Fält | Före | Efter |','|---|---|---|---|']
        for file,field,old,new in changes:
            report.append('| '+' | '.join(x.replace('|','\\|').replace('\n',' / ') for x in [file,field,old,new])+' |')
        report += ['', '## Kvar att bekräfta','', '- Havreflan som ingrediens: exakt råvara är oklar. Recepttiteln har rättats till Havreflarn.', '- Oklara förkortningar och produktbeteckningar, exempelvis Karite, Natriumb och Matyoghurt H1, är inte utvidgade på antagande.', '', 'Polynéer har kontrollerats mot [Institutet för språk och folkminnen](https://www.isof.se/dialekter/pa-gang/dialektbloggen/inlagg/2015-07-01-kejsarkronor-polyneer-och-larkor-fran-leipzig).']
        report_path=ROOT/'stavningsrattningar.md'
        if report_path.exists():
            old=report_path.read_text(encoding='utf-8')
            rows='\n'.join(report[6:6+len(changes)])+'\n'
            report_path.write_text(old.replace('## Kvar att bekräfta',rows+'\n## Kvar att bekräfta'),encoding='utf-8')
        else:report_path.write_text('\n'.join(report)+'\n',encoding='utf-8')
    print(f'{len(changes)} texter rättade i {len(set(c[0] for c in changes))} recept.')


if __name__=='__main__':main()
