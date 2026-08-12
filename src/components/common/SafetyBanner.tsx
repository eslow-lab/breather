import React from 'react';
import { AlertTriangle, ShieldCheck, X } from 'lucide-react';
import { ExerciseDefinition, Protocol } from '../../types/exercise';

interface SafetyBannerProps {
  exercise: ExerciseDefinition;
  protocol: Protocol;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SafetyBanner: React.FC<SafetyBannerProps> = ({
  exercise,
  protocol,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] max-w-md w-full rounded-3xl p-6 shadow-xl animate-fade-in text-left">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400">
            <div className="p-2 rounded-xl bg-amber-500/10">
              <AlertTriangle className="w-5 h-5 stroke-[2]" />
            </div>
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              Aviso de Práctica Segura
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed">
          Has seleccionado <strong>{exercise.name}</strong> ({protocol.name}). Por favor, ten en cuenta las siguientes recomendaciones:
        </p>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-5">
          <ul className="space-y-2 text-xs text-[var(--text-primary)]">
            {exercise.safety.warnings.map((warning, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>{warning}</span>
              </li>
            ))}
            {exercise.safety.contraindications?.map((ci, idx) => (
              <li key={`ci-${idx}`} className="flex items-start gap-2 text-amber-700 dark:text-amber-300">
                <span className="font-bold">•</span>
                <span><strong>Contraindicación:</strong> {ci}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-[var(--color-accent)] text-white text-xs font-medium flex items-center justify-center gap-1.5 hover:opacity-95"
          >
            <ShieldCheck className="w-4 h-4" /> Entendido, Iniciar
          </button>
        </div>
      </div>
    </div>
  );
};
