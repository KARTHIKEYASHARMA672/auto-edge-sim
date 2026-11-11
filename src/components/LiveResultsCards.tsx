import { Server, Radio, HardDrive, Activity } from 'lucide-react';
import { ArchitectureResult, SimulationResult } from '../types/simulation';

interface LiveResultsCardsProps {
  simulationResult: SimulationResult | null;
}

export const LiveResultsCards: React.FC<LiveResultsCardsProps> = ({ simulationResult }) => {
  if (!simulationResult) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
        <Activity size={28} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
        <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
          Simulation Ready
        </div>
        <div style={{ fontSize: '0.8rem' }}>
          Configure parameters and click "Run Simulation" to generate dynamic Cloud, Fog, and Edge latency telemetry.
        </div>
      </div>
    );
  }

  const architectures: {
    data: ArchitectureResult;
    icon: typeof Server;
    color: string;
    tierRole: string;
  }[] = [
    {
      data: simulationResult.cloud,
      icon: Server,
      color: 'var(--color-cloud)',
      tierRole: 'Centralized Tier'
    },
    {
      data: simulationResult.fog,
      icon: Radio,
      color: 'var(--color-fog)',
      tierRole: 'Intermediate Tier'
    },
    {
      data: simulationResult.edge,
      icon: HardDrive,
      color: 'var(--color-edge)',
      tierRole: 'Local Tier'
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
      {architectures.map(({ data, icon: Icon, color, tierRole }) => {
        return (
          <div
            key={data.architecture}
            className="card"
            style={{
              borderTop: `3px solid ${color}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.85rem'
            }}
          >
            {/* Header */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color }}>{data.architecture.toUpperCase()}</h3>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{tierRole}</span>
                  </div>
                </div>

                {/* Neutral Academic Status Indicator */}
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border-subtle)',
                    fontFamily: 'var(--font-mono)'
                  }}
                  title="Total response time range"
                >
                  {data.totalLatencyMs < 10 ? 'Ultra-low' : data.totalLatencyMs < 25 ? 'Moderate' : 'Extended'}
                </span>
              </div>

              {/* Primary Metric: Total Response Latency */}
              <div
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  marginTop: '0.5rem',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Total Response Latency
                </div>
                <div className="mono" style={{ fontSize: '1.75rem', fontWeight: 700, color }}>
                  {data.totalLatencyMs.toFixed(3)}{' '}
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>ms</span>
                </div>
              </div>
            </div>

            {/* Metrics Breakdown Table */}
            <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Bandwidth:</span>
                <span className="mono" style={{ fontWeight: 600 }}>{data.bandwidthMbps} Mbps</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Transmission Delay:</span>
                <span className="mono">{data.transmissionDelayMs.toFixed(3)} ms</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Propagation Delay:</span>
                <span className="mono">{data.propagationDelayMs.toFixed(3)} ms</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Queue Delay:</span>
                <span className="mono">{data.queueDelayMs.toFixed(3)} ms</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0', borderBottom: '1px solid var(--border-subtle)', fontWeight: 500 }}>
                <span style={{ color: 'var(--text-muted)' }}>Net Network Delay:</span>
                <span className="mono" style={{ color: 'var(--text-main)' }}>{data.networkDelayMs.toFixed(3)} ms</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0', borderBottom: '1px solid var(--border-subtle)', fontWeight: 500 }}>
                <span style={{ color: 'var(--text-muted)' }}>Processing Delay:</span>
                <span className="mono" style={{ color: 'var(--text-main)' }}>{data.processingDelayMs.toFixed(3)} ms</span>
              </div>
            </div>

            {/* Visual Delay Proportion Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-dim)', marginBottom: '3px' }}>
                <span>Network ({((data.networkDelayMs / data.totalLatencyMs) * 100).toFixed(0)}%)</span>
                <span>Processing ({((data.processingDelayMs / data.totalLatencyMs) * 100).toFixed(0)}%)</span>
              </div>
              <div style={{ height: '6px', borderRadius: '3px', backgroundColor: 'var(--bg-primary)', display: 'flex', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${(data.networkDelayMs / data.totalLatencyMs) * 100}%`,
                    backgroundColor: color,
                    opacity: 0.8
                  }}
                  title={`Network Delay: ${data.networkDelayMs.toFixed(2)} ms`}
                />
                <div
                  style={{
                    width: `${(data.processingDelayMs / data.totalLatencyMs) * 100}%`,
                    backgroundColor: '#e2e8f0',
                    opacity: 0.6
                  }}
                  title={`Processing Delay: ${data.processingDelayMs.toFixed(2)} ms`}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
