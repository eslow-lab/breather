import { ExerciseDefinition } from '../../types/exercise';

export const lateralCostalBreathing: ExerciseDefinition = {
  id: 'lateral-costal-breathing', name: 'Respiración Costal Lateral', aliases: ['Respiración intercostal', 'Lateral Rib Breathing'],
  description: 'Dirige la inhalación hacia la expansión tridimensional de las costillas laterales e inferiores.',
  goals: ['regulate', 'focus'], difficulty: 'beginner', category: 'expansion', iconName: 'Maximize2',
  instructions: [
    'Coloca las palmas de las manos a los lados del tórax, sobre las costillas inferiores.',
    'Siente cómo las costillas se expanden hacia los lados y la espalda al inhalar.',
    'Siente cómo la caja torácica vuelve al centro suavemente al exhala.'
  ],
  protocols: [{
    id: 'lateral-4-5', name: 'Expansión Ligera (4 - 5)', description: 'Mobilización suave de la caja torácica.', defaultCycles: 10, recommendedDurationMinutes: 4,
    phases: [
      { id: 'inhale', label: 'Inhala Costal', duration: 4, instruction: 'Inhala dirigiendo el aire hacia los lados del tórax.', visualScale: 1.0 },
      { id: 'exhale', label: 'Exhala', duration: 5, instruction: 'Exhala sintiendo el retorno natural de las costillas.', visualScale: 0.4 }
    ]
  }],
  safety: { level: 'low', warnings: ['Evita elevar los hombros hacia las orejas durante la inhalación.'], requiresConfirmation: false, automaticRecommendation: true },
  evidence: { summary: 'Promueve la movilidad de la musculatura intercostal y una mayor percepción corporal de la caja torácica.', notes: 'Muy utilizada en educación vocal y técnicas de postura corporal.' }
};
