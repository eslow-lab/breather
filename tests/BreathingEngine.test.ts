import { test, expect, vi, beforeEach, afterEach } from 'vitest';
import { BreathingEngine } from '../src/engine/BreathingEngine';

const protocol = {
  id: 'test',
  name: 'Test Protocol',
  phases: [
    { id: 'inhale', name: 'Inhale', duration: 2 },
    { id: 'exhale', name: 'Exhale', duration: 3 },
  ],
  defaultCycles: 1,
};

let now = 0;
const tick = (ms: number) => {
  now += ms;
  vi.spyOn(performance, 'now').mockReturnValue(now);
  vi.advanceTimersByTime(ms);
};

beforeEach(() => {
  now = 0;
  vi.useFakeTimers();
  vi.spyOn(performance, 'now').mockReturnValue(now);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

test('multiple pause and resume cycles exclude all paused time from the timeline', () => {
  const engine = new BreathingEngine({ protocol });
  engine.start();

  tick(1000);
  engine.pause();
  now += 5000;
  engine.resume();

  tick(1000);
  engine.pause();
  now += 10000;
  engine.resume();

  tick(1000);
  const state = engine.getState();

  assert.equal(state.status, 'running');
  assert.equal(state.currentPhase?.definition.id, 'exhale');
  assert.equal(state.currentPhase?.elapsedInPhase, 1);
  assert.equal(state.currentPhase?.remainingInPhase, 2);
  assert.equal(state.totalElapsed, 3);
  assert.equal(state.totalRemaining, 2);
});

test('stop emits an aborted state and does not restart the engine', () => {
  const engine = new BreathingEngine({ protocol });
  const events: string[] = [];
  engine.subscribe((event) => events.push(event));
  engine.start();
  tick(500);
  engine.stop();
  engine.start();

  assert.equal(engine.getState().status, 'aborted');
  assert.equal(events.includes('SESSION_ABORTED'), true);
  assert.equal(events.filter((event) => event === 'SESSION_STARTED').length, 1);
});

test('catches up across multiple phases when a frame is delayed', () => {
  const engine = new BreathingEngine({ protocol });
  engine.start();

  tick(6000);

  const state = engine.getState();
  assert.equal(state.status, 'completed');
  assert.equal(state.totalElapsed, 5);
  assert.equal(state.totalRemaining, 0);
});