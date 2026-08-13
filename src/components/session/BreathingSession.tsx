import React, { useEffect, useState, useRef } from 'react';
import { ExerciseDefinition, Protocol } from '../../types/exercise';
import { EngineState, SessionStatus } from '../../types/engine';
import { BreathingEngine } from '../../engine/BreathingEngine';
import { audioService } from '../../services/AudioService';
import { hapticsService } from '../../services/HapticsService';
import { UserPreferences, SessionRecord } from '../../types/session';
import { BreathingOrb } from './BreathingOrb';
import { PhaseIndicator } from './PhaseIndicator';
import { SessionControls } from './SessionControls';
import { SessionComplete } from './SessionComplete';
import { X, Volume2, VolumeX } from 'lucide-react';

interface BreathingSessionProps {
  exercise: ExerciseDefinition;
  protocol: Protocol;
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: UserPreferences) => void;
  onClose: () => void;
  onCompleteSession: (record: SessionRecord) => void;
  onAbortSession: (record: SessionRecord) => void;
}

export const BreathingSession: React.FC<BreathingSessionProps> = ({
  exercise,
  protocol,
  preferences,
  onUpdatePreferences,
  onClose,
  onCompleteSession,
  onAbortSession,
}) => {
  const engineRef = useRef<BreathingEngine | null>(null);
  const [engineState, setEngineState] = useState<EngineState | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(preferences.soundEnabled);
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(preferences.hapticsEnabled);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const abortRecordedRef = useRef(false);

  useEffect(() => {
    const engine = new BreathingEngine({ protocol });
    engineRef.current = engine;

    audioService.setMuted(!soundEnabled);
    hapticsService.setEnabled(hapticsEnabled);

    const unsubscribe = engine.subscribe((eventType, state) => {
      setEngineState(state);

      if (eventType === 'PHASE_STARTED' && state.currentPhase) {
        const pType = state.currentPhase.definition.id;
        audioService.playPhaseCue(pType);
        hapticsService.triggerPhaseHaptic(pType);
      } else if (eventType === 'SESSION_COMPLETED') {
        audioService.playCompletionChime();
        hapticsService.triggerCompletion();
        setIsCompleted(true);
      }
    });

    audioService.unlockAudio();
    engine.start();

    return () => {
      unsubscribe();
      engine.stop();
      if (engineRef.current === engine) engineRef.current = null;
    };
  }, [protocol]);

  useEffect(() => {
    audioService.setMuted(!soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    hapticsService.setEnabled(hapticsEnabled);
  }, [hapticsEnabled]);

  useEffect(() => {
    setSoundEnabled(preferences.soundEnabled);
    setHapticsEnabled(preferences.hapticsEnabled);
  }, [preferences.soundEnabled, preferences.hapticsEnabled]);

  const handleTogglePlayPause = () => {
    if (!engineRef.current || !engineState) return;
    if (engineState.status === 'running') engineRef.current.pause();
    else if (engineState.status === 'paused') {
      audioService.unlockAudio();
      engineRef.current.resume();
    }
  };

  const handleToggleSound = () => {
    const nextSound = !soundEnabled;
    setSoundEnabled(nextSound);
    audioService.setMuted(!nextSound);
    onUpdatePreferences({ ...preferences, soundEnabled: nextSound });
  };

  const handleToggleHaptics = () => {
    const nextHaptics = !hapticsEnabled;
    setHapticsEnabled(nextHaptics);
    hapticsService.setEnabled(nextHaptics);
    onUpdatePreferences({ ...preferences, hapticsEnabled: nextHaptics });
  };

  const handleStopSession = () => {
    if (abortRecordedRef.current) return;

    const state = engineState;
    if (engineRef.current) engineRef.current.stop();

    if (state && state.status !== 'completed' && state.totalElapsed > 0) {
      abortRecordedRef.current = true;
      onAbortSession({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        protocolId: protocol.id,
        protocolName: protocol.name,
        plannedDurationSeconds: state.totalPlannedDuration,
        actualDurationSeconds: state.totalElapsed,
        cyclesCompleted: state.currentCycle,
        totalPlannedCycles: state.totalCycles,
        completed: false,
      });
    }

    onClose();
  };

  if (isCompleted && engineState) {
    return (
      <SessionComplete
        exercise={exercise}
        protocol={protocol}
        cyclesCompleted={engineState.currentCycle}
        totalPlannedCycles={engineState.totalCycles}
        actualDurationSeconds={engineState.totalElapsed}
        onDone={(record) => {
          onCompleteSession(record);
          onClose();
        }}
      />
    );
  }

  const phaseState = engineState?.currentPhase ?? null;
  const status: SessionStatus = engineState?.status ?? 'idle';
  const elapsedSec = Math.floor(engineState?.totalElapsed ?? 0);
  const elapsedMinutes = Math.floor(elapsedSec / 60);
  const elapsedRemainderSec = elapsedSec % 60;
  const timeFormatted = `${elapsedMinutes < 10 ? '0' : ''}${elapsedMinutes}:${elapsedRemainderSec < 10 ? '0' : ''}${elapsedRemainderSec}`;

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-app)] flex flex-col justify-between p-6 sm:p-8 animate-fade-in select-none overflow-hidden">
      <div className="flex items-center justify-between max-w-md w-full mx-auto">
        <button onClick={handleStopSession} aria-label="Salir de la sesión" className="p-2 rounded-full bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors">
          <X className="w-5 h-5 stroke-[2]" />
        </button>

        <div className="text-center">
          <h2 className="text-base font-semibold tracking-tight text-[var(--text-primary)]">{exercise.name}</h2>
          <p className="text-[11px] text-[var(--text-muted)] tracking-wider uppercase font-medium">{protocol.name}</p>
        </div>

        <button onClick={handleToggleSound} aria-label={soundEnabled ? 'Silenciar' : 'Activar sonido'} className="p-2 rounded-full bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors">
          {soundEnabled ? <Volume2 className="w-5 h-5 stroke-[2]" /> : <VolumeX className="w-5 h-5 stroke-[2]" />}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center my-auto">
        <PhaseIndicator protocol={protocol} currentPhaseState={phaseState} />
        <BreathingOrb phaseState={phaseState} reducedMotion={preferences.reducedMotion} />

        <div className="flex items-center gap-6 mt-2 text-xs font-mono font-medium text-[var(--text-muted)]">
          <span className="bg-[var(--bg-surface)] px-3 py-1.5 rounded-xl border border-[var(--border-subtle)]">Ciclo: <strong className="text-[var(--text-primary)]">{engineState?.currentCycle ?? 1}</strong> / {engineState?.totalCycles ?? protocol.defaultCycles}</span>
          <span className="bg-[var(--bg-surface)] px-3 py-1.5 rounded-xl border border-[var(--border-subtle)]">Tiempo: <strong className="text-[var(--text-primary)]">{timeFormatted}</strong></span>
        </div>
      </div>

      <div className="max-w-md w-full mx-auto pb-4">
        <div className="w-full bg-[var(--bg-surface)] h-1.5 rounded-full overflow-hidden mb-4 border border-[var(--border-subtle)]">
          <div className="bg-[var(--color-accent)] h-full transition-all duration-300" style={{ width: `${(engineState?.overallProgress ?? 0) * 100}%` }} />
        </div>

        <SessionControls
          status={status}
          soundEnabled={soundEnabled}
          hapticsEnabled={hapticsEnabled}
          onTogglePlayPause={handleTogglePlayPause}
          onToggleSound={handleToggleSound}
          onToggleHaptics={handleToggleHaptics}
          onStopSession={handleStopSession}
        />
      </div>
    </div>
  );
};
