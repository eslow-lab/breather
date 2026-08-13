import { ExerciseDefinition } from '../../types/exercise';

export const prolongedExhalation: ExerciseDefinition = {
  id: 'prolonged-exhalation',
  name: 'Exhalación Prolongada',
  aliases: ['Respiración 4-7-8 modificada', 'Extended Exhale'],
  description: 'Extiende el tiempo de exhalación en relación con la inhalación para facilitar una sensación de descanso.',
  experience: {
    summary: 'Una práctica de ritmo respiratorio en la que la salida de aire dura más que la entrada.',
    intention: 'Explorar un ritmo más lento y observar cómo responde tu cuerpo, sin forzar la exhalación.',
    sensoryNotes: ['Sensación de desaceleración del ritmo respiratorio.', 'Atención al recorrido suave y continuo de la exhalación.']
  },
  goals: ['calm', 'sleep'],
  difficulty: 'beginner',
  category: 'pacing',
  iconName: 'Moon',
  instructions: [
    'Inhala de manera constante sintiendo la entrada de aire.',
    'Exhala durante más tiempo que la inhalación, de forma fluida y sin forzar.',
    'Procura mantener los hombros relajados durante todo el ciclo.'
  ],
  protocols: [
    {
      id: 'prolonged-4-6', name: 'Suave (4 - 6)',
      description: 'Proporción 1:1.5 para explorar una exhalación algo más larga que la inhalación.', defaultCycles: 12, recommendedDurationMinutes: 4,
      phases: [
        { id: 'inhale', label: 'Inhala', duration: 4, instruction: 'Inhala pausadamente por la nariz.', visualScale: 1.0 },
        { id: 'exhale', label: 'Exhala', duration: 6, instruction: 'Exhala de forma larga y fluida por la boca o la nariz, sin forzar.', visualScale: 0.4 }
      ],
      safety: { level: 'low', warnings: ['Si la exhalación resulta incómoda o aparece sensación de falta de aire, acorta la salida o vuelve a una respiración natural.'], automaticRecommendation: true }
    },
    {
      id: 'prolonged-4-8', name: 'Profundo (4 - 8)',
      description: 'Proporción 1:2 para explorar una exhalación claramente más larga.', defaultCycles: 15, recommendedDurationMinutes: 6,
      phases: [
        { id: 'inhale', label: 'Inhala', duration: 4, instruction: 'Inhala tranquilo y constante.', visualScale: 1.0 },
        { id: 'exhale', label: 'Exhala', duration: 8, instruction: 'Suelta el aire lentamente, sin intentar vaciar los pulmones a la fuerza.', visualScale: 0.4 }
      ],
      safety: { level: 'low', warnings: ['Si 8 segundos resultan incómodos, utiliza el protocolo 4-6 o vuelve a una respiración natural.'], automaticRecommendation: false }
    }
  ],
  safety: { level: 'low', warnings: ['No fuerces la exhalación ni intentes vaciar completamente los pulmones. Detén la práctica si aparece mareo, dolor o dificultad respiratoria.'], requiresConfirmation: false, automaticRecommendation: true },
  evidence: {
    summary: 'La respiración controlada y lenta se ha estudiado en relación con el estrés y la ansiedad, pero la evidencia no permite atribuir un efecto específico y garantizado a prolongar la exhalación frente a otras pautas respiratorias.',
    notes: 'Las revisiones sistemáticas muestran resultados prometedores pero heterogéneos para las intervenciones respiratorias. La respuesta puede depender de la técnica y de la persona.',
    sources: [
      { type: 'systematic-review', citation: 'A Systematic Review of Breathing Exercise Interventions: An Integrative Complementary Approach for Anxiety and Stress in Adult Populations (2024)', url: 'https://pubmed.ncbi.nlm.nih.gov/39150318/' },
      { type: 'systematic-review', citation: 'A systematic review of brief respiratory, embodiment, cognitive, and mindfulness interventions to reduce state anxiety (2024)', url: 'https://pubmed.ncbi.nlm.nih.gov/38933581/' },
      { type: 'review', citation: 'Breathing Practices for Stress and Anxiety Reduction: Conceptual Framework of Implementation Guidelines Based on a Systematic Review of the Published Literature (2024)', url: 'https://pubmed.ncbi.nlm.nih.gov/38137060/' }
    ]
  }
};
