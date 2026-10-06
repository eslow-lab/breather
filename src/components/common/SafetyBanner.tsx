import React, { useEffect, useRef } from 'react';
import { AlertTriangle, ShieldCheck, X } from 'lucide-react';
import { ExerciseDefinition, Protocol } from '../../types/exercise';
import { getProtocolSafety } from '../../engine/recommendations';
import { keepDialogFocus } from './dialogFocus';

interface SafetyBannerProps {
  exercise: ExerciseDefinition;
  protocol: Protocol;
  onConfirm: () => void;
  onCancel: () => void;
}

const safetyLevelLabel = {
  low: 'bajo',
  moderate: 'moderado',
  advanced: 'avanzado',
} as const;

export const SafetyBanner: React.FC<SafetyBannerProps> = ({ exercise, protocol, onConfirm, onCancel }) => {
  const safety = getProtocolSafety(exercise, protocol);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const messages = [
    ...(safety.warnings ?? []),
    ...(safety.contraindications ?? []).map((item) => `Contraindicación: ${item}`),
  ];

  // A native modal keeps keyboard focus inside and makes the page behind it inert.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previouslyFocused = document.activeElement;
    const opener = previouslyFocused instanceof HTMLElement && !dialog.contains(previouslyFocused)
      ? previouslyFocused
      : null;
    if (!dialog.open) dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
      // If the launcher is still part of the page, restore the prior keyboard position.
      if (opener?.isConnected) {
        requestAnimationFrame(() => { if (opener.isConnected) opener.focus(); });
      }
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 text-left text-[var(--text-primary)] shadow-xl animate-fade-in backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      aria-modal="true"
      aria-labelledby="safety-title"
      aria-describedby="safety-description safety-level"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      onKeyDown={keepDialogFocus}
    >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400">
            <div className="p-2 rounded-xl bg-amber-500/10" aria-hidden="true"><AlertTriangle className="w-5 h-5 stroke-[2]" /></div>
            <h3 id="safety-title" className="text-base font-semibold text-[var(--text-primary)]">Aviso de práctica segura</h3>
          </div>
          <button autoFocus onClick={onCancel} aria-label="Cerrar aviso de práctica segura" className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"><X className="w-5 h-5" aria-hidden="true" /></button>
        </div>

        <p id="safety-description" className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed">Has seleccionado <strong>{exercise.name}</strong> ({protocol.name}). Revisa la información antes de comenzar.</p>

        {messages.length > 0 && <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-5"><ul className="space-y-2 text-xs text-[var(--text-primary)]">{messages.map((message) => <li key={message} className="flex items-start gap-2"><span className="text-amber-600 font-bold" aria-hidden="true">•</span><span>{message}</span></li>)}</ul></div>}

        <p id="safety-level" className="text-[11px] text-[var(--text-muted)] mb-5">Nivel de precaución: <strong>{safetyLevelLabel[safety.level]}</strong>. Si la práctica resulta incómoda, detén la sesión.</p>

        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]">Cancelar</button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-[var(--color-accent)] text-white text-xs font-medium flex items-center justify-center gap-1.5 hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent)]"><ShieldCheck className="w-4 h-4" aria-hidden="true" />Entendido, iniciar</button>
        </div>
    </dialog>
  );
};
