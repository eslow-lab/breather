import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { BreathingSession } from '../src/components/session/BreathingSession';
import { audioService } from '../src/services/AudioService';
import { hapticsService } from '../src/services/HapticsService';

const engineMocks = { start: 0, stop: 0, pause: 0, resume: 0 };
const subscriptions: Array<(event: string, state: any) => void> = [];

class MockEngine {
  constructor(_: any) {}
  start() { engineMocks.start++; }
  stop() { engineMocks.stop++; }
  pause() { engineMocks.pause++; }
  resume() { engineMocks.resume++; }
  subscribe(callback: (event: string, state: any) => void) {
    subscriptions.push(callback);
    return () => {
      const index = subscriptions.indexOf(callback);
      if (index >= 0) subscriptions.splice(index, 1);
    };
  }
}

const audio = audioService as any;
const haptics = hapticsService as any;

const exercise = {
  id: 'test-exercise',
  name: 'Test Exercise',
  description: 'Test',
  category: 'breathing',
  protocols: [],
  safety: { level: 'beginner', warnings: [], contraindications: [], requiresConfirmation: false },
  evidence: { summary: 'Test', sources: [] },
} as any;

const protocol = {
  id: 'test-protocol',
  name: 'Test Protocol',
  phases: [{ id: 'inhale', type: 'inhale', duration: 2 }],
  defaultCycles: 1,
} as any;

const preferences = {
  soundEnabled: true,
  hapticsEnabled: true,
  reducedMotion: false,
} as any;

function render() {
  return TestRenderer.create(
    <BreathingSession
      exercise={exercise}
      protocol={protocol}
      preferences={preferences}
      onUpdatePreferences={() => {}}
      onClose={() => {}}
      onCompleteSession={() => {}}
      onAbortSession={() => {}}
    />,
  );
}

test('mount starts the engine and unmount cleans it up', () => {
  engineMocks.start = 0;
  engineMocks.stop = 0;
  const renderer = render();
  assert.equal(engineMocks.start, 1);
  renderer.unmount();
  assert.equal(engineMocks.stop, 1);
});

test('phase-start events trigger audio and haptics', () => {
  const playPhaseCue = audio.playPhaseCue;
  const triggerPhaseHaptic = haptics.triggerPhaseHaptic;
  let audioCalls = 0;
  let hapticCalls = 0;
  audio.playPhaseCue = () => { audioCalls++; };
  haptics.triggerPhaseHaptic = () => { hapticCalls++; };

  const renderer = render();
  act(() => subscriptions[0]?.('PHASE_STARTED', {
    status: 'running',
    currentPhase: { definition: { id: 'inhale' } },
  }));

  assert.equal(audioCalls, 1);
  assert.equal(hapticCalls, 1);
  renderer.unmount();
  audio.playPhaseCue = playPhaseCue;
  haptics.triggerPhaseHaptic = triggerPhaseHaptic;
});

test('completion event triggers completion feedback', () => {
  const playCompletionChime = audio.playCompletionChime;
  const triggerCompletion = haptics.triggerCompletion;
  let audioCalls = 0;
  let hapticCalls = 0;
  audio.playCompletionChime = () => { audioCalls++; };
  haptics.triggerCompletion = () => { hapticCalls++; };

  const renderer = render();
  act(() => subscriptions[0]?.('SESSION_COMPLETED', {
    status: 'completed',
    currentCycle: 1,
    totalCycles: 1,
    totalElapsed: 2,
  }));

  assert.equal(audioCalls, 1);
  assert.equal(hapticCalls, 1);
  renderer.unmount();
  audio.playCompletionChime = playCompletionChime;
  haptics.triggerCompletion = triggerCompletion;
});
