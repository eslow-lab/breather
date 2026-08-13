import { ExerciseDefinition } from '../../types/exercise';

export const boxBreathing: ExerciseDefinition = {
  id: 'box-breathing', name: 'Respiración en Caja', aliases: ['Box Breathing', 'Square Breathing', '4-4-4-4'],
  description: 'Estructura las cuatro fases de la respiración con igual duración para aportar orden y enfoque.',
  experience: {
    summary: 'Una práctica estructurada en cuatro fases de igual duración: inhalación, retención, exhalación y pausa.',
    intention: 'Explorar un ritmo regular y utilizar la atención sobre las cuatro fases como punto de enfoque.',
    sensoryNotes: ['Sensación de estructura y regularidad.', 'Atención al cambio entre las cuatro fases.']
  },
  goals: ['focus', 'regulate'], difficulty: 'intermediate', category: 'box', iconName: 'Square',
  instructions: ['Inhala en 4 segundos.', 'Retén el aire con los pulmones llenos durante 4 segundos.', 'Exhala en 4 segundos.', 'Pausa con los pulmones vacíos durante 4 segundos.'],
  protocols: [
    {
      id: 'box-beginner-3', name: 'Caja Corta (3 - 3 - 3 - 3)', description: 'Duración reducida para explorar las fases de retención.', defaultCycles: 10, recommendedDurationMinutes: 3,
      phases: [
        { id: 'inhale', label: 'Inhala', duration: 3, instruction: 'Inhala llenando suavemente los pulmones.', visualScale: 1.0 },
        { id: 'hold', label: 'Retén (Lleno)', duration: 3, instruction: 'Mantén el aire con calma, sin forzar.', visualScale: 1.0 },
        { id: 'exhale', label: 'Exhala', duration: 3, instruction: 'Vacía los pulmones con un ritmo continuo.', visualScale: 0.4 },
        { id: 'pause', label: 'Pausa (Vacío)', duration: 3, instruction: 'Permanece en pausa solo mientras resulte cómodo.', visualScale: 0.4 }
      ],
      safety: { level: 'moderate', warnings: ['Si la retención o la pausa resultan incómodas, reduce la duración o utiliza una técnica sin retención.'], automaticRecommendation: false }
    },
    {
      id: 'box-standard-4', name: 'Caja Clásica (4 - 4 - 4 - 4)', description: 'Cuatro fases de 4 segundos cada una.', defaultCycles: 12, recommendedDurationMinutes: 5,
      phases: [
        { id: 'inhale', label: 'Inhala', duration: 4, instruction: 'Inhala de forma uniforme.', visualScale: 1.0 },
        { id: 'hold', label: 'Retén', duration: 4, instruction: 'Retén el aire sin tensión.', visualScale: 1.0 },
        { id: 'exhale', label: 'Exhala', duration: 4, instruction: 'Exhala en 4 tiempos fluidos.', visualScale: 0.4 },
        { id: 'pause', label: 'Pausa', duration: 4, instruction: 'Descansa en vacío solo mientras resulte cómodo.', visualScale: 0.4 }
      ],
      safety: { level: 'moderate', warnings: ['Si sientes mareo, ahogo o ansiedad durante una retención o pausa, detén el protocolo y vuelve a una respiración natural.'], automaticRecommendation: false }
    }
  ],
  safety: { level: 'moderate', warnings: ['Las retenciones pueden resultar incómodas para algunas personas. Detén la práctica si aparece mareo, dolor, dificultad respiratoria o aumento de ansiedad.'], contraindications: ['No utilizar como sustituto de atención médica. Evitar la recomendación automática cuando las retenciones puedan resultar desencadenantes para el usuario.'], requiresConfirmation: false, automaticRecommendation: false },
  evidence: {
    summary: 'La respiración controlada puede influir en el estado de ansiedad y estrés, pero la evidencia de intervenciones breves es heterogénea y depende de la técnica concreta. La estructura de caja puede utilizarse como práctica de atención y ritmo, sin presentar un efecto clínico garantizado.',
    notes: 'Las revisiones disponibles recomiendan interpretar los resultados según el protocolo concreto y la respuesta individual.',
    sources: [
      { type: 'systematic-review', citation: 'A systematic review of brief respiratory, embodiment, cognitive, and mindfulness interventions to reduce state anxiety (2024)', url: 'https://pubmed.ncbi.nlm.nih.gov/38933581/' },
      { type: 'systematic-review', citation: 'A Systematic Review of Breathing Exercise Interventions: An Integrative Complementary Approach for Anxiety and Stress in Adult Populations (2024)', url: 'https://pubmed.ncbi.nlm.nih.gov/39150318/' },
      { type: 'review', citation: 'Breathing Practices for Stress and Anxiety Reduction: Conceptual Framework of Implementation Guidelines Based on a Systematic Review of the Published Literature (2024)', url: 'https://pubmed.ncbi.nlm.nih.gov/38137060/' }
    ]
  }
};
