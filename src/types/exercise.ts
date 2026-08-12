export type Goal = 'calm' | 'sleep' | 'focus' | 'regulate' | 'explore';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type ExerciseCategory = 
  | 'diaphragmatic'
  | 'pacing'
  | 'box'
  | 'pranayama'
  | 'expansion'
  | 'sighing';

export type PhaseType = 'inhale' | 'hold' | 'exhale' | 'pause';

export interface PhaseDefinition {
  id: PhaseType;
  label: string;             // e.g., "Inhala", "Retén", "Exhala", "Pausa"
  duration: number;          // duration in seconds
  instruction: string;       // detailed instruction e.g. "Inhala por la nariz inflando el abdomen"
  visualScale?: number;      // target visual scale ratio (e.g. 1.0 for inhale, 0.4 for exhale)
}

export interface Protocol {
  id: string;
  name: string;              // e.g., "Principiante", "Estándar", "Avanzado"
  description: string;
  phases: PhaseDefinition[];
  defaultCycles: number;
  recommendedDurationMinutes?: number;
}

export interface SafetyDefinition {
  level: 'low' | 'moderate' | 'advanced';
  warnings: string[];
  contraindications?: string[];
  requiresConfirmation: boolean;
  automaticRecommendation: boolean;
}

export interface EvidenceDefinition {
  summary: string;
  notes?: string;
}

export interface ExerciseDefinition {
  id: string;
  name: string;
  aliases?: string[];
  description: string;
  goals: Goal[];
  difficulty: Difficulty;
  category: ExerciseCategory;
  protocols: Protocol[];
  instructions: string[];
  safety: SafetyDefinition;
  evidence: EvidenceDefinition;
  iconName?: string;
}
