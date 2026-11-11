import React from 'react';
import { Layers } from 'lucide-react';
import { SimulationResult } from '../../types/simulation';

interface DelayBreakdownChartProps {
  simulationResult: SimulationResult | null;
}

export const DelayBreakdownChart: React.FC<DelayBreakdownChartProps> = ({ simulationResult }) => {
  if (!simulationResult) return null;

  const architectures = [
    { name: 'Cloud', data: simulationResult.cloud },
    { name: 'Fog', data: simulationResult.fog },
    { name: 'Edge', data: simulationResult.edge }
  ];

  const components = [
    { key: 'transmissionDelayMs' as const, label: 'Transmission', color: '#06b6d4' }, // Cyan
    { key: 'propagationDelayMs' as const, label: 'Propagation', color: '#6366f1' },  // Indigo
    { key: 'queueDelayMs' as const, label: 'Queue', color: '#f59e0b' },              // Amber
    { key: 'processingDelayMs' as const, label: 'Processing', color: '#10b981' }      // Emerald
  ];

  const maxTotal = Math.max(...architectures.map((a) => a.data.totalLatencyMs), 10);
  const chartHeight = 180;
  const chartWidth = 420;
  const padding = { top: 25, right: 30, bottom: 35, left: 50 };

  const innerHeight = chartHeight - padding.top - padding.bottom;
  const innerWidth = chartWidth - padding.left - padding.right;

  const yCeil = Math.ceil(maxTotal / 10) * 10;
  const yTicks = [0, yCeil * 0.25, yCeil * 0.5, yCeil * 0.75, yCeil];

  const barWidth = 40;
  const step = innerWidth / architectures.length;

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header" style={{ marginBottom: '0.75rem' }}>
        <div className="card-title">
          <Layers size={16} style={{ color: 'var(--color-accent)' }} />
          <span>Latency Component Breakdown</span>
        </div>
        {/* Component Legend */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.7rem' }}>
          {components.map((comp) => (
            <span key={comp.key} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: comp.color }} />
              <span style={{ color: 'var(--text-muted)' }}>{comp.label}</span>
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', maxWidth: '440px', height: 'auto' }}>
          {/* Grid lines and Y-axis labels */}
          {yTicks.map((tick, i) => {
            const yPos = padding.top + innerHeight - (tick / yCeil) * innerHeight;
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={yPos}
                  x2={chartWidth - padding.right}
                  y2={yPos}
                  stroke="var(--border-subtle)"
                  strokeDasharray={tick === 0 ? 'none' : '3 3'}
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 8}
                  y={yPos + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="var(--text-dim)"
                  fontFamily="var(--font-mono)"
                >
                  {tick.toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* Y-Axis Label */}
          <text
            x={-chartHeight / 2}
            y="14"
            transform="rotate(-90)"
            textAnchor="middle"
            fontSize="9"
            fill="var(--text-muted)"
          >
            Stacked Delay (ms)
          </text>

          {/* Stacked Bars */}
          {architectures.map((arch, archIndex) => {
            const x = padding.left + archIndex * step + (step - barWidth) / 2;
            let currentY = padding.top + innerHeight;

            // Segments bottom-to-top: Transmission -> Propagation -> Queue -> Processing
            return (
              <g key={arch.name}>
                {components.map((comp) => {
                  const val = arch.data[comp.key];
                  const segHeight = (val / yCeil) * innerHeight;
                  currentY -= segHeight;

                  return (
                    <rect
                      key={comp.key}
                      x={x}
                      y={currentY}
                      width={barWidth}
                      height={Math.max(0.5, segHeight)}
                      fill={comp.color}
                      opacity="0.9"
                    />
                  );
                })}

                {/* Total Latency text on top */}
                <text
                  x={x + barWidth / 2}
                  y={padding.top + innerHeight - (arch.data.totalLatencyMs / yCeil) * innerHeight - 6}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="var(--text-main)"
                  fontFamily="var(--font-mono)"
                >
                  {arch.data.totalLatencyMs.toFixed(1)}
                </text>

                {/* Architecture label under bar */}
                <text
                  x={x + barWidth / 2}
                  y={padding.top + innerHeight + 16}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill="var(--text-muted)"
                >
                  {arch.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Numerical Data Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.68rem', textAlign: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem' }}>
        {architectures.map((arch) => (
          <div key={arch.name}>
            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{arch.name}</div>
            <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Net: {arch.data.networkDelayMs.toFixed(2)} | Proc: {arch.data.processingDelayMs.toFixed(2)} ms
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
