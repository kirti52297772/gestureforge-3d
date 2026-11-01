// ============================================================================
// CARDIAC SOUND SYNTHESIZER (WEB AUDIO API)
// Synthesizes realistic S1 ('lub') and S2 ('dub') heart sounds via Web Audio API
// ============================================================================

export function createHeartAudio() {
  let audioCtx = null;
  let isMuted = true;

  function initContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Play S1 sound ("lub" - AV valves closing)
  function playS1() {
    if (isMuted) return;
    initContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;

      // Sub-bass thump
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(85, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(65, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.12);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      // Audio context handling
    }
  }

  // Play S2 sound ("dub" - Semilunar valves closing)
  function playS2() {
    if (isMuted) return;
    initContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(110, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.09);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      // Audio context handling
    }
  }

  // Gentle acoustic chirp for gesture pin selection
  function playSelectChirp() {
    initContext();
    if (!audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      // Audio context handling
    }
  }

  function setMuted(muted) {
    isMuted = muted;
    if (!isMuted) {
      initContext();
    }
  }

  function toggleMute() {
    setMuted(!isMuted);
    return !isMuted;
  }

  return {
    playS1,
    playS2,
    playSelectChirp,
    setMuted,
    toggleMute,
    isMuted: () => isMuted
  };
}
