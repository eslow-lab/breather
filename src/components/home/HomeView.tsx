import React from 'react';
import { Sparkles, Moon, Target, RefreshCw, Compass, Play, Clock, ChevronRight } from 'lucide-react';
import { ExerciseDefinition, Goal, Protocol } from '../../types/exercise';
import { UserStats } from '../../types/session';
import { recommendProtocol } from '../../engine/recommendations';

interface HomeViewProps {
  stats: UserStats;
  exercises: ExerciseDefinition[];
  onSelectExercise: (exercise: ExerciseDefinition, protocol?: Protocol) => void;
  onNavigateTab: (tab: 'explore' | 'history') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ stats, exercises, onSelectExercise, onNavigateTab }) => {
  const lastExercise = stats.lastExerciseId ? exercises.find((e) => e.id === stats.lastExerciseId) : null;

  const goalCards = [
    { goal: 'calm' as Goal, title: 'CALMARME', subtitle: 'Respiración pausada para acompañar una sensación de calma.', icon: Sparkles, color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20' },
    { goal: 'sleep' as Goal, title: 'DORMIR', subtitle: 'Un ritmo respiratorio pausado para preparar el descanso.', icon: Moon, color: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20' },
    { goal: 'focus' as Goal, title: 'CONCENTRARME', subtitle: 'Un patrón estructurado para sostener la atención.', icon: Target, color: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20' },
    { goal: 'regulate' as Goal, title: 'REGULARME', subtitle: 'Un patrón guiado para volver a un ritmo cómodo.', icon: RefreshCw, color: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20' },
  ];

  const handleGoalClick = (goal: Goal) => {
    const recommendation = recommendProtocol(exercises, { goal });
    if (recommendation) onSelectExercise(recommendation.exercise, recommendation.protocol);
    else onNavigateTab('explore');
  };

  return (
    <div className="max-w-2xl mx-auto px-6 pt-6 pb-28">
      {lastExercise && (
        <div className="mb-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-5 flex items-center justify-between shadow-sm hover:border-[var(--color-accent)] transition-all">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-[var(--color-accent-light)] text-[var(--color-accent)]"><Clock className="w-5 h-5 stroke-[2]" /></div>
            <div><span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] block">Última Sesión</span><h3 className="text-sm font-semibold text-[var(--text-primary)]">{lastExercise.name}</h3></div>
          </div>
          <button onClick={() => onSelectExercise(lastExercise, lastExercise.protocols[0])} className="py-2 px-4 rounded-2xl bg-[var(--color-accent)] text-white text-xs font-medium flex items-center gap-1.5 hover:opacity-95 transition-all shadow-sm"><Play className="w-3.5 h-3.5 fill-current" />Continuar</button>
        </div>
      )}

      <div className="mb-6"><h2 className="text-2xl font-light tracking-tight text-[var(--text-primary)]">¿Qué necesitas ahora?</h2><p className="text-xs text-[var(--text-secondary)] mt-1">Elige tu intención para iniciar una guía a tu medida.</p></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {goalCards.map((card) => {
          const Icon = card.icon;
          return <button key={card.goal} onClick={() => handleGoalClick(card.goal)} className="group text-left bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--color-accent)] rounded-3xl p-6 transition-all hover:shadow-md flex flex-col justify-between">
            <div><div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 border ${card.color}`}><Icon className="w-5 h-5 stroke-[2]" /></div><h3 className="text-sm font-bold tracking-wider text-[var(--text-primary)] mb-1">{card.title}</h3><p className="text-xs text-[var(--text-secondary)] leading-relaxed">{card.subtitle}</p></div>
            <div className="mt-4 flex items-center text-xs font-medium text-[var(--color-accent)] group-hover:translate-x-1 transition-transform"><span>Iniciar ejercicio</span><ChevronRight className="w-4 h-4 ml-1" /></div>
          </button>;
        })}
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 flex items-center justify-between shadow-sm mb-8">
        <div className="flex items-center gap-4"><div className="p-3.5 rounded-2xl bg-[var(--bg-surface-hover)] text-[var(--text-primary)]"><Compass className="w-6 h-6 stroke-[2]" /></div><div><h3 className="text-sm font-semibold text-[var(--text-primary)]">Explorar Catálogo</h3><p className="text-xs text-[var(--text-secondary)]">Accede a las {exercises.length} técnicas respiratorias guiadas.</p></div></div>
        <button onClick={() => onNavigateTab('explore')} className="p-3 rounded-2xl bg-[var(--bg-surface-hover)] text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-colors" aria-label="Ver todas las técnicas"><ChevronRight className="w-5 h-5" /></button>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-5 flex items-center justify-around text-center text-xs">
        <div><span className="text-[var(--text-muted)] block text-[10px] uppercase tracking-wider font-medium">Minutos Totales</span><span className="text-lg font-semibold text-[var(--text-primary)] font-mono">{stats.totalMinutes} min</span></div>
        <div className="w-px h-8 bg-[var(--border-subtle)]" />
        <div><span className="text-[var(--text-muted)] block text-[10px] uppercase tracking-wider font-medium">Sesiones Esta Semana</span><span className="text-lg font-semibold text-[var(--text-primary)] font-mono">{stats.sessionsThisWeek}</span></div>
      </div>
    </div>
  );
};
