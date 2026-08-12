import { SessionRecord, UserPreferences, UserStats } from '../types/session';

const SESSIONS_KEY = 'breather_sessions_v1';
const PREFS_KEY = 'breather_preferences_v1';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  soundEnabled: true,
  soundMode: 'chime',
  hapticsEnabled: true,
  reducedMotion: false,
  language: 'es',
};

export class StorageService {
  public static getPreferences(): UserPreferences {
    if (typeof localStorage === 'undefined') return DEFAULT_PREFERENCES;
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (!raw) return DEFAULT_PREFERENCES;
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }

  public static savePreferences(prefs: UserPreferences): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.warn('Failed to save preferences:', e);
    }
  }

  public static getSessions(): SessionRecord[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const raw = localStorage.getItem(SESSIONS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  public static saveSession(session: SessionRecord): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const sessions = StorageService.getSessions();
      sessions.unshift(session); // Store newest first
      // Limit local storage history to last 500 records
      const trimmed = sessions.slice(0, 500);
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(trimmed));
    } catch (e) {
      console.warn('Failed to save session record:', e);
    }
  }

  public static getStats(): UserStats {
    const sessions = StorageService.getSessions();
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalCompletedSessions: 0,
        totalMinutes: 0,
        sessionsThisWeek: 0,
      };
    }

    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

    let totalSec = 0;
    let completedCount = 0;
    let weekCount = 0;
    const exerciseCounts: Record<string, number> = {};

    sessions.forEach((s) => {
      totalSec += s.actualDurationSeconds;
      if (s.completed) completedCount++;
      if (s.timestamp >= oneWeekAgo) weekCount++;
      exerciseCounts[s.exerciseId] = (exerciseCounts[s.exerciseId] || 0) + 1;
    });

    // Find favorite exercise
    let favoriteExerciseId: string | undefined = undefined;
    let maxCount = 0;
    Object.entries(exerciseCounts).forEach(([id, count]) => {
      if (count > maxCount) {
        maxCount = count;
        favoriteExerciseId = id;
      }
    });

    return {
      totalSessions: sessions.length,
      totalCompletedSessions: completedCount,
      totalMinutes: Math.round(totalSec / 60),
      sessionsThisWeek: weekCount,
      favoriteExerciseId,
      lastSessionTimestamp: sessions[0]?.timestamp,
      lastExerciseId: sessions[0]?.exerciseId,
    };
  }

  public static clearAllData(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.removeItem(SESSIONS_KEY);
      localStorage.removeItem(PREFS_KEY);
    } catch (e) {
      console.warn('Failed to clear local data:', e);
    }
  }
}
