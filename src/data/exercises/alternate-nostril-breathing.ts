import { ExerciseDefinition } from '../../types/exercise';

export const alternateNostrilBreathing: ExerciseDefinition = {
  id: 'alternate-nostril-breathing', name: 'Respiración Alterna', aliases: ['Nadi Shodhana', 'Alternate Nostril Breathing'],
  description: 'Práctica tradicional que alterna el flujo respiratorio entre la fosa nasal izquierda y la derecha.',
  goals: ['focus', 'regulate', 'calm'], difficulty: 'intermediate', category: 'pranayama', iconName: 'GitMerge',
  instructions: [
    'Tapa suavemente la fosa nasal derecha con el pulgar e inhala por la izquierda.',
    'Tapa la fosa izquierda con el anular, libera la derecha y exhala por la derecha.',
    'Inhala por la fosa derecha, tápala y exhala por la izquierda para completar un ciclo.'
  ],
  protocols: [{
    id: 'alternate-smooth-4-4', name: 'Fluido (4 - 4)', description: 'Inhalación y exhalación equilibradas de 4 segundos sin retención.', defaultCycles: 10, recommendedDurationMinutes: 5,
    phases: [
      { id: 'inhale', label: 'Inhala Izquierda', duration: 4, instruction: 'Cierra fosa derecha con el pulgar. Inhala por la fosa izquierda.', visualScale: 1.0 },
      { id: 'exhale', label: 'Exhala Derecha', duration: 4, instruction: 'Cierra fosa izquierda. Libera la derecha y exhala suavemente.', visualScale: 0.4 },
      { id: 'inhale', label: 'Inhala Derecha', duration: 4, instruction: 'Mantén la fosa izquierda cerrada. Inhala por la derecha.', visualScale: 1.0 },
      { id: 'exhale', label: 'Exhala Izquierda', duration: 4, instruction: 'Cierra fosa derecha. Libera la izquierda y exhala totalmente.', visualScale: 0.4 }
    ]
  }],
  safety: { level: 'low', warnings: ['No fuerces el cierre de las fosas nasales. Si tienes congestión nasal, realiza otra técnica.'], contraindications: ['Congestión nasal o inflamación en senos paranasales.'], requiresConfirmation: false, automaticRecommendation: true },
  evidence: { summary: 'Favorece una concentración enfocada al requerir atención táctil y postural continua.', notes: 'Práctica milenaria de equilibrado de atención.' }
};
