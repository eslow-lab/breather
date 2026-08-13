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
    if (this.status === 'running' || this.status === 'aborted') return;

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

      this.notify('PHASE_COMPLETED');
      this.phaseStartTime += phaseDurationMs;
      this.currentPhaseIndex++;

      if (this.currentPhaseIndex >= phases.length) {
        this.notify('CYCLE_COMPLETED');
        this.currentPhaseIndex = 0;
        this.currentCycle++;

        if (this.currentCycle > this.totalCycles) {
          this.status = 'completed';
          this.cancelTick();
          this.notify('SESSION_COMPLETED');
          return;
        }
      }

      this.notify('PHASE_STARTED');
    }
  }

  public getState(): EngineState {
    const now = this.status === 'paused' ? this.pausedTime : performance.now();
    const phases = this.protocol.phases;

    if (this.status === 'idle' || phases.length === 0) {
      const cycleDuration = phases.reduce((acc, p) => acc + p.duration, 0);
      const totalPlannedDuration = cycleDuration * this.totalCycles;

      return {
        status: 'idle',
        currentPhase: phases[0] ? {
          definition: phases[0],
          phaseIndex: 0,
          totalPhases: phases.length,
          elapsedInPhase: 0,
          remainingInPhase: phases[0].duration,
          progressInPhase: 0,
        } : null,
        currentCycle: 1,
        totalCycles: this.totalCycles,
        totalElapsed: 0,
        totalRemaining: totalPlannedDuration,
        totalPlannedDuration,
        overallProgress: 0,
      };
    }

    const currentPhaseDef = phases[Math.min(this.currentPhaseIndex, phases.length - 1)];
    const phaseDurationMs = currentPhaseDef.duration * 1000;
    const elapsedInPhaseMs = Math.max(0, Math.min(phaseDurationMs, now - this.phaseStartTime));
    const remainingInPhaseMs = Math.max(0, phaseDurationMs - elapsedInPhaseMs);
    const progressInPhase = phaseDurationMs > 0 ? elapsedInPhaseMs / phaseDurationMs : 1;

    const singleCycleDurationSec = phases.reduce((acc, p) => acc + p.duration, 0);
    const totalPlannedDurationSec = singleCycleDurationSec * this.totalCycles;

    // Calculate total elapsed
    const completedCycles = Math.max(0, this.currentCycle - 1);
    let previousPhasesDurationSec = 0;
    for (let i = 0; i < this.currentPhaseIndex; i++) {
      previousPhasesDurationSec += phases[i].duration;
    }

    const totalElapsedSec = (completedCycles * singleCycleDurationSec) + previousPhasesDurationSec + (elapsedInPhaseMs / 1000);
    const clampedTotalElapsedSec = Math.min(totalPlannedDurationSec, totalElapsedSec);
    const totalRemainingSec = Math.max(0, totalPlannedDurationSec - clampedTotalElapsedSec);
    const overallProgress = totalPlannedDurationSec > 0 ? Math.min(1, clampedTotalElapsedSec / totalPlannedDurationSec) : 0;

    return {
      status: this.status,
      currentPhase: {
        definition: currentPhaseDef,
        phaseIndex: this.currentPhaseIndex,
        totalPhases: phases.length,
        elapsedInPhase: elapsedInPhaseMs / 1000,
        remainingInPhase: remainingInPhaseMs / 1000,
        progressInPhase,
      },
      currentCycle: Math.min(this.currentCycle, this.totalCycles),
      totalCycles: this.totalCycles,
      totalElapsed: clampedTotalElapsedSec,
      totalRemaining: totalRemainingSec,
      totalPlannedDuration: totalPlannedDurationSec,
      overallProgress,
    };
  }

  public getProtocol(): Protocol {
    return this.protocol;
  }
}
