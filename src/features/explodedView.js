// ============================================================================
// SURGICAL DISSECTION / EXPLODED VIEW ENGINE
// Smoothly separates anatomical sections along surgical planes for internal inspection
// ============================================================================

import * as THREE from 'three';

export function createExplodedView({ explodeButton, onExplodeChange } = {}) {
  let isExploded = false;
  let targetProgress = 0.0;
  let currentProgress = 0.0;
  let animId = null;

  // Active list of dissectible parts: { object, originalPosition, explodeVector }
  let activeParts = [];

  function setParts(parts) {
    activeParts = parts || [];
    currentProgress = 0.0;
    targetProgress = 0.0;
    isExploded = false;
    updateButtonLabel();
    applyProgress(0);
  }

  function toggleExplodedView() {
    isExploded = !isExploded;
    targetProgress = isExploded ? 1.0 : 0.0;
    updateButtonLabel();
    startAnimation();
    onExplodeChange?.(isExploded, targetProgress);
    return isExploded;
  }

  function setExplodeFactor(factor) {
    targetProgress = Math.max(0, Math.min(1.5, factor));
    isExploded = targetProgress > 0.05;
    updateButtonLabel();
    startAnimation();
  }

  function updateButtonLabel() {
    if (explodeButton) {
      explodeButton.textContent = isExploded ? 'Assemble Organ' : 'Dissect / Explode View';
      explodeButton.classList.toggle('active', isExploded);
    }
  }

  function applyProgress(p) {
    currentProgress = p;
    activeParts.forEach(item => {
      if (item.object && item.originalPosition && item.explodeVector) {
        item.object.position.copy(item.originalPosition).addScaledVector(item.explodeVector, p);
      }
    });
  }

  function startAnimation() {
    if (animId) cancelAnimationFrame(animId);

    function step() {
      const delta = targetProgress - currentProgress;
      if (Math.abs(delta) < 0.005) {
        applyProgress(targetProgress);
        animId = null;
        return;
      }

      applyProgress(currentProgress + delta * 0.12);
      animId = requestAnimationFrame(step);
    }

    animId = requestAnimationFrame(step);
  }

  function resetExplodedView() {
    isExploded = false;
    targetProgress = 0.0;
    applyProgress(0.0);
    updateButtonLabel();
  }

  if (explodeButton) {
    explodeButton.addEventListener('click', toggleExplodedView);
  }

  return {
    setParts,
    toggleExplodedView,
    setExplodeFactor,
    resetExplodedView,
    isExploded: () => isExploded,
    getProgress: () => currentProgress
  };
}
