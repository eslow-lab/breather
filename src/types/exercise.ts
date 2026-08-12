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
  label: string;
  duration: number;
  instruction: string;
  visualScale?: number;
}

export interface SafetyDefinition {
  level: 'low' | 'moderate' | 'advanced';
  warnings: string[];
  contraindications?: string[];
  requiresConfirmation: boolean;
  automaticRecommendation: boolean;
}

export interface Protocol {
  id: string;
  name: string;
  description: string;
  phases: PhaseDefinition[];
  defaultCycles: number;
  recommendedDurationMinutes?: number;
  /** Optional protocol-specific override. When absent, exercise-level safety applies. */
  safety?: Partial<SafetyDefinition>;
}

export interface EvidenceDefinition {
  summary: string;
  notes?: string;
  sources?: EvidenceSource[];
}

export interface EvidenceSource {
  type: 'guideline' | 'systematic-review' | 'review' | 'trial' | 'textbook' | 'other';
  citation: string;
  url?: string;
  accessedAt?: string;
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
