import React, { useState } from 'react';
import { EXERCISES } from '../../data/exercises';
import { ExerciseDefinition, Protocol } from '../../types/exercise';
import { TechniqueDetailModal } from './TechniqueDetailModal';
import { Sparkles, Shield, ChevronRight } from 'lucide-react';

interface ExploreViewProps {
  onSelectExercise: (exercise: ExerciseDefinition, protocol?: Protocol) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  onSelectExercise,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalExercise, setActiveModalExercise] = useState<ExerciseDefinition | null>(null);

  const categories = [
    { id: 'all', label: 'Todas' },
    { id: 'diaphragmatic', label: 'Diafragmática' },
    { id: 'pacing', label: 'Control de Ritmo' },
    { id: 'box', label: 'Respiración en Caja' },
    { id: 'pranayama', label: 'Respiración Alterna' },
    { id: 'sighing', label: 'Suspiro Fisiológico' },
  ];

  const filteredExercises = selectedCategory === 'all'
    ? EXERCISES
    : EXERCISES.filter((ex) => ex.category === selectedCategory);

  return (
    <div className="max-w-2xl mx-auto px-6 pt-6 pb-28 text-left">
      <div className="mb-6">
        <h2 className="text-2xl font-light tracking-tight text-[var(--text-primary)]">
          Catálogo de Técnicas
        </h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          7 prácticas respiratorias guiadas con protocolo y advertencias claras.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-[var(--color-accent)] text-white shadow-sm'
                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Exercise Cards */}
      <div className="space-y-4">
        {filteredExercises.map((ex) => (
          <div
            key={ex.id}
            onClick={() => setActiveModalExercise(ex)}
            className="group cursor-pointer bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--color-accent)] rounded-3xl p-5 transition-all hover:shadow-md flex items-center justify-between"
          >
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-accent)] bg-[var(--color-accent-light)] px-2 py-0.5 rounded-md">
                  {ex.category}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-600" /> Nivel: {ex.difficulty}
                </span>
              </div>
              <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">
                {ex.name}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                {ex.description}
              </p>
            </div>

            <div className="p-2.5 rounded-2xl bg-[var(--bg-app)] text-[var(--text-muted)] group-hover:text-[var(--color-accent)] group-hover:bg-[var(--color-accent-light)] transition-colors shrink-0">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      <TechniqueDetailModal
        exercise={activeModalExercise}
        onClose={() => setActiveModalExercise(null)}
        onStartSession={(ex, proto) => {
          onSelectExercise(ex, proto);
          setActiveModalExercise(null);
        }}
      />
    </div>
  );
};
