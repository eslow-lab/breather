import React, { useState } from 'react';
import { X, Play, ShieldAlert, BookOpen, Clock, Layers } from 'lucide-react';
import { ExerciseDefinition, Protocol } from '../../types/exercise';

interface TechniqueDetailModalProps {
  exercise: ExerciseDefinition | null;
  onClose: () => void;
  onStartSession: (exercise: ExerciseDefinition, protocol: Protocol) => void;
}

export const TechniqueDetailModal: React.FC<TechniqueDetailModalProps> = ({
  exercise,
  onClose,
  onStartSession,
}) => {
  if (!exercise) return null;

  const [selectedProtocol, setSelectedProtocol] = useState<Protocol>(exercise.protocols[0]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl animate-slide-up text-left">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] mb-6">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-accent)] bg-[var(--color-accent-light)] px-2.5 py-1 rounded-full">
              {exercise.category}
            </span>
            <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)] mt-2">
              {exercise.name}
            </h2>
            {exercise.aliases && (
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {exercise.aliases.join(' · ')}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar detalles"
            className="p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
          {exercise.description}
        </p>

        {/* Protocol Selector */}
        <div className="mb-6">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] block mb-3 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[var(--color-accent)]" /> Selecciona el Protocolo
          </label>
          <div className="space-y-2.5">
            {exercise.protocols.map((proto) => {
              const isSelected = selectedProtocol.id === proto.id;
              const durationSec = proto.phases.reduce((a, b) => a + b.duration, 0) * proto.defaultCycles;
              const durationMin = Math.round(durationSec / 60);

              return (
                <button
                  key={proto.id}
                  onClick={() => setSelectedProtocol(proto)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[var(--color-accent-light)] border-[var(--color-accent)] text-[var(--text-primary)] shadow-sm'
                      : 'bg-[var(--bg-app)] border-[var(--border-subtle)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)]'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-xs text-[var(--text-primary)]">
                      {proto.name}
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] mt-1">
                      {proto.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-mono text-[var(--text-muted)] ml-3 shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    ~{durationMin} min
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-6 bg-[var(--bg-app)] p-4 rounded-2xl border border-[var(--border-subtle)]">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-2.5">
            Paso a Paso
          </h4>
          <ol className="space-y-2 text-xs text-[var(--text-secondary)] list-decimal list-inside">
            {exercise.instructions.map((step, idx) => (
              <li key={idx} className="leading-relaxed">
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Safety Warnings & Evidence Notes */}
        <div className="space-y-3 mb-8">
          <div className="flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300 bg-amber-500/10 p-3.5 rounded-2xl border border-amber-500/20">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <div>
              <strong className="block font-semibold mb-0.5">Seguridad y Confort:</strong>
              {exercise.safety.warnings.join(' ')}
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)] bg-[var(--bg-app)] p-3.5 rounded-2xl border border-[var(--border-subtle)]">
            <BookOpen className="w-4 h-4 shrink-0 mt-0.5 text-[var(--color-accent)]" />
            <div>
              <strong className="block font-semibold text-[var(--text-primary)] mb-0.5">Evidencia y Tradición:</strong>
              {exercise.evidence.summary}
            </div>
          </div>
        </div>

        {/* Start Action */}
        <button
          onClick={() => {
            onStartSession(exercise, selectedProtocol);
            onClose();
          }}
          className="w-full py-4 rounded-2xl bg-[var(--color-accent)] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md"
        >
          <Play className="w-4 h-4 fill-current" />
          Iniciar Sesión ({selectedProtocol.name})
        </button>
      </div>
    </div>
  );
};
