import React from 'react';
import { Protocol } from '../../types/exercise';
import { EnginePhaseState } from '../../types/engine';

interface PhaseIndicatorProps {
  protocol: Protocol;
  currentPhaseState: EnginePhaseState | null;
}

export const PhaseIndicator: React.FC<PhaseIndicatorProps> = ({
  protocol,
  currentPhaseState,
}) => {
  const activeIndex = currentPhaseState?.phaseIndex ?? 0;

  return (
    <div className="w-full max-w-sm mx-auto my-4 px-4">
      {/* Accessible Screen Reader Phase Announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {currentPhaseState ? `${currentPhaseState.definition.label}: ${currentPhaseState.definition.instruction}` : ''}
      </div>

      {/* Visual Phase Pipeline */}
      <div className="flex items-center justify-between gap-2">
        {protocol.phases.map((phase, idx) => {
          const isActive = idx === activeIndex;
          const isPassed = idx < activeIndex;

          return (
            <div key={`${phase.id}-${idx}`} className="flex-1 flex flex-col items-center">
              <div
                className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-[var(--color-accent)] shadow-sm'
                    : isPassed
                    ? 'bg-[var(--color-accent)]/40'
                    : 'bg-[var(--border-subtle)]'
                }`}
              />
              <span
                className={`text-[10px] uppercase tracking-wider font-medium mt-1.5 transition-colors ${
                  isActive ? 'text-[var(--text-primary)] font-semibold' : 'text-[var(--text-muted)]'
                }`}
              >
                {phase.label.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
