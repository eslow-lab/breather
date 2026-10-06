import test from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { SafetyBanner } from '../src/components/common/SafetyBanner';
import { TechniqueDetailModal } from '../src/components/explore/TechniqueDetailModal';
import { HomeView } from '../src/components/home/HomeView';
import { ExploreView } from '../src/components/explore/ExploreView';
import type { ExerciseDefinition, Protocol } from '../src/types/exercise';
import type { UserStats } from '../src/types/session';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

function exerciseFixture(overrides: Partial<ExerciseDefinition> = {}): ExerciseDefinition {
  return {
    id: 'example',
    name: 'Example exercise',
    description: 'A non-clinical guided practice.',
    goals: ['calm'],
    category: 'pacing',
    difficulty: 'beginner',
    instructions: ['Breathe comfortably.'],
    protocols: [{
      id: 'basic',
      name: 'Basic',
      description: 'A comfortable rhythm.',
      phases: [{ id: 'inhale', label: 'Inhala', duration: 3, instruction: 'Inhala' }],
      defaultCycles: 3,
    }],
    safety: {
      level: 'low',
      warnings: ['General warning'],
      contraindications: ['General restriction'],
      requiresConfirmation: false,
      automaticRecommendation: true,
    },
    evidence: { summary: 'No clinical claim.' },
    ...overrides,
  };
}

test('SafetyBanner labels the modal and shows resolved protocol warnings, not stale exercise warnings', () => {
  const exercise = exerciseFixture();
  const protocol: Protocol = {
    ...exercise.protocols[0],
    safety: {
      level: 'moderate',
      warnings: ['Specific protocol warning'],
      contraindications: ['Specific protocol restriction'],
    },
  };
  const html = renderToStaticMarkup(
    <SafetyBanner exercise={exercise} protocol={protocol} onCancel={() => {}} onConfirm={() => {}} />,
  );

  assert.match(html, /<dialog\b/);
  assert.match(html, /aria-modal="true"/);
  assert.match(html, /aria-labelledby="safety-title"/);
  assert.match(html, /aria-describedby="safety-description safety-level"/);
  assert.match(html, /Specific protocol warning/);
  assert.match(html, /Contraindicación: Specific protocol restriction/);
  assert.match(html, /Nivel de precaución: <strong>moderado<\/strong>/);
  assert.doesNotMatch(html, /General warning/);
  assert.doesNotMatch(html, /General restriction/);
});

test('SafetyBanner Escape cancellation and explicit confirmation use different callbacks', () => {
  const exercise = exerciseFixture();
  let cancels = 0;
  let confirms = 0;
  let prevented = false;
  let renderer: ReactTestRenderer | null = null;
  try {
    act(() => {
      renderer = create(
        <SafetyBanner exercise={exercise} protocol={exercise.protocols[0]}
          onCancel={() => { cancels++; }} onConfirm={() => { confirms++; }} />,
      );
    });
    const dialog = renderer!.root.findByType('dialog');
    act(() => dialog.props.onCancel({ preventDefault: () => { prevented = true; } }));
    assert.equal(prevented, true);
    assert.equal(cancels, 1);
    assert.equal(confirms, 0);

    const buttons = renderer!.root.findAllByType('button');
    const confirm = buttons.find((button) => String(button.props.className).includes('flex-1 py-3 rounded-xl bg-[var(--color-accent)]'));
    assert.ok(confirm);
    act(() => confirm.props.onClick());
    assert.equal(confirms, 1);
    assert.equal(cancels, 1);
  } finally {
    if (renderer) act(() => renderer!.unmount());
  }
});

test('TechniqueDetailModal survives null-to-exercise transition and keeps selection within current exercise', () => {
  const first = exerciseFixture({
    protocols: [
      ...exerciseFixture().protocols,
      { ...exerciseFixture().protocols[0], id: 'specific', name: 'Specific',
        safety: { warnings: ['Specific protocol warning'] } },
    ],
  });
  const second = exerciseFixture({
    id: 'other',
    name: 'Other exercise',
    protocols: [{ ...exerciseFixture().protocols[0], id: 'other-protocol', name: 'Other protocol' }],
  });
  const chosen: string[] = [];
  let renderer: ReactTestRenderer | null = null;
  const onStartSession = (_exercise: ExerciseDefinition, protocol: Protocol) => { chosen.push(protocol.id); };
  const onClose = () => {};
  try {
    act(() => {
      renderer = create(<TechniqueDetailModal exercise={null} onClose={onClose} onStartSession={onStartSession} />);
    });
    act(() => {
      renderer!.update(<TechniqueDetailModal exercise={first} onClose={onClose} onStartSession={onStartSession} />);
    });

    const protocolButtons = renderer!.root.findAllByType('button').filter(
      (button) => String(button.props.className).includes('w-full text-left p-4'),
    );
    assert.equal(protocolButtons.length, 2);
    act(() => protocolButtons[1].props.onClick());
    assert.match(JSON.stringify(renderer!.toJSON()), /Specific protocol warning/);

    act(() => {
      renderer!.update(<TechniqueDetailModal exercise={second} onClose={onClose} onStartSession={onStartSession} />);
    });
    const startButton = renderer!.root.findAllByType('button').find(
      (button) => String(button.props.className).includes('w-full py-4'),
    );
    assert.ok(startButton);
    act(() => startButton.props.onClick());
    assert.deepEqual(chosen, ['other-protocol']);
  } finally {
    if (renderer) act(() => renderer!.unmount());
  }
});

test('Home intention without automatic recommendation navigates to Explore with reason context', () => {
  const stats: UserStats = {
    totalSessions: 0, totalCompletedSessions: 0, totalMinutes: 0, sessionsThisWeek: 0,
  };
  let navigation: [string, string | undefined] | null = null;
  let selectionCount = 0;
  let renderer: ReactTestRenderer | null = null;
  try {
    act(() => {
      renderer = create(
        <HomeView stats={stats} exercises={[exerciseFixture()]}
          onSelectExercise={() => { selectionCount++; }}
          onNavigateTab={(tab, goal) => { navigation = [tab, goal]; }} />,
      );
    });
    const cards = renderer!.root.findAllByType('button').filter(
      (button) => String(button.props.className).startsWith('group text-left'),
    );
    assert.equal(cards.length, 4);
    act(() => cards[2].props.onClick()); // focus has no eligible exercise in the test catalog
    assert.deepEqual(navigation, ['explore', 'focus']);
    assert.equal(selectionCount, 0);
  } finally {
    if (renderer) act(() => renderer!.unmount());
  }

  const exploreHtml = renderToStaticMarkup(
    <ExploreView onSelectExercise={() => {}} unavailableGoal="focus" />,
  );
  assert.match(exploreHtml, /role="status"/);
  assert.match(exploreHtml, /No hay un protocolo disponible para recomendación automática/);
});
