import {
  Play,
  Server,
  Radio,
  HardDrive,
  Cpu,
  Shield,
  Activity,
  GitCompare,
  BarChart2,
  CheckCircle2,
  Info
} from 'lucide-react';
import { ARCHITECTURE_CONFIGS } from '../simulation/networkParameters';
import { ARCHITECTURE_COMPARISON_DATA } from '../data/experimentalData';
import { NavTab } from '../components/Header';

interface DashboardProps {
  onNavigate: (tab: NavTab) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '2.5rem' }}>
      {/* 1. Academic Project Hero */}
      <div
        className="card"
        style={{
          borderLeft: '4px solid var(--color-accent)',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ maxWidth: '850px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-neutral">University Research Platform</span>
              <span className="badge" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-accent)' }}>
                Edge Computing Lab
              </span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
              AutoEdgeSim
            </h1>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Comparative Simulation of Cloud, Fog, and Edge Computing Architectures for Autonomous Vehicle Obstacle Detection
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              A software-only simulation environment comparing end-to-end response latencies across Cloud, Fog, and Edge computing paradigms. 
              The simulation rigorously evaluates network transmission, propagation, stochastic queueing delays, and computational processing 
              workloads when an autonomous vehicle encounters road obstacles at varying distances, speeds, and network conditions.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={() => onNavigate('simulation')}
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.4rem', fontSize: '0.95rem' }}
            >
              <Play size={18} fill="currentColor" />
              <span>START SIMULATION</span>
            </button>
            <button
              onClick={() => onNavigate('experiments')}
              className="btn btn-outline"
              style={{ padding: '0.5rem 1.4rem' }}
            >
              <BarChart2 size={16} />
              <span>View 1,000x Benchmark</span>
            </button>
          </div>
        </div>

        {/* Academic Notice Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.6rem 0.85rem',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)'
          }}
        >
          <Info size={16} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
          <span>
            <strong>Simulation Model:</strong> Software-based analytical simulation model. Does not involve physical hardware, microcontrollers (Arduino/Raspberry Pi), or real vehicle CAN bus connections.
          </span>
        </div>
      </div>

      {/* 2. Interactive Architecture Flow Diagram */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Activity size={18} style={{ color: 'var(--color-accent)' }} />
            <span>Autonomous Decision Flow Pipeline</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Vehicle ➔ Wireless Uplink ➔ Compute Tier ➔ Control Actuation
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem 0'
          }}
        >
          {/* Step 1 */}
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(37, 99, 235, 0.15)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
              <Cpu size={20} />
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>1. Perception & Detection</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              LiDAR/Camera detects obstacle (5–50m). Generates 1–5 KB telemetry packet.
            </div>
          </div>

          <div style={{ textAlign: 'center', color: 'var(--text-dim)' }}>➔</div>

          {/* Step 2 */}
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(2, 132, 199, 0.15)', color: 'var(--color-fog)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
              <Radio size={20} />
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>2. Network Uplink</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Data transmitted through edge/fog/cloud channels with bandwidth & queue delays.
            </div>
          </div>

          <div style={{ textAlign: 'center', color: 'var(--text-dim)' }}>➔</div>

          {/* Step 3 */}
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(13, 148, 136, 0.15)', color: 'var(--color-edge)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
              <HardDrive size={20} />
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>3. Computational Workload</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Workload calculated from vehicle speed, obstacle distance, and obstacle size.
            </div>
          </div>

          <div style={{ textAlign: 'center', color: 'var(--text-dim)' }}>➔</div>

          {/* Step 4 */}
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-safe)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
              <Shield size={20} />
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>4. Safety Action Execution</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              CONTINUE, SLOW DOWN, or EMERGENCY BRAKE executed based on distance severity.
            </div>
          </div>
        </div>
      </div>

      {/* 3. Three Architecture Summary Cards */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Architecture Specifications</h3>
          <button onClick={() => onNavigate('comparison')} className="btn btn-outline btn-sm">
            <GitCompare size={14} />
            <span>Full Comparison Matrix</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {/* Cloud Card */}
          <div className="card" style={{ borderTop: '3px solid var(--color-cloud)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <Server size={20} style={{ color: 'var(--color-cloud)' }} />
              <div>
                <h4 style={{ color: 'var(--color-cloud)', fontSize: '1.05rem', fontWeight: 700 }}>CLOUD COMPUTING</h4>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Centralized Datacenter</div>
              </div>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.85rem', minHeight: '36px' }}>
              {ARCHITECTURE_CONFIGS.Cloud.description}
            </p>
            <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.65rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Bandwidth:</span>
                <span className="mono" style={{ fontWeight: 600 }}>100 Mbps</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Propagation Delay:</span>
                <span className="mono">20.0 ms</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Base Queue Delay:</span>
                <span className="mono">8.0 ms</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Processing Capacity:</span>
                <span className="mono">1.0 units</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.35rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--text-muted)' }}>Mean Benchmark Latency:</span>
                <span className="mono" style={{ color: 'var(--color-cloud)' }}>36.934 ms</span>
              </div>
            </div>
          </div>

          {/* Fog Card */}
          <div className="card" style={{ borderTop: '3px solid var(--color-fog)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <Radio size={20} style={{ color: 'var(--color-fog)' }} />
              <div>
                <h4 style={{ color: 'var(--color-fog)', fontSize: '1.05rem', fontWeight: 700 }}>FOG COMPUTING</h4>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Roadside Unit / Regional Aggregator</div>
              </div>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.85rem', minHeight: '36px' }}>
              {ARCHITECTURE_CONFIGS.Fog.description}
            </p>
            <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.65rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Bandwidth:</span>
                <span className="mono" style={{ fontWeight: 600 }}>200 Mbps</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Propagation Delay:</span>
                <span className="mono">8.0 ms</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Base Queue Delay:</span>
                <span className="mono">4.0 ms</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Processing Capacity:</span>
                <span className="mono">2.0 units</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.35rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--text-muted)' }}>Mean Benchmark Latency:</span>
                <span className="mono" style={{ color: 'var(--color-fog)' }}>15.298 ms</span>
              </div>
            </div>
          </div>

          {/* Edge Card */}
          <div className="card" style={{ borderTop: '3px solid var(--color-edge)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <HardDrive size={20} style={{ color: 'var(--color-edge)' }} />
              <div>
                <h4 style={{ color: 'var(--color-edge)', fontSize: '1.05rem', fontWeight: 700 }}>EDGE COMPUTING</h4>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>On-Vehicle / Near-Field Node</div>
              </div>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.85rem', minHeight: '36px' }}>
              {ARCHITECTURE_CONFIGS.Edge.description}
            </p>
            <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.65rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Bandwidth:</span>
                <span className="mono" style={{ fontWeight: 600 }}>500 Mbps</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Propagation Delay:</span>
                <span className="mono">2.0 ms</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Base Queue Delay:</span>
                <span className="mono">1.5 ms</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Processing Capacity:</span>
                <span className="mono">4.0 units</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.35rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--text-muted)' }}>Mean Benchmark Latency:</span>
                <span className="mono" style={{ color: 'var(--color-edge)' }}>4.738 ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. 1000-Scenario Empirical Benchmark Highlights */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <CheckCircle2 size={18} style={{ color: 'var(--color-accent)' }} />
            <span>Benchmark Highlights (1,000 Simulated Scenarios Summary)</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Source: AutoEdgeSim_Architecture_Comparison.csv
          </span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Architecture</th>
                <th>Scenarios</th>
                <th>Mean Latency</th>
                <th>Min Latency</th>
                <th>Max Latency</th>
                <th>Net Network Delay</th>
                <th>Proc Delay</th>
                <th>Diff vs Cloud</th>
                <th>% Reduction</th>
              </tr>
            </thead>
            <tbody>
              {ARCHITECTURE_COMPARISON_DATA.map((row) => (
                <tr key={row.architecture}>
                  <td style={{ fontWeight: 600 }}>{row.architecture}</td>
                  <td className="mono">{row.scenarios}</td>
                  <td className="mono" style={{ fontWeight: 600 }}>{row.averageLatencyMs.toFixed(3)} ms</td>
                  <td className="mono">{row.minimumLatencyMs.toFixed(3)} ms</td>
                  <td className="mono">{row.maximumLatencyMs.toFixed(3)} ms</td>
                  <td className="mono">{row.networkDelayMs.toFixed(3)} ms</td>
                  <td className="mono">{row.processingDelayMs.toFixed(3)} ms</td>
                  <td className="mono">{row.differenceFromCloudMs.toFixed(3)} ms</td>
                  <td className="mono" style={{ fontWeight: 600, color: row.percentageDifferenceFromCloud < 0 ? 'var(--color-safe)' : 'var(--text-muted)' }}>
                    {row.percentageDifferenceFromCloud.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
