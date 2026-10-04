import json

with open('assets/models/forest/scene.gltf') as f:
    g = json.load(f)

print('Meshes count:', len(g.get('meshes', [])))
for i, m in enumerate(g.get('meshes', [])):
    print(f"Mesh {i}: {m.get('name')}")
    for p in m.get('primitives', []):
        mat_id = p.get('material')
        mat_name = g['materials'][mat_id].get('name') if mat_id is not None else 'None'
        print(f"  primitive material: {mat_name} attributes: {list(p.get('attributes', {}).keys())}")

print('\nMaterials count:', len(g.get('materials', [])))
for i, m in enumerate(g.get('materials', [])):
    print(f"Material {i}: {m.get('name')}")
