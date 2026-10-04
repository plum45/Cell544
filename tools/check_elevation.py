import json, struct

with open('assets/models/forest/scene.gltf') as f:
    gltf = json.load(f)

acc0 = gltf['accessors'][0]
bv = gltf['bufferViews'][acc0['bufferView']]
byte_offset = bv.get('byteOffset', 0) + acc0.get('byteOffset', 0)
count = acc0['count']

with open('assets/models/forest/scene.bin', 'rb') as f:
    f.seek(byte_offset)
    raw = f.read(count * 12)

scale = 120.0 / (1215.42 - (-1145.07))

spots = [
    ('Center (Player Start)', 0, 0),
    ('Botanical Cottage / Holiday Home', 0, -28),
    ('Windmill', 25, -14),
    ('Lighthouse', 25, 14),
    ('Energy Pavilion', -25, 14),
    ('Observatory', -25, -14),
    ('Sanctuary', 0, 28)
]

for name, sx, sz in spots:
    y_vals = []
    for i in range(count):
        x, y, z = struct.unpack('<fff', raw[i*12 : (i+1)*12])
        px = x * scale
        pz = z * scale
        py = y * scale
        dist = ((px - sx)**2 + (pz - sz)**2)**0.5
        if dist < 6.0:
            y_vals.append(py)
    if y_vals:
        print(f'{name} ({sx}, {sz}): avg_y={sum(y_vals)/len(y_vals):.2f} (min={min(y_vals):.2f}, max={max(y_vals):.2f})')
    else:
        print(f'{name} ({sx}, {sz}): no nearby vertex')
