import { Download, AlertCircle, CheckCircle } from 'lucide-react';
import { SimulationControls } from '../components/SimulationControls';
import { ScenarioAnimation } from '../components/ScenarioAnimation';
import { LiveResultsCards } from '../components/LiveResultsCards';
import { LatencyBarChart } from '../components/Charts/LatencyBarChart';
import { DelayBreakdownChart } from '../components/Charts/DelayBreakdownChart';
import { SimulationParameters, SimulationResult } from '../types/simulation';
import { exportSimulationToCsv } from '../simulation/exportCsv';

interface LiveSimulationPageProps {
  parameters: SimulationParameters;
  simulationResult: SimulationResult | null;
  onParametersChange: (params: SimulationParameters) => void;
  onRunSimulation: () => void;
  onReset: () => void;
  isRunning: boolean;
}

export const LiveSimulationPage: React.FC<LiveSimulationPageProps> = ({
  parameters,
  simulationResult,
  onParametersChange,
  onRunSimulation,
  onReset,
  isRunning
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '2rem' }}>
      {/* Page Header Strip with CSV Export */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Interactive Scenario Simulation</h2>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Configure autonomous vehicle variables and evaluate multi-tier Cloud, Fog, and Edge processing dynamics.
          </div>
        </div>

        {simulationResult && (
          <button
            onClick={() => exportSimulationToCsv(simulationResult)}
            className="btn btn-outline btn-sm"
            title="Export this scenario to CSV"
          >
            <Download size={14} />
            <span>Export Scenario CSV</span>
          </button>
        )}
      </div>

      {/* 3-COLUMN MAIN WORKSPACE */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 320px) minmax(400px, 1fr) minmax(280px, 340px)',
          gap: '1rem',
          alignItems: 'stretch'
        }}
        className="simulation-workspace"
      >
        {/* LEFT COLUMN: CONTROLS */}
        <div style={{ minWidth: 0 }}>
          <SimulationControls
            parameters={parameters}
            onChange={onParametersChange}
            onRunSimulation={onRunSimulation}
            onReset={onReset}
            isRunning={isRunning}
          />
        </div>

        {/* CENTER COLUMN: ANIMATED VEHICLE SCENARIO & NETWORK FLOW */}
        <div style={{ minWidth: 0 }}>
          <ScenarioAnimation
            simulationResult={simulationResult}
            parameters={parameters}
            onRunSimulation={onRunSimulation}
            onReset={onReset}
          />
        </div>

        {/* RIGHT COLUMN: LIVE NUMERICAL RESULTS CARDS */}
        <div style={{ minWidth: 0, height: '100%' }}>
          <LiveResultsCards simulationResult={simulationResult} />
        </div>
      </div>

      {/* LOWER SECTION: COMPARISON CHARTS & DECISION JUSTIFICATION */}
      {simulationResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            <LatencyBarChart simulationResult={simulationResult} />
            <DelayBreakdownChart simulationResult={simulationResult} />
          </div>

          {/* Decision Result Analysis Banner */}
          <div
            className="card"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              borderLeft:
                simulationResult.severity === 'SAFE'
                  ? '4px solid var(--color-safe)'
                  : simulationResult.severity === 'WARNING'
                  ? '4px solid var(--color-warning)'
                  : '4px solid var(--color-critical)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ marginTop: '2px' }}>
                {simulationResult.severity === 'SAFE' ? (
                  <CheckCircle size={22} style={{ color: 'var(--color-safe)' }} />
                ) : simulationResult.severity === 'WARNING' ? (
                  <AlertCircle size={22} style={{ color: 'var(--color-warning)' }} />
                ) : (
                  <AlertCircle size={22} style={{ color: 'var(--color-critical)' }} />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                    Scenario Decision Rationale: {simulationResult.action} ({simulationResult.severity})
                  </h3>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  At <strong>{simulationResult.parameters.vehicleSpeedKmh} km/h</strong>, the vehicle covers{' '}
                  <strong>{(simulationResult.parameters.vehicleSpeedKmh / 3.6).toFixed(1)} meters per second</strong>. 
                  Given an obstacle distance of <strong>{simulationResult.parameters.obstacleDistanceM} m</strong>, the detection 
                  system classifications are deterministically verified. Decision latency delivered by Edge computing (
                  <strong>{simulationResult.edge.totalLatencyMs.toFixed(2)} ms</strong>) affords the autonomous braking system 
                  maximum reaction margin compared to intermediate Fog (<strong>{simulationResult.fog.totalLatencyMs.toFixed(2)} ms</strong>) 
                  and remote Cloud (<strong>{simulationResult.cloud.totalLatencyMs.toFixed(2)} ms</strong>).
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
