import { PhaseDefinition, Protocol } from './exercise';

export type SessionStatus = 'idle' | 'running' | 'paused' | 'completed' | 'aborted';

export interface EnginePhaseState {
  definition: PhaseDefinition;
  phaseIndex: number;
  totalPhases: number;
  elapsedInPhase: number;     // in seconds
  remainingInPhase: number;   // in seconds
  progressInPhase: number;    // 0 to 1
}

export interface EngineState {
  status: SessionStatus;
  currentPhase: EnginePhaseState | null;
  currentCycle: number;
  totalCycles: number;
  totalElapsed: number;       // total elapsed session time in seconds
  totalRemaining: number;     // total estimated remaining time in seconds
  totalPlannedDuration: number; // total expected session length in seconds
  overallProgress: number;    // 0 to 1
}

export type EngineEventType =
  | 'SESSION_STARTED'
  | 'PHASE_STARTED'
  | 'PHASE_COMPLETED'
  | 'CYCLE_COMPLETED'
  | 'SESSION_PAUSED'
  | 'SESSION_RESUMED'
  | 'SESSION_COMPLETED'
  | 'SESSION_ABORTED'
  | 'TICK';

export type EngineEventListener = (eventType: EngineEventType, state: EngineState) => void;

export interface EngineConfig {
  protocol: Protocol;
  cycles?: number; // Override default cycles if user customizes session length
}
