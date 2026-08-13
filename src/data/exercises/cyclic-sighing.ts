import { ExerciseDefinition } from '../../types/exercise';

export const cyclicSighing: ExerciseDefinition = {
  id: 'cyclic-sighing', name: 'Suspiro Cíclico', aliases: ['Cyclic Sighing', 'Physiological Sigh', 'Doble Inhalación'],
  description: 'Consiste en dos inhalaciones consecutivas por la nariz seguidas de una exhalación larga y relajada por la boca.',
  experience: {
    summary: 'Una práctica de dos inhalaciones consecutivas seguidas de una exhalación larga y cómoda.',
    intention: 'Explorar un patrón breve de suspiro sin convertir la segunda inhalación en una inhalación máxima o forzada.',
    sensoryNotes: ['Percepción de una segunda entrada de aire corta.', 'Atención a una exhalación larga y relajada.']
  },
  goals: ['calm', 'regulate'], difficulty: 'intermediate', category: 'sighing', iconName: 'Zap',
  instructions: [
    'Inhala por la nariz hasta llenar cómodamente los pulmones.',
    'Sin exhalar, realiza un segundo sorbo corto de aire por la nariz.',
    'Exhala lentamente por la boca, sin forzar el final de la salida.'
  ],
  protocols: [{
    id: 'cyclic-sigh-standard', name: 'Suspiro Fisiológico (3+1 - 6)', description: 'Doble inhalación (3s principal + 1s sorbo) y exhalación de 6 segundos.', defaultCycles: 10, recommendedDurationMinutes: 3,
    phases: [
      { id: 'inhale', label: 'Inhala Principal', duration: 3, instruction: 'Inhala cómodamente por la nariz.', visualScale: 0.8 },
      { id: 'inhale', label: 'Sorbo Final', duration: 1, instruction: 'Toma un segundo sorbo corto de aire por la nariz, sin forzar.', visualScale: 1.0 },
      { id: 'exhale', label: 'Exhala Suspirando', duration: 6, instruction: 'Exhala de forma prolongada y relajada por la boca.', visualScale: 0.4 }
    ],
    safety: { level: 'moderate', warnings: ['No hagas inhalaciones rápidas, máximas o agresivas. Si aparece mareo, hormigueo, sensación de ahogo o malestar, detén la práctica y respira con normalidad.'], automaticRecommendation: false }
  }],
  safety: { level: 'moderate', warnings: ['La doble inhalación puede resultar estimulante o incómoda para algunas personas. Mantén ambas inhalaciones suaves y detén la práctica ante mareo, dolor, dificultad respiratoria o aumento de ansiedad.'], requiresConfirmation: false, automaticRecommendation: false },
  evidence: {
    summary: 'El suspiro cíclico se ha estudiado como una intervención breve de respiración controlada y muestra resultados prometedores para algunos indicadores de estado de ánimo, ansiedad y estrés, pero la evidencia sigue siendo limitada y específica del protocolo.',
    notes: 'No debe presentarse como un mecanismo demostrado para "reajustar" el sistema nervioso ni como tratamiento de la ansiedad.',
    sources: [
      { type: 'systematic-review', citation: 'A systematic review of brief respiratory, embodiment, cognitive, and mindfulness interventions to reduce state anxiety (2024)', url: 'https://pubmed.ncbi.nlm.nih.gov/38933581/' },
      { type: 'trial', citation: 'Cyclic sighing in the clinic waiting room may decrease pain: results from a pilot randomized controlled trial (2025)', url: 'https://pubmed.ncbi.nlm.nih.gov/39904867/' }
    ]
  }
};
