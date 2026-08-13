import { ExerciseDefinition } from '../../types/exercise';

export const diaphragmaticBreathing: ExerciseDefinition = {
  id: 'diaphragmatic-breathing',
  name: 'Respiración Diafragmática',
  aliases: ['Respiración abdominal', 'Belly breathing'],
  description: 'Enfoca la inhalación hacia la expansión del abdomen promoviendo un ritmo lento y profundo.',
  goals: ['calm', 'regulate'],
  difficulty: 'beginner',
  category: 'diaphragmatic',
  iconName: 'Activity',
  instructions: [
    'Coloca una mano sobre el pecho y la otra sobre el abdomen.',
    'Inhala lentamente por la nariz, permitiendo que el abdomen se eleve suavemente mientras el pecho permanece quieto.',
    'Exhala de forma pausada por la boca o la nariz, sintiendo cómo el abdomen vuelve a descender.'
  ],
  protocols: [
    {
      id: 'diaphragmatic-beginner',
      name: 'Principiante (4 - 6)',
      description: 'Ritmo suave ideal para iniciar la toma de conciencia del patrón diafragmático.',
      defaultCycles: 10,
      recommendedDurationMinutes: 3,
      phases: [
        { id: 'inhale', label: 'Inhala', duration: 4, instruction: 'Inhala por la nariz expandiendo suavemente el abdomen.', visualScale: 1.0 },
        { id: 'exhale', label: 'Exhala', duration: 6, instruction: 'Exhala suavemente dejando que el abdomen descienda.', visualScale: 0.4 }
      ]
    },
    {
      id: 'diaphragmatic-standard',
      name: 'Estándar (4 - 2 - 6)',
      description: 'Añade una pausa cómoda tras la inhalación para asentarse en el ritmo.',
      defaultCycles: 15,
      recommendedDurationMinutes: 5,
      phases: [
        { id: 'inhale', label: 'Inhala', duration: 4, instruction: 'Inhala suave y profundo hacia el abdomen.', visualScale: 1.0 },
        { id: 'hold', label: 'Retén', duration: 2, instruction: 'Mantén el aire cómodamente sin tensión.', visualScale: 1.0 },
        { id: 'exhale', label: 'Exhala', duration: 6, instruction: 'Libera el aire despacio y sin prisa.', visualScale: 0.4 }
      ]
    }
  ],
  safety: {
    level: 'low',
    warnings: ['No fuerces el volumen de aire ni intentes inflar el abdomen de manera exagerada.'],
    requiresConfirmation: false,
    automaticRecommendation: true
  },
  evidence: {
    summary: 'La respiración diafragmática ha sido estudiada como una técnica básica de autoregulación fisiológica que favorece la reducción de la tensión física.',
    notes: 'Ampliamente utilizada en programas de mindfulness y relajación muscular progresiva.'
  }
};
