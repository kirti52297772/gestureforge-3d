
import { loadGlbOrgan } from './glbOrganLoader.js';

export function loadBrainModel() {
  return loadGlbOrgan(
    '/models/brain/brain.glb',
    'Human Brain'
  );
}
