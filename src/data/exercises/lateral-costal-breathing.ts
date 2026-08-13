import { ExerciseDefinition } from '../../types/exercise';

export const lateralCostalBreathing: ExerciseDefinition = {
  id: 'lateral-costal-breathing', name: 'Respiración Costal Lateral', aliases: ['Respiración intercostal', 'Lateral Rib Breathing'],
  description: 'Dirige la inhalación hacia la expansión tridimensional de las costillas laterales e inferiores.',
  experience: {
    summary: 'Una práctica de conciencia corporal centrada en percibir el movimiento lateral e inferior de la caja torácica durante la respiración.',
    intention: 'Explorar el movimiento de las costillas sin intentar dirigir físicamente el aire hacia una zona concreta.',
    sensoryNotes: ['Percepción de expansión alrededor de las costillas.', 'Atención al movimiento suave de la caja torácica.']
  },
  goals: ['regulate', 'focus'], difficulty: 'beginner', category: 'expansion', iconName: 'Maximize2',
  instructions: [
    'Coloca las palmas de las manos a los lados del tórax, sobre las costillas inferiores.',
    'Siente cómo las costillas se expanden hacia los lados y la espalda al inhalar.',
    'Siente cómo la caja torácica vuelve al centro suavemente al exhalar.'
  ],
  protocols: [{
    id: 'lateral-4-5', name: 'Expansión Ligera (4 - 5)', description: 'Movilización suave de la caja torácica.', defaultCycles: 10, recommendedDurationMinutes: 4,
    phases: [
      { id: 'inhale', label: 'Inhala Costal', duration: 4, instruction: 'Inhala observando la expansión de las costillas laterales.', visualScale: 1.0 },
      { id: 'exhale', label: 'Exhala', duration: 5, instruction: 'Exhala sintiendo el retorno natural de las costillas.', visualScale: 0.4 }
    ]
  }],
  safety: { level: 'low', warnings: ['Evita elevar los hombros o forzar una expansión máxima. Si aparece dolor, dificultad respiratoria o mareo, detén la práctica.'], requiresConfirmation: false, automaticRecommendation: true },
  evidence: {
    summary: 'La respiración controlada puede utilizarse para desarrollar conciencia del patrón respiratorio, pero la evidencia disponible no permite atribuir a esta variante concreta un beneficio fisiológico específico y garantizado en población general.',
    notes: 'La evidencia sobre ejercicios respiratorios es heterogénea y depende de la técnica, población y protocolo estudiado.',
    sources: [
      { type: 'systematic-review', citation: 'A Systematic Review of Breathing Exercise Interventions: An Integrative Complementary Approach for Anxiety and Stress in Adult Populations (2024)', url: 'https://pubmed.ncbi.nlm.nih.gov/39150318/' },
      { type: 'systematic-review', citation: 'Breathing Practices for Stress and Anxiety Reduction: Conceptual Framework of Implementation Guidelines Based on a Systematic Review of the Published Literature (2024)', url: 'https://pubmed.ncbi.nlm.nih.gov/38137060/' }
    ]
  }
};
