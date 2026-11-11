import React from 'react';
import {
  Play,
  RotateCcw,
  Sliders,
  Gauge,
  MapPin,
  Box,
  Wifi,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  NetworkCongestion,
  ObstacleSize,
  ProcessingLoad,
  SimulationParameters
} from '../types/simulation';
import { PARAMETER_BOUNDS } from '../simulation/networkParameters';

interface SimulationControlsProps {
  parameters: SimulationParameters;
  onChange: (params: SimulationParameters) => void;
  onRunSimulation: () => void;
  onReset: () => void;
  isRunning: boolean;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  parameters,
  onChange,
  onRunSimulation,
  onReset,
  isRunning
}) => {
  const updateParam = <K extends keyof SimulationParameters>(
    key: K,
    value: SimulationParameters[K]
  ) => {
    onChange({
      ...parameters,
      [key]: value
    });
  };

  // Quick Viva Demo Presets
  const applyPreset = (preset: 'critical' | 'warning' | 'safe') => {
    if (preset === 'critical') {
      onChange({
        vehicleSpeedKmh: 85,
        obstacleDistanceM: 8,
        obstacleSize: 'Large',
        packetSizeKb: 3.5,
        networkCongestion: 'High',
        processingLoad: 'High',
        randomVariation: true
      });
    } else if (preset === 'warning') {
      onChange({
        vehicleSpeedKmh: 70,
        obstacleDistanceM: 18,
        obstacleSize: 'Medium',
        packetSizeKb: 2,
        networkCongestion: 'Medium',
        processingLoad: 'Medium',
        randomVariation: true
      });
    } else {
      onChange({
        vehicleSpeedKmh: 95,
        obstacleDistanceM: 42,
        obstacleSize: 'Small',
        packetSizeKb: 1.5,
        networkCongestion: 'Low',
        processingLoad: 'Low',
        randomVariation: true
      });
    }
  };

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">
        <div className="card-title">
          <Sliders size={18} style={{ color: 'var(--color-accent)' }} />
          <span>Simulation Controls</span>
        </div>
        <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
          Config
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.25rem' }}>
        {/* Scenario Presets for Fast Viva Testing */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
            <Sparkles size={11} style={{ display: 'inline', marginRight: '4px' }} />
            Quick Scenario Presets
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.35rem' }}>
            <button
              onClick={() => applyPreset('critical')}
              className="btn btn-outline btn-sm"
              style={{ padding: '0.3rem', fontSize: '0.72rem', borderColor: 'rgba(239, 68, 68, 0.4)' }}
            >
              Critical (8m)
            </button>
            <button
              onClick={() => applyPreset('warning')}
              className="btn btn-outline btn-sm"
              style={{ padding: '0.3rem', fontSize: '0.72rem', borderColor: 'rgba(245, 158, 11, 0.4)' }}
            >
              Warning (18m)
            </button>
            <button
              onClick={() => applyPreset('safe')}
              className="btn btn-outline btn-sm"
              style={{ padding: '0.3rem', fontSize: '0.72rem', borderColor: 'rgba(16, 185, 129, 0.4)' }}
            >
              Safe (42m)
            </button>
          </div>
        </div>

        {/* 1. Vehicle Speed */}
        <div className="control-group">
          <div className="control-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Gauge size={14} />
              Vehicle Speed
            </span>
            <span className="control-value">
              {parameters.vehicleSpeedKmh} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>km/h</span>
            </span>
          </div>
          <input
            type="range"
            min={PARAMETER_BOUNDS.speed.min}
            max={PARAMETER_BOUNDS.speed.max}
            step={PARAMETER_BOUNDS.speed.step}
            value={parameters.vehicleSpeedKmh}
            onChange={(e) => updateParam('vehicleSpeedKmh', Number(e.target.value))}
            className="slider-range"
            aria-label="Vehicle Speed"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '2px' }}>
            <span>30 km/h</span>
            <span>65 km/h</span>
            <span>100 km/h</span>
          </div>
        </div>

        {/* 2. Obstacle Distance */}
        <div className="control-group">
          <div className="control-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <MapPin size={14} />
              Obstacle Distance
            </span>
            <span className="control-value">
              {parameters.obstacleDistanceM} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>m</span>
            </span>
          </div>
          <input
            type="range"
            min={PARAMETER_BOUNDS.distance.min}
            max={PARAMETER_BOUNDS.distance.max}
            step={PARAMETER_BOUNDS.distance.step}
            value={parameters.obstacleDistanceM}
            onChange={(e) => updateParam('obstacleDistanceM', Number(e.target.value))}
            className="slider-range"
            aria-label="Obstacle Distance"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '2px' }}>
            <span style={{ color: 'var(--color-critical)' }}>5m (Critical)</span>
            <span style={{ color: 'var(--color-warning)' }}>25m (Warning)</span>
            <span style={{ color: 'var(--color-safe)' }}>50m (Safe)</span>
          </div>
        </div>

        {/* 3. Obstacle Size */}
        <div className="control-group">
          <div className="control-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Box size={14} />
              Obstacle Size
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              {parameters.obstacleSize === 'Small' ? '1.0x workload' : parameters.obstacleSize === 'Medium' ? '1.2x workload' : '1.5x workload'}
            </span>
          </div>
          <div className="segmented-control">
            {(['Small', 'Medium', 'Large'] as ObstacleSize[]).map((size) => (
              <button
                key={size}
                type="button"
                className={`segmented-btn ${parameters.obstacleSize === size ? 'active' : ''}`}
                onClick={() => updateParam('obstacleSize', size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Packet Size */}
        <div className="control-group">
          <div className="control-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Layers size={14} />
              Packet Size
            </span>
            <span className="control-value">
              {parameters.packetSizeKb} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>KB</span>
            </span>
          </div>
          <input
            type="range"
            min={PARAMETER_BOUNDS.packetSize.min}
            max={PARAMETER_BOUNDS.packetSize.max}
            step={PARAMETER_BOUNDS.packetSize.step}
            value={parameters.packetSizeKb}
            onChange={(e) => updateParam('packetSizeKb', Number(e.target.value))}
            className="slider-range"
            aria-label="Packet Size"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '2px' }}>
            <span>1 KB</span>
            <span>3 KB</span>
            <span>5 KB</span>
          </div>
        </div>

        {/* 5. Network Congestion */}
        <div className="control-group">
          <div className="control-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Wifi size={14} />
              Network Congestion
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              {parameters.networkCongestion === 'Low' ? '0.5x queue' : parameters.networkCongestion === 'Medium' ? '1.0x queue' : '2.0x queue'}
            </span>
          </div>
          <div className="segmented-control">
            {(['Low', 'Medium', 'High'] as NetworkCongestion[]).map((cong) => (
              <button
                key={cong}
                type="button"
                className={`segmented-btn ${parameters.networkCongestion === cong ? 'active' : ''}`}
                onClick={() => updateParam('networkCongestion', cong)}
              >
                {cong}
              </button>
            ))}
          </div>
        </div>

        {/* 6. Processing Load */}
        <div className="control-group">
          <div className="control-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Cpu size={14} />
              Processing Load
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              {parameters.processingLoad === 'Low' ? '0.5x factor' : parameters.processingLoad === 'Medium' ? '1.0x factor' : parameters.processingLoad === 'High' ? '2.0x factor' : '3.0x factor'}
            </span>
          </div>
          <div className="segmented-control">
            {(['Low', 'Medium', 'High', 'Very High'] as ProcessingLoad[]).map((load) => (
              <button
                key={load}
                type="button"
                className={`segmented-btn ${parameters.processingLoad === load ? 'active' : ''}`}
                onClick={() => updateParam('processingLoad', load)}
                style={{ padding: '0.35rem 0.2rem', fontSize: '0.72rem' }}
              >
                {load}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
        <button
          onClick={onRunSimulation}
          className="btn btn-primary"
          style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem' }}
          disabled={isRunning}
        >
          <Play size={18} fill="currentColor" />
          <span>{isRunning ? 'SIMULATING...' : 'RUN SIMULATION'}</span>
        </button>

        <button
          onClick={onReset}
          className="btn btn-outline"
          style={{ width: '100%', padding: '0.5rem' }}
          disabled={isRunning}
        >
          <RotateCcw size={15} />
          <span>RESET PARAMETERS</span>
        </button>
      </div>
    </div>
  );
};
