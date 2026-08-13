import { ExerciseDefinition, Goal, Protocol } from '../types/exercise';

type SafetyLevel = ExerciseDefinition['safety']['level'];

export interface RecommendationRequest {
  goal: Goal;
  difficulty?: ExerciseDefinition['difficulty'];
  excludeExerciseIds?: string[];
}

export interface Recommendation {
  exercise: ExerciseDefinition;
  protocol: Protocol;
  reason: string;
}

const safetyRank: Record<SafetyLevel, number> = { low: 0, moderate: 1, advanced: 2 };

function maxSafetyLevel(a: SafetyLevel, b: SafetyLevel): SafetyLevel {
  return safetyRank[a] >= safetyRank[b] ? a : b;
}

function mergeUnique(values: Array<string | undefined>): string[] {
  return [...new Set(values.flatMap((value) => value ? [value] : []))];
}

function resolveSafety(exercise: ExerciseDefinition, protocol: Protocol) {
  const protocolSafety = protocol.safety;

  return {
    ...exercise.safety,
    ...protocolSafety,
    // A protocol may add restrictions, but cannot weaken the exercise-level contract.
    level: maxSafetyLevel(exercise.safety.level, protocolSafety?.level ?? exercise.safety.level),
    warnings: mergeUnique([exercise.safety.warnings.join('\n'), protocolSafety?.warnings?.join('\n')])
      .flatMap((value) => value.split('\n'))
      .filter(Boolean),
    contraindications: mergeUnique([
      ...(exercise.safety.contraindications ?? []),
      ...(protocolSafety?.contraindications ?? []),
    ]),
    requiresConfirmation: exercise.safety.requiresConfirmation || Boolean(protocolSafety?.requiresConfirmation),
    automaticRecommendation: exercise.safety.automaticRecommendation && protocolSafety?.automaticRecommendation !== false,
  };
}

/**
 * Selects protocols only when their explicit safety contract allows automatic recommendation.
 * This is a ranking helper, not a medical decision system.
 */
export function recommendProtocol(
  exercises: ExerciseDefinition[],
  request: RecommendationRequest,
): Recommendation | null {
  const excluded = new Set(request.excludeExerciseIds ?? []);
  const candidates: Array<Recommendation & { score: number }> = [];

  for (const exercise of exercises) {
    if (excluded.has(exercise.id) || !exercise.goals.includes(request.goal)) continue;
    if (request.difficulty && exercise.difficulty !== request.difficulty) continue;

    for (const protocol of exercise.protocols) {
      const safety = resolveSafety(exercise, protocol);
      if (!safety.automaticRecommendation || safety.requiresConfirmation) continue;

      const score = 100 - safetyRank[safety.level] * 20 + (request.difficulty === exercise.difficulty ? 10 : 0);
      candidates.push({
        exercise,
        protocol,
        score,
        reason: `Seleccionado por objetivo "${request.goal}" y protocolo apto para recomendación automática.`,
      });
    }
  }

  candidates.sort((a, b) => b.score - a.score || a.exercise.name.localeCompare(b.exercise.name));
  return candidates[0] ?? null;
}

export function getProtocolSafety(exercise: ExerciseDefinition, protocol: Protocol) {
  return resolveSafety(exercise, protocol);
}
