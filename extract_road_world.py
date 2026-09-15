import json, struct, math

with open('assets/models/forest/scene.gltf') as f:
    g = json.load(f)

# Find root transform of gltf
# Nodes hierarchy
children_map = {}
for i, n in enumerate(g['nodes']):
    for c in n.get('children', []):
        children_map[c] = i

def get_node_matrix(node_idx):
    chain = []
    curr = node_idx
    while curr is not None:
        chain.append(curr)
        curr = children_map.get(curr)
    chain.reverse()
    
    # multiply translations
    tx, ty, tz = 0.0, 0.0, 0.0
    for nid in chain:
        n = g['nodes'][nid]
        t = n.get('translation', [0, 0, 0])
        tx += t[0]
        ty += t[1]
        tz += t[2]
    return tx, ty, tz

scale = 120.0 / (1215.42 - (-1145.07)) # 0.0508369

path_nodes = []
for i, n in enumerate(g['nodes']):
    m_id = n.get('mesh')
    if m_id is not None:
        m_name = g['meshes'][m_id].get('name', '').lower()
        if 'path' in m_name:
            path_nodes.append((i, m_id, n))

print(f'Found {len(path_nodes)} path nodes!')

bin_file = open('assets/models/forest/scene.bin', 'rb')
road_centers = []

for n_id, m_id, n in path_nodes:
    tx, ty, tz = get_node_matrix(n_id)
    mesh = g['meshes'][m_id]
    p = mesh['primitives'][0]
    acc = g['accessors'][p['attributes']['POSITION']]
    bv = g['bufferViews'][acc['bufferView']]
    offset = bv.get('byteOffset', 0) + acc.get('byteOffset', 0)
    count = acc['count']
    bin_file.seek(offset)
    raw = bin_file.read(count * 12)
    xs, ys, zs = [], [], []
    for j in range(count):
        x, y, z = struct.unpack('<fff', raw[j*12 : (j+1)*12])
        xs.append((x + tx) * scale)
        ys.append((y + ty) * scale)
        zs.append((z + tz) * scale)
    if xs:
        road_centers.append((sum(xs)/len(xs), sum(ys)/len(ys), sum(zs)/len(zs)))

bin_file.close()

# Deduplicate points that are very close
unique_road = []
for p in road_centers:
    if not any(math.dist(p, u) < 1.0 for u in unique_road):
        unique_road.append(p)

print(f'Unique road points: {len(unique_road)}')
unique_road.sort(key=lambda p: math.atan2(p[2], p[0]))

for i, (x, y, z) in enumerate(unique_road):
    ang = math.degrees(math.atan2(z, x))
    dist = math.hypot(x, z)
    print(f'Road #{i:2d} (deg={ang:6.1f}, r={dist:4.1f}): x={x:6.2f}, y={y:6.2f}, z={z:6.2f}')
