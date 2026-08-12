import React, { useState } from 'react';
import { StorageService } from '../../services/StorageService';
import { SessionRecord, UserStats } from '../../types/session';
import { Clock, Calendar, CheckCircle2, Trash2, Heart } from 'lucide-react';

interface SessionHistoryViewProps {
  stats: UserStats;
  onRefreshStats: () => void;
}

export const SessionHistoryView: React.FC<SessionHistoryViewProps> = ({
  stats,
  onRefreshStats,
}) => {
  const [sessions, setSessions] = useState<SessionRecord[]>(() => StorageService.getSessions());

  const handleClearHistory = () => {
    if (window.confirm('¿Deseas borrar todo el historial de prácticas locales?')) {
      StorageService.clearAllData();
      setSessions([]);
      onRefreshStats();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 pt-6 pb-28 text-left">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-light tracking-tight text-[var(--text-primary)]">
            Tu Práctica
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Registro simple y sin presiones de tus sesiones de respiración.
          </p>
        </div>

        {sessions.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="p-2 text-[var(--text-muted)] hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            title="Borrar historial"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-4 rounded-3xl">
          <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block font-medium">
            Minutos Totales
          </span>
          <span className="text-2xl font-mono font-light text-[var(--text-primary)] mt-1 block">
            {stats.totalMinutes}
          </span>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-4 rounded-3xl">
          <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block font-medium">
            Sesiones Totales
          </span>
          <span className="text-2xl font-mono font-light text-[var(--text-primary)] mt-1 block">
            {stats.totalSessions}
          </span>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-4 rounded-3xl col-span-2 sm:col-span-1">
          <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block font-medium">
            Esta Semana
          </span>
          <span className="text-2xl font-mono font-light text-[var(--text-primary)] mt-1 block">
            {stats.sessionsThisWeek}
          </span>
        </div>
      </div>

      {/* Session History List */}
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
        Historial de Sesiones
      </h3>

      {sessions.length === 0 ? (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-8 text-center text-xs text-[var(--text-muted)]">
          No hay sesiones guardadas todavía. Completa tu primera guía respiratoria para registrarla aquí.
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const date = new Date(session.timestamp);
            const formattedDate = date.toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            });
            const minutes = Math.floor(session.actualDurationSeconds / 60);
            const seconds = Math.round(session.actualDurationSeconds % 60);

            return (
              <div
                key={session.id}
                className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-4 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-accent)]" />
                    <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                      {session.exerciseName}
                    </h4>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mt-1">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {formattedDate}
                    </span>
                  </div>
                  {session.note && (
                    <p className="text-xs text-[var(--text-secondary)] mt-2 bg-[var(--bg-app)] px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-500" /> {session.note}
                    </p>
                  )}
                </div>

                <div className="text-right font-mono text-xs text-[var(--text-muted)]">
                  {session.cyclesCompleted} ciclos
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
