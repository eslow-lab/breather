import test, { afterEach, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { BreathingEngine } from '../src/engine/BreathingEngine';
import { audioService } from '../src/services/AudioService';
import { hapticsService } from '../src/services/HapticsService';
import { Protocol } from '../src/types/exercise';

const protocol: Protocol = {
  id: 'integration-protocol',
  name: 'Integration',
  description: 'Deterministic integration protocol',
  defaultCycles: 1,
  phases: [
    { id: 'inhale', label: 'Inhala', duration: 1, instruction: 'Inhala' },
    { id: 'exhale', label: 'Exhala', duration: 1, instruction: 'Exhala' },
  ],
};

let now = 0;
let rafCallbacks: Array<FrameRequestCallback> = [];

beforeEach(() => {
  now = 0;
  rafCallbacks = [];
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
      return rafCallbacks.length;
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
  rafCallbacks.shift()?.(now);
}

test('engine phase events drive audio and haptic cues', () => {
  const audioCalls: string[] = [];
  const hapticCalls: string[] = [];
  const originalAudioCue = audioService.playPhaseCue;
  const originalHapticCue = hapticsService.triggerPhaseHaptic;

  audioService.playPhaseCue = (phaseType) => audioCalls.push(phaseType);
  hapticsService.triggerPhaseHaptic = (phaseType) => hapticCalls.push(phaseType);

  try {
    const engine = new BreathingEngine({ protocol });
    engine.subscribe((eventType, state) => {
      if (eventType === 'PHASE_STARTED' && state.currentPhase) {
        audioService.playPhaseCue(state.currentPhase.definition.id);
        hapticsService.triggerPhaseHaptic(state.currentPhase.definition.id);
      }
    });

    engine.start();
    tick(1000);

    assert.deepEqual(audioCalls, ['inhale', 'exhale']);
    assert.deepEqual(hapticCalls, ['inhale', 'exhale']);
  } finally {
    audioService.playPhaseCue = originalAudioCue;
    hapticsService.triggerPhaseHaptic = originalHapticCue;
  }
});

test('session completion event drives completion audio and haptic feedback', () => {
  let completionAudioCalls = 0;
  let completionHapticCalls = 0;
  const originalAudio = audioService.playCompletionChime;
  const originalHaptic = hapticsService.triggerCompletion;

  audioService.playCompletionChime = () => { completionAudioCalls++; };
  hapticsService.triggerCompletion = () => { completionHapticCalls++; };

  try {
    const engine = new BreathingEngine({ protocol });
    engine.subscribe((eventType) => {
      if (eventType === 'SESSION_COMPLETED') {
        audioService.playCompletionChime();
        hapticsService.triggerCompletion();
      }
    });

    engine.start();
    tick(2000);

    assert.equal(completionAudioCalls, 1);
    assert.equal(completionHapticCalls, 1);
    assert.equal(engine.getState().status, 'completed');
  } finally {
    audioService.playCompletionChime = originalAudio;
    hapticsService.triggerCompletion = originalHaptic;
  }
});
