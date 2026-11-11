import React, { useState, useEffect } from 'react';
import { Header, NavTab } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { LiveSimulationPage } from './pages/LiveSimulationPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { ExperimentsPage } from './pages/ExperimentsPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { DEFAULT_PARAMETERS } from './simulation/networkParameters';
import { runSimulation } from './simulation/simulationEngine';
import { SimulationParameters, SimulationResult } from './types/simulation';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [parameters, setParameters] = useState<SimulationParameters>(DEFAULT_PARAMETERS);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isLightTheme, setIsLightTheme] = useState<boolean>(false);

  // Initialize with a default simulation result on first mount
  useEffect(() => {
    const initialResult = runSimulation(DEFAULT_PARAMETERS);
    setSimulationResult(initialResult);
  }, []);

  const handleRunSimulation = () => {
    setIsRunning(true);
    // Simulate instantaneous or slight micro-delay for realistic computing feel
    setTimeout(() => {
      const result = runSimulation(parameters);
      setSimulationResult(result);
      setIsRunning(false);
    }, 150);
  };

  const handleReset = () => {
    setParameters(DEFAULT_PARAMETERS);
    const result = runSimulation(DEFAULT_PARAMETERS);
    setSimulationResult(result);
  };

  const toggleTheme = () => {
    const nextTheme = !isLightTheme;
    setIsLightTheme(nextTheme);
    if (nextTheme) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLightTheme={isLightTheme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content Body */}
      <main style={{ flex: 1, paddingTop: '1.5rem' }}>
        <div className="container">
          {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
          {activeTab === 'simulation' && (
            <LiveSimulationPage
              parameters={parameters}
              simulationResult={simulationResult}
              onParametersChange={setParameters}
              onRunSimulation={handleRunSimulation}
              onReset={handleReset}
              isRunning={isRunning}
            />
          )}
          {activeTab === 'comparison' && <ArchitecturePage />}
          {activeTab === 'experiments' && <ExperimentsPage />}
          {activeTab === 'methodology' && <MethodologyPage />}
        </div>
      </main>

      {/* Institutional Academic Footer */}
      <footer
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-subtle)',
          padding: '1.5rem 0',
          marginTop: 'auto'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}
        >
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '2px' }}>
              AutoEdgeSim: Autonomous Vehicle Cloud-Fog-Edge Simulation Platform
            </div>
            <div>
              Comparative Simulation of Cloud, Fog, and Edge Computing Architectures for Autonomous Vehicle Obstacle Detection
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div>University Edge Computing Research Project</div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>
              Software-Only Simulation Platform • Deterministic Delay Models
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
