import React, { useState } from 'react';
import { Database, FileSpreadsheet, Layers, ShieldAlert, Cpu, Wifi } from 'lucide-react';
import {
  CONGESTION_EXPERIMENT_DATA,
  PROCESSING_EXPERIMENT_DATA,
  PACKET_EXPERIMENT_DATA,
  SEVERITY_EXPERIMENT_DATA,
  EXPERIMENT_METADATA
} from '../data/experimentalData';

export const ExperimentsPage: React.FC = () => {
  const [activeExp, setActiveExp] = useState<string>('all');
  const [showTable, setShowTable] = useState<boolean>(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2.5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-neutral">Precomputed Jupyter Datasets</span>
            <span className="badge" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-accent)' }}>
              1,000 Monte Carlo Iterations
            </span>
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Simulation Experimental Results</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Empirical benchmark curves generated from the underlying Python Jupyter simulation notebook. Values are strictly preserved from research CSV files.
          </p>
        </div>

        {/* View Controls */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            onClick={() => setShowTable(!showTable)}
            className={`btn btn-sm ${showTable ? 'btn-primary' : 'btn-outline'}`}
          >
            <Database size={14} />
            <span>{showTable ? 'Hide Raw Data' : 'View Raw Data Tables'}</span>
          </button>
        </div>
      </div>

      {/* Experiment Filter Bar */}
      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '2px' }}>
        <button
          onClick={() => setActiveExp('all')}
          className={`btn btn-sm ${activeExp === 'all' ? 'btn-primary' : 'btn-outline'}`}
        >
          All 4 Experiments
        </button>
        {EXPERIMENT_METADATA.map((exp, idx) => (
          <button
            key={exp.id}
            onClick={() => setActiveExp(exp.id)}
            className={`btn btn-sm ${activeExp === exp.id ? 'btn-primary' : 'btn-outline'}`}
          >
            Exp {idx + 1}: {exp.title}
          </button>
        ))}
      </div>

      {/* EXPERIMENTS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: activeExp === 'all' ? 'repeat(auto-fit, minmax(480px, 1fr))' : '1fr', gap: '1.25rem' }}>
        {/* EXPERIMENT 1: Network Congestion vs Average Latency */}
        {(activeExp === 'all' || activeExp === 'exp1') && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div className="card-header">
              <div className="card-title">
                <Wifi size={16} style={{ color: 'var(--color-accent)' }} />
                <span>Experiment 1: Network Congestion vs Latency</span>
              </div>
              <span className="badge badge-neutral mono" style={{ fontSize: '0.68rem' }}>SIMULATION RESULT</span>
            </div>

            {/* SVG Grouped Bar Chart */}
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <svg viewBox="0 0 460 210" style={{ width: '100%', maxWidth: '500px', height: 'auto' }}>
                {/* Y-Axis Grid (0 to 50 ms) */}
                {[0, 10, 20, 30, 40, 50].map((tick) => {
                  const y = 175 - (tick / 50) * 145;
                  return (
                    <g key={tick}>
                      <line x1="45" y1={y} x2="435" y2={y} stroke="var(--border-subtle)" strokeDasharray={tick === 0 ? 'none' : '3 3'} />
                      <text x="38" y={y + 3} textAnchor="end" fontSize="9" fill="var(--text-dim)" fontFamily="var(--font-mono)">
                        {tick}
                      </text>
                    </g>
                  );
                })}

                {/* Y-axis label */}
                <text x="-105" y="14" transform="rotate(-90)" textAnchor="middle" fontSize="9" fill="var(--text-muted)">
                  Avg Latency (ms)
                </text>

                {/* X-Groups: Low, Medium, High */}
                {(['Low', 'Medium', 'High'] as const).map((group, gIdx) => {
                  const groupX = 80 + gIdx * 125;
                  const groupData = CONGESTION_EXPERIMENT_DATA.filter((d) => d.congestion === group);

                  return (
                    <g key={group}>
                      {groupData.map((d, dIdx) => {
                        const barWidth = 24;
                        const barX = groupX + dIdx * 28 - 36;
                        const barH = (d.averageLatencyMs / 50) * 145;
                        const barY = 175 - barH;
                        const color = d.architecture === 'Cloud' ? 'var(--color-cloud)' : d.architecture === 'Fog' ? 'var(--color-fog)' : 'var(--color-edge)';

                        return (
                          <g key={d.architecture}>
                            <rect x={barX} y={barY} width={barWidth} height={barH} rx="2" fill={color} opacity="0.9" />
                            <text x={barX + barWidth / 2} y={barY - 4} textAnchor="middle" fontSize="8" fontWeight="600" fill="var(--text-main)" fontFamily="var(--font-mono)">
                              {d.averageLatencyMs.toFixed(1)}
                            </text>
                          </g>
                        );
                      })}
                      {/* Group label */}
                      <text x={groupX} y="195" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--text-muted)">
                        {group}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.72rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '10px', height: '10px', backgroundColor: 'var(--color-cloud)', borderRadius: '2px' }} />
                <span>Cloud</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '10px', height: '10px', backgroundColor: 'var(--color-fog)', borderRadius: '2px' }} />
                <span>Fog</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '10px', height: '10px', backgroundColor: 'var(--color-edge)', borderRadius: '2px' }} />
                <span>Edge</span>
              </span>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.45, borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
              <strong>Observation:</strong> {EXPERIMENT_METADATA[0].insight}
            </p>
          </div>
        )}

        {/* EXPERIMENT 2: Processing Load vs Average Latency */}
        {(activeExp === 'all' || activeExp === 'exp2') && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div className="card-header">
              <div className="card-title">
                <Cpu size={16} style={{ color: 'var(--color-accent)' }} />
                <span>Experiment 2: Processing Load vs Latency</span>
              </div>
              <span className="badge badge-neutral mono" style={{ fontSize: '0.68rem' }}>SIMULATION RESULT</span>
            </div>

            {/* SVG Grouped Bar Chart */}
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <svg viewBox="0 0 460 210" style={{ width: '100%', maxWidth: '500px', height: 'auto' }}>
                {/* Y-Axis Grid (0 to 50 ms) */}
                {[0, 10, 20, 30, 40, 50].map((tick) => {
                  const y = 175 - (tick / 50) * 145;
                  return (
                    <g key={tick}>
                      <line x1="45" y1={y} x2="435" y2={y} stroke="var(--border-subtle)" strokeDasharray={tick === 0 ? 'none' : '3 3'} />
                      <text x="38" y={y + 3} textAnchor="end" fontSize="9" fill="var(--text-dim)" fontFamily="var(--font-mono)">
                        {tick}
                      </text>
                    </g>
                  );
                })}

                <text x="-105" y="14" transform="rotate(-90)" textAnchor="middle" fontSize="9" fill="var(--text-muted)">
                  Avg Latency (ms)
                </text>

                {/* X-Groups: Low, Medium, High, Very High */}
                {(['Low', 'Medium', 'High', 'Very High'] as const).map((group, gIdx) => {
                  const groupX = 75 + gIdx * 98;
                  const groupData = PROCESSING_EXPERIMENT_DATA.filter((d) => d.processingLoad === group);

                  return (
                    <g key={group}>
                      {groupData.map((d, dIdx) => {
                        const barWidth = 19;
                        const barX = groupX + dIdx * 22 - 30;
                        const barH = (d.averageLatencyMs / 50) * 145;
                        const barY = 175 - barH;
                        const color = d.architecture === 'Cloud' ? 'var(--color-cloud)' : d.architecture === 'Fog' ? 'var(--color-fog)' : 'var(--color-edge)';

                        return (
                          <g key={d.architecture}>
                            <rect x={barX} y={barY} width={barWidth} height={barH} rx="2" fill={color} opacity="0.9" />
                            <text x={barX + barWidth / 2} y={barY - 4} textAnchor="middle" fontSize="7.5" fontWeight="600" fill="var(--text-main)" fontFamily="var(--font-mono)">
                              {d.averageLatencyMs.toFixed(1)}
                            </text>
                          </g>
                        );
                      })}
                      <text x={groupX - 8} y="195" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text-muted)">
                        {group}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.72rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '10px', height: '10px', backgroundColor: 'var(--color-cloud)', borderRadius: '2px' }} />
                <span>Cloud</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '10px', height: '10px', backgroundColor: 'var(--color-fog)', borderRadius: '2px' }} />
                <span>Fog</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '10px', height: '10px', backgroundColor: 'var(--color-edge)', borderRadius: '2px' }} />
                <span>Edge</span>
              </span>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.45, borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
              <strong>Observation:</strong> {EXPERIMENT_METADATA[1].insight}
            </p>
          </div>
        )}

        {/* EXPERIMENT 3: Packet Size vs Transmission Delay */}
        {(activeExp === 'all' || activeExp === 'exp3') && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div className="card-header">
              <div className="card-title">
                <Layers size={16} style={{ color: 'var(--color-accent)' }} />
                <span>Experiment 3: Packet Size vs Transmission Delay</span>
              </div>
              <span className="badge badge-neutral mono" style={{ fontSize: '0.68rem' }}>SIMULATION RESULT</span>
            </div>

            {/* SVG Line / Dot Chart */}
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <svg viewBox="0 0 460 210" style={{ width: '100%', maxWidth: '500px', height: 'auto' }}>
                {/* Y-Axis Grid (0 to 0.45 ms) */}
                {[0, 0.1, 0.2, 0.3, 0.4].map((tick) => {
                  const y = 175 - (tick / 0.45) * 145;
                  return (
                    <g key={tick}>
                      <line x1="45" y1={y} x2="435" y2={y} stroke="var(--border-subtle)" strokeDasharray={tick === 0 ? 'none' : '3 3'} />
                      <text x="38" y={y + 3} textAnchor="end" fontSize="9" fill="var(--text-dim)" fontFamily="var(--font-mono)">
                        {tick.toFixed(2)}
                      </text>
                    </g>
                  );
                })}

                <text x="-105" y="14" transform="rotate(-90)" textAnchor="middle" fontSize="9" fill="var(--text-muted)">
                  Transmission Delay (ms)
                </text>

                {/* X-Points: 1, 2, 3, 4, 5 KB */}
                {[1, 2, 3, 4, 5].map((pkt, pIdx) => {
                  const x = 70 + pIdx * 80;
                  return (
                    <text key={pkt} x={x} y="195" textAnchor="middle" fontSize="10" fill="var(--text-muted)">
                      {pkt} KB
                    </text>
                  );
                })}

                {/* Draw Curves for Cloud, Fog, Edge */}
                {(['Cloud', 'Fog', 'Edge'] as const).map((arch) => {
                  const points = PACKET_EXPERIMENT_DATA.filter((d) => d.architecture === arch);
                  const color = arch === 'Cloud' ? 'var(--color-cloud)' : arch === 'Fog' ? 'var(--color-fog)' : 'var(--color-edge)';
                  const polyPoints = points
                    .map((pt, idx) => {
                      const x = 70 + idx * 80;
                      const y = 175 - (pt.transmissionDelayMs / 0.45) * 145;
                      return `${x},${y}`;
                    })
                    .join(' ');

                  return (
                    <g key={arch}>
                      <polyline fill="none" stroke={color} strokeWidth="2.5" points={polyPoints} />
                      {points.map((pt, idx) => {
                        const x = 70 + idx * 80;
                        const y = 175 - (pt.transmissionDelayMs / 0.45) * 145;
                        return (
                          <g key={idx}>
                            <circle cx={x} cy={y} r="3.5" fill={color} stroke="#ffffff" strokeWidth="1" />
                            <text x={x} y={y - 6} textAnchor="middle" fontSize="7.5" fill="var(--text-main)" fontFamily="var(--font-mono)">
                              {pt.transmissionDelayMs.toFixed(3)}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  );
                })}
              </svg>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.72rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '10px', height: '10px', backgroundColor: 'var(--color-cloud)', borderRadius: '2px' }} />
                <span>Cloud (100 Mbps)</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '10px', height: '10px', backgroundColor: 'var(--color-fog)', borderRadius: '2px' }} />
                <span>Fog (200 Mbps)</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '10px', height: '10px', backgroundColor: 'var(--color-edge)', borderRadius: '2px' }} />
                <span>Edge (500 Mbps)</span>
              </span>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.45, borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
              <strong>Observation:</strong> {EXPERIMENT_METADATA[2].insight}
            </p>
          </div>
        )}

        {/* EXPERIMENT 4: Obstacle Severity Distribution */}
        {(activeExp === 'all' || activeExp === 'exp4') && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div className="card-header">
              <div className="card-title">
                <ShieldAlert size={16} style={{ color: 'var(--color-accent)' }} />
                <span>Experiment 4: Obstacle Severity Distribution</span>
              </div>
              <span className="badge badge-neutral mono" style={{ fontSize: '0.68rem' }}>SIMULATION RESULT</span>
            </div>

            {/* Severity Distribution Visual Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0.5rem' }}>
              {SEVERITY_EXPERIMENT_DATA.map((row) => {
                const color = row.severity === 'SAFE' ? 'var(--color-safe)' : row.severity === 'WARNING' ? 'var(--color-warning)' : 'var(--color-critical)';
                return (
                  <div key={row.severity} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                      <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color }} />
                        {row.severity} ({row.severity === 'SAFE' ? '> 25m' : row.severity === 'WARNING' ? '10–25m' : '≤ 10m'})
                      </span>
                      <span className="mono" style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                        {row.percentage.toFixed(1)}% ({row.scenarioCount} / 1000)
                      </span>
                    </div>

                    <div style={{ height: '14px', borderRadius: '4px', backgroundColor: 'var(--bg-primary)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                      <div
                        style={{
                          width: `${row.percentage}%`,
                          height: '100%',
                          backgroundColor: color,
                          opacity: 0.85
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.45, borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
              <strong>Observation:</strong> {EXPERIMENT_METADATA[3].insight}
            </p>
          </div>
        )}
      </div>

      {/* RAW CSV DATA TABLES (TOGGLED) */}
      {showTable && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card-header">
            <div className="card-title">
              <FileSpreadsheet size={16} />
              <span>Underlying CSV Experimental Data Points</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Exact Jupyter Outputs</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {/* Table 1 */}
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
                AutoEdgeSim_Congestion_Results.csv
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Congestion</th>
                      <th>Architecture</th>
                      <th>Avg Latency (ms)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CONGESTION_EXPERIMENT_DATA.map((r, i) => (
                      <tr key={i}>
                        <td>{r.congestion}</td>
                        <td>{r.architecture}</td>
                        <td className="mono">{r.averageLatencyMs.toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2 */}
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
                AutoEdgeSim_Processing_Results.csv
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Load</th>
                      <th>Architecture</th>
                      <th>Avg Latency (ms)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PROCESSING_EXPERIMENT_DATA.map((r, i) => (
                      <tr key={i}>
                        <td>{r.processingLoad}</td>
                        <td>{r.architecture}</td>
                        <td className="mono">{r.averageLatencyMs.toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
