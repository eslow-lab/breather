export interface SessionRecord {
  id: string;
  timestamp: number;         // Unix timestamp ms
  exerciseId: string;
  exerciseName: string;
  protocolId: string;
  protocolName: string;
  plannedDurationSeconds: number;
  actualDurationSeconds: number;
  cyclesCompleted: number;
  totalPlannedCycles: number;
  completed: boolean;        // true if finished, false if aborted
  note?: string;             // optional user reflection (e.g. feeling after session)
}

export interface UserStats {
  totalSessions: number;
  totalCompletedSessions: number;
  totalMinutes: number;
  sessionsThisWeek: number;
  favoriteExerciseId?: string;
  lastSessionTimestamp?: number;
  lastExerciseId?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  soundEnabled: boolean;
  soundMode: 'silent' | 'chime' | 'voice_chime' | 'binaural';
  hapticsEnabled: boolean;
  reducedMotion: boolean;
  language: 'es' | 'en';
}
