export class AudioService {
  private ctx: AudioContext | null = null;
  private isMuted = false;

  constructor() {
    // Lazy init audio context on first user interaction.
  }

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

      // These tunings are an experiential sound-design choice.
      // Breather does not present them as therapeutic frequencies.
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

  public playCompletionChime(): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Experiential completion chord. The tuning is not presented as a therapeutic claim.
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
