import json

with open('assets/models/forest/scene.gltf') as f:
    g = json.load(f)

scale = 120.0 / (1215.42 - (-1145.07))
m_ids = [63, 124, 137, 139, 142, 176, 184, 187, 220, 229, 245, 997, 1000, 1005, 1010, 1015, 1020, 1025]

for m_id in m_ids:
    mesh = g['meshes'][m_id]
    acc_id = mesh['primitives'][0]['attributes']['POSITION']
    acc = g['accessors'][acc_id]
    min_v = [round(v * scale, 2) for v in acc['min']]
    max_v = [round(v * scale, 2) for v in acc['max']]
    print(f"Mesh {m_id:4d}: min={min_v} max={max_v}")
