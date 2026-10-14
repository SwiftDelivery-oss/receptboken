"""Tilldela beständiga recept-ID:n. Registret måste följa med vid underhåll."""
import json
from pathlib import Path


def ensure_ids(directory, registry_path=None):
    directory = Path(directory)
    registry_path = Path(registry_path) if registry_path else directory.parent/'recept-id-register.json'
    registry = json.loads(registry_path.read_text(encoding='utf-8')) if registry_path.exists() else {'nästa_id': 1, 'reserverade': {}}
    reserved = registry['reserverade']
    retired = set(registry.get('borttagna', []))
    files = [(p, json.loads(p.read_text(encoding='utf-8'))) for p in sorted(directory.glob('*.json'))]
    seen = set()
    for source, recipe in files:
        rid = recipe.get('id')
        if rid is None:
            continue
        if type(rid) is not int or rid < 1 or rid > 999999999:
            raise ValueError(f'{source.name}: id måste vara ett positivt heltal')
        if rid in retired:
            raise ValueError(f'{source.name}: borttaget id {rid} får inte återanvändas')
        if rid in seen:
            raise ValueError(f'{source.name}: dubblett av id {rid}')
        seen.add(rid)
        previous = next((key for key, slug in reversed(list(reserved.items())) if slug == recipe['slug']), None)
        if previous and int(previous) != rid:
            raise ValueError(f'{source.name}: befintligt id {previous} får inte ändras')
    next_id = max(registry['nästa_id'], max([int(key) for key in reserved] + list(seen) + [0]) + 1)
    changed = []
    for source, recipe in files:
        if recipe.get('id') is None:
            recipe['id'] = next_id
            next_id += 1
            seen.add(recipe['id'])
            changed.append((source, recipe))
        reserved[str(recipe['id'])] = recipe['slug']
    registry['nästa_id'] = next_id
    registry['borttagna'] = sorted(retired | {int(key) for key in reserved if int(key) not in seen})
    # Reserve IDs before writing recipes: an interrupted run cannot reuse them.
    registry_path.write_text(json.dumps(registry, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    for source, recipe in changed:
        source.write_text(json.dumps(recipe, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
