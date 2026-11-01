
export function createStatusPanel() {
  const fpsValue = document.querySelector('#fpsValue');
  const renderStatus = document.querySelector('#renderStatus');
  const engineStatus = document.querySelector('#engineStatus');

  let frameCount = 0;
  let lastFpsUpdate = performance.now();

  function updatePerformanceMonitor() {
    frameCount++;

    const now = performance.now();
    const elapsed = now - lastFpsUpdate;

    if (elapsed >= 1000) {
      const fps = Math.round((frameCount * 1000) / elapsed);

      fpsValue.textContent = `${fps} FPS`;

      renderStatus.textContent =
        fps >= 50 ? 'SMOOTH' :
        fps >= 30 ? 'NORMAL' :
        'LOW FPS';

      frameCount = 0;
      lastFpsUpdate = now;
    }
  }

  function setEngineStatus(status) {
    engineStatus.textContent = status;
  }

  setEngineStatus('ONLINE');

  return {
    updatePerformanceMonitor,
    setEngineStatus
  };
}
