import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SafetyBanner } from '../../src/components/common/SafetyBanner';
import type { ExerciseDefinition, Protocol } from '../../src/types/exercise';
import '../../src/index.css';

const exercise: ExerciseDefinition = {
  id: 'browser-safety-fixture',
  name: 'Práctica de prueba',
  description: 'Escenario de validación automatizada (no disponible en el catálogo).',
  goals: ['calm'],
  difficulty: 'beginner',
  category: 'pacing',
  instructions: [],
  protocols: [{
    id: 'fixture-protocol',
    name: 'Protocolo con confirmación',
    description: 'Fixture for verifying focus, Escape and warnings.',
    defaultCycles: 1,
    phases: [{ id: 'inhale', label: 'Inhala', duration: 3, instruction: 'Inhala suavemente.' }],
  }],
  safety: {
    level: 'low',
    warnings: ['Aviso general de prueba'],
    contraindications: [],
    requiresConfirmation: false,
    automaticRecommendation: true,
  },
  evidence: { summary: 'Fixture técnico; sin afirmaciones médicas.' },
};

const protocol: Protocol = {
  ...exercise.protocols[0],
  safety: {
    level: 'moderate',
    warnings: ['Aviso específico del protocolo'],
    contraindications: ['Restricción específica del protocolo'],
    requiresConfirmation: true,
    automaticRecommendation: false,
  },
};

function Fixture() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState('sin acción');

  return (
    <main>
      <button onClick={() => setOpen(true)}>Abrir aviso de seguridad</button>
      <p role="status">Resultado: {result}</p>
      {open && (
        <SafetyBanner
          exercise={exercise}
          protocol={protocol}
          onCancel={() => { setResult('cancelado'); setOpen(false); }}
          onConfirm={() => { setResult('confirmado'); setOpen(false); }}
        />
      )}
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<Fixture />);
