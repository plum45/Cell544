import json

with open('assets/models/forest/scene.gltf') as f:
    g = json.load(f)

scale = 120.0 / (1215.42 - (-1145.07))

# Build parent mapping
parents = {}
for i, n in enumerate(g['nodes']):
    for c in n.get('children', []):
        parents[c] = i

for i, n in enumerate(g['nodes']):
    m = n.get('mesh')
    if m is not None and 'path' in g['meshes'][m].get('name', '').lower():
        # Trace path up to root
        curr = i
        chain = []
        while curr is not None:
            node_obj = g['nodes'][curr]
            chain.append((curr, node_obj.get('name'), node_obj.get('translation'), node_obj.get('rotation'), node_obj.get('matrix')))
            curr = parents.get(curr)
        print(f"Path Node {i}:")
        for c in chain:
            print(f"   -> {c[0]} '{c[1]}' t={c[2]} mat={c[4] is not None}")
        break
