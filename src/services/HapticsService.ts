export class HapticsService {
  private enabled: boolean = true;

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public triggerPhaseHaptic(phaseType: 'inhale' | 'hold' | 'exhale' | 'pause'): void {
    if (!this.enabled || typeof window === 'undefined' || !('vibrate' in navigator)) return;

    try {
      if (phaseType === 'inhale') {
        // Gentle crescendo pulse
        navigator.vibrate([30, 40, 50]);
      } else if (phaseType === 'exhale') {
        // Soft releasing vibration
        navigator.vibrate([60, 30, 20]);
      } else if (phaseType === 'hold') {
        // Double tap tap
        navigator.vibrate([25, 50, 25]);
      } else {
        // Light tap
        navigator.vibrate(20);
      }
    } catch {
      // Ignore vibration errors if restricted
    }
  }

  public triggerCompletion(): void {
    if (!this.enabled || typeof window === 'undefined' || !('vibrate' in navigator)) return;

    try {
      navigator.vibrate([50, 100, 50, 100, 100]);
    } catch {
      // Ignore
    }
  }
}

export const hapticsService = new HapticsService();
