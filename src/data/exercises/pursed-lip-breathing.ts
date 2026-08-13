import { ExerciseDefinition } from '../../types/exercise';

export const pursedLipBreathing: ExerciseDefinition = {
  id: 'pursed-lip-breathing', name: 'Labios Fruncidos', aliases: ['Pursed Lip Breathing'],
  description: 'Crea una ligera resistencia al expulsar el aire a través de los labios entreabiertos.',
  goals: ['regulate', 'calm'], difficulty: 'beginner', category: 'pacing', iconName: 'Wind',
  instructions: [
    'Inhala normalmente por la nariz durante unos 2 segundos.',
    'Frunce los labios suavemente como si fueras a apagar una vela o silbar.',
    'Exhala despacio a través de los labios fruncidos durante unos 4 segundos.'
  ],
  protocols: [{
    id: 'pursed-standard', name: 'Ritmo 2 - 4',
    description: 'Pauta clásica de liberación gradual de presión y control de flujo.', defaultCycles: 15, recommendedDurationMinutes: 3,
    phases: [
      { id: 'inhale', label: 'Inhala', duration: 2, instruction: 'Inhala suavemente por la nariz.', visualScale: 1.0 },
      { id: 'exhale', label: 'Exhala', duration: 4, instruction: 'Exhala despacio entre los labios fruncidos sin soplar con fuerza.', visualScale: 0.4 }
    ]
  }],
  safety: { level: 'low', warnings: ['No soples con fuerza excesiva; la salida de aire debe ser fluida y sin tensión facial.'], requiresConfirmation: false, automaticRecommendation: true },
  evidence: { summary: 'Esta técnica ayuda a ralentizar el flujo ventilatorio y promover una exhalación completa y placentera.', notes: 'Frecuentemente recomendada como ejercicio básico de higiene respiratoria.' }
};
