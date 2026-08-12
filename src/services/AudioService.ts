export class AudioService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isUnlocked: boolean = false;

  constructor() {
    // Lazy init audio context on first user interaction
  }

  private initContext(): void {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public unlockAudio(): void {
    this.initContext();
    this.isUnlocked = true;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  public playPhaseCue(phaseType: 'inhale' | 'hold' | 'exhale' | 'pause'): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      if (phaseType === 'inhale') {
        // Soft rising warm tone (432 Hz -> 528 Hz)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(432, now);
        osc.frequency.exponentialRampToValueAtTime(528, now + 0.8);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc.start(now);
        osc.stop(now + 1.3);
      } else if (phaseType === 'exhale') {
        // Descending gentle tone (528 Hz -> 396 Hz)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(528, now);
        osc.frequency.exponentialRampToValueAtTime(396, now + 0.9);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
        osc.start(now);
        osc.stop(now + 1.5);
      } else if (phaseType === 'hold') {
        // Calm singing bowl chime (432 Hz)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(432, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
        osc.start(now);
        osc.stop(now + 1.9);
      } else {
        // Pause/Neutral chime (360 Hz)
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

  public playCompletionChime(): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Arpeggio chord (528 Hz, 660 Hz, 792 Hz - Solfeggio frequencies)
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
