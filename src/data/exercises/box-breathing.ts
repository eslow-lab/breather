import { ExerciseDefinition } from '../../types/exercise';

export const boxBreathing: ExerciseDefinition = {
  id: 'box-breathing', name: 'Respiración en Caja', aliases: ['Box Breathing', 'Square Breathing', '4-4-4-4'],
  description: 'Estructura las cuatro fases de la respiración con igual duración para aportar orden y enfoque.',
  goals: ['focus', 'regulate'], difficulty: 'intermediate', category: 'box', iconName: 'Square',
  instructions: ['Inhala en 4 segundos.', 'Retén el aire con los pulmones llenos durante 4 segundos.', 'Exhala en 4 segundos.', 'Pausa con los pulmones vacíos durante 4 segundos.'],
  protocols: [
    {
      id: 'box-beginner-3', name: 'Caja Corta (3 - 3 - 3 - 3)', description: 'Duración reducida para acostumbrarse a la retención en vacío.', defaultCycles: 10, recommendedDurationMinutes: 3,
      phases: [
        { id: 'inhale', label: 'Inhala', duration: 3, instruction: 'Inhala llenando suavemente los pulmones.', visualScale: 1.0 },
        { id: 'hold', label: 'Retén (Lleno)', duration: 3, instruction: 'Mantén el aire con calma.', visualScale: 1.0 },
        { id: 'exhale', label: 'Exhala', duration: 3, instruction: 'Vacia los pulmones en un ritmo continuo.', visualScale: 0.4 },
        { id: 'pause', label: 'Pausa (Vacío)', duration: 3, instruction: 'Permanece en pausa sin bloquear la garganta.', visualScale: 0.4 }
      ]
    },
    {
      id: 'box-standard-4', name: 'Caja Clásica (4 - 4 - 4 - 4)', description: 'La estructura de 4 segundos ampliamente difundida.', defaultCycles: 12, recommendedDurationMinutes: 5,
      phases: [
        { id: 'inhale', label: 'Inhala', duration: 4, instruction: 'Inhala de forma uniforme.', visualScale: 1.0 },
        { id: 'hold', label: 'Retén', duration: 4, instruction: 'Retén el aire sintiendo estabilidad.', visualScale: 1.0 },
        { id: 'exhale', label: 'Exhala', duration: 4, instruction: 'Exhala en 4 tiempos fluidos.', visualScale: 0.4 },
        { id: 'pause', label: 'Pausa', duration: 4, instruction: 'Descansa en vacío sin esfuerzo.', visualScale: 0.4 }
      ]
    }
  ],
  safety: { level: 'moderate', warnings: ['Si sientes mareo o sensación de ahogo durante la pausa sin aire, reduce la duración a 2 o 3 segundos o pasa a una técnica sin retención.'], contraindications: ['Sensación aguda de ansiedad ante retenciones prolongadas.'], requiresConfirmation: false, automaticRecommendation: true },
  evidence: { summary: 'Proporciona una pauta metronómica estructurada que ayuda a centrar la atención mental en momentos de dispersión.', notes: 'Utilizada en contextos de alto rendimiento y entrenamiento de atención plena.' }
};
