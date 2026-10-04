// ===== Web Audio API Sound System =====
// Pure procedural synth audio — zero external assets needed, ultra reliable

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playNote(freq, type = 'sine', duration = 0.25, gain = 0.15) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    g.gain.setValueAtTime(gain, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(g);
    g.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

// Piano note helper (musical notes A3 to C6)
const PIANO_NOTES = {
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
  'G4': 392.00, 'A4': 440.00, 'B4': 493.88, 'C5': 523.25,
  'D5': 587.33, 'E5': 659.25, 'G5': 783.99, 'A5': 880.00
};

export function playPianoNote(noteKey = null) {
  const keys = Object.keys(PIANO_NOTES);
  const key = noteKey || keys[Math.floor(Math.random() * keys.length)];
  const freq = PIANO_NOTES[key] || 440;
  playNote(freq, 'triangle', 0.8, 0.22);
}

// Dialogue blip / speech sound
export function playSpeechBlip(pitch = 1.0) {
  const baseFreq = 420 * pitch;
  playNote(baseFreq + Math.random() * 80, 'square', 0.06, 0.04);
}

// Interaction click
export function playClickSound() {
  playNote(780, 'sine', 0.08, 0.08);
}

// Discovery / Achievement chime
export function playSuccessChime() {
  playNote(523.25, 'sine', 0.15, 0.1);
  setTimeout(() => playNote(659.25, 'sine', 0.15, 0.1), 80);
  setTimeout(() => playNote(783.99, 'sine', 0.25, 0.15), 160);
  setTimeout(() => playNote(1046.50, 'triangle', 0.45, 0.18), 240);
}

// Footstep sound
export function playFootstep() {
  playNote(140 + Math.random() * 30, 'triangle', 0.04, 0.02);
}

// Coffee / Lab machine bubbler
export function playBrewSound() {
  playNote(650, 'sawtooth', 0.1, 0.03);
  setTimeout(() => playNote(720, 'sawtooth', 0.12, 0.03), 100);
}
