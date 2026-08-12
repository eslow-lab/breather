import React from 'react';
import { Pause, Play, Volume2, VolumeX, Smartphone, X } from 'lucide-react';
import { SessionStatus } from '../../types/engine';

interface SessionControlsProps {
  status: SessionStatus;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  onTogglePlayPause: () => void;
  onToggleSound: () => void;
  onToggleHaptics: () => void;
  onStopSession: () => void;
}

export const SessionControls: React.FC<SessionControlsProps> = ({
  status,
  soundEnabled,
  hapticsEnabled,
  onTogglePlayPause,
  onToggleSound,
  onToggleHaptics,
  onStopSession,
}) => {
  const isPaused = status === 'paused';

  return (
    <div className="flex items-center justify-center gap-6 my-6">
      {/* Sound Toggle */}
      <button
        onClick={onToggleSound}
        aria-label={soundEnabled ? 'Silenciar sonido' : 'Activar sonido'}
        className={`p-3.5 rounded-full border transition-all ${
          soundEnabled
            ? 'bg-[var(--bg-surface)] text-[var(--color-accent)] border-[var(--border-subtle)]'
            : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-subtle)] opacity-70'
        } hover:scale-105`}
      >
        {soundEnabled ? <Volume2 className="w-5 h-5 stroke-[2]" /> : <VolumeX className="w-5 h-5 stroke-[2]" />}
      </button>

      {/* Main Play / Pause Button */}
      <button
        onClick={onTogglePlayPause}
        aria-label={isPaused ? 'Reanudar sesión' : 'Pausar sesión'}
        className="p-5 rounded-full bg-[var(--color-accent)] text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
      >
        {isPaused ? <Play className="w-7 h-7 fill-current ml-0.5" /> : <Pause className="w-7 h-7 fill-current" />}
      </button>

      {/* Haptics Toggle */}
      <button
        onClick={onToggleHaptics}
        aria-label={hapticsEnabled ? 'Desactivar vibración' : 'Activar vibración'}
        className={`p-3.5 rounded-full border transition-all ${
          hapticsEnabled
            ? 'bg-[var(--bg-surface)] text-[var(--color-accent)] border-[var(--border-subtle)]'
            : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-subtle)] opacity-70'
        } hover:scale-105`}
      >
        <Smartphone className={`w-5 h-5 stroke-[2] ${!hapticsEnabled ? 'line-through' : ''}`} />
      </button>

      {/* Exit Button */}
      <button
        onClick={onStopSession}
        aria-label="Finalizar o salir de la sesión"
        className="p-3.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-red-600 border border-[var(--border-subtle)] hover:bg-red-50 dark:hover:bg-red-950/30 transition-all hover:scale-105 ml-2"
      >
        <X className="w-5 h-5 stroke-[2]" />
      </button>
    </div>
  );
};
