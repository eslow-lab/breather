import { ExerciseDefinition } from '../../types/exercise';
import { diaphragmaticBreathing } from './diaphragmatic-breathing';
import { prolongedExhalation } from './prolonged-exhalation';
import { pursedLipBreathing } from './pursed-lip-breathing';
import { boxBreathing } from './box-breathing';
import { alternateNostrilBreathing } from './alternate-nostril-breathing';
import { lateralCostalBreathing } from './lateral-costal-breathing';
import { cyclicSighing } from './cyclic-sighing';

export const EXERCISES: ExerciseDefinition[] = [
  diaphragmaticBreathing,
  prolongedExhalation,
  pursedLipBreathing,
  boxBreathing,
  alternateNostrilBreathing,
  lateralCostalBreathing,
  cyclicSighing
];

export {
  diaphragmaticBreathing,
  prolongedExhalation,
  pursedLipBreathing,
  boxBreathing,
  alternateNostrilBreathing,
  lateralCostalBreathing,
  cyclicSighing
};
