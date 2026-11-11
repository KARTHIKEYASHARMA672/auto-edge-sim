import React from 'react';
import { BarChart3 } from 'lucide-react';
import { SimulationResult } from '../../types/simulation';

interface LatencyBarChartProps {
  simulationResult: SimulationResult | null;
}

export const LatencyBarChart: React.FC<LatencyBarChartProps> = ({ simulationResult }) => {
  if (!simulationResult) return null;

  const data = [
    { name: 'Cloud', latency: simulationResult.cloud.totalLatencyMs, color: 'var(--color-cloud)' },
    { name: 'Fog', latency: simulationResult.fog.totalLatencyMs, color: 'var(--color-fog)' },
    { name: 'Edge', latency: simulationResult.edge.totalLatencyMs, color: 'var(--color-edge)' }
  ];

  const maxLatency = Math.max(...data.map((d) => d.latency), 10);
  const chartHeight = 180;
  const chartWidth = 380;
  const padding = { top: 25, right: 30, bottom: 35, left: 50 };

  const innerHeight = chartHeight - padding.top - padding.bottom;
  const innerWidth = chartWidth - padding.left - padding.right;

  // Compute y-axis scale ticks (0 to max ceiling rounded up to 10)
  const yCeil = Math.ceil(maxLatency / 10) * 10;
  const yTicks = [0, yCeil * 0.25, yCeil * 0.5, yCeil * 0.75, yCeil];

  const barWidth = 44;
  const step = innerWidth / data.length;

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header" style={{ marginBottom: '0.75rem' }}>
        <div className="card-title">
          <BarChart3 size={16} style={{ color: 'var(--color-accent)' }} />
          <span>Total Response Latency Comparison</span>
        </div>
        <span className="badge badge-neutral mono" style={{ fontSize: '0.68rem' }}>
          Real-time ms
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', maxWidth: '420px', height: 'auto' }}>
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
            Response Latency (ms)
          </text>

          {/* Bars */}
          {data.map((item, index) => {
            const barHeight = (item.latency / yCeil) * innerHeight;
            const x = padding.left + index * step + (step - barWidth) / 2;
            const y = padding.top + innerHeight - barHeight;

            return (
              <g key={item.name}>
                {/* Bar rectangle */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="3"
                  fill={item.color}
                  opacity="0.9"
                />
                {/* Value on top of bar */}
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="var(--text-main)"
                  fontFamily="var(--font-mono)"
                >
                  {item.latency.toFixed(2)}
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
                  {item.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
        Cloud ({simulationResult.cloud.totalLatencyMs.toFixed(1)} ms) vs Fog ({simulationResult.fog.totalLatencyMs.toFixed(1)} ms) vs Edge ({simulationResult.edge.totalLatencyMs.toFixed(1)} ms)
      </div>
    </div>
  );
};
