import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { BreathingSession } from '../src/components/session/BreathingSession';
import { audioService } from '../src/services/AudioService';
import { hapticsService } from '../src/services/HapticsService';

const originalWindow = (globalThis as any).window;
const originalRaf = (globalThis as any).requestAnimationFrame;
const originalCancelRaf = (globalThis as any).cancelAnimationFrame;
const originalPerformance = globalThis.performance;

let now = 0;
let nextFrameId = 1;
const frames = new Map<number, FrameRequestCallback>();

function installClockAndRaf() {
  now = 0;
  nextFrameId = 1;
  frames.clear();
  (globalThis as any).window = {};
  (globalThis as any).requestAnimationFrame = (callback: FrameRequestCallback) => {
    const id = nextFrameId++;
    frames.set(id, callback);
    return id;
  };
  (globalThis as any).cancelAnimationFrame = (id: number) => {
    frames.delete(id);
  };
  Object.defineProperty(globalThis, 'performance', {
    configurable: true,
    value: { now: () => now },
  });
}

function restoreClockAndRaf() {
  if (originalWindow === undefined) delete (globalThis as any).window;
  else (globalThis as any).window = originalWindow;
  if (originalRaf === undefined) delete (globalThis as any).requestAnimationFrame;
  else (globalThis as any).requestAnimationFrame = originalRaf;
  if (originalCancelRaf === undefined) delete (globalThis as any).cancelAnimationFrame;
  else (globalThis as any).cancelAnimationFrame = originalCancelRaf;
  Object.defineProperty(globalThis, 'performance', {
    configurable: true,
    value: originalPerformance,
  });
  frames.clear();
}

function runNextFrame() {
  const entry = frames.entries().next().value as [number, FrameRequestCallback] | undefined;
  if (!entry) return;
  const [id, callback] = entry;
  frames.delete(id);
  callback(now);
}

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
  phases: [{ id: 'inhale', type: 'inhale', duration: 1 }],
  defaultCycles: 1,
} as any;

const preferences = {
  soundEnabled: true,
  hapticsEnabled: true,
  reducedMotion: false,
} as any;

let renderer: ReactTestRenderer | null = null;

beforeEach(() => {
  installClockAndRaf();
});

afterEach(() => {
  renderer?.unmount();
  renderer = null;
  restoreClockAndRaf();
});

function render(props: Partial<React.ComponentProps<typeof BreathingSession>> = {}) {
  renderer = create(
    <BreathingSession
      exercise={exercise}
      protocol={protocol}
      preferences={preferences}
      onUpdatePreferences={() => {}}
      onClose={() => {}}
      onCompleteSession={() => {}}
      onAbortSession={() => {}}
      {...props}
    />,
  );
  return renderer;
}

test('mount starts the real engine and unmount stops it', () => {
  const unlockAudio = audioService.unlockAudio;
  let unlockCalls = 0;
  audioService.unlockAudio = () => { unlockCalls++; };

  render();

  assert.equal(unlockCalls, 1);
  assert.ok(renderer?.root);

  audioService.unlockAudio = unlockAudio;
});

test('real engine phase-start event triggers audio and haptics', () => {
  const playPhaseCue = audioService.playPhaseCue;
  const triggerPhaseHaptic = hapticsService.triggerPhaseHaptic;
  let audioCalls = 0;
  let hapticCalls = 0;
  let phaseType = '';

  audioService.playPhaseCue = (type: string) => {
    audioCalls++;
    phaseType = type;
  };
  hapticsService.triggerPhaseHaptic = (type: string) => {
    hapticCalls++;
    phaseType = type;
  };

  render();

  assert.equal(audioCalls, 1);
  assert.equal(hapticCalls, 1);
  assert.equal(phaseType, 'inhale');

  audioService.playPhaseCue = playPhaseCue;
  hapticsService.triggerPhaseHaptic = triggerPhaseHaptic;
});

test('real engine completion triggers completion feedback and completed UI', () => {
  const playCompletionChime = audioService.playCompletionChime;
  const triggerCompletion = hapticsService.triggerCompletion;
  let audioCalls = 0;
  let hapticCalls = 0;

  audioService.playCompletionChime = () => { audioCalls++; };
  hapticsService.triggerCompletion = () => { hapticCalls++; };

  render();

  act(() => {
    now = 1000;
    runNextFrame();
  });

  assert.equal(audioCalls, 1);
  assert.equal(hapticCalls, 1);
  assert.ok(renderer?.root.findAllByType('section').length > 0);

  audioService.playCompletionChime = playCompletionChime;
  hapticsService.triggerCompletion = triggerCompletion;
});

test('pause and resume preserve the active timeline of the real engine', () => {
  const renderer = render();

  now = 400;
  act(() => runNextFrame());

  const pauseButton = renderer.root.findAllByType('button').find((button) => button.props['aria-label'] === 'Pausar sesión');
  assert.ok(pauseButton);
  act(() => pauseButton?.props.onClick());

  now = 5400;
  const resumeButton = renderer.root.findAllByType('button').find((button) => button.props['aria-label'] === 'Reanudar sesión');
  assert.ok(resumeButton);
  act(() => resumeButton?.props.onClick());

  now = 6000;
  act(() => runNextFrame());

  assert.ok(renderer.root.findAllByType('section').length > 0);
});

test('stop records an aborted session and closes the real session', () => {
  let abortedRecord: any = null;
  let closed = false;

  const renderer = render({
    onClose: () => { closed = true; },
    onAbortSession: (record) => { abortedRecord = record; },
  });

  now = 500;
  act(() => runNextFrame());

  const stopButton = renderer.root.findAllByType('button').find((button) => button.props['aria-label'] === 'Finalizar o salir de la sesión');
  assert.ok(stopButton);
  act(() => stopButton?.props.onClick());

  assert.equal(closed, true);
  assert.equal(abortedRecord?.completed, false);
  assert.equal(abortedRecord?.actualDurationSeconds, 0.5);
});
