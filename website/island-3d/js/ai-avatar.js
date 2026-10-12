import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ============================================================
// 3D AI Avatar Module — High-Quality Expressive 3D Robot Guide
// Powered by Authentic GLTF Model (RobotExpressive.glb),
// Skeletal Animations (Idle, Wave, Yes/Nod, ThumbsUp),
// Web Speech STT/TTS, and State Machine
// ============================================================

export class AIAvatar3D {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.canvas = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();

    // 3D Model & Animation Mixer
    this.model = null;
    this.mixer = null;
    this.actions = {};
    this.activeAction = null;
    this.headBone = null;
    this.dnaHelixGroup = null;
    this.pedestalRings = [];
    this.speechLight = null;

    // State Machine: 'idle' | 'listening' | 'thinking' | 'speaking'
    this.state = 'idle';

    // Head-Tracking / Cursor Look
    this.mouse = new THREE.Vector2(0, 0);
    this.targetLook = new THREE.Vector2(0, 0);
    this.currentLook = new THREE.Vector2(0, 0);

    // Audio & Speech
    this.isSpeaking = false;
    this.speechUtterance = null;
    this.isAudioMuted = false;
    this.speechRecognition = null;
    this.isListening = false;
    this.onSpeechResult = null;

    // Callbacks
    this.onStateChange = null;

    this.init();
  }

  init() {
    if (!this.container) return;

    // 1. Create Canvas
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'ai-avatar-canvas';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.display = 'block';
    this.container.appendChild(this.canvas);

    const width = this.container.clientWidth || 340;
    const height = this.container.clientHeight || 360;

    // 2. Three.js Scene & Camera
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    // Camera positioned for friendly upper-body / bust portrait framing
    this.camera.position.set(0, 1.25, 2.35);
    this.camera.lookAt(0, 1.05, 0);

    // 3. Renderer with antialiasing and tone mapping
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;

    // 4. Studio Lighting
    this.setupLighting();

    // 5. Load Authentic 3D Model (RobotExpressive.glb)
    this.load3DModel();

    // 6. Interaction & Window Events
    this.setupEvents();

    // 7. Initialize Speech System
    this.setupSpeechSystem();

    // 8. Start Render Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupLighting() {
    // Ambient light
    const ambient = new THREE.AmbientLight(0x0f172a, 1.6);
    this.scene.add(ambient);

    // Key Light (Warm daylight)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(2, 3.5, 2.5);
    this.scene.add(keyLight);

    // Fill Light (Bioluminescent Cyan)
    const fillLight = new THREE.DirectionalLight(0x06d6a0, 1.8);
    fillLight.position.set(-2, 2, 2);
    this.scene.add(fillLight);

    // Rim / Backlight (Electric Violet Halo)
    const rimLight = new THREE.DirectionalLight(0x818cf8, 3.5);
    rimLight.position.set(0, 3, -2.5);
    this.scene.add(rimLight);

    // Dynamic Reactive Speech Light
    this.speechLight = new THREE.PointLight(0x06d6a0, 1.2, 5);
    this.speechLight.position.set(0, 0.9, 0.7);
    this.scene.add(this.speechLight);
  }

  load3DModel() {
    // Loading indicator on pedestal
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.set(0, 0, 0);
    this.scene.add(pedestalGroup);

    // Holographic Base Ring
    const baseDisk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9, 1.05, 0.08, 32),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.85 })
    );
    baseDisk.position.y = 0.04;
    pedestalGroup.add(baseDisk);

    for (let r = 0; r < 2; r++) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.7 + r * 0.2, 0.76 + r * 0.2, 32),
        new THREE.MeshBasicMaterial({
          color: r === 0 ? 0x06d6a0 : 0x38bdf8,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.65
        })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.09 + r * 0.01;
      pedestalGroup.add(ring);
      this.pedestalRings.push(ring);
    }

    // Floating 3D Holographic DNA double helix near shoulder
    this.dnaHelixGroup = this.createDNAHelix();
    this.dnaHelixGroup.position.set(0.68, 1.05, 0.35);
    this.dnaHelixGroup.scale.set(0.22, 0.22, 0.22);
    this.scene.add(this.dnaHelixGroup);

    // Load authentic RobotExpressive.glb
    const loader = new GLTFLoader();
    loader.load(
      'assets/models/RobotExpressive.glb',
      (gltf) => {
        this.model = gltf.scene;
        // Position model for upper-body / bust framing
        this.model.position.set(0, 0.08, 0);
        this.model.scale.set(0.55, 0.55, 0.55);
        this.scene.add(this.model);

        // Find Head bone for mouse tracking
        this.model.traverse((child) => {
          if (child.isBone && child.name.toLowerCase().includes('head')) {
            this.headBone = child;
          }
          if (child.isMesh) {
            child.castShadow = false;
            child.receiveShadow = false;
            if (child.material) {
              child.material.roughness = 0.35;
              child.material.metalness = 0.25;
            }
          }
        });

        // Setup Animation Mixer
        this.mixer = new THREE.AnimationMixer(this.model);
        gltf.animations.forEach((clip) => {
          this.actions[clip.name] = this.mixer.clipAction(clip);
        });

        // Start with Idle Animation
        this.fadeToAction('Idle', 0.2);

        // Friendly welcome wave on start
        setTimeout(() => {
          this.playGesture('Wave', 2.5);
        }, 800);
      },
      undefined,
      (err) => {
        console.warn('Could not load RobotExpressive.glb, falling back:', err);
      }
    );
  }

  createDNAHelix() {
    const dnaGroup = new THREE.Group();
    const count = 16;
    const height = 3.0;
    const radius = 0.6;

    const strandMatA = new THREE.MeshStandardMaterial({
      color: 0x06d6a0,
      emissive: 0x06d6a0,
      emissiveIntensity: 0.9
    });
    const strandMatB = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.9
    });
    const rungMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 4;
      const y = (i / count) * height - height / 2;

      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;

      const ballA = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), strandMatA);
      ballA.position.set(x1, y, z1);
      dnaGroup.add(ballA);

      const ballB = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), strandMatB);
      ballB.position.set(x2, y, z2);
      dnaGroup.add(ballB);

      if (i % 2 === 0) {
        const rung = new THREE.Mesh(
          new THREE.CylinderGeometry(0.02, 0.02, radius * 2, 6),
          rungMat
        );
        rung.position.set(0, y, 0);
        rung.rotation.z = Math.PI / 2;
        rung.rotation.y = -angle;
        dnaGroup.add(rung);
      }
    }

    return dnaGroup;
  }

  fadeToAction(name, duration = 0.3) {
    const action = this.actions[name];
    if (!action) return;

    if (this.activeAction && this.activeAction !== action) {
      this.activeAction.fadeOut(duration);
    }

    action.reset().fadeIn(duration).play();
    this.activeAction = action;
  }

  playGesture(gestureName, durationSeconds = 2.0) {
    if (!this.actions[gestureName]) return;

    const prevAction = this.activeAction;
    const gestureAction = this.actions[gestureName];

    gestureAction.reset();
    gestureAction.setLoop(THREE.LoopOnce);
    gestureAction.clampWhenFinished = true;

    if (prevAction) prevAction.fadeOut(0.2);
    gestureAction.fadeIn(0.2).play();
    this.activeAction = gestureAction;

    setTimeout(() => {
      gestureAction.fadeOut(0.3);
      if (prevAction) {
        prevAction.reset().fadeIn(0.3).play();
        this.activeAction = prevAction;
      } else {
        this.fadeToAction('Idle', 0.3);
      }
    }, durationSeconds * 1000);
  }

  setupEvents() {
    window.addEventListener('mousemove', (e) => {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.mouse.set(x, y);

      this.targetLook.x = THREE.MathUtils.clamp(x * 0.35, -0.4, 0.4);
      this.targetLook.y = THREE.MathUtils.clamp(y * 0.25, -0.25, 0.25);
    });

    const ro = new ResizeObserver(() => this.onResize());
    ro.observe(this.container);
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  // ===== State Machine Controller =====
  setState(newState) {
    if (this.state === newState) return;
    this.state = newState;

    if (this.onStateChange) {
      this.onStateChange(newState);
    }

    if (newState === 'speaking') {
      if (this.actions['Yes']) {
        this.fadeToAction('Yes', 0.25);
      }
      if (this.speechLight) {
        this.speechLight.color.setHex(0x06d6a0);
        this.speechLight.intensity = 2.4;
      }
    } else if (newState === 'listening') {
      if (this.actions['Sitting'] || this.actions['Idle']) {
        this.fadeToAction('Idle', 0.3);
      }
      if (this.speechLight) {
        this.speechLight.color.setHex(0x38bdf8);
        this.speechLight.intensity = 2.2;
      }
    } else if (newState === 'thinking') {
      this.fadeToAction('Idle', 0.3);
      if (this.speechLight) {
        this.speechLight.color.setHex(0xa855f7);
        this.speechLight.intensity = 2.5;
      }
    } else {
      // Idle
      this.fadeToAction('Idle', 0.3);
      if (this.speechLight) {
        this.speechLight.color.setHex(0x06d6a0);
        this.speechLight.intensity = 1.2;
      }
    }
  }

  // ===== Speech System (STT & TTS) =====
  setupSpeechSystem() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.speechRecognition = new SpeechRecognition();
      this.speechRecognition.lang = 'th-TH';
      this.speechRecognition.continuous = false;
      this.speechRecognition.interimResults = false;

      this.speechRecognition.onstart = () => {
        this.isListening = true;
        this.setState('listening');
      };

      this.speechRecognition.onresult = (event) => {
        const transcript = event.results[0]?.[0]?.transcript || '';
        this.isListening = false;
        this.setState('idle');
        if (this.onSpeechResult && transcript.trim()) {
          this.onSpeechResult(transcript.trim());
        }
      };

      this.speechRecognition.onerror = (e) => {
        console.warn('Speech recognition error:', e);
        this.isListening = false;
        this.setState('idle');
      };

      this.speechRecognition.onend = () => {
        this.isListening = false;
        if (this.state === 'listening') this.setState('idle');
      };
    }
  }

  startVoiceInput(callback) {
    if (!this.speechRecognition) {
      alert('เบราว์เซอร์ของคุณยังไม่รองรับระบบสั่งการด้วยเสียง กรุณาใช้ Chrome หรือ Edge ครับ');
      return false;
    }
    this.onSpeechResult = callback;
    try {
      this.speechRecognition.start();
      return true;
    } catch (e) {
      console.warn('Cannot start recognition:', e);
      return false;
    }
  }

  stopVoiceInput() {
    if (this.speechRecognition && this.isListening) {
      this.speechRecognition.stop();
    }
  }

  speak(text, onComplete) {
    if (this.isAudioMuted || !('speechSynthesis' in window)) {
      if (onComplete) onComplete();
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/[#🤖🐰✨🧬📡🕯️🔬🗺️💎👑🎉]/g, '')
      .trim();

    this.speechUtterance = new SpeechSynthesisUtterance(cleanText);
    this.speechUtterance.lang = 'th-TH';
    this.speechUtterance.rate = 1.05;
    this.speechUtterance.pitch = 1.15;

    const voices = window.speechSynthesis.getVoices();
    const thaiVoice = voices.find(v => v.lang.includes('th') || v.name.includes('Thai'));
    if (thaiVoice) {
      this.speechUtterance.voice = thaiVoice;
    }

    this.speechUtterance.onstart = () => {
      this.isSpeaking = true;
      this.setState('speaking');
    };

    this.speechUtterance.onend = () => {
      this.isSpeaking = false;
      this.setState('idle');
      if (onComplete) onComplete();
    };

    this.speechUtterance.onerror = () => {
      this.isSpeaking = false;
      this.setState('idle');
      if (onComplete) onComplete();
    };

    window.speechSynthesis.speak(this.speechUtterance);
  }

  stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.setState('idle');
  }

  toggleMute() {
    this.isAudioMuted = !this.isAudioMuted;
    if (this.isAudioMuted) {
      this.stopSpeaking();
    }
    return this.isAudioMuted;
  }

  // ===== Render Frame =====
  animate() {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // 1. Update Animation Mixer
    if (this.mixer) {
      this.mixer.update(delta);
    }

    // 2. Smooth Mouse Look-At for Head
    this.currentLook.x = THREE.MathUtils.lerp(this.currentLook.x, this.targetLook.x, 0.08);
    this.currentLook.y = THREE.MathUtils.lerp(this.currentLook.y, this.targetLook.y, 0.08);

    if (this.headBone) {
      this.headBone.rotation.y = this.currentLook.x * 0.8;
      this.headBone.rotation.x = -this.currentLook.y * 0.6;
    }

    // 3. DNA Double Helix Spin & Float
    if (this.dnaHelixGroup) {
      this.dnaHelixGroup.rotation.y = time * 1.35;
      this.dnaHelixGroup.position.y = 1.05 + Math.sin(time * 2.4) * 0.035;
    }

    // 4. Pedestal Hologram Rings Rotation
    this.pedestalRings.forEach((ring, idx) => {
      ring.rotation.z = time * (idx === 0 ? 0.45 : -0.35);
    });

    // 5. Breathing light pulse
    if (this.speechLight && this.state === 'idle') {
      this.speechLight.intensity = 1.2 + Math.sin(time * 2.5) * 0.3;
    }

    // 6. Render
    this.renderer.render(this.scene, this.camera);
  }
}
