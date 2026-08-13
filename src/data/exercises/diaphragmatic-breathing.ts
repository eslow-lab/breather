import { ExerciseDefinition } from '../../types/exercise';

export const diaphragmaticBreathing: ExerciseDefinition = {
  id: 'diaphragmatic-breathing',
  name: 'Respiración Diafragmática',
  aliases: ['Respiración abdominal', 'Belly breathing'],
  description: 'Enfoca la inhalación hacia la expansión del abdomen promoviendo un ritmo lento y profundo.',
  experience: {
    summary: 'Una práctica de respiración lenta y consciente centrada en percibir el movimiento suave del abdomen.',
    intention: 'Explora un ritmo cómodo y presta atención a cómo se mueve el cuerpo sin forzar la respiración.',
    sensoryNotes: [
      'Puedes notar el movimiento del abdomen durante la inhalación y la exhalación.',
      'Mantén hombros, mandíbula y abdomen sin tensión innecesaria.'
    ]
  },
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
      description: 'Ritmo suave para explorar la respiración diafragmática sin retención.',
      defaultCycles: 10,
      recommendedDurationMinutes: 3,
      phases: [
        { id: 'inhale', label: 'Inhala', duration: 4, instruction: 'Inhala por la nariz expandiendo suavemente el abdomen.', visualScale: 1.0 },
        { id: 'exhale', label: 'Exhala', duration: 6, instruction: 'Exhala suavemente dejando que el abdomen descienda.', visualScale: 0.4 }
      ],
      safety: {
        level: 'low',
        automaticRecommendation: true
      }
    },
    {
      id: 'diaphragmatic-standard',
      name: 'Estándar (4 - 2 - 6)',
      description: 'Añade una pausa breve y cómoda tras la inhalación.',
      defaultCycles: 15,
      recommendedDurationMinutes: 5,
      phases: [
        { id: 'inhale', label: 'Inhala', duration: 4, instruction: 'Inhala suave y profundo hacia el abdomen.', visualScale: 1.0 },
        { id: 'hold', label: 'Retén', duration: 2, instruction: 'Mantén el aire cómodamente sin tensión.', visualScale: 1.0 },
        { id: 'exhale', label: 'Exhala', duration: 6, instruction: 'Libera el aire despacio y sin prisa.', visualScale: 0.4 }
      ],
      safety: {
        level: 'moderate',
        warnings: ['Si la retención resulta incómoda, reduce o elimina la pausa y continúa con el protocolo sin retención.'],
        automaticRecommendation: false
      }
    }
  ],
  safety: {
    level: 'low',
    warnings: [
      'No fuerces el volumen de aire ni intentes inflar el abdomen de manera exagerada.',
      'Si aparece mareo, falta de aire o malestar, detén la práctica y vuelve a una respiración natural.'
    ],
    requiresConfirmation: false,
    automaticRecommendation: true
  },
  evidence: {
    summary: 'La respiración diafragmática se ha estudiado como una intervención de respiración controlada para el estrés y otros resultados de salud. La evidencia reciente es prometedora, pero los protocolos y la calidad metodológica de los estudios son heterogéneos.',
    notes: 'Una revisión sistemática de 2026 incluyó 48 ensayos aleatorizados y encontró beneficios consistentes para ansiedad y algunos otros resultados, pero señaló una heterogeneidad considerable y un riesgo de sesgo relevante. Una revisión cuantitativa anterior también encontró señales de reducción del estrés, aunque solo pudo incluir tres estudios y no pudo realizar un metaanálisis por heterogeneidad.',
    sources: [
      {
        type: 'systematic-review',
        citation: 'Kwon CY, Won J, Lee B. The health effects of diaphragmatic breathing: A systematic review. Complementary Therapies in Medicine. 2026;96:103317.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/41482169/',
        accessedAt: '2026-08-13'
      },
      {
        type: 'systematic-review',
        citation: 'Hopper S, Murray S, Ferrara L, Singleton J. Effectiveness of diaphragmatic breathing for reducing physiological and psychological stress in adults: a quantitative systematic review. JBI Database of Systematic Reviews and Implementation Reports. 2019;17(9):1855-1876.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/31436595/',
        accessedAt: '2026-08-13'
      }
    ]
  }
};
