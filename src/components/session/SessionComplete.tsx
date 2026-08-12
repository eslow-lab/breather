import React, { useState } from 'react';
import { CheckCircle2, Heart, ArrowRight } from 'lucide-react';
import { ExerciseDefinition, Protocol } from '../../types/exercise';
import { SessionRecord } from '../../types/session';

interface SessionCompleteProps {
  exercise: ExerciseDefinition;
  protocol: Protocol;
  cyclesCompleted: number;
  totalPlannedCycles: number;
  actualDurationSeconds: number;
  onDone: (sessionRecord: SessionRecord) => void;
}

export const SessionComplete: React.FC<SessionCompleteProps> = ({
  exercise,
  protocol,
  cyclesCompleted,
  totalPlannedCycles,
  actualDurationSeconds,
  onDone,
}) => {
  const [selectedFeeling, setSelectedFeeling] = useState<string>('Tranquilo');
  const [note, setNote] = useState<string>('');

  const feelings = ['Tranquilo', 'Enfocado', 'Relajado', 'Con energía', 'Satisfecho'];

  const minutes = Math.floor(actualDurationSeconds / 60);
  const seconds = Math.round(actualDurationSeconds % 60);

  const handleFinish = () => {
    const record: SessionRecord = {
      id: `session_${Date.now()}`,
      timestamp: Date.now(),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      protocolId: protocol.id,
      protocolName: protocol.name,
      plannedDurationSeconds: protocol.phases.reduce((a, b) => a + b.duration, 0) * totalPlannedCycles,
      actualDurationSeconds,
      cyclesCompleted,
      totalPlannedCycles,
      completed: cyclesCompleted >= totalPlannedCycles,
      note: `${selectedFeeling}${note ? `: ${note}` : ''}`,
    };

    onDone(record);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="max-w-md w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-8 shadow-sm">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-[var(--color-accent-light)] text-[var(--color-accent)] mx-auto flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8 stroke-[2]" />
        </div>

        <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] mb-2">
          ¡Sesión Completada!
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          {exercise.name} · {protocol.name}
        </p>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-4 bg-[var(--bg-app)] p-4 rounded-2xl mb-8 border border-[var(--border-subtle)]">
          <div>
            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider block font-medium">
              Tiempo Practicado
            </span>
            <span className="text-lg font-mono font-semibold text-[var(--text-primary)]">
              {minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`}
            </span>
          </div>
          <div>
            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider block font-medium">
              Ciclos
            </span>
            <span className="text-lg font-mono font-semibold text-[var(--text-primary)]">
              {cyclesCompleted} / {totalPlannedCycles}
            </span>
          </div>
        </div>

        {/* Reflection & Mood Picker */}
        <div className="text-left mb-6">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] block mb-3 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500" /> ¿Cómo te sientes ahora?
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            {feelings.map((feeling) => (
              <button
                key={feeling}
                onClick={() => setSelectedFeeling(feeling)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedFeeling === feeling
                    ? 'bg-[var(--color-accent)] text-white shadow-sm'
                    : 'bg-[var(--bg-app)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)]'
                }`}
              >
                {feeling}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Nota breve opcional..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>

        <button
          onClick={handleFinish}
          className="w-full py-3.5 rounded-2xl bg-[var(--color-accent)] text-white font-medium text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-sm"
        >
          Guardar y Continuar
          <ArrowRight className="w-4 h-4 stroke-[2]" />
        </button>
      </div>
    </div>
  );
};
