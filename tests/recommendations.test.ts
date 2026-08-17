import test from 'node:test';
import assert from 'node:assert/strict';
import { recommendProtocol, getProtocolSafety } from '../src/engine/recommendations';
import type { ExerciseDefinition } from '../src/types/exercise';

const baseExercise = (overrides: Partial<ExerciseDefinition> = {}): ExerciseDefinition => ({
  id: 'test-exercise',
  name: 'Test Exercise',
  aliases: [],
  description: 'Test',
  goals: ['calm'],
  difficulty: 'beginner',
  category: 'pacing',
  iconName: 'Activity',
  instructions: [],
  protocols: [{
    id: 'test-protocol',
    name: 'Test Protocol',
    description: 'Test',
    defaultCycles: 5,
    recommendedDurationMinutes: 3,
    phases: [{ id: 'inhale', label: 'Inhala', duration: 4, instruction: 'Inhala', visualScale: 1 }],
  }],
  safety: {
    level: 'low',
    warnings: [],
    requiresConfirmation: false,
    automaticRecommendation: true,
  },
  evidence: { summary: 'Test', notes: 'Test' },
  ...overrides,
});

test('recommendProtocol selects a safe protocol matching the requested goal', () => {
  const result = recommendProtocol([baseExercise()], { goal: 'calm' });
  assert.equal(result?.exercise.id, 'test-exercise');
  assert.equal(result?.protocol.id, 'test-protocol');
});

test('recommendProtocol returns null when no protocol is eligible for automatic recommendation', () => {
  const exercise = baseExercise({
    safety: { level: 'moderate', warnings: [], requiresConfirmation: true, automaticRecommendation: false },
  });
  assert.equal(recommendProtocol([exercise], { goal: 'calm' }), null);
});

test('recommendProtocol respects goal and difficulty filters', () => {
  const exercise = baseExercise({ goals: ['sleep'] });
  assert.equal(recommendProtocol([exercise], { goal: 'calm' }), null);
  assert.equal(recommendProtocol([exercise], { goal: 'sleep', difficulty: 'advanced' }), null);
});

test('recommendProtocol respects excluded exercise ids', () => {
  assert.equal(
    recommendProtocol([baseExercise()], { goal: 'calm', excludeExerciseIds: ['test-exercise'] }),
    null,
  );
});

test('getProtocolSafety lets protocol safety override exercise safety', () => {
  const exercise = baseExercise();
  const protocol = {
    ...exercise.protocols[0],
    safety: { level: 'moderate' as const, warnings: ['Protocol warning'], requiresConfirmation: true, automaticRecommendation: false },
  };
  const safety = getProtocolSafety(exercise, protocol);
  assert.equal(safety.level, 'moderate');
  assert.deepEqual(safety.warnings, ['Protocol warning']);
  assert.equal(safety.requiresConfirmation, true);
  assert.equal(safety.automaticRecommendation, false);
});
