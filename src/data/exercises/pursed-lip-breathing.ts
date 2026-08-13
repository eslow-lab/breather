import { ExerciseDefinition } from '../../types/exercise';

export const pursedLipBreathing: ExerciseDefinition = {
  id: 'pursed-lip-breathing', name: 'Labios Fruncidos', aliases: ['Pursed Lip Breathing'],
  description: 'Crea una ligera resistencia al expulsar el aire a través de los labios entreabiertos.',
  experience: {
    summary: 'Una técnica que hace más lenta y controlada la salida del aire mediante labios suavemente fruncidos.',
    intention: 'Explorar una exhalación estable y fluida sin aumentar el esfuerzo.',
    sensoryNotes: ['Resistencia ligera al paso del aire.', 'Atención a la suavidad de la exhalación y a la relajación facial.']
  },
  goals: ['regulate', 'calm'], difficulty: 'beginner', category: 'pacing', iconName: 'Wind',
  instructions: [
    'Inhala normalmente por la nariz durante unos 2 segundos.',
    'Frunce los labios suavemente como si fueras a apagar una vela o silbar.',
    'Exhala despacio a través de los labios fruncidos durante unos 4 segundos.'
  ],
  protocols: [{
    id: 'pursed-standard', name: 'Ritmo 2 - 4',
    description: 'Pauta de inhalación de 2 segundos y exhalación de 4 segundos.', defaultCycles: 15, recommendedDurationMinutes: 3,
    phases: [
      { id: 'inhale', label: 'Inhala', duration: 2, instruction: 'Inhala suavemente por la nariz.', visualScale: 1.0 },
      { id: 'exhale', label: 'Exhala', duration: 4, instruction: 'Exhala despacio entre los labios fruncidos sin soplar con fuerza.', visualScale: 0.4 }
    ],
    safety: { level: 'low', warnings: ['Mantén la salida de aire suave. Si aparece dificultad respiratoria o malestar, detén la práctica y vuelve a respirar con normalidad.'], automaticRecommendation: false }
  }],
  safety: { level: 'low', warnings: ['No soples con fuerza excesiva ni fuerces una exhalación completa. Esta técnica tiene evidencia clínica especialmente en personas con enfermedad pulmonar, por lo que Breather no debe presentarla como tratamiento médico para la población general.'], requiresConfirmation: false, automaticRecommendation: false },
  evidence: {
    summary: 'La respiración con labios fruncidos se ha estudiado especialmente en personas con enfermedad pulmonar obstructiva, donde puede ayudar a reducir la disnea y modificar algunos parámetros respiratorios. No debemos extrapolar estos resultados como beneficios clínicos garantizados para personas sanas.',
    notes: 'La evidencia disponible para población con enfermedad pulmonar es de calidad baja a moderada según la revisión y depende del resultado evaluado.',
    sources: [
      { type: 'systematic-review', citation: 'Among non-pharmacological interventions, breathing strategies reduce dyspnoea and improve quality of life in adults with stable chronic lung disease: a systematic review (2025)', url: 'https://pubmed.ncbi.nlm.nih.gov/40987623/' },
      { type: 'systematic-review', citation: 'Breathing techniques to reduce symptoms in people with serious respiratory illness: a systematic review (2024)', url: 'https://pubmed.ncbi.nlm.nih.gov/39477355/' },
      { type: 'systematic-review', citation: 'Effects of acute use of pursed-lips breathing during exercise in patients with COPD: a systematic review and meta-analysis (2018)', url: 'https://pubmed.ncbi.nlm.nih.gov/28969859/' }
    ]
  }
};
