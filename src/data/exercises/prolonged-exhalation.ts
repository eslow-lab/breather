import { ExerciseDefinition } from '../../types/exercise';

export const prolongedExhalation: ExerciseDefinition = {
  id: 'prolonged-exhalation',
  name: 'Exhalación Prolongada',
  aliases: ['Respiración 4-7-8 modificada', 'Extended Exhale'],
  description: 'Extiende el tiempo de exhalación en relación con la inhalación para facilitar una sensación de descanso.',
  goals: ['calm', 'sleep'],
  difficulty: 'beginner',
  category: 'pacing',
  iconName: 'Moon',
  instructions: [
    'Inhala de manera constante sintiendo la entrada de aire.',
    'Exhala el doble de tiempo o de forma más prolongada y fluida.',
    'Procura mantener los hombros relajados durante todo el ciclo.'
  ],
  protocols: [
    {
      id: 'prolonged-4-6', name: 'Suave (4 - 6)',
      description: 'Proporción 1:1.5 fácil de seguir para desacelerar la mente.', defaultCycles: 12, recommendedDurationMinutes: 4,
      phases: [
        { id: 'inhale', label: 'Inhala', duration: 4, instruction: 'Inhala pausadamente por la nariz.', visualScale: 1.0 },
        { id: 'exhale', label: 'Exhala', duration: 6, instruction: 'Exhala largo y prolongado por la boca o nariz.', visualScale: 0.4 }
      ]
    },
    {
      id: 'prolonged-4-8', name: 'Profundo (4 - 8)',
      description: 'Proporción 1:2 para mayor desaceleración antes de dormir.', defaultCycles: 15, recommendedDurationMinutes: 6,
      phases: [
        { id: 'inhale', label: 'Inhala', duration: 4, instruction: 'Inhala tranquilo y constante.', visualScale: 1.0 },
        { id: 'exhale', label: 'Exhala', duration: 8, instruction: 'Suelta el aire muy lentamente, sin forzar la expulsión final.', visualScale: 0.4 }
      ]
    }
  ],
  safety: { level: 'low', warnings: ['Si sientes falta de aire al final de la exhalación, acorta la duración de salida.'], requiresConfirmation: false, automaticRecommendation: true },
  evidence: {
    summary: 'Ampliar la fase de expiración estimula las respuestas naturales de calma del organismo al disminuir la frecuencia cardíaca instantánea.',
    notes: 'Investigación sobre variabilidad de la frecuencia cardíaca (HRV).'
  }
};
