import React from 'react';
import { Wind, Moon, Sun } from 'lucide-react';
import { UserPreferences } from '../../types/session';

interface HeaderProps {
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: UserPreferences) => void;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  preferences,
  onUpdatePreferences,
  title,
  showBack,
  onBack,
}) => {
  const toggleTheme = () => {
    const nextTheme = preferences.theme === 'dark' ? 'light' : 'dark';
    onUpdatePreferences({ ...preferences, theme: nextTheme });
  };

  return (
    <header className="sticky top-0 z-30 bg-[var(--bg-app)]/80 backdrop-blur-md border-b border-[var(--border-subtle)] transition-colors px-6 py-4">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && onBack ? (
            <button
              onClick={onBack}
              aria-label="Volver"
              className="p-1.5 -ml-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
            >
              ←
            </button>
          ) : null}
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[var(--color-accent-light)] text-[var(--color-accent)]">
              <Wind className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
                {title || 'Breather'}
              </h1>
              {!title && (
                <p className="text-[11px] text-[var(--text-muted)] tracking-wider uppercase font-medium">
                  Guía Respiratoria
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label={`Cambiar a modo ${preferences.theme === 'dark' ? 'claro' : 'oscuro'}`}
            className="p-2.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-all hover:scale-105"
          >
            {preferences.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 stroke-[2]" />
            ) : (
              <Moon className="w-4 h-4 stroke-[2]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
