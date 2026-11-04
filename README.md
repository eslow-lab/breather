# Breather

A calm, precise, privacy-first guided breathing app for wellbeing — by
[eslow_lab](https://github.com/eslow-lab).

Breather runs entirely in the browser. There is no backend, no account, and no
tracking: all preferences and session history live in the device's
`localStorage`. The focus is a trustworthy, non-clinical breathing experience
with a clear separation between the *experience* copy shown to users and the
*evidence* that backs each technique.

## Features

- **7 breathing techniques** — diaphragmatic, prolonged exhalation, pursed-lip,
  box, alternate-nostril, lateral-costal, and cyclic sighing.
- **Framework-agnostic engine** — a `requestAnimationFrame`-driven state machine
  (`BreathingEngine`) that is pause/resume accurate and emits typed events.
- **Guided sessions** — animated breathing orb, phase indicator, controls, and a
  session-complete summary.
- **Safety-aware** — techniques carry a safety level; advanced protocols or those
  that require confirmation prompt a safety banner before starting.
- **Explore & history** — browse techniques with detail modals, and review past
  sessions and aggregate stats.
- **Settings & theming** — light/dark/system theme, audio cues, and haptics.
- **Privacy-first** — no network calls for user data; everything is local.

## Tech stack

- **React 19** + **TypeScript** (strict: `noUnusedLocals` / `noUnusedParameters`)
- **Vite 6** for dev/build
- **Tailwind CSS 4** (via `@tailwindcss/vite`)
- **motion** for animations, **lucide-react** for icons
- Tests via Node's built-in test runner driven by **tsx**

## Project structure

```
src/
  App.tsx               # Root component: tabs, session orchestration, safety gating
  main.tsx              # React entry point
  components/
    layout/             # Header, NavigationBar
    home/               # HomeView
    explore/            # ExploreView, TechniqueDetailModal
    history/            # SessionHistoryView
    settings/           # SettingsView
    session/            # BreathingSession, BreathingOrb, PhaseIndicator,
                        #   SessionControls, SessionComplete
    common/             # SafetyBanner
  engine/
    BreathingEngine.ts  # Framework-agnostic session state machine
    recommendations.ts  # Technique recommendation logic
  data/
    exercises/          # One file per technique + catalog index (EXERCISES)
    experience.ts
  services/
    StorageService.ts   # localStorage: preferences, stats, session history
    AudioService.ts     # Optional audio cues
    HapticsService.ts   # Optional vibration cues
  types/                # exercise / engine / session type definitions
tests/                  # Engine, services, data, and React integration tests
```

### Data model

Each technique is an `ExerciseDefinition` (see `src/types/exercise.ts`) with one
or more `Protocol`s. A protocol is a list of timed `PhaseDefinition`s
(`inhale` / `hold` / `exhale` / `pause`) plus a default cycle count. User-facing
`experience` copy is kept deliberately separate from the conservative `evidence`
field so marketing language can never be mistaken for a medical claim — a rule
the test suite enforces.

## Run locally

**Prerequisites:** Node.js (tested on Node 22)

```bash
npm install     # install dependencies
npm run dev      # start the dev server on http://localhost:3000
```

### Other scripts

```bash
npm run build    # production build to dist/
npm run preview  # preview the production build
npm run lint     # type-check with tsc --noEmit
npm test         # run the test suite (tsx --test)
```

## Status

Initial checkpoint baseline (verified on Node 22):

- `npm run lint` — clean (no type errors)
- `npm test` — 33 passing
- `npm run build` — succeeds (~280 kB JS / ~36 kB CSS before gzip)

## License

See repository for license details.
