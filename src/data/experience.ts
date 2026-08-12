import { ExerciseDefinition, ExperienceDefinition } from '../types/exercise';

/**
 * Experiential copy is intentionally kept separate from evidence and safety.
 * It describes what the practice feels like or how it is presented, without
 * implying a physiological or therapeutic effect.
 */
export const EXPERIENCE_BY_EXERCISE: Record<string, ExperienceDefinition> = {
  'diaphragmatic-breathing': {
    summary: 'Una respiración lenta y cómoda que invita a prestar atención al movimiento del abdomen y al ritmo de la respiración.',
    intention: 'Sentir el movimiento de la respiración sin forzarla.',
    sensoryNotes: ['Movimiento suave del abdomen', 'Ritmo estable', 'Atención al flujo del aire']
  },
  'prolonged-exhalation': {
    summary: 'Un ritmo sencillo en el que la salida del aire ocupa más tiempo que la entrada.',
    intention: 'Explorar una exhalación larga y fluida manteniendo la comodidad.',
    sensoryNotes: ['Salida de aire lenta', 'Ritmo regular', 'Sensación de continuidad']
  },
  'pursed-lip-breathing': {
    summary: 'Una práctica que añade una ligera resistencia al flujo de salida mediante los labios suavemente fruncidos.',
    intention: 'Percibir y controlar suavemente el flujo de aire.',
    sensoryNotes: ['Flujo de aire controlado', 'Labios relajados', 'Exhalación pausada']
  },
  'box-breathing': {
    summary: 'Un patrón simétrico de cuatro fases que ofrece una estructura clara para seguir cada ciclo.',
    intention: 'Seguir las cuatro fases con atención y sin forzar las retenciones.',
    sensoryNotes: ['Estructura repetitiva', 'Ritmo regular', 'Transiciones claras']
  },
  'alternate-nostril-breathing': {
    summary: 'Una práctica de respiración alterna que combina ritmo, coordinación y atención a cada lado de la respiración.',
    intention: 'Explorar la coordinación entre respiración, movimiento y atención.',
    sensoryNotes: ['Alternancia izquierda-derecha', 'Coordinación manual', 'Ritmo equilibrado']
  },
  'lateral-costal-breathing': {
    summary: 'Una práctica centrada en percibir la expansión y el movimiento lateral de la caja torácica.',
    intention: 'Observar el movimiento de las costillas durante la respiración.',
    sensoryNotes: ['Expansión lateral', 'Movimiento de las costillas', 'Atención corporal']
  }
};

/**
 * Applies the experiential layer without altering evidence or safety data.
 * Exercises without an explicit entry retain their existing description as a
 * conservative fallback until their copy is individually reviewed.
 */
export function withExperientialContent(exercises: ExerciseDefinition[]): ExerciseDefinition[] {
  return exercises.map((exercise) => ({
    ...exercise,
    experience: EXPERIENCE_BY_EXERCISE[exercise.id] ?? {
      summary: exercise.description,
      intention: 'Explorar la respiración de forma cómoda y consciente.'
    }
  }));
}
