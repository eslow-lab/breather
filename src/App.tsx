import React, { useState, useEffect } from 'react';
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

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [preferences, setPreferences] = useState<UserPreferences>(() => StorageService.getPreferences());
  const [stats, setStats] = useState<UserStats>(() => StorageService.getStats());

  // Active session launcher
  const [activeSession, setActiveSession] = useState<{
    exercise: ExerciseDefinition;
    protocol: Protocol;
  } | null>(null);

  // Safety confirmation dialog state
  const [pendingSafetySession, setPendingSafetySession] = useState<{
    exercise: ExerciseDefinition;
    protocol: Protocol;
  } | null>(null);

  // Apply theme class on change
  useEffect(() => {
    const root = document.documentElement;
    if (preferences.theme === 'dark') {
      root.classList.add('dark');
    } else if (preferences.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    StorageService.savePreferences(preferences);
  }, [preferences]);

  const refreshStats = () => {
    setStats(StorageService.getStats());
  };

  const handleSelectExercise = (exercise: ExerciseDefinition, protocol?: Protocol) => {
    const proto = protocol || exercise.protocols[0];

    // Check safety warning
    if (exercise.safety.level === 'advanced' || exercise.safety.requiresConfirmation || proto.phases.some((p) => p.id === 'hold' && p.duration >= 4)) {
      setPendingSafetySession({ exercise, protocol: proto });
    } else {
      setActiveSession({ exercise, protocol: proto });
    }
  };

  const handleCompleteSession = (record: SessionRecord) => {
    StorageService.saveSession(record);
    refreshStats();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] transition-colors duration-300">
      {/* Header */}
      {!activeSession && (
        <Header
          preferences={preferences}
          onUpdatePreferences={setPreferences}
          showBack={activeTab !== 'home'}
          onBack={() => setActiveTab('home')}
        />
      )}

      {/* Main Tab Content */}
      {!activeSession && (
        <main className="animate-fade-in">
          {activeTab === 'home' && (
            <HomeView
              stats={stats}
              onSelectExercise={handleSelectExercise}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'explore' && (
            <ExploreView onSelectExercise={handleSelectExercise} />
          )}

          {activeTab === 'history' && (
            <SessionHistoryView stats={stats} onRefreshStats={refreshStats} />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              preferences={preferences}
              onUpdatePreferences={setPreferences}
              onRefreshStats={refreshStats}
            />
          )}
        </main>
      )}

      {/* Navigation Bar */}
      <NavigationBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isSessionActive={!!activeSession}
      />

      {/* Active Breathing Session Overlay */}
      {activeSession && (
        <BreathingSession
          exercise={activeSession.exercise}
          protocol={activeSession.protocol}
          preferences={preferences}
          onUpdatePreferences={setPreferences}
          onClose={() => setActiveSession(null)}
          onCompleteSession={handleCompleteSession}
        />
      )}

      {/* Safety Confirmation Dialog */}
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
