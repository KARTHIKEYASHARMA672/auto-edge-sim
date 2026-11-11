import { AlertTriangle } from 'lucide-react';
import { SIMULATION_DISCLAIMER } from '../simulation/networkParameters';

export const MethodologyPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      {/* Page Title */}
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Simulation Methodology & Mathematical Model</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Formal documentation of mathematical equations, network delay formulations, computational workload factors, and decision logic.
        </p>
      </div>

      {/* Mandatory Academic Disclaimer Banner */}
      <div
        className="card"
        style={{
          borderLeft: '4px solid var(--color-warning)',
          backgroundColor: 'var(--bg-tertiary)',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center'
        }}
      >
        <AlertTriangle size={20} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
        <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
          <strong>Academic Simulation Notice:</strong> {SIMULATION_DISCLAIMER}
        </div>
      </div>

      {/* 1. Scenario Generation & Control Inputs */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <span className="mono" style={{ color: 'var(--color-accent)' }}>01.</span>
            <span>Scenario Parameter Generation</span>
          </div>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
          Each simulation scenario characterizes a discrete autonomous driving event parameterized by continuous and categorical random variables:
        </p>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Domain / Range</th>
                <th>Physical Interpretation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>Vehicle Speed ($v$)</td>
                <td className="mono">30 – 100 km/h</td>
                <td>Longitudinal velocity of the autonomous test platform.</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Obstacle Distance ($d$)</td>
                <td className="mono">5 – 50 meters</td>
                <td>Direct line-of-sight range to detected road obstruction.</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Obstacle Size ($S$)</td>
                <td className="mono">Small, Medium, Large</td>
                <td>Dimensional complexity (Small = 1.0, Medium = 1.2, Large = 1.5).</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Packet Size ($P$)</td>
                <td className="mono">1 – 5 KB</td>
                <td>Extracted perception payload (LiDAR pointcloud bounding boxes / feature vectors).</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Network Congestion ($C$)</td>
                <td className="mono">Low (0.5), Medium (1.0), High (2.0)</td>
                <td>Channel saturation multiplier affecting wireless link queueing.</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Processing Load ($L$)</td>
                <td className="mono">Low (0.5), Medium (1.0), High (2.0), Very High (3.0)</td>
                <td>Contention multiplier scaling node effective compute capacity.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2 & 3. Network Delay & Transmission Delay Model */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <span className="mono" style={{ color: 'var(--color-accent)' }}>02.</span>
            <span>Network Delay & Transmission Model</span>
          </div>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
          The transmission delay (T_trans) represents the physical serialization time required to push data bits across the wireless link:
        </p>

        <div
          style={{
            backgroundColor: 'var(--bg-primary)',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.88rem',
            marginBottom: '0.75rem',
            lineHeight: 1.6
          }}
        >
          <div>T = Data Size / Bandwidth</div>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.78rem', marginTop: '0.25rem' }}>
            packet_size_kbits = packet_size_kb × 8
            <br />
            bandwidth_kbps = bandwidth_mbps × 1000
            <br />
            transmission_delay_ms = (packet_size_kbits / bandwidth_kbps) × 1000
          </div>
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Because unit conversions cancel (((KB × 8 × 1000) / (Mbps × 1000))), this simplifies exactly to:
          <span className="mono" style={{ color: 'var(--text-main)', marginLeft: '6px' }}>
            T_trans (ms) = (packet_size_kb × 8) / bandwidth_mbps
          </span>
        </p>
      </div>

      {/* 4 & 5. Propagation & Queue Delay Models */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <span className="mono" style={{ color: 'var(--color-accent)' }}>03.</span>
            <span>Propagation and Queue Delay Formulations</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.35rem' }}>Propagation Delay (T_prop)</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Reflects the electro-optical transit latency over physical distance and routing hops:
            </p>
            <ul style={{ fontSize: '0.78rem', color: 'var(--text-muted)', paddingLeft: '1.2rem', marginTop: '0.35rem' }}>
              <li><strong>Cloud:</strong> 20.0 ms (Backhaul fiber to remote datacenter)</li>
              <li><strong>Fog:</strong> 8.0 ms (Cellular base station / RSU gateway)</li>
              <li><strong>Edge:</strong> 2.0 ms (Local near-field DSRC / On-vehicle bus)</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.35rem' }}>Queue Delay (T_queue)</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Models buffering latency under stochastic traffic fluctuations:
            </p>
            <div
              style={{
                backgroundColor: 'var(--bg-primary)',
                padding: '0.6rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                marginTop: '0.35rem'
              }}
            >
              T_queue = base_queue_ms × congestion × Uniform(0.8, 1.2)
            </div>
          </div>
        </div>

        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <strong>Total Network Delay:</strong>{' '}
          <span className="mono" style={{ color: 'var(--text-main)' }}>
            T_network = T_trans + T_prop + T_queue
          </span>
        </div>
      </div>

      {/* 6. Processing Model */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <span className="mono" style={{ color: 'var(--color-accent)' }}>04.</span>
            <span>Computational Workload & Processing Delay</span>
          </div>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
          Autonomous perception requires decision computation that increases dynamically when vehicle velocity is higher, obstacles are closer, and target geometries are larger:
        </p>

        <div
          style={{
            backgroundColor: 'var(--bg-primary)',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.84rem',
            marginBottom: '0.75rem',
            lineHeight: 1.6
          }}
        >
          <div>Total Workload = 10 × speed_factor × distance_factor × size_factor</div>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.78rem', marginTop: '0.25rem' }}>
            speed_factor = vehicle_speed / 100
            <br />
            distance_factor = max(0.5, (50 - obstacle_distance) / 50)
            <br />
            size_factor = Small: 1.0, Medium: 1.2, Large: 1.5
          </div>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
          Processing load modulates effective processing capacity (C_eff = C_base / Load). The resulting processing delay includes a stochastic variation (0.9 - 1.1):
        </p>

        <div
          style={{
            backgroundColor: 'var(--bg-primary)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.84rem'
          }}
        >
          Processing Delay (ms) = (Total Workload / Effective Capacity) × Uniform(0.9, 1.1)
        </div>
      </div>

      {/* 7. Total Response Latency */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <span className="mono" style={{ color: 'var(--color-accent)' }}>05.</span>
            <span>End-to-End Total Response Latency</span>
          </div>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          For each architecture tier (Tier k in [Cloud, Fog, Edge]), the cumulative round-trip latency is the exact sum of total network delay and processing computation delay:
        </p>
        <div
          style={{
            backgroundColor: 'var(--bg-primary)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.95rem',
            fontWeight: 600,
            marginTop: '0.5rem',
            textAlign: 'center',
            color: 'var(--color-accent)'
          }}
        >
          Total Latency (ms) = Network Delay + Processing Delay
        </div>
      </div>

      {/* 8 & 9. Obstacle Severity & Vehicle Action Decision Logic */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <span className="mono" style={{ color: 'var(--color-accent)' }}>06.</span>
            <span>Safety State Machine & Actuation Mapping</span>
          </div>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
          Obstacle distance thresholds dictate the autonomous safety classification and vehicle control actuation:
        </p>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Physical Distance Range</th>
                <th>Severity State</th>
                <th>Vehicle Control Action</th>
                <th>Dynamic Safety Requirement</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono">Distance &gt; 25 m</td>
                <td><span className="badge badge-safe">SAFE</span></td>
                <td style={{ fontWeight: 600 }}>CONTINUE</td>
                <td style={{ color: 'var(--text-muted)' }}>Nominal highway cruising; route logging and predictive path planning.</td>
              </tr>
              <tr>
                <td className="mono">10 m &lt; Distance ≤ 25 m</td>
                <td><span className="badge badge-warning">WARNING</span></td>
                <td style={{ fontWeight: 600 }}>SLOW DOWN</td>
                <td style={{ color: 'var(--text-muted)' }}>Gradual regenerative deceleration; driver alert; heightened sensor polling.</td>
              </tr>
              <tr>
                <td className="mono">Distance ≤ 10 m</td>
                <td><span className="badge badge-critical">CRITICAL</span></td>
                <td style={{ fontWeight: 600 }}>EMERGENCY BRAKE</td>
                <td style={{ color: 'var(--text-muted)' }}>Maximum hydraulic anti-lock emergency braking; sub-10ms response imperative.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
