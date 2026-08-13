import { Protocol } from '../types/exercise';
import { 
  EngineConfig, 
  EngineEventListener, 
  EngineEventType, 
  EngineState, 
  SessionStatus 
} from '../types/engine';

export class BreathingEngine {
  private protocol: Protocol;
  private totalCycles: number;
  private listeners: Set<EngineEventListener> = new Set();

  private status: SessionStatus = 'idle';
  private currentCycle: number = 1;
  private currentPhaseIndex: number = 0;

  // Monotonic time references (in milliseconds)
  private sessionStartTime: number = 0;
  private phaseStartTime: number = 0;
  private pausedTime: number = 0;
  private totalPausedDuration: number = 0;

  private animationFrameId: number | null = null;

  constructor(config: EngineConfig) {
    this.protocol = config.protocol;
    this.totalCycles = config.cycles && config.cycles > 0 
      ? config.cycles 
      : config.protocol.defaultCycles;
  }

  public subscribe(listener: EngineEventListener): () => void {
    this.listeners.add(listener);
    // Immediately emit current state on subscribe
    listener('TICK', this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(eventType: EngineEventType): void {
    const state = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(eventType, state);
      } catch (err) {
        console.error(`Error in BreathingEngine listener for ${eventType}:`, err);
      }
    });
  }

  public start(): void {
    if (this.status !== 'idle') return;

    const now = performance.now();
    this.status = 'running';
    this.currentCycle = 1;
    this.currentPhaseIndex = 0;
    this.sessionStartTime = now;
    this.phaseStartTime = now;
    this.totalPausedDuration = 0;
    this.pausedTime = 0;

    this.notify('SESSION_STARTED');
    this.notify('PHASE_STARTED');

    this.scheduleTick();
  }

  public pause(): void {
    if (this.status !== 'running') return;

    this.status = 'paused';
    this.pausedTime = performance.now();
    this.cancelTick();

    this.notify('SESSION_PAUSED');
  }

  public resume(): void {
    if (this.status !== 'paused') return;

    const now = performance.now();
    const pauseDelta = now - this.pausedTime;
    this.totalPausedDuration += pauseDelta;
    this.phaseStartTime += pauseDelta; // Adjust phase start to offset paused duration

    this.status = 'running';
    this.notify('SESSION_RESUMED');

    this.scheduleTick();
  }

  public stop(): void {
    if (this.status === 'idle' || this.status === 'completed' || this.status === 'aborted') return;

    this.cancelTick();
    this.status = 'aborted';
    this.notify('SESSION_ABORTED');
  }

  private scheduleTick(): void {
    this.cancelTick();
    if (typeof window === 'undefined') return;

    const tick = () => {
      if (this.status !== 'running') return;
      this.processTick();
      if (this.status === 'running') {
        this.animationFrameId = requestAnimationFrame(tick);
      }
    };

    this.animationFrameId = requestAnimationFrame(tick);
  }

  private cancelTick(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private processTick(): void {
    const now = performance.now();
    const phases = this.protocol.phases;
    if (phases.length === 0) return;

    while (this.status === 'running') {
      const currentPhaseDef = phases[this.currentPhaseIndex];
      const phaseDurationMs = currentPhaseDef.duration * 1000;
      const elapsedInPhaseMs = now - this.phaseStartTime;

      if (elapsedInPhaseMs < phaseDurationMs) {
        this.notify('TICK');
        return;
      }

      this.phaseStartTime += phaseDurationMs;
      this.notify('PHASE_COMPLETED');

      const isLastPhase = this.currentPhaseIndex === phases.length - 1;
      if (isLastPhase) {
        if (this.currentCycle >= this.totalCycles) {
          this.status = 'completed';
          this.cancelTick();
          this.notify('SESSION_COMPLETED');
          return;
        }

        this.currentCycle += 1;
        this.currentPhaseIndex = 0;
        this.notify('CYCLE_COMPLETED');
      } else {
        this.currentPhaseIndex += 1;
      }

      this.notify('PHASE_STARTED');
    }
  }

  public getState(): EngineState {
    const phases = this.protocol.phases;
    const totalPlannedDuration = phases.reduce((sum, phase) => sum + phase.duration, 0) * this.totalCycles;
    const totalElapsed = this.calculateTotalElapsed();
    const totalRemaining = Math.max(0, totalPlannedDuration - totalElapsed);

    let currentPhase: EngineState['currentPhase'] = null;
    if (phases.length > 0 && this.status !== 'idle') {
      const phase = phases[this.currentPhaseIndex];
      const now = performance.now();
      const elapsedInPhase = this.status === 'paused' 
        ? this.pausedTime - this.phaseStartTime 
        : this.status === 'completed' 
          ? phase.duration 
          : Math.max(0, (now - this.phaseStartTime) / 1000);
      const clampedElapsed = Math.min(phase.duration, Math.max(0, elapsedInPhase));

      currentPhase = {
        definition: phase,
        elapsedInPhase: clampedElapsed,
        remainingInPhase: Math.max(0, phase.duration - clampedElapsed),
        progressInPhase: phase.duration > 0 ? clampedElapsed / phase.duration : 1,
      };
    }

    return {
      status: this.status,
      currentCycle: this.currentCycle,
      totalCycles: this.totalCycles,
      currentPhase,
      totalElapsed,
      totalRemaining,
      overallProgress: totalPlannedDuration > 0 ? totalElapsed / totalPlannedDuration : 1,
      totalPlannedDuration,
    };
  }

  private calculateTotalElapsed(): number {
    const phases = this.protocol.phases;
    const completedCycles = Math.max(0, this.currentCycle - 1);
    const completedPhaseDuration = phases
      .slice(0, this.currentPhaseIndex)
      .reduce((sum, phase) => sum + phase.duration, 0);

    if (this.status === 'completed') {
      return phases.reduce((sum, phase) => sum + phase.duration, 0) * this.totalCycles;
    }

    if (this.status === 'idle') return 0;

    const now = this.status === 'paused' ? this.pausedTime : performance.now();
    const currentPhaseElapsed = Math.max(0, (now - this.phaseStartTime) / 1000);
    const currentPhaseDuration = phases[this.currentPhaseIndex]?.duration || 0;

    return Math.min(
      phases.reduce((sum, phase) => sum + phase.duration, 0) * this.totalCycles,
      completedCycles * phases.reduce((sum, phase) => sum + phase.duration, 0) +
      completedPhaseDuration + Math.min(currentPhaseElapsed, currentPhaseDuration)
    );
  }
}