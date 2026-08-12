import assert from 'node:assert/strict';
import test, { afterEach, beforeEach } from 'node:test';
import { BreathingEngine } from '../src/engine/BreathingEngine';
import { Protocol } from '../src/types/exercise';

const protocol: Protocol = {
  id: 'test-protocol',
  name: 'Test',
  description: 'Deterministic engine test protocol',
  defaultCycles: 2,
  phases: [
    { id: 'inhale', label: 'Inhala', duration: 2, instruction: 'Inhala' },
    { id: 'exhale', label: 'Exhala', duration: 3, instruction: 'Exhala' },
  ],
};

let now = 0;
let rafCallbacks: Array<FrameRequestCallback> = [];
let nextFrameId = 1;

beforeEach(() => {
  now = 0;
  rafCallbacks = [];
  nextFrameId = 1;

  Object.defineProperty(globalThis, 'performance', {
    configurable: true,
    value: { now: () => now },
  });

  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {},
  });

  Object.defineProperty(globalThis, 'requestAnimationFrame', {
    configurable: true,
    value: (callback: FrameRequestCallback) => {
      rafCallbacks.push(callback);
      return nextFrameId++;
    },
  });

  Object.defineProperty(globalThis, 'cancelAnimationFrame', {
    configurable: true,
    value: () => undefined,
  });
});

afterEach(() => {
  delete (globalThis as Record<string, unknown>).window;
});

function tick(ms: number) {
  now += ms;
  const callback = rafCallbacks.shift();
  callback?.(now);
}

test('starts from the first phase without drift in planned duration', () => {
  const engine = new BreathingEngine({ protocol });
  engine.start();

  let state = engine.getState();
  assert.equal(state.status, 'running');
  assert.equal(state.currentPhase?.definition.id, 'inhale');
  assert.equal(state.currentCycle, 1);
  assert.equal(state.totalPlannedDuration, 10);

  tick(2000);
  state = engine.getState();
  assert.equal(state.currentPhase?.definition.id, 'exhale');
  assert.equal(state.currentCycle, 1);

  tick(3000);
  state = engine.getState();
  assert.equal(state.currentPhase?.definition.id, 'inhale');
  assert.equal(state.currentCycle, 2);
});

test('pause freezes elapsed time and resume continues from the same phase position', () => {
  const engine = new BreathingEngine({ protocol });
  engine.start();

  tick(1000);
  engine.pause();
  const paused = engine.getState();

  now += 5000;
  const stillPaused = engine.getState();
  assert.equal(stillPaused.status, 'paused');
  assert.equal(stillPaused.totalElapsed, paused.totalElapsed);
  assert.equal(stillPaused.currentPhase?.remainingInPhase, paused.currentPhase?.remainingInPhase);

  engine.resume();
  tick(1000);
  const resumed = engine.getState();
  assert.equal(resumed.status, 'running');
  assert.equal(resumed.currentPhase?.definition.id, 'exhale');
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
