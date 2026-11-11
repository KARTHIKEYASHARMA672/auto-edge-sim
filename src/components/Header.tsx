import React from 'react';
import { Cpu, Activity, GitCompare, BarChart3, BookOpen, Layers, Sun, Moon } from 'lucide-react';

export type NavTab = 'dashboard' | 'simulation' | 'comparison' | 'experiments' | 'methodology';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isLightTheme: boolean;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isLightTheme,
  toggleTheme
}) => {
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: Layers },
    { id: 'simulation' as NavTab, label: 'Live Simulation', icon: Activity },
    { id: 'comparison' as NavTab, label: 'Architecture Comparison', icon: GitCompare },
    { id: 'experiments' as NavTab, label: 'Experiments', icon: BarChart3 },
    { id: 'methodology' as NavTab, label: 'Methodology', icon: BookOpen }
  ];

  return (
    <header
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.75rem',
          paddingBottom: '0.75rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        {/* Branding & Subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}
          >
            <Cpu size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                AutoEdgeSim
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: '3px',
                  backgroundColor: 'rgba(37, 99, 235, 0.15)',
                  color: 'var(--color-accent)',
                  border: '1px solid rgba(37, 99, 235, 0.3)'
                }}
              >
                UNIV. RESEARCH
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Autonomous Vehicle Cloud-Fog-Edge Simulation Platform
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="btn"
                style={{
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.82rem',
                  backgroundColor: isActive ? 'var(--color-accent)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  border: isActive ? '1px solid var(--color-accent)' : '1px solid transparent'
                }}
              >
                <Icon size={15} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Tools (Theme Toggle) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={toggleTheme}
            className="btn btn-outline btn-sm"
            title="Toggle Light / Dark Academic Theme"
            aria-label="Toggle Theme"
          >
            {isLightTheme ? <Moon size={15} /> : <Sun size={15} />}
            <span style={{ fontSize: '0.75rem' }}>{isLightTheme ? 'Dark' : 'Light'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
