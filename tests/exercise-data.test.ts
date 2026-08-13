import test from 'node:test';
import assert from 'node:assert/strict';
import { EXERCISES } from '../src/data/exercises';
import { getProtocolSafety } from '../src/engine/recommendations';

test('exercise catalog has unique exercise ids', () => {
  const ids = EXERCISES.map((exercise) => exercise.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('exercise catalog has valid protocols and phases', () => {
  for (const exercise of EXERCISES) {
    assert.ok(exercise.protocols.length > 0, `${exercise.id} has no protocols`);
    for (const protocol of exercise.protocols) {
      assert.ok(protocol.id.length > 0);
      assert.ok(protocol.defaultCycles > 0);
      assert.ok(protocol.phases.length > 0);
      for (const phase of protocol.phases) {
        assert.ok(phase.duration > 0, `${exercise.id}/${protocol.id} has invalid phase duration`);
        assert.ok(phase.label.length > 0);
        assert.ok(phase.instruction.length > 0);
      }
    }
  }
});

test('protocol safety overrides are resolved without losing exercise safety', () => {
  const exercise = EXERCISES.find((item) => item.id === 'diaphragmatic-breathing');
  assert.ok(exercise);
  const protocol = exercise.protocols.find((item) => item.id === 'diaphragmatic-standard');
  assert.ok(protocol);

  const safety = getProtocolSafety(exercise, protocol);
  assert.equal(safety.level, 'moderate');
  assert.equal(safety.automaticRecommendation, false);
  assert.ok(safety.warnings.length > 0);
});

test('evidence remains separate from user-facing description', () => {
  for (const exercise of EXERCISES) {
    assert.ok(exercise.description.length > 0);
    assert.ok(exercise.evidence.summary.length > 0);
  }
});
