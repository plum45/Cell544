import json, struct

with open('assets/models/forest/scene.gltf') as f:
    g = json.load(f)

scale = 120.0 / (1215.42 - (-1145.07))

bin_file = open('assets/models/forest/scene.bin', 'rb')

# Accessor 0 is vertex positions
pos_acc = g['accessors'][0]
pos_bv = g['bufferViews'][pos_acc['bufferView']]
pos_offset = pos_bv.get('byteOffset', 0) + pos_acc.get('byteOffset', 0)
vertex_count = pos_acc['count']
bin_file.seek(pos_offset)
raw_positions = bin_file.read(vertex_count * 12)

# Unpack all vertices
vertices = []
for i in range(vertex_count):
    x, y, z = struct.unpack('<fff', raw_positions[i*12 : (i+1)*12])
    vertices.append((x * scale, y * scale, z * scale))

print(f'Total vertices in forest model: {len(vertices)}')

# Now for each Meadow_Path mesh, read its index accessor to find its vertices!
path_centers = []
for i, m in enumerate(g.get('meshes', [])):
    name = m.get('name', '')
    if 'meadow_path' in name.lower():
        p = m['primitives'][0]
        ind_acc_id = p['indices']
        ind_acc = g['accessors'][ind_acc_id]
        ind_bv = g['bufferViews'][ind_acc['bufferView']]
        ind_offset = ind_bv.get('byteOffset', 0) + ind_acc.get('byteOffset', 0)
        ind_count = ind_acc['count']
        component_type = ind_acc['componentType'] # 5123 is UNSIGNED_SHORT, 5125 is UNSIGNED_INT
        
        bin_file.seek(ind_offset)
        if component_type == 5123:
            raw_indices = bin_file.read(ind_count * 2)
            indices = struct.unpack(f'<{ind_count}H', raw_indices)
        elif component_type == 5125:
            raw_indices = bin_file.read(ind_count * 4)
            indices = struct.unpack(f'<{ind_count}I', raw_indices)
        else:
            indices = []
        
        xs = [vertices[idx][0] for idx in indices]
        ys = [vertices[idx][1] for idx in indices]
        zs = [vertices[idx][2] for idx in indices]
        
        if xs:
            cx = sum(xs) / len(xs)
            cy = sum(ys) / len(ys)
            cz = sum(zs) / len(zs)
            path_centers.append((cx, cy, cz, name))

bin_file.close()

print(f'Successfully found {len(path_centers)} actual path segments!')

import math
path_centers.sort(key=lambda p: math.atan2(p[2], p[0]))

print('\nActual Brown Road Coordinates along the Loop:')
for i, (x, y, z, name) in enumerate(path_centers):
    ang = math.degrees(math.atan2(z, x))
    dist = math.hypot(x, z)
    print(f'Path #{i:2d} (deg={ang:6.1f}, r={dist:4.1f}): x={x:6.2f}, y={y:6.2f}, z={z:6.2f}')
