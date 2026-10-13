"""Gemensamma, beroendefria kontroller för publika receptdata."""
import re
import unicodedata

CATEGORIES = ['Bröd', 'Kakor mm', 'Röror', 'Kallskuret', 'Övriga']
MONEY = re.compile(r'\b(?:kr|sek|kronor|kostnad\w*|pris(?:et|er|fält)?|à-pris)\b', re.I)


def slugify(text):
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', text).strip('-')


def assert_no_money(value, path='recept'):
    if isinstance(value, dict):
        for key, item in value.items():
            if MONEY.search(key) or re.search(r'pris|kostnad|price|cost|currency|kronor|(?:^|_)kr(?:$|_)', key, re.I):
                raise ValueError(f'Förbjudet fält i {path}: {key}')
            assert_no_money(item, f'{path}.{key}')
    elif isinstance(value, list):
        for item in value:
            assert_no_money(item, path)
    elif isinstance(value, str) and MONEY.search(value):
        raise ValueError(f'Ekonomisk text i {path}; kontrollera källan.')
