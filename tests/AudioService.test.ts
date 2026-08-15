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

class MockStereoPannerNode {
  connect() {}
  pan = {
    setValueAtTime() {},
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

  createStereoPanner() {
    return new MockStereoPannerNode();
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
    value: {
      AudioContext: TestAudioContext,
      speechSynthesis: {
        spoken: [] as string[],
        cancel() {},
        speak(utterance: { text: string }) {
          this.spoken.push(utterance.text);
        },
      },
    },
  });

  Object.defineProperty(globalThis, 'SpeechSynthesisUtterance', {
    configurable: true,
    value: class {
      constructor(public text: string) {}
      lang = '';
      rate = 1;
      pitch = 1;
      volume = 1;
    },
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

test('silent sound mode does not create an audio context', () => {
  const contexts = installAudioContext();
  const service = new AudioService();
  service.setSoundMode('silent');

  service.playPhaseCue('inhale');
  service.playCompletionCue();

  assert.equal(service.getSoundMode(), 'silent');
  assert.equal(contexts.length, 0);
});

test('chime sound mode creates one oscillator for a phase cue', () => {
  const contexts = installAudioContext();
  const service = new AudioService();
  service.setSoundMode('chime');

  service.playPhaseCue('inhale');

  assert.equal(service.getSoundMode(), 'chime');
  assert.equal(contexts.length, 1);
  assert.equal(contexts[0].oscillators.length, 1);
});

test('voice plus chime mode speaks the phase and creates chime audio', () => {
  const contexts = installAudioContext();
  const service = new AudioService();
  service.setSoundMode('voice_chime');

  service.playPhaseCue('exhale');

  assert.equal(service.getSoundMode(), 'voice_chime');
  assert.equal(contexts.length, 1);
  assert.equal(contexts[0].oscillators.length, 1);
  assert.deepEqual((globalThis as any).window.speechSynthesis.spoken, ['Exhala']);
});

test('binaural sound mode creates two oscillators for a phase cue', () => {
  const contexts = installAudioContext();
  const service = new AudioService();
  service.setSoundMode('binaural');

  service.playPhaseCue('hold');

  assert.equal(service.getSoundMode(), 'binaural');
  assert.equal(contexts.length, 1);
  assert.equal(contexts[0].oscillators.length, 2);
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
  assert.deepEqual(contexts[0].oscillators[0].frequencyCalls[0], [432, 10]);
});

test('completion chime schedules three oscillators', () => {
  const contexts = installAudioContext();
  const service = new AudioService();

  service.playCompletionCue();

  assert.equal(contexts.length, 1);
  assert.equal(contexts[0].oscillators.length, 3);
  assert.deepEqual(
    contexts[0].oscillators.map((oscillator) => oscillator.frequencyCalls[0][0]),
    [528, 660, 792],
  );
});
