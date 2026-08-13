import test, { afterEach, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { StorageService } from '../src/services/StorageService';
import { SessionRecord, UserPreferences } from '../src/types/session';

class MemoryStorage implements Storage {
  private data = new Map<string, string>();
  get length() { return this.data.size; }
  clear() { this.data.clear(); }
  getItem(key: string) { return this.data.get(key) ?? null; }
  key(index: number) { return Array.from(this.data.keys())[index] ?? null; }
  removeItem(key: string) { this.data.delete(key); }
  setItem(key: string, value: string) { this.data.set(key, value); }
}

const storage = new MemoryStorage();

beforeEach(() => {
  storage.clear();
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: storage,
  });
});

afterEach(() => {
  delete (globalThis as Record<string, unknown>).localStorage;
});

function session(index: number, overrides: Partial<SessionRecord> = {}): SessionRecord {
  return {
    id: `session-${index}`,
    timestamp: Date.now() - index * 1000,
    exerciseId: index % 2 === 0 ? 'box-breathing' : 'diaphragmatic-breathing',
    exerciseName: index % 2 === 0 ? 'Box' : 'Diaphragmatic',
    protocolId: 'protocol',
    protocolName: 'Protocol',
    plannedDurationSeconds: 120,
    actualDurationSeconds: 60,
    cyclesCompleted: 2,
    totalPlannedCycles: 4,
    completed: index % 2 === 0,
    ...overrides,
  };
}

test('returns stable default preferences when storage is empty', () => {
  const prefs = StorageService.getPreferences();
  assert.deepEqual(prefs, {
    theme: 'system',
    soundEnabled: true,
    soundMode: 'chime',
    hapticsEnabled: true,
    reducedMotion: false,
    language: 'es',
  });
});

test('round-trips preferences through localStorage', () => {
  const prefs: UserPreferences = {
    theme: 'dark',
    soundEnabled: false,
    soundMode: 'silent',
    hapticsEnabled: false,
    reducedMotion: true,
    language: 'en',
  };

  StorageService.savePreferences(prefs);
  assert.deepEqual(StorageService.getPreferences(), prefs);
});

test('stores newest sessions first and caps history at 500 records', () => {
  for (let i = 0; i < 501; i++) {
    StorageService.saveSession(session(i));
  }

  const sessions = StorageService.getSessions();
  assert.equal(sessions.length, 500);
  assert.equal(sessions[0].id, 'session-500');
  assert.equal(sessions[499].id, 'session-1');
});

test('derives session statistics from persisted records', () => {
  const now = Date.now();
  StorageService.saveSession(session(1, { timestamp: now, actualDurationSeconds: 90, completed: false }));
  StorageService.saveSession(session(2, { timestamp: now - 8 * 24 * 60 * 60 * 1000, actualDurationSeconds: 150, completed: true }));
  StorageService.saveSession(session(3, { timestamp: now, actualDurationSeconds: 120, completed: true }));

  const stats = StorageService.getStats();
  assert.equal(stats.totalSessions, 3);
  assert.equal(stats.totalCompletedSessions, 2);
  assert.equal(stats.totalMinutes, 6);
  assert.equal(stats.sessionsThisWeek, 2);
  assert.equal(stats.lastSessionTimestamp, now);
  assert.equal(stats.lastExerciseId, 'diaphragmatic-breathing');
});

test('clearAllData removes preferences and sessions', () => {
  StorageService.savePreferences(StorageService.getPreferences());
  StorageService.saveSession(session(1));

  StorageService.clearAllData();

  assert.equal(StorageService.getSessions().length, 0);
  assert.deepEqual(StorageService.getPreferences(), {
    theme: 'system',
    soundEnabled: true,
    soundMode: 'chime',
    hapticsEnabled: true,
    reducedMotion: false,
    language: 'es',
  });
});
