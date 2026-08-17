import React, { useEffect, useState } from 'react';
import { Header } from './components/layout/Header';
import { NavigationBar, NavTab } from './components/layout/NavigationBar';
import { HomeView } from './components/home/HomeView';
import { ExploreView } from './components/explore/ExploreView';
import { SessionHistoryView } from './components/history/SessionHistoryView';
import { SettingsView } from './components/settings/SettingsView';
import { BreathingSession } from './components/session/BreathingSession';
import { SafetyBanner } from './components/common/SafetyBanner';
import { ExerciseDefinition, Protocol } from './types/exercise';
import { UserPreferences, UserStats, SessionRecord } from './types/session';
import { StorageService } from './services/StorageService';
import { getProtocolSafety } from './engine/recommendations';
import { EXERCISES } from './data/exercises';

function protocolRequiresSafetyConfirmation(exercise: ExerciseDefinition, protocol: Protocol): boolean {
  const safety = getProtocolSafety(exercise, protocol);
  return safety.level === 'advanced' || safety.requiresConfirmation;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [preferences, setPreferences] = useState<UserPreferences>(() => StorageService.getPreferences());
  const [stats, setStats] = useState<UserStats>(() => StorageService.getStats());
  const [activeSession, setActiveSession] = useState<{ exercise: ExerciseDefinition; protocol: Protocol } | null>(null);
  const [pendingSafetySession, setPendingSafetySession] = useState<{ exercise: ExerciseDefinition; protocol: Protocol } | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (preferences.theme === 'dark') root.classList.add('dark');
    else if (preferences.theme === 'light') root.classList.remove('dark');
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) root.classList.add('dark');
    else root.classList.remove('dark');
    StorageService.savePreferences(preferences);
  }, [preferences]);

  const refreshStats = () => setStats(StorageService.getStats());

  const handleSelectExercise = (exercise: ExerciseDefinition, protocol?: Protocol) => {
    const proto = protocol || exercise.protocols[0];
    if (protocolRequiresSafetyConfirmation(exercise, proto)) {
      setPendingSafetySession({ exercise, protocol: proto });
      return;
    }
    setActiveSession({ exercise, protocol: proto });
  };

  const handleCompleteSession = (record: SessionRecord) => {
    StorageService.saveSession(record);
    refreshStats();
  };

  const handleAbortSession = (record: SessionRecord) => {
    StorageService.saveSession(record);
    refreshStats();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] transition-colors duration-300">
      {!activeSession && (
        <Header preferences={preferences} onUpdatePreferences={setPreferences} showBack={activeTab !== 'home'} onBack={() => setActiveTab('home')} />
      )}

      {!activeSession && (
        <main className="animate-fade-in">
          {activeTab === 'home' && <HomeView stats={stats} exercises={EXERCISES} onSelectExercise={handleSelectExercise} onNavigateTab={(tab) => setActiveTab(tab)} />}
          {activeTab === 'explore' && <ExploreView onSelectExercise={handleSelectExercise} />}
          {activeTab === 'history' && <SessionHistoryView stats={stats} onRefreshStats={refreshStats} />}
          {activeTab === 'settings' && <SettingsView preferences={preferences} onUpdatePreferences={setPreferences} onRefreshStats={refreshStats} />}
        </main>
      )}

      <NavigationBar activeTab={activeTab} onTabChange={setActiveTab} isSessionActive={!!activeSession} />

      {activeSession && (
        <BreathingSession
          exercise={activeSession.exercise}
          protocol={activeSession.protocol}
          preferences={preferences}
          onUpdatePreferences={setPreferences}
          onClose={() => setActiveSession(null)}
          onCompleteSession={handleCompleteSession}
          onAbortSession={handleAbortSession}
        />
      )}

      {pendingSafetySession && (
        <SafetyBanner
          exercise={pendingSafetySession.exercise}
          protocol={pendingSafetySession.protocol}
          onConfirm={() => {
            setActiveSession(pendingSafetySession);
            setPendingSafetySession(null);
          }}
          onCancel={() => setPendingSafetySession(null)}
        />
      )}
    </div>
  );
}
