import { ExerciseDefinition } from '../../types/exercise';

export const cyclicSighing: ExerciseDefinition = {
  id: 'cyclic-sighing', name: 'Suspiro Cíclico', aliases: ['Cyclic Sighing', 'Physiological Sigh', 'Doble Inhalación'],
  description: 'Consiste en dos inhalaciones consecutivas por la nariz seguidas de una exhalación larga y relajada por la boca.',
  goals: ['calm', 'regulate'], difficulty: 'intermediate', category: 'sighing', iconName: 'Zap',
  instructions: [
    'Inhala por la nariz hasta llenar la mayor parte de tus pulmones.',
    'Sin exhala, realiza un segundo sorbo corto de aire al final para abrir completamente el espacio respiratorio.',
    'Exhala lentamente y por completo a través de la boca en un suspiro largo.'
  ],
  protocols: [{
    id: 'cyclic-sigh-standard', name: 'Suspiro Fisiológico (3+1 - 6)', description: 'Doble inhalación (3s principal + 1s sorbo) y exhalación de 6 segundos.', defaultCycles: 10, recommendedDurationMinutes: 3,
    phases: [
      { id: 'inhale', label: 'Inhala Principal', duration: 3, instruction: 'Inhala profundo por la nariz.', visualScale: 0.8 },
      { id: 'inhale', label: 'Sorbo Final', duration: 1, instruction: 'Toma un segundo sorbo corto de aire por la nariz.', visualScale: 1.0 },
      { id: 'exhale', label: 'Exhala Suspirando', duration: 6, instruction: 'Exhala de forma prolongada y liberadora por la boca.', visualScale: 0.4 }
    ]
  }],
  safety: { level: 'low', warnings: ['No hiperventiles realizando inhalaciones demasiado rápidas o agresivas.'], requiresConfirmation: false, automaticRecommendation: true },
  evidence: { summary: 'Investigaciones recientes sugieren que realizar suspiros fisiológicos breves ayuda a reajustar de forma rápida el estado de alerta del sistema nervioso.', notes: 'Estudiado en laboratorios de neurobiología como un mecanismo eficaz de autorregulación del estresor inmediato.' }
};
