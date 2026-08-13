import { ExerciseDefinition } from '../../types/exercise';

export const alternateNostrilBreathing: ExerciseDefinition = {
  id: 'alternate-nostril-breathing', name: 'Respiración Alterna', aliases: ['Nadi Shodhana', 'Alternate Nostril Breathing'],
  description: 'Práctica tradicional que alterna el flujo respiratorio entre la fosa nasal izquierda y la derecha.',
  experience: {
    summary: 'Una práctica de respiración alterna que utiliza un patrón izquierda-derecha para mantener la atención sobre el ritmo y el gesto respiratorio.',
    intention: 'Explorar un patrón regular y dirigir la atención a cada lado de la respiración sin forzar el flujo.',
    sensoryNotes: ['Atención al cambio de lado en cada fase.', 'Percepción del flujo de aire y del movimiento de la mano.']
  },
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
    ],
    safety: { level: 'low', warnings: ['No fuerces el cierre de las fosas nasales. Si tienes congestión nasal o la práctica resulta incómoda, utiliza otra técnica.'], automaticRecommendation: false }
  }],
  safety: { level: 'low', warnings: ['No fuerces el cierre de las fosas nasales. Si tienes congestión nasal o la práctica resulta incómoda, detén la sesión.'], contraindications: ['Congestión nasal importante o dificultad para respirar por la nariz.'], requiresConfirmation: false, automaticRecommendation: false },
  evidence: {
    summary: 'La respiración alterna se ha investigado principalmente en relación con variables cardiovasculares y autonómicas. Una revisión sistemática de ensayos aleatorizados encontró resultados favorables sobre presión arterial, pero la heterogeneidad de los estudios limita las conclusiones generales.',
    notes: 'La evidencia no justifica describir Nadi Shodhana como una técnica que "equilibra" fisiológicamente los hemisferios, las fosas nasales o el sistema nervioso.',
    sources: [
      { type: 'systematic-review', citation: 'Effectiveness of Alternative Nostril Breathing on Blood Pressure: A Systematic Review and Meta-Analysis of Randomized Controlled Trials (2024)', url: 'https://pubmed.ncbi.nlm.nih.gov/39008954/' },
      { type: 'systematic-review', citation: 'Yogic Breathing Practices a Non-Pharmacological Alternative Medicine for Managing Pulmonary Functions of Healthy Adults: A Systematic Review and Meta-analysis (2026)', url: 'https://pubmed.ncbi.nlm.nih.gov/41969720/' }
    ]
  }
};
