import test from 'node:test';
import assert from 'node:assert/strict';
import { AudioService } from '../src/services/AudioService';

class MockGainNode {
  connect() {}
  gain = {
    setValueAtTime() {},
    linearRampToValueAtTime() {},
    exponentialRampToValueAtTime() {},
  };
}

class MockOscillatorNode {
  type = '';
  frequency = {
    setValueAtTime: (...args: number[]) => {
      this.frequencyCalls.push(args);
    },
    exponentialRampToValueAtTime: (...args: number[]) => {
      this.frequencyCalls.push(args);
    },
  };
  frequencyCalls: number[][] = [];
  started = false;
  stopped = false;
  connect() {}
  start() { this.started = true; }
  stop() { this.stopped = true; }
}

class MockAudioContext {
  state: AudioContextState = 'suspended';
  currentTime = 10;
  oscillators: MockOscillatorNode[] = [];
  resumeCalls = 0;
  destination = {};

  createOscillator() {
    const oscillator = new MockOscillatorNode();
    this.oscillators.push(oscillator);
    return oscillator;
  }

  createGain() {
    return new MockGainNode();
  }

  resume() {
    this.resumeCalls++;
    this.state = 'running';
    return Promise.resolve();
  }
}

function installAudioContext() {
  const contexts: MockAudioContext[] = [];
  class TestAudioContext extends MockAudioContext {
    constructor() {
      super();
      contexts.push(this);
    }
  }

  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { AudioContext: TestAudioContext },
  });

  return contexts;
}

test('unlockAudio lazily creates and resumes the audio context', async () => {
  const contexts = installAudioContext();
  const service = new AudioService();

  service.unlockAudio();
  await Promise.resolve();

  assert.equal(contexts.length, 1);
  assert.equal(contexts[0].resumeCalls, 1);
  assert.equal(contexts[0].state, 'running');
});

test('muted audio does not create oscillators', () => {
  const contexts = installAudioContext();
  const service = new AudioService();
  service.setMuted(true);

  service.playPhaseCue('inhale');

  assert.equal(contexts.length, 0);
});

test('phase cues create the expected oscillator lifecycle', async () => {
  const contexts = installAudioContext();
  const service = new AudioService();

  service.playPhaseCue('inhale');
  await Promise.resolve();

  assert.equal(contexts.length, 1);
  assert.equal(contexts[0].oscillators.length, 1);
  assert.equal(contexts[0].oscillators[0].started, true);
  assert.equal(contexts[0].oscillators[0].stopped, true);
  assert.equal(contexts[0].oscillators[0].frequencyCalls[0], [432, 10]);
});

test('completion chime schedules three oscillators', () => {
  const contexts = installAudioContext();
  const service = new AudioService();

  service.playCompletionChime();

  assert.equal(contexts.length, 1);
  assert.equal(contexts[0].oscillators.length, 3);
  assert.deepEqual(
    contexts[0].oscillators.map((oscillator) => oscillator.frequencyCalls[0][0]),
    [528, 660, 792],
  );
});
