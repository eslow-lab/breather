import { ExerciseDefinition } from '../types/exercise';

export const EXERCISES: ExerciseDefinition[] = [
  {
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
          {
            id: 'inhale',
            label: 'Inhala',
            duration: 4,
            instruction: 'Inhala por la nariz expandiendo suavemente el abdomen.',
            visualScale: 1.0
          },
          {
            id: 'exhale',
            label: 'Exhala',
            duration: 6,
            instruction: 'Exhala suavemente dejando que el abdomen descienda.',
            visualScale: 0.4
          }
        ]
      },
      {
        id: 'diaphragmatic-standard',
        name: 'Estándar (4 - 2 - 6)',
        description: 'Añade una pausa cómoda tras la inhalación para asentarse en el ritmo.',
        defaultCycles: 15,
        recommendedDurationMinutes: 5,
        phases: [
          {
            id: 'inhale',
            label: 'Inhala',
            duration: 4,
            instruction: 'Inhala suave y profundo hacia el abdomen.',
            visualScale: 1.0
          },
          {
            id: 'hold',
            label: 'Retén',
            duration: 2,
            instruction: 'Mantén el aire cómodamente sin tensión.',
            visualScale: 1.0
          },
          {
            id: 'exhale',
            label: 'Exhala',
            duration: 6,
            instruction: 'Libera el aire despacio y sin prisa.',
            visualScale: 0.4
          }
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
  },
  {
    id: 'prolonged-exhalation',
    name: 'Exhalación Prolongada',
    aliases: ['Respiración 4-7-8 modificada', 'Extended Exhale'],
    description: 'Extiende el tiempo de exhalación en relación con la inhalación para facilitar una sensación de descanso.',
    goals: ['calm', 'sleep'],
    difficulty: 'beginner',
    category: 'pacing',
    iconName: 'Moon',
    instructions: [
      'Inhala de manera constante sintiendo la entrada de aire.',
      'Exhala el doble de tiempo o de forma más prolongada y fluida.',
      'Procura mantener los hombros relajados durante todo el ciclo.'
    ],
    protocols: [
      {
        id: 'prolonged-4-6',
        name: 'Suave (4 - 6)',
        description: 'Proporción 1:1.5 fácil de seguir para desacelerar la mente.',
        defaultCycles: 12,
        recommendedDurationMinutes: 4,
        phases: [
          {
            id: 'inhale',
            label: 'Inhala',
            duration: 4,
            instruction: 'Inhala pausadamente por la nariz.',
            visualScale: 1.0
          },
          {
            id: 'exhale',
            label: 'Exhala',
            duration: 6,
            instruction: 'Exhala largo y prolongado por la boca o nariz.',
            visualScale: 0.4
          }
        ]
      },
      {
        id: 'prolonged-4-8',
        name: 'Profundo (4 - 8)',
        description: 'Proporción 1:2 para mayor desaceleración antes de dormir.',
        defaultCycles: 15,
        recommendedDurationMinutes: 6,
        phases: [
          {
            id: 'inhale',
            label: 'Inhala',
            duration: 4,
            instruction: 'Inhala tranquilo y constante.',
            visualScale: 1.0
          },
          {
            id: 'exhale',
            label: 'Exhala',
            duration: 8,
            instruction: 'Suelta el aire muy lentamente, sin forzar la expulsión final.',
            visualScale: 0.4
          }
        ]
      }
    ],
    safety: {
      level: 'low',
      warnings: ['Si sientes falta de aire al final de la exhalación, acorta la duración de salida.'],
      requiresConfirmation: false,
      automaticRecommendation: true
    },
    evidence: {
      summary: 'Ampliar la fase de expiración estimula las respuestas naturales de calma del organismo al disminuir la frecuencia cardíaca instantánea.',
      notes: 'Investigación sobre variabilidad de la frecuencia cardíaca (HRV).'
    }
  },
  {
    id: 'pursed-lip-breathing',
    name: 'Labios Fruncidos',
    aliases: ['Pursed Lip Breathing'],
    description: 'Crea una ligera resistencia al expulsar el aire a través de los labios entreabiertos.',
    goals: ['regulate', 'calm'],
    difficulty: 'beginner',
    category: 'pacing',
    iconName: 'Wind',
    instructions: [
      'Inhala normalmente por la nariz durante unos 2 segundos.',
      'Frunce los labios suavemente como si fueras a apagar una vela o silbar.',
      'Exhala despacio a través de los labios fruncidos durante unos 4 segundos.'
    ],
    protocols: [
      {
        id: 'pursed-standard',
        name: 'Ritmo 2 - 4',
        description: 'Pauta clásica de liberación gradual de presión y control de flujo.',
        defaultCycles: 15,
        recommendedDurationMinutes: 3,
        phases: [
          {
            id: 'inhale',
            label: 'Inhala',
            duration: 2,
            instruction: 'Inhala suavemente por la nariz.',
            visualScale: 1.0
          },
          {
            id: 'exhale',
            label: 'Exhala',
            duration: 4,
            instruction: 'Exhala despacio entre los labios fruncidos sin soplar con fuerza.',
            visualScale: 0.4
          }
        ]
      }
    ],
    safety: {
      level: 'low',
      warnings: ['No soples con fuerza excesiva; la salida de aire debe ser fluida y sin tensión facial.'],
      requiresConfirmation: false,
      automaticRecommendation: true
    },
    evidence: {
      summary: 'Esta técnica ayuda a ralentizar el flujo ventilatorio y promover una exhalación completa y placentera.',
      notes: 'Frecuentemente recomendada como ejercicio básico de higiene respiratoria.'
    }
  },
  {
    id: 'box-breathing',
    name: 'Respiración en Caja',
    aliases: ['Box Breathing', 'Square Breathing', '4-4-4-4'],
    description: 'Estructura las cuatro fases de la respiración con igual duración para aportar orden y enfoque.',
    goals: ['focus', 'regulate'],
    difficulty: 'intermediate',
    category: 'box',
    iconName: 'Square',
    instructions: [
      'Inhala en 4 segundos.',
      'Retén el aire con los pulmones llenos durante 4 segundos.',
      'Exhala en 4 segundos.',
      'Pausa con los pulmones vacíos durante 4 segundos.'
    ],
    protocols: [
      {
        id: 'box-beginner-3',
        name: 'Caja Corta (3 - 3 - 3 - 3)',
        description: 'Duración reducida para acostumbrarse a la retención en vacío.',
        defaultCycles: 10,
        recommendedDurationMinutes: 3,
        phases: [
          {
            id: 'inhale',
            label: 'Inhala',
            duration: 3,
            instruction: 'Inhala llenando suavemente los pulmones.',
            visualScale: 1.0
          },
          {
            id: 'hold',
            label: 'Retén (Lleno)',
            duration: 3,
            instruction: 'Mantén el aire con calma.',
            visualScale: 1.0
          },
          {
            id: 'exhale',
            label: 'Exhala',
            duration: 3,
            instruction: 'Vacia los pulmones en un ritmo continuo.',
            visualScale: 0.4
          },
          {
            id: 'pause',
            label: 'Pausa (Vacío)',
            duration: 3,
            instruction: 'Permanece en pausa sin bloquear la garganta.',
            visualScale: 0.4
          }
        ]
      },
      {
        id: 'box-standard-4',
        name: 'Caja Clásica (4 - 4 - 4 - 4)',
        description: 'La estructura de 4 segundos ampliamente difundida.',
        defaultCycles: 12,
        recommendedDurationMinutes: 5,
        phases: [
          {
            id: 'inhale',
            label: 'Inhala',
            duration: 4,
            instruction: 'Inhala de forma uniforme.',
            visualScale: 1.0
          },
          {
            id: 'hold',
            label: 'Retén',
            duration: 4,
            instruction: 'Retén el aire sintiendo estabilidad.',
            visualScale: 1.0
          },
          {
            id: 'exhale',
            label: 'Exhala',
            duration: 4,
            instruction: 'Exhala en 4 tiempos fluidos.',
            visualScale: 0.4
          },
          {
            id: 'pause',
            label: 'Pausa',
            duration: 4,
            instruction: 'Descansa en vacío sin esfuerzo.',
            visualScale: 0.4
          }
        ]
      }
    ],
    safety: {
      level: 'moderate',
      warnings: [
        'Si sientes mareo o sensación de ahogo durante la pausa sin aire, reduce la duración a 2 o 3 segundos o pasa a una técnica sin retención.'
      ],
      contraindications: ['Sensación aguda de ansiedad ante retenciones prolongadas.'],
      requiresConfirmation: false,
      automaticRecommendation: true
    },
    evidence: {
      summary: 'Proporciona una pauta metronómica estructurada que ayuda a centrar la atención mental en momentos de dispersión.',
      notes: 'Utilizada en contextos de alto rendimiento y entrenamiento de atención plena.'
    }
  },
  {
    id: 'alternate-nostril-breathing',
    name: 'Respiración Alterna',
    aliases: ['Nadi Shodhana', 'Alternate Nostril Breathing'],
    description: 'Práctica tradicional que alterna el flujo respiratorio entre la fosa nasal izquierda y la derecha.',
    goals: ['focus', 'regulate', 'calm'],
    difficulty: 'intermediate',
    category: 'pranayama',
    iconName: 'GitMerge',
    instructions: [
      'Tapa suavemente la fosa nasal derecha con el pulgar e inhala por la izquierda.',
      'Tapa la fosa izquierda con el anular, libera la derecha y exhala por la derecha.',
      'Inhala por la fosa derecha, tápala y exhala por la izquierda para completar un ciclo.'
    ],
    protocols: [
      {
        id: 'alternate-smooth-4-4',
        name: 'Fluido (4 - 4)',
        description: 'Inhalación y exhalación equilibradas de 4 segundos sin retención.',
        defaultCycles: 10,
        recommendedDurationMinutes: 5,
        phases: [
          {
            id: 'inhale',
            label: 'Inhala Izquierda',
            duration: 4,
            instruction: 'Cierra fosa derecha con el pulgar. Inhala por la fosa izquierda.',
            visualScale: 1.0
          },
          {
            id: 'exhale',
            label: 'Exhala Derecha',
            duration: 4,
            instruction: 'Cierra fosa izquierda. Libera la derecha y exhala suavemente.',
            visualScale: 0.4
          },
          {
            id: 'inhale',
            label: 'Inhala Derecha',
            duration: 4,
            instruction: 'Mantén la fosa izquierda cerrada. Inhala por la derecha.',
            visualScale: 1.0
          },
          {
            id: 'exhale',
            label: 'Exhala Izquierda',
            duration: 4,
            instruction: 'Cierra fosa derecha. Libera la izquierda y exhala totalmente.',
            visualScale: 0.4
          }
        ]
      }
    ],
    safety: {
      level: 'low',
      warnings: ['No fuerces el cierre de las fosas nasales. Si tienes congestión nasal, realiza otra técnica.'],
      contraindications: ['Congestión nasal o inflamación en senos paranasales.'],
      requiresConfirmation: false,
      automaticRecommendation: true
    },
    evidence: {
      summary: 'Favorece una concentración enfocada al requerir atención táctil y postural continua.',
      notes: 'Práctica milenaria de equilibrado de atención.'
    }
  },
  {
    id: 'lateral-costal-breathing',
    name: 'Respiración Costal Lateral',
    aliases: ['Respiración intercostal', 'Lateral Rib Breathing'],
    description: 'Dirige la inhalación hacia la expansión tridimensional de las costillas laterales e inferiores.',
    goals: ['regulate', 'focus'],
    difficulty: 'beginner',
    category: 'expansion',
    iconName: 'Maximize2',
    instructions: [
      'Coloca las palmas de las manos a los lados del tórax, sobre las costillas inferiores.',
      'Siente cómo las costillas se expanden hacia los lados y la espalda al inhalar.',
      'Siente cómo la caja torácica vuelve al centro suavemente al exhala.'
    ],
    protocols: [
      {
        id: 'lateral-4-5',
        name: 'Expansión Ligera (4 - 5)',
        description: 'Mobilización suave de la caja torácica.',
        defaultCycles: 10,
        recommendedDurationMinutes: 4,
        phases: [
          {
            id: 'inhale',
            label: 'Inhala Costal',
            duration: 4,
            instruction: 'Inhala dirigiendo el aire hacia los lados del tórax.',
            visualScale: 1.0
          },
          {
            id: 'exhale',
            label: 'Exhala',
            duration: 5,
            instruction: 'Exhala sintiendo el retorno natural de las costillas.',
            visualScale: 0.4
          }
        ]
      }
    ],
    safety: {
      level: 'low',
      warnings: ['Evita elevar los hombros hacia las orejas durante la inhalación.'],
      requiresConfirmation: false,
      automaticRecommendation: true
    },
    evidence: {
      summary: 'Promueve la movilidad de la musculatura intercostal y una mayor percepción corporal de la caja torácica.',
      notes: 'Muy utilizada en educación vocal y técnicas de postura corporal.'
    }
  },
  {
    id: 'cyclic-sighing',
    name: 'Suspiro Cíclico',
    aliases: ['Cyclic Sighing', 'Physiological Sigh', 'Doble Inhalación'],
    description: 'Consiste en dos inhalaciones consecutivas por la nariz seguidas de una exhalación larga y relajada por la boca.',
    goals: ['calm', 'regulate'],
    difficulty: 'intermediate',
    category: 'sighing',
    iconName: 'Zap',
    instructions: [
      'Inhala por la nariz hasta llenar la mayor parte de tus pulmones.',
      'Sin exhala, realiza un segundo sorbo corto de aire al final para abrir completamente el espacio respiratorio.',
      'Exhala lentamente y por completo a través de la boca en un suspiro largo.'
    ],
    protocols: [
      {
        id: 'cyclic-sigh-standard',
        name: 'Suspiro Fisiológico (3+1 - 6)',
        description: 'Doble inhalación (3s principal + 1s sorbo) y exhalación de 6 segundos.',
        defaultCycles: 10,
        recommendedDurationMinutes: 3,
        phases: [
          {
            id: 'inhale',
            label: 'Inhala Principal',
            duration: 3,
            instruction: 'Inhala profundo por la nariz.',
            visualScale: 0.8
          },
          {
            id: 'inhale',
            label: 'Sorbo Final',
            duration: 1,
            instruction: 'Toma un segundo sorbo corto de aire por la nariz.',
            visualScale: 1.0
          },
          {
            id: 'exhale',
            label: 'Exhala Suspirando',
            duration: 6,
            instruction: 'Exhala de forma prolongada y liberadora por la boca.',
            visualScale: 0.4
          }
        ]
      }
    ],
    safety: {
      level: 'low',
      warnings: ['No hiperventiles realizando inhalaciones demasiado rápidas o agresivas.'],
      requiresConfirmation: false,
      automaticRecommendation: true
    },
    evidence: {
      summary: 'Investigaciones recientes sugieren que realizar suspiros fisiológicos breves ayuda a reajustar de forma rápida el estado de alerta del sistema nervioso.',
      notes: 'Estudiado en laboratorios de neurobiología como un mecanismo eficaz de autorregulación del estresor inmediato.'
    }
  }
];
