import json

with open('assets/models/forest/scene.gltf') as f:
    gltf = json.load(f)

for i, acc in enumerate(gltf.get('accessors', [])):
    if 'min' in acc and 'max' in acc and len(acc['min']) == 3:
        print(f"Accessor {i}: min={acc['min']} max={acc['max']}")
        break
