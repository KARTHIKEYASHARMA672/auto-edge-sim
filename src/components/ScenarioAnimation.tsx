import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Server,
  Radio,
  HardDrive,
  Eye,
  EyeOff
} from 'lucide-react';
import {
  ObstacleSeverity,
  SimulationParameters,
  SimulationResult,
  VehicleAction
} from '../types/simulation';

interface ScenarioAnimationProps {
  simulationResult: SimulationResult | null;
  parameters: SimulationParameters;
  onRunSimulation: () => void;
  onReset: () => void;
}

type AnimationPhase = 'idle' | 'approaching' | 'detecting' | 'processing' | 'response' | 'action_applied';

export const ScenarioAnimation: React.FC<ScenarioAnimationProps> = ({
  simulationResult,
  parameters,
  onRunSimulation,
  onReset
}) => {
  const [phase, setPhase] = useState<AnimationPhase>('idle');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0); // 0 to 100
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Derive active values (from simulation result if available, otherwise current parameters)
  const speed = simulationResult?.parameters.vehicleSpeedKmh ?? parameters.vehicleSpeedKmh;
  const distance = simulationResult?.parameters.obstacleDistanceM ?? parameters.obstacleDistanceM;
  const size = simulationResult?.parameters.obstacleSize ?? parameters.obstacleSize;
  const severity: ObstacleSeverity = simulationResult?.severity ?? (distance > 25 ? 'SAFE' : distance > 10 ? 'WARNING' : 'CRITICAL');
  const action: VehicleAction = simulationResult?.action ?? (severity === 'SAFE' ? 'CONTINUE' : severity === 'WARNING' ? 'SLOW DOWN' : 'EMERGENCY BRAKE');

  // Architecture response latencies for visual packets
  const edgeLatency = simulationResult?.edge.totalLatencyMs ?? 4.7;
  const fogLatency = simulationResult?.fog.totalLatencyMs ?? 15.3;
  const cloudLatency = simulationResult?.cloud.totalLatencyMs ?? 36.9;

  // Start animation when a simulation result is provided
  useEffect(() => {
    if (simulationResult) {
      setProgress(0);
      setPhase('approaching');
      setIsPaused(false);
      lastTimeRef.current = null;
    }
  }, [simulationResult]);

  // Main Animation Tick
  useEffect(() => {
    if (isPaused || phase === 'idle' || phase === 'action_applied') return;

    const animate = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }
      const delta = (time - lastTimeRef.current) * playbackSpeed;
      lastTimeRef.current = time;

      setProgress((prev) => {
        const next = prev + (delta / 45); // ~4.5 seconds for complete sequence at 1x
        if (next >= 100) {
          setPhase('action_applied');
          return 100;
        }

        if (next > 75) {
          setPhase('response');
        } else if (next > 40) {
          setPhase('processing');
        } else if (next > 20) {
          setPhase('detecting');
        } else {
          setPhase('approaching');
        }

        return next;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPaused, phase, playbackSpeed]);

  const handlePlayPause = () => {
    if (phase === 'action_applied') {
      // Replay
      setProgress(0);
      setPhase('approaching');
      setIsPaused(false);
      lastTimeRef.current = null;
    } else if (phase === 'idle') {
      onRunSimulation();
    } else {
      setIsPaused(!isPaused);
      lastTimeRef.current = null;
    }
  };

  const handleReplay = () => {
    setProgress(0);
    setPhase('approaching');
    setIsPaused(false);
    lastTimeRef.current = null;
  };

  const handleFullReset = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setProgress(0);
    setPhase('idle');
    setIsPaused(false);
    onReset();
  };

  // Road position calculations:
  // Scale: 0m (far right) to 50m (far left)
  // Obstacle distance determines obstacle position from vehicle stop point
  // 5m = close to vehicle, 50m = far right
  const obstaclePercent = Math.min(88, Math.max(30, 20 + (distance / 50) * 65));

  // Vehicle advancement:
  // Phase 'approaching' moves from 10% towards obstacle
  // If CRITICAL: stops at obstaclePercent - 15% with brake effect
  // If WARNING: slows down and approaches smoothly
  // If SAFE: passes smoothly forward
  let vehiclePosition = 12;
  if (phase !== 'idle') {
    if (severity === 'CRITICAL') {
      const targetStop = Math.max(15, obstaclePercent - 16);
      vehiclePosition = 12 + (progress / 100) * (targetStop - 12);
    } else if (severity === 'WARNING') {
      const targetStop = Math.max(18, obstaclePercent - 22);
      vehiclePosition = 12 + (progress / 100) * (targetStop - 12);
    } else {
      vehiclePosition = 12 + (progress / 100) * 35;
    }
  }

  // Network packet progress (travel from vehicle -> node -> vehicle)
  const packetCycle = Math.min(1, Math.max(0, (progress - 35) / 45));
  // Relative speeds based on simulated total latency:
  // Edge completes its roundtrip quickly, Fog midway, Cloud last
  const edgeProgress = Math.min(1, packetCycle * 2.2);
  const fogProgress = Math.min(1, packetCycle * 1.4);
  const cloudProgress = Math.min(1, packetCycle * 0.9);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {/* Simulation Header & Status Indicators */}
      <div className="card-header" style={{ marginBottom: 0, paddingBottom: '0.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>Vehicle Scenario Simulation</span>
          <span className="badge badge-neutral mono" style={{ fontSize: '0.72rem' }}>
            {phase.toUpperCase().replace('_', ' ')}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Speed: <strong style={{ color: 'var(--text-main)' }}>{speed} km/h</strong> | Dist:{' '}
            <strong style={{ color: 'var(--text-main)' }}>{distance} m</strong>
          </span>
        </div>

        {/* Severity & Action Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            className={`badge ${
              severity === 'SAFE'
                ? 'badge-safe'
                : severity === 'WARNING'
                ? 'badge-warning'
                : 'badge-critical'
            }`}
          >
            {severity === 'SAFE' ? (
              <ShieldCheck size={13} />
            ) : severity === 'WARNING' ? (
              <AlertTriangle size={13} />
            ) : (
              <AlertOctagon size={13} />
            )}
            {severity}
          </span>

          <span
            className="badge"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-strong)'
            }}
          >
            ACTION: {action}
          </span>
        </div>
      </div>

      {/* 1. VISUAL ROADWAY CANVAS / SCENE */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '190px',
          backgroundColor: '#172033',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        {/* Road Surface */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '32px',
            bottom: '32px',
            backgroundColor: '#1e293b',
            borderTop: '2px solid #475569',
            borderBottom: '2px solid #475569'
          }}
        >
          {/* Dashed Center Road Stripe */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '2px',
              borderTop: '2px dashed #64748b',
              transform: 'translateY(-50%)'
            }}
          />

          {/* Distance Scale Marks along Road (0m to 50m) */}
          <div
            style={{
              position: 'absolute',
              bottom: '4px',
              left: '10%',
              right: '10%',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.62rem',
              color: '#64748b',
              fontFamily: 'var(--font-mono)'
            }}
          >
            <span>0m (Vehicle Base)</span>
            <span>10m [CRITICAL]</span>
            <span>25m [WARNING]</span>
            <span>50m [SAFE]</span>
          </div>

          {/* Critical Threshold Line (10m) */}
          <div
            style={{
              position: 'absolute',
              left: '32%',
              top: 0,
              bottom: 0,
              width: '1px',
              borderLeft: '1px dotted rgba(239, 68, 68, 0.4)'
            }}
            title="Critical Zone Boundary (10m)"
          />

          {/* Warning Threshold Line (25m) */}
          <div
            style={{
              position: 'absolute',
              left: '55%',
              top: 0,
              bottom: 0,
              width: '1px',
              borderLeft: '1px dotted rgba(245, 158, 11, 0.4)'
            }}
            title="Warning Zone Boundary (25m)"
          />
        </div>

        {/* Autonomous Vehicle */}
        <div
          style={{
            position: 'absolute',
            left: `${reducedMotion ? 18 : vehiclePosition}%`,
            top: '46px',
            transition: reducedMotion ? 'none' : 'left 0.1s linear',
            zIndex: 10
          }}
        >
          {/* Forward Sensor Radar Cone */}
          <div
            style={{
              position: 'absolute',
              left: '52px',
              top: '-18px',
              width: `${Math.max(60, (obstaclePercent - vehiclePosition) * 7.5)}px`,
              height: '76px',
              background:
                severity === 'CRITICAL'
                  ? 'linear-gradient(90deg, rgba(239, 68, 68, 0.25) 0%, rgba(239, 68, 68, 0.02) 100%)'
                  : severity === 'WARNING'
                  ? 'linear-gradient(90deg, rgba(245, 158, 11, 0.22) 0%, rgba(245, 158, 11, 0.02) 100%)'
                  : 'linear-gradient(90deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.02) 100%)',
              clipPath: 'polygon(0% 40%, 100% 0%, 100% 100%, 0% 60%)',
              pointerEvents: 'none',
              opacity: phase !== 'idle' ? 1 : 0.4
            }}
          />

          {/* Vehicle Body SVG (Clean Technical Styling) */}
          <svg width="60" height="40" viewBox="0 0 60 40">
            {/* Chassis Shadow */}
            <rect x="2" y="4" width="56" height="32" rx="6" fill="#0b1120" opacity="0.6" />
            {/* Main Body */}
            <rect x="4" y="6" width="52" height="28" rx="6" fill="#1e40af" stroke="#60a5fa" strokeWidth="1.5" />
            {/* Roof / Cabin */}
            <rect x="14" y="10" width="28" height="20" rx="3" fill="#0f172a" stroke="#93c5fd" strokeWidth="1" />
            {/* LiDAR Dome Sensor on top */}
            <circle cx="28" cy="20" r="3.5" fill="#38bdf8" />
            {/* Front Headlights */}
            <rect x="54" y="8" width="2" height="6" rx="1" fill="#fef08a" />
            <rect x="54" y="26" width="2" height="6" rx="1" fill="#fef08a" />
            {/* Rear Brake Lights (Glow on SLOW DOWN / EMERGENCY BRAKE) */}
            <rect
              x="4"
              y="8"
              width="2"
              height="6"
              rx="1"
              fill={action !== 'CONTINUE' && phase !== 'idle' ? '#ef4444' : '#7f1d1d'}
            />
            <rect
              x="4"
              y="26"
              width="2"
              height="6"
              rx="1"
              fill={action !== 'CONTINUE' && phase !== 'idle' ? '#ef4444' : '#7f1d1d'}
            />
          </svg>

          {/* Vehicle Status Tag */}
          <div
            style={{
              position: 'absolute',
              top: '-18px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '0.62rem',
              fontWeight: 600,
              color: '#ffffff',
              backgroundColor: '#0f172a',
              padding: '1px 4px',
              borderRadius: '2px',
              whiteSpace: 'nowrap',
              border: '1px solid var(--border-subtle)'
            }}
          >
            AV-01
          </div>
        </div>

        {/* Obstacle Target */}
        <div
          style={{
            position: 'absolute',
            left: `${obstaclePercent}%`,
            top: '46px',
            transform: 'translateX(-50%)',
            zIndex: 10
          }}
        >
          {/* Obstacle Representation */}
          <svg
            width={size === 'Small' ? '30' : size === 'Medium' ? '38' : '48'}
            height={size === 'Small' ? '30' : size === 'Medium' ? '38' : '48'}
            viewBox="0 0 40 40"
          >
            {/* Concrete Hazard Barrier / Cube */}
            <rect
              x="4"
              y="4"
              width="32"
              height="32"
              rx="4"
              fill="#b91c1c"
              stroke="#fca5a5"
              strokeWidth="2"
            />
            {/* Hazard Diagonal Warning Stripes */}
            <line x1="8" y1="32" x2="32" y2="8" stroke="#ffffff" strokeWidth="3" />
            <line x1="8" y1="20" x2="20" y2="8" stroke="#ffffff" strokeWidth="3" />
            <line x1="20" y1="32" x2="32" y2="20" stroke="#ffffff" strokeWidth="3" />
          </svg>

          {/* Obstacle Label */}
          <div
            style={{
              position: 'absolute',
              bottom: '-16px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '0.62rem',
              color: '#cbd5e1',
              backgroundColor: '#0f172a',
              padding: '1px 4px',
              borderRadius: '2px',
              whiteSpace: 'nowrap',
              border: '1px solid var(--border-subtle)'
            }}
          >
            {size} ({distance}m)
          </div>
        </div>

        {/* Visual Distance Metric Line between Vehicle & Obstacle */}
        <div
          style={{
            position: 'absolute',
            left: `${vehiclePosition + 7}%`,
            width: `${Math.max(0, obstaclePercent - (vehiclePosition + 7))}%`,
            top: '20px',
            height: '1px',
            borderTop: '1px solid var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <span
            style={{
              fontSize: '0.65rem',
              backgroundColor: 'var(--bg-secondary)',
              padding: '0 4px',
              borderRadius: '2px',
              color: 'var(--text-main)',
              fontFamily: 'var(--font-mono)'
            }}
          >
            Δd = {distance}m
          </span>
        </div>
      </div>

      {/* 2. MULTI-TIER ARCHITECTURE PROCESSING ANIMATION */}
      <div
        style={{
          backgroundColor: 'var(--bg-tertiary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.65rem',
            fontSize: '0.76rem',
            color: 'var(--text-muted)'
          }}
        >
          <span style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Radio size={14} style={{ color: 'var(--color-accent)' }} />
            Multi-Tier Processing Telemetry (Round-Trip Latency Verification)
          </span>
          <span style={{ fontSize: '0.72rem' }}>
            Vehicle ➔ Wireless Uplink ➔ Processing Node ➔ Vehicle Decision
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {/* TIER 1: EDGE COMPUTING CHANNEL */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '100px 1fr 110px',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.45rem 0.65rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HardDrive size={15} style={{ color: 'var(--color-edge)' }} />
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-edge)' }}>Edge Node</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>500 Mbps | 4.0 Cap</div>
              </div>
            </div>

            {/* Travel Track with Moving Data Pulse */}
            <div style={{ position: 'relative', height: '14px', backgroundColor: 'var(--bg-primary)', borderRadius: '7px', overflow: 'hidden' }}>
              {/* Progress Bar filling based on Edge round-trip */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${reducedMotion ? 100 : edgeProgress * 100}%`,
                  backgroundColor: 'rgba(13, 148, 136, 0.25)',
                  borderRight: '2px solid var(--color-edge)',
                  transition: reducedMotion ? 'none' : 'width 0.1s linear'
                }}
              />
              {/* Data packet dot */}
              <div
                style={{
                  position: 'absolute',
                  left: `calc(${reducedMotion ? 100 : edgeProgress * 100}% - 6px)`,
                  top: '2px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-edge)',
                  boxShadow: '0 0 4px rgba(13, 148, 136, 0.6)',
                  display: packetCycle > 0 ? 'block' : 'none'
                }}
              />
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="mono" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-edge)' }}>
                {edgeLatency.toFixed(2)} ms
              </span>
              <span style={{ display: 'block', fontSize: '0.62rem', color: 'var(--text-dim)' }}>
                {edgeProgress >= 1 ? 'DECISION RETURNED' : 'PROCESSING...'}
              </span>
            </div>
          </div>

          {/* TIER 2: FOG COMPUTING CHANNEL */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '100px 1fr 110px',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.45rem 0.65rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Radio size={15} style={{ color: 'var(--color-fog)' }} />
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-fog)' }}>Fog Node</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>200 Mbps | 2.0 Cap</div>
              </div>
            </div>

            {/* Travel Track with Moving Data Pulse */}
            <div style={{ position: 'relative', height: '14px', backgroundColor: 'var(--bg-primary)', borderRadius: '7px', overflow: 'hidden' }}>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${reducedMotion ? 100 : fogProgress * 100}%`,
                  backgroundColor: 'rgba(2, 132, 199, 0.25)',
                  borderRight: '2px solid var(--color-fog)',
                  transition: reducedMotion ? 'none' : 'width 0.1s linear'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: `calc(${reducedMotion ? 100 : fogProgress * 100}% - 6px)`,
                  top: '2px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-fog)',
                  boxShadow: '0 0 4px rgba(2, 132, 199, 0.6)',
                  display: packetCycle > 0 ? 'block' : 'none'
                }}
              />
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="mono" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-fog)' }}>
                {fogLatency.toFixed(2)} ms
              </span>
              <span style={{ display: 'block', fontSize: '0.62rem', color: 'var(--text-dim)' }}>
                {fogProgress >= 1 ? 'DECISION RETURNED' : 'PROCESSING...'}
              </span>
            </div>
          </div>

          {/* TIER 3: CLOUD COMPUTING CHANNEL */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '100px 1fr 110px',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.45rem 0.65rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Server size={15} style={{ color: 'var(--color-cloud)' }} />
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-cloud)' }}>Cloud Server</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>100 Mbps | 1.0 Cap</div>
              </div>
            </div>

            {/* Travel Track with Moving Data Pulse */}
            <div style={{ position: 'relative', height: '14px', backgroundColor: 'var(--bg-primary)', borderRadius: '7px', overflow: 'hidden' }}>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${reducedMotion ? 100 : cloudProgress * 100}%`,
                  backgroundColor: 'rgba(99, 102, 241, 0.25)',
                  borderRight: '2px solid var(--color-cloud)',
                  transition: reducedMotion ? 'none' : 'width 0.1s linear'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: `calc(${reducedMotion ? 100 : cloudProgress * 100}% - 6px)`,
                  top: '2px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-cloud)',
                  boxShadow: '0 0 4px rgba(99, 102, 241, 0.6)',
                  display: packetCycle > 0 ? 'block' : 'none'
                }}
              />
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="mono" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-cloud)' }}>
                {cloudLatency.toFixed(2)} ms
              </span>
              <span style={{ display: 'block', fontSize: '0.62rem', color: 'var(--text-dim)' }}>
                {cloudProgress >= 1 ? 'DECISION RETURNED' : 'PROCESSING...'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SIMULATION CONTROLS BAR (Play/Pause/Replay/Reset/Speed/Reduced Motion) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
          paddingTop: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <button
            onClick={handlePlayPause}
            className="btn btn-secondary btn-sm"
            style={{ minWidth: '85px' }}
          >
            {isPaused || phase === 'idle' || phase === 'action_applied' ? (
              <>
                <Play size={14} fill="currentColor" />
                <span>{phase === 'action_applied' ? 'Replay' : 'Play'}</span>
              </>
            ) : (
              <>
                <Pause size={14} />
                <span>Pause</span>
              </>
            )}
          </button>

          <button onClick={handleReplay} className="btn btn-outline btn-sm" title="Replay Scenario">
            <RotateCcw size={14} />
            <span>Replay</span>
          </button>

          <button onClick={handleFullReset} className="btn btn-outline btn-sm" title="Reset Simulation">
            <span>Reset</span>
          </button>
        </div>

        {/* Speed & Accessibility Options */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Playback speed toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <span>Speed:</span>
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setPlaybackSpeed(s)}
                className={`btn btn-sm ${playbackSpeed === s ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '0.2rem 0.45rem', fontSize: '0.7rem' }}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Reduced motion toggle */}
          <button
            onClick={() => setReducedMotion(!reducedMotion)}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
            title="Toggle Reduced Motion Accessibility"
          >
            {reducedMotion ? <EyeOff size={13} /> : <Eye size={13} />}
            <span>{reducedMotion ? 'Static Mode' : 'Anim Mode'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
