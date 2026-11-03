
import { loadGlbOrgan } from './glbOrganLoader.js';

export function loadKidneyModel() {
  return loadGlbOrgan(
    '/models/kidneys/kidney.glb',
    'Human Kidney'
  );
}
