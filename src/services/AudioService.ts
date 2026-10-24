import { SoundMode } from '../types/session';

type PhaseType = 'inhale' | 'hold' | 'exhale' | 'pause';

const PHASE_LABELS: Record<PhaseType, string> = {
  inhale: 'Inhala',
  hold: 'Mantén',
  exhale: 'Exhala',
  pause: 'Pausa',
};

const BINAURAL_BASE_FREQUENCIES: Record<PhaseType, number> = {
  inhale: 220,
  hold: 196,
  exhale: 174,
  pause: 185,
};

export class AudioService {
  private ctx: AudioContext | null = null;
  private isMuted = false;
  private soundMode: SoundMode = 'chime';

  private initContext(): void {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public unlockAudio(): void {
    this.initContext();
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  public setSoundMode(mode: SoundMode): void {
    this.soundMode = mode;
  }

  public getSoundMode(): SoundMode {
    return this.soundMode;
  }

  public playPhaseCue(phaseType: PhaseType): void {
    if (this.isMuted || this.soundMode === 'silent') return;

    if (this.soundMode === 'voice_chime') {
      this.playVoiceCue(phaseType);
      this.playChimeCue(phaseType);
      return;
    }

    if (this.soundMode === 'binaural') {
      this.playBinauralCue(phaseType);
      return;
    }

    this.playChimeCue(phaseType);
  }

  public playCompletionCue(): void {
    if (this.isMuted || this.soundMode === 'silent') return;

    if (this.soundMode === 'voice_chime') {
      this.playVoice('Sesión completada');
      this.playCompletionChime();
      return;
    }

    if (this.soundMode === 'binaural') {
      this.playBinauralCompletion();
      return;
    }

    this.playCompletionChime();
  }

  private playVoiceCue(phaseType: PhaseType): void {
    this.playVoice(PHASE_LABELS[phaseType]);
  }

  private playVoice(text: string): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.7;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Voice playback inhibited by browser policy:', err);
    }
  }

  private playChimeCue(phaseType: PhaseType): void {
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      // Experiential sound design. These frequencies are not presented as therapeutic claims.
      if (phaseType === 'inhale') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(432, now);
        osc.frequency.exponentialRampToValueAtTime(528, now + 0.8);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc.start(now);
        osc.stop(now + 1.3);
      } else if (phaseType === 'exhale') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(528, now);
        osc.frequency.exponentialRampToValueAtTime(396, now + 0.9);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
        osc.start(now);
        osc.stop(now + 1.5);
      } else if (phaseType === 'hold') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(432, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
        osc.start(now);
        osc.stop(now + 1.9);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(360, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
        osc.start(now);
        osc.stop(now + 1.6);
      }
    } catch (err) {
      console.warn('Audio playback inhibited by browser policy:', err);
    }
  }

  private playBinauralCue(phaseType: PhaseType): void {
    this.initContext();
    if (!this.ctx) return;

    try {
      if (!this.ctx.createStereoPanner) {
        this.playChimeCue(phaseType);
        return;
      }

      const now = this.ctx.currentTime;
      const base = BINAURAL_BASE_FREQUENCIES[phaseType];
      const beat = 6;
      const duration = phaseType === 'hold' ? 1.9 : 1.5;

      const left = this.ctx.createOscillator();
      const right = this.ctx.createOscillator();
      const leftGain = this.ctx.createGain();
      const rightGain = this.ctx.createGain();
      const leftPan = this.ctx.createStereoPanner();
      const rightPan = this.ctx.createStereoPanner();

      left.type = 'sine';
      right.type = 'sine';
      left.frequency.setValueAtTime(base, now);
      right.frequency.setValueAtTime(base + beat, now);
      leftPan.pan.setValueAtTime(-1, now);
      rightPan.pan.setValueAtTime(1, now);

      left.connect(leftGain);
      leftGain.connect(leftPan);
      leftPan.connect(this.ctx.destination);
      right.connect(rightGain);
      rightGain.connect(rightPan);
      rightPan.connect(this.ctx.destination);

      leftGain.gain.setValueAtTime(0.0001, now);
      rightGain.gain.setValueAtTime(0.0001, now);
      leftGain.gain.linearRampToValueAtTime(0.08, now + 0.15);
      rightGain.gain.linearRampToValueAtTime(0.08, now + 0.15);
      leftGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      rightGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      left.start(now);
      right.start(now);
      left.stop(now + duration + 0.05);
      right.stop(now + duration + 0.05);
    } catch (err) {
      console.warn('Binaural playback inhibited by browser policy:', err);
    }
  }

  private playBinauralCompletion(): void {
    this.initContext();
    if (!this.ctx) return;

    try {
      if (!this.ctx.createStereoPanner) {
        this.playCompletionChime();
        return;
      }

      const now = this.ctx.currentTime;
      const left = this.ctx.createOscillator();
      const right = this.ctx.createOscillator();
      const leftGain = this.ctx.createGain();
      const rightGain = this.ctx.createGain();
      const leftPan = this.ctx.createStereoPanner();
      const rightPan = this.ctx.createStereoPanner();

      left.type = 'sine';
      right.type = 'sine';
      left.frequency.setValueAtTime(220, now);
      right.frequency.setValueAtTime(226, now);
      leftPan.pan.setValueAtTime(-1, now);
      rightPan.pan.setValueAtTime(1, now);
      leftGain.gain.setValueAtTime(0.0001, now);
      rightGain.gain.setValueAtTime(0.0001, now);
      leftGain.gain.linearRampToValueAtTime(0.08, now + 0.15);
      rightGain.gain.linearRampToValueAtTime(0.08, now + 0.15);
      leftGain.gain.exponentialRampToValueAtTime(0.0001, now + 2);
      rightGain.gain.exponentialRampToValueAtTime(0.0001, now + 2);

      left.connect(leftGain);
      leftGain.connect(leftPan);
      leftPan.connect(this.ctx.destination);
      right.connect(rightGain);
      rightGain.connect(rightPan);
      rightPan.connect(this.ctx.destination);
      left.start(now);
      right.start(now);
      left.stop(now + 2.05);
      right.stop(now + 2.05);
    } catch (err) {
      console.warn('Binaural completion playback inhibited by browser policy:', err);
    }
  }

  private playCompletionChime(): void {
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const freqs = [528, 660, 792];
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.25);
        gain.gain.setValueAtTime(0.001, now + idx * 0.25);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.25 + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.25 + 2.5);
        osc.start(now + idx * 0.25);
        osc.stop(now + idx * 0.25 + 2.6);
      });
    } catch (err) {
      console.warn('Completion audio error:', err);
    }
  }
}

export const audioService = new AudioService();
