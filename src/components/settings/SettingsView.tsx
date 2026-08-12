import React from 'react';
import { UserPreferences } from '../../types/session';
import { Moon, Sun, Monitor, Volume2, Smartphone, Eye, ShieldCheck, Trash2 } from 'lucide-react';
import { StorageService } from '../../services/StorageService';

interface SettingsViewProps {
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: UserPreferences) => void;
  onRefreshStats: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  preferences,
  onUpdatePreferences,
  onRefreshStats,
}) => {
  const handleClear = () => {
    if (window.confirm('¿Seguro que deseas borrar todos los datos locales y preferencias?')) {
      StorageService.clearAllData();
      onRefreshStats();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 pt-6 pb-28 text-left">
      <div className="mb-6">
        <h2 className="text-2xl font-light tracking-tight text-[var(--text-primary)]">
          Ajustes
        </h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Personaliza tu experiencia de bienestar y preferencias.
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme Settings */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] block mb-3 flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-[var(--color-accent)]" /> Tema Visual
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'light', label: 'Claro', icon: Sun },
              { id: 'dark', label: 'Oscuro', icon: Moon },
              { id: 'system', label: 'Sistema', icon: Monitor },
            ].map((themeOpt) => {
              const Icon = themeOpt.icon;
              const isActive = preferences.theme === themeOpt.id;
              return (
                <button
                  key={themeOpt.id}
                  onClick={() => onUpdatePreferences({ ...preferences, theme: themeOpt.id as any })}
                  className={`py-3 px-3 rounded-2xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-[var(--color-accent-light)] border-[var(--color-accent)] text-[var(--color-accent)] font-semibold'
                      : 'bg-[var(--bg-app)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {themeOpt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Audio & Haptics */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[var(--bg-app)] text-[var(--text-primary)]">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[var(--text-primary)] block">
                  Señales de Sonido
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  Tono suave sintético al cambiar de fase respiratoria.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.soundEnabled}
              onChange={(e) => onUpdatePreferences({ ...preferences, soundEnabled: e.target.checked })}
              className="w-5 h-5 accent-[var(--color-accent)] cursor-pointer"
            />
          </div>

          <div className="w-full h-px bg-[var(--border-subtle)]" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[var(--bg-app)] text-[var(--text-primary)]">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[var(--text-primary)] block">
                  Vibración Háptica
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  Pulsos táctiles durante las fases en dispositivos compatibles.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.hapticsEnabled}
              onChange={(e) => onUpdatePreferences({ ...preferences, hapticsEnabled: e.target.checked })}
              className="w-5 h-5 accent-[var(--color-accent)] cursor-pointer"
            />
          </div>
        </div>

        {/* Accessibility & Reduced Motion */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[var(--bg-app)] text-[var(--text-primary)]">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[var(--text-primary)] block">
                  Movimiento Reducido
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  Sustituye la animación de expansión por cambios sutiles de opacidad.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.reducedMotion}
              onChange={(e) => onUpdatePreferences({ ...preferences, reducedMotion: e.target.checked })}
              className="w-5 h-5 accent-[var(--color-accent)] cursor-pointer"
            />
          </div>
        </div>

        {/* Privacy & Data Pledge */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-5 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-[var(--text-secondary)] leading-relaxed">
            <strong className="text-[var(--text-primary)] block font-semibold mb-0.5">
              Privacidad de Diseño (Privacy-by-Design)
            </strong>
            Breather opera 100% offline-first. Tu historial de sesiones y preferencias se guardan de forma local en tu navegador y nunca se transmiten a servidores externos.
          </div>
        </div>

        {/* Danger Zone */}
        <button
          onClick={handleClear}
          className="w-full py-3.5 px-4 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-medium border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Restablecer Datos Locales
        </button>
      </div>
    </div>
  );
};
