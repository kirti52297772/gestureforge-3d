
import { loadGlbOrgan } from './glbOrganLoader.js';

export function loadEyeModel() {
  return loadGlbOrgan(
    '/models/eyes/eyes.glb',
    'Human Eye'
  );
}
