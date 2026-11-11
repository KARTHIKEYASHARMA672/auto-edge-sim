import { GitCompare } from 'lucide-react';
import { ARCHITECTURE_CONFIGS } from '../simulation/networkParameters';
import { ARCHITECTURE_COMPARISON_DATA } from '../data/experimentalData';

export const ArchitecturePage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2.5rem' }}>
      {/* Page Title */}
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Architecture Comparative Analysis</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Detailed comparative evaluation of Cloud, Fog, and Edge tiers across bandwidth, propagation, queueing dynamics, and computational throughput.
        </p>
      </div>

      {/* 1. Core Technical Specification Matrix */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <GitCompare size={18} style={{ color: 'var(--color-accent)' }} />
            <span>Architecture Simulation Parameters</span>
          </div>
          <span className="badge badge-neutral">Simulation Model Assumptions</span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Attribute / Metric</th>
                <th style={{ color: 'var(--color-cloud)' }}>Cloud Computing</th>
                <th style={{ color: 'var(--color-fog)' }}>Fog Computing</th>
                <th style={{ color: 'var(--color-edge)' }}>Edge Computing</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>Deployment Proximity</td>
                <td>Remote Central Datacenter</td>
                <td>Roadside Unit (RSU) / Regional Metro</td>
                <td>On-Vehicle Microserver / Near-Field</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Bandwidth (Mbps)</td>
                <td className="mono" style={{ fontWeight: 600 }}>{ARCHITECTURE_CONFIGS.Cloud.bandwidthMbps} Mbps</td>
                <td className="mono" style={{ fontWeight: 600 }}>{ARCHITECTURE_CONFIGS.Fog.bandwidthMbps} Mbps</td>
                <td className="mono" style={{ fontWeight: 600 }}>{ARCHITECTURE_CONFIGS.Edge.bandwidthMbps} Mbps</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Propagation Delay</td>
                <td className="mono">{ARCHITECTURE_CONFIGS.Cloud.propagationDelayMs.toFixed(1)} ms</td>
                <td className="mono">{ARCHITECTURE_CONFIGS.Fog.propagationDelayMs.toFixed(1)} ms</td>
                <td className="mono">{ARCHITECTURE_CONFIGS.Edge.propagationDelayMs.toFixed(1)} ms</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Base Queue Delay</td>
                <td className="mono">{ARCHITECTURE_CONFIGS.Cloud.baseQueueDelayMs.toFixed(1)} ms</td>
                <td className="mono">{ARCHITECTURE_CONFIGS.Fog.baseQueueDelayMs.toFixed(1)} ms</td>
                <td className="mono">{ARCHITECTURE_CONFIGS.Edge.baseQueueDelayMs.toFixed(1)} ms</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Base Congestion Index</td>
                <td className="mono">{ARCHITECTURE_CONFIGS.Cloud.baseCongestionLevel.toFixed(1)}x</td>
                <td className="mono">{ARCHITECTURE_CONFIGS.Fog.baseCongestionLevel.toFixed(1)}x</td>
                <td className="mono">{ARCHITECTURE_CONFIGS.Edge.baseCongestionLevel.toFixed(1)}x</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Processing Capacity Factor</td>
                <td className="mono">{ARCHITECTURE_CONFIGS.Cloud.processingCapacity.toFixed(1)} units</td>
                <td className="mono">{ARCHITECTURE_CONFIGS.Fog.processingCapacity.toFixed(1)} units</td>
                <td className="mono">{ARCHITECTURE_CONFIGS.Edge.processingCapacity.toFixed(1)} units</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Average Transmission Delay (2 KB)</td>
                <td className="mono">0.160 ms</td>
                <td className="mono">0.080 ms</td>
                <td className="mono">0.032 ms</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. 1,000 Scenario Statistical Results */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <span>Statistical Performance (1,000 Monte Carlo Simulation Scenarios)</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Empirical Results (AutoEdgeSim_Architecture_Comparison.csv)
          </span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tier</th>
                <th>Sample Size</th>
                <th>Mean Latency</th>
                <th>Min Latency</th>
                <th>Max Latency</th>
                <th>Network Delay</th>
                <th>Processing Delay</th>
                <th>Relative Δ vs Cloud</th>
                <th>Latency Reduction</th>
              </tr>
            </thead>
            <tbody>
              {ARCHITECTURE_COMPARISON_DATA.map((row) => (
                <tr key={row.architecture}>
                  <td style={{ fontWeight: 600 }}>{row.architecture}</td>
                  <td className="mono">{row.scenarios}</td>
                  <td className="mono" style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                    {row.averageLatencyMs.toFixed(3)} ms
                  </td>
                  <td className="mono">{row.minimumLatencyMs.toFixed(3)} ms</td>
                  <td className="mono">{row.maximumLatencyMs.toFixed(3)} ms</td>
                  <td className="mono">{row.networkDelayMs.toFixed(3)} ms</td>
                  <td className="mono">{row.processingDelayMs.toFixed(3)} ms</td>
                  <td className="mono">{row.differenceFromCloudMs.toFixed(3)} ms</td>
                  <td
                    className="mono"
                    style={{
                      fontWeight: 600,
                      color: row.percentageDifferenceFromCloud < 0 ? 'var(--color-safe)' : 'var(--text-muted)'
                    }}
                  >
                    {row.percentageDifferenceFromCloud.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Trade-off Analysis Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--color-cloud)' }}>
          <h4 style={{ color: 'var(--color-cloud)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Cloud Computing Trade-Offs
          </h4>
          <ul style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingLeft: '1.1rem' }}>
            <li><strong>Strength:</strong> Virtually unconstrained storage, multi-vehicle fleet coordination, macro traffic modeling.</li>
            <li><strong>Weakness:</strong> Susceptible to WAN cellular jitter, high propagation delay (20ms), not viable for sub-10ms emergency braking.</li>
            <li><strong>Optimal Role:</strong> Long-range route optimization, telemetry archive, AI model retraining.</li>
          </ul>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--color-fog)' }}>
          <h4 style={{ color: 'var(--color-fog)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Fog Computing Trade-Offs
          </h4>
          <ul style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingLeft: '1.1rem' }}>
            <li><strong>Strength:</strong> 58.6% latency reduction over Cloud; local road infrastructure integration (smart intersections).</li>
            <li><strong>Weakness:</strong> Handoff overhead between roadside towers; bounded node capacity during high vehicle density.</li>
            <li><strong>Optimal Role:</strong> Cooperative perception, intersection hazard broadcast, warning-level deceleration.</li>
          </ul>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--color-edge)' }}>
          <h4 style={{ color: 'var(--color-edge)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Edge Computing Trade-Offs
          </h4>
          <ul style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingLeft: '1.1rem' }}>
            <li><strong>Strength:</strong> 87.2% latency reduction over Cloud; deterministic response (mean 4.7ms); zero dependence on remote network link.</li>
            <li><strong>Weakness:</strong> Vehicle thermal constraints, localized sensor field of view, hardware deployment cost per unit.</li>
            <li><strong>Optimal Role:</strong> Safety-critical obstacle braking, collision avoidance, real-time object tracking.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
