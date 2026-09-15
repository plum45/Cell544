import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import fs from 'fs';

// Quick check in node
console.log('Fox model file exists:', fs.existsSync('assets/models/fox/scene.gltf'));
console.log('Fox bin file exists:', fs.existsSync('assets/models/fox/scene.bin'));
console.log('House model file exists:', fs.existsSync('assets/models/house/scene.gltf'));
console.log('House bin file exists:', fs.existsSync('assets/models/house/scene.bin'));
