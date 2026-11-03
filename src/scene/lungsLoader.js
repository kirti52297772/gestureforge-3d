
import { loadGlbOrgan } from './glbOrganLoader.js';

export function loadLungsModel() {
  return loadGlbOrgan(
    '/models/lungs/lungs.glb',
    'Human Lungs'
  );
}
