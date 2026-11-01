// ============================================================================
// REAL-TIME ECG / EKG WAVEFORM MONITOR
// Synchronized physiological Lead II cardiac tracing with P-Q-R-S-T complexes
// ============================================================================

export function createEcgMonitor({ canvas, heartAudio, onBeat }) {
  if (!canvas) return { setBpm: () => {}, togglePause: () => {}, destroy: () => {} };

  const ctx = canvas.getContext('2d');
  let animationId = null;
  let bpm = 72;
  let isRunning = true;

  // Trace buffer
  let width = canvas.width = canvas.parentElement?.clientWidth || 400;
  let height = canvas.height = 70;

  const points = [];
  const maxPoints = 250;
  for (let i = 0; i < maxPoints; i++) {
    points.push(0);
  }

  let phase = 0; // 0 to 1 cycle
  let lastTime = performance.now();
  let s1Fired = false;
  let s2Fired = false;

  function resize() {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight || 70;
  }
  window.addEventListener('resize', resize);

  // Calculate ECG voltage at phase in cardiac cycle (0.0 to 1.0)
  function getEcgVoltage(p) {
    // Normal sinus rhythm Lead II:
    // 0.00 - 0.12: Baseline
    // 0.12 - 0.20: P wave (atrial depolarization)
    // 0.20 - 0.30: PR segment
    // 0.30 - 0.32: Q wave (downward deflection)
    // 0.32 - 0.36: R wave (tall upward peak)
    // 0.36 - 0.38: S wave (sharp downward)
    // 0.38 - 0.48: ST segment
    // 0.48 - 0.62: T wave (ventricular repolarization)
    // 0.62 - 1.00: Isoelectric baseline

    if (p >= 0.12 && p < 0.22) {
      // P wave (smooth hump)
      const t = (p - 0.12) / 0.10;
      return Math.sin(t * Math.PI) * 0.22;
    }
    if (p >= 0.28 && p < 0.30) {
      // Q wave
      const t = (p - 0.28) / 0.02;
      return -Math.sin(t * Math.PI) * 0.18;
    }
    if (p >= 0.30 && p < 0.35) {
      // R wave (sharp tall peak)
      const t = (p - 0.30) / 0.05;
      if (t < 0.5) {
        return (t * 2) * 1.35;
      } else {
        return (1 - (t - 0.5) * 2) * 1.35;
      }
    }
    if (p >= 0.35 && p < 0.38) {
      // S wave
      const t = (p - 0.35) / 0.03;
      return -Math.sin(t * Math.PI) * 0.35;
    }
    if (p >= 0.48 && p < 0.62) {
      // T wave
      const t = (p - 0.48) / 0.14;
      return Math.sin(t * Math.PI) * 0.38;
    }
    // Baseline with slight biological tremor
    return (Math.random() - 0.5) * 0.02;
  }

  function draw() {
    if (!isRunning) return;

    const now = performance.now();
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    // Advance phase according to BPM
    const cycleDuration = 60 / bpm; // seconds per beat
    phase = (phase + (dt / cycleDuration)) % 1.0;

    // Trigger audio & events
    if (phase >= 0.32 && !s1Fired) {
      s1Fired = true;
      heartAudio?.playS1();
      onBeat?.('systole');
    }
    if (phase >= 0.58 && !s2Fired) {
      s2Fired = true;
      heartAudio?.playS2();
      onBeat?.('diastole');
    }
    if (phase < 0.1) {
      s1Fired = false;
      s2Fired = false;
    }

    const currentV = getEcgVoltage(phase);
    points.push(currentV);
    if (points.length > maxPoints) {
      points.shift();
    }

    // Render ECG
    ctx.clearRect(0, 0, width, height);

    // Subtle medical grid
    ctx.strokeStyle = 'rgba(57, 214, 231, 0.06)';
    ctx.lineWidth = 1;
    const gridSize = 16;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Baseline
    const midY = height * 0.58;

    // Glowing trace
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#39e58c';
    ctx.strokeStyle = '#39e58c';
    ctx.lineWidth = 2.2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    ctx.beginPath();
    const stepX = width / (maxPoints - 1);
    for (let i = 0; i < points.length; i++) {
      const x = i * stepX;
      const y = midY - points[i] * (height * 0.42);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Leading scan bar pulse
    const leadX = (points.length - 1) * stepX;
    const leadY = midY - points[points.length - 1] * (height * 0.42);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(leadX, leadY, 3, 0, Math.PI * 2);
    ctx.fill();

    animationId = requestAnimationFrame(draw);
  }

  resize();
  animationId = requestAnimationFrame(draw);

  return {
    setBpm(newBpm) {
      bpm = Math.max(30, Math.min(200, newBpm));
    },
    getBpm() {
      return bpm;
    },
    togglePause() {
      isRunning = !isRunning;
      if (isRunning) {
        lastTime = performance.now();
        draw();
      }
    },
    destroy() {
      isRunning = false;
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    }
  };
}
