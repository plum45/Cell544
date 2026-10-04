import json

with open('assets/models/forest/scene.gltf') as f:
    g = json.load(f)

path_meshes = []
for i, m in enumerate(g.get('meshes', [])):
    name = m.get('name', '')
    if 'path' in name.lower() or 'road' in name.lower():
        path_meshes.append((i, name, m))

print(f'Found {len(path_meshes)} path meshes:')
for i, name, m in path_meshes:
    print(f'  Mesh {i}: {name}')

# Now find nodes referencing these meshes
path_nodes = []
for i, n in enumerate(g.get('nodes', [])):
    mesh_id = n.get('mesh')
    if mesh_id in [pm[0] for pm in path_meshes]:
        print(f"Node {i}: name={n.get('name')} mesh={mesh_id} trans={n.get('translation')} rot={n.get('rotation')} scale={n.get('scale')}")
