import json, struct, math

with open('assets/models/forest/scene.gltf') as f:
    g = json.load(f)

scale = 120.0 / (1215.42 - (-1145.07)) # 0.0508369

path_mesh_ids = set()
for i, m in enumerate(g.get('meshes', [])):
    if 'path' in m.get('name', '').lower():
        path_mesh_ids.add(i)

bin_file = open('assets/models/forest/scene.bin', 'rb')

road_points = []
for m_id in path_mesh_ids:
    mesh = g['meshes'][m_id]
    for p in mesh['primitives']:
        pos_acc_id = p['attributes']['POSITION']
        acc = g['accessors'][pos_acc_id]
        bv = g['bufferViews'][acc['bufferView']]
        offset = bv.get('byteOffset', 0) + acc.get('byteOffset', 0)
        count = acc['count']
        bin_file.seek(offset)
        raw = bin_file.read(count * 12)
        xs, ys, zs = [], [], []
        for j in range(count):
            x, y, z = struct.unpack('<fff', raw[j*12 : (j+1)*12])
            xs.append(x * scale)
            ys.append(y * scale)
            zs.append(z * scale)
        if xs:
            road_points.append((sum(xs)/len(xs), sum(ys)/len(ys), sum(zs)/len(zs)))

bin_file.close()

road_points.sort(key=lambda p: math.atan2(p[2], p[0]))

print(f'Total road points: {len(road_points)}')
for i, (x, y, z) in enumerate(road_points):
    ang = math.degrees(math.atan2(z, x))
    print(f'Point {i:2d} (deg={ang:6.1f}): x={x:6.2f}, y={y:6.2f}, z={z:6.2f}')
