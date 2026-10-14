import json
from pathlib import Path
import sys
import tempfile
import unittest
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from recipe_ids import ensure_ids

class RecipeIds(unittest.TestCase):
    def test_ids_survive_rename_addition_and_deletion(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);directory=root/'recept';directory.mkdir()
            def write(name,data):
                (directory/(name+'.json')).write_text(json.dumps(data),encoding='utf-8')
            write('a',{'slug':'a'});write('b',{'slug':'b'})
            ensure_ids(directory)
            a=json.loads((directory/'a.json').read_text());b=json.loads((directory/'b.json').read_text())
            self.assertEqual((a['id'],b['id']),(1,2))
            (directory/'b.json').unlink();write('b',{'slug':'b'})
            ensure_ids(directory)
            self.assertEqual(json.loads((directory/'b.json').read_text())['id'],3)
            a['slug']='nytt-namn';(directory/'a.json').unlink();write('nytt-namn',a)
            ensure_ids(directory);ensure_ids(directory)
            self.assertEqual(json.loads((directory/'nytt-namn.json').read_text())['id'],1)
            self.assertEqual(set(json.loads((root/'recept-id-register.json').read_text())['reserverade']),{'1','2','3'})
            write('återanvänd',{'slug':'återanvänd','id':2})
            with self.assertRaises(ValueError):ensure_ids(directory)
    def test_duplicate_and_changed_ids_are_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            directory=Path(tmp)/'recept';directory.mkdir()
            file=directory/'a.json';file.write_text('{"slug":"a"}')
            ensure_ids(directory);file.write_text('{"slug":"a","id":2}')
            with self.assertRaises(ValueError):ensure_ids(directory)

if __name__=='__main__':unittest.main()
