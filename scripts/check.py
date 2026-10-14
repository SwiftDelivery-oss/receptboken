"""Bygg och testa både domänrot och GitHub Pages-undermapp."""
from pathlib import Path
import subprocess
import sys

root = Path(__file__).resolve().parents[1]
try:
    for base in ('/', '/receptboken/'):
        subprocess.run([sys.executable, 'scripts/build.py', '--base', base], cwd=root, check=True)
        subprocess.run([sys.executable, '-m', 'unittest', 'discover', '-s', 'tests', '-p', 'test_*.py'], cwd=root, check=True)
        tests = [str(p.relative_to(root)) for p in (root/'tests').glob('*.test.js')]
        subprocess.run(['node', '--test', *tests], cwd=root, check=True)
finally:
    subprocess.run([sys.executable, 'scripts/build.py'], cwd=root, check=True)
