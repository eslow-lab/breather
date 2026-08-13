import React, { useEffect, useState } from 'react';
import { EnginePhaseState } from '../../types/engine';

interface BreathingOrbProps {
  phaseState: EnginePhaseState | null;
  reducedMotion?: boolean;
}

function getSystemReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export const BreathingOrb: React.FC<BreathingOrbProps> = ({ phaseState, reducedMotion = false }) => {
  const [systemReducedMotion, setSystemReducedMotion] = useState(getSystemReducedMotion);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setSystemReducedMotion(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener?.('change', handleChange);
    return () => mediaQuery.removeEventListener?.('change', handleChange);
  }, []);

  const effectiveReducedMotion = reducedMotion || systemReducedMotion;

  if (!phaseState) {
    return (
      <div className="w-64 h-64 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center">
        <span className="text-[var(--text-muted)] text-sm">Preparando...</span>
      </div>
    );
  }

  const { definition, remainingInPhase, progressInPhase } = phaseState;
  const phaseType = definition.id;
  const minScale = 0.55;
  const maxScale = 1.0;
  let scale = 1.0;

  if (phaseType === 'inhale') scale = minScale + (maxScale - minScale) * progressInPhase;
  else if (phaseType === 'hold') scale = maxScale;
  else if (phaseType === 'exhale') scale = maxScale - (maxScale - minScale) * progressInPhase;
  else scale = minScale;

  const finalScale = effectiveReducedMotion
    ? (phaseType === 'inhale' || phaseType === 'hold' ? 0.85 : 0.7)
    : scale;

  const getPhaseStyles = () => {
    switch (phaseType) {
      case 'inhale':
        return { bg: 'bg-emerald-800/10 dark:bg-emerald-400/10', border: 'border-emerald-600/40 dark:border-emerald-400/50', text: 'text-emerald-800 dark:text-emerald-300', glow: 'orb-glow-inhale', ring: 'border-emerald-500/30' };
      case 'hold':
        return { bg: 'bg-amber-800/10 dark:bg-amber-400/10', border: 'border-amber-600/40 dark:border-amber-400/50', text: 'text-amber-800 dark:text-amber-300', glow: 'orb-glow-hold', ring: 'border-amber-500/30' };
      case 'exhale':
        return { bg: 'bg-sky-800/10 dark:bg-sky-400/10', border: 'border-sky-600/40 dark:border-sky-400/50', text: 'text-sky-800 dark:text-sky-300', glow: 'orb-glow-exhale', ring: 'border-sky-500/30' };
      case 'pause':
      default:
        return { bg: 'bg-slate-800/10 dark:bg-slate-400/10', border: 'border-slate-600/40 dark:border-slate-400/50', text: 'text-slate-800 dark:text-slate-300', glow: 'shadow-sm', ring: 'border-slate-500/20' };
    }
  };

  const style = getPhaseStyles();
  const secondsDisplay = Math.ceil(remainingInPhase);

  return (
    <div className="relative flex flex-col items-center justify-center my-8">
      <div
        className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full border pointer-events-none"
        style={{
          transform: `scale(${finalScale * 1.15})`,
          opacity: effectiveReducedMotion ? 0.3 : 0.4 + progressInPhase * 0.3,
        }}
      />

      <div
        className={`w-64 h-64 sm:w-72 sm:h-72 rounded-full border-2 ${style.border} ${style.bg} ${style.glow} backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center shadow-xl ${effectiveReducedMotion ? '' : 'transition-transform duration-100 ease-out'}`}
        style={{ transform: `scale(${finalScale})` }}
      >
        <span className={`text-xs uppercase tracking-widest font-semibold mb-1 ${style.text}`}>{definition.label}</span>
        <span className="text-5xl sm:text-6xl font-light tracking-tighter text-[var(--text-primary)] my-2 font-mono">
          {secondsDisplay < 10 ? `0${secondsDisplay}` : secondsDisplay}
        </span>
        <p className="text-xs text-[var(--text-secondary)] max-w-[180px] leading-relaxed line-clamp-2 mt-1">{definition.instruction}</p>
      </div>
    </div>
  );
};
