import React from 'react';
import { Home, Compass, History, Settings } from 'lucide-react';

export type NavTab = 'home' | 'explore' | 'history' | 'settings';

interface NavigationBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isSessionActive?: boolean;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  activeTab,
  onTabChange,
  isSessionActive = false,
}) => {
  if (isSessionActive) return null; // Hide navigation during active breathing session for zero distractions

  const navItems = [
    { id: 'home' as NavTab, label: 'Inicio', icon: Home },
    { id: 'explore' as NavTab, label: 'Explorar', icon: Compass },
    { id: 'history' as NavTab, label: 'Historial', icon: History },
    { id: 'settings' as NavTab, label: 'Ajustes', icon: Settings },
  ];

  return (
    <nav 
      aria-label="Navegación principal" 
      className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-surface)]/90 backdrop-blur-md border-t border-[var(--border-subtle)] transition-colors"
    >
      <div className="max-w-md mx-auto px-6 py-2 flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-[var(--color-accent)] font-medium scale-105'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Icon className="w-5 h-5 mb-1 stroke-[1.75]" />
              <span className="text-[11px] tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
