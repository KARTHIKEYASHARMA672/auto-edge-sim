/**
 * AutoEdgeSim - Simulation Engine
 * 
 * Implements the mathematical delay and processing models for Cloud, Fog,
 * and Edge computing architectures in autonomous vehicle obstacle detection scenarios.
 * 
 * Completely decoupled from React UI components for standalone testability.
 */

import {
  ArchitectureResult,
  ArchitectureType,
  ObstacleSeverity,
  ObstacleSize,
  SimulationParameters,
  SimulationResult,
  VehicleAction
} from '../types/simulation';
import {
  ARCHITECTURE_CONFIGS,
  CONGESTION_MULTIPLIERS,
  OBSTACLE_SIZE_FACTORS,
  PROCESSING_LOAD_MULTIPLIERS
} from './networkParameters';

/**
 * Determines obstacle severity based on physical distance (meters).
 * Exact university model:
 *   Distance > 25 m  => SAFE
 *   10 < Distance <= 25 m => WARNING
 *   Distance <= 10 m => CRITICAL
 */
export function determineSeverity(distanceM: number): ObstacleSeverity {
  if (distanceM > 25) {
    return 'SAFE';
  } else if (distanceM > 10) {
    return 'WARNING';
  } else {
    return 'CRITICAL';
  }
}

/**
 * Determines vehicle control action from obstacle severity.
 *   SAFE     => CONTINUE
 *   WARNING  => SLOW DOWN
 *   CRITICAL => EMERGENCY BRAKE
 */
export function determineAction(severity: ObstacleSeverity): VehicleAction {
  switch (severity) {
    case 'SAFE':
      return 'CONTINUE';
    case 'WARNING':
      return 'SLOW DOWN';
    case 'CRITICAL':
      return 'EMERGENCY BRAKE';
  }
}

/**
 * Calculates transmission delay (ms):
 * T = Data Size / Bandwidth
 * Formula:
 *   packet_size_kbits = packet_size_kb * 8
 *   bandwidth_kbps = bandwidth_mbps * 1000
 *   transmission_delay_ms = (packet_size_kbits / bandwidth_kbps) * 1000
 */
export function calculateTransmissionDelay(packetSizeKb: number, bandwidthMbps: number): number {
  const packetSizeKbits = packetSizeKb * 8;
  const bandwidthKbps = bandwidthMbps * 1000;
  const delayMs = (packetSizeKbits / bandwidthKbps) * 1000;
  return delayMs;
}

/**
 * Calculates queue delay (ms):
 * queue_delay = base_queue_delay_ms * congestion_level * random_variation (0.8 - 1.2)
 */
export function calculateQueueDelay(
  baseQueueDelayMs: number,
  congestionLevel: number,
  applyVariation: boolean = true,
  forcedVariation?: number
): number {
  const variation = applyVariation
    ? forcedVariation ?? (0.8 + Math.random() * 0.4)
    : 1.0;
  return baseQueueDelayMs * congestionLevel * variation;
}

/**
 * Calculates computational workload (normalized abstract units):
 * Total workload = 10 * speed_factor * distance_factor * size_factor
 * where:
 *   speed_factor = vehicle_speed / 100
 *   distance_factor = max(0.5, (50 - obstacle_distance) / 50)
 *   size_factor: Small = 1.0, Medium = 1.2, Large = 1.5
 */
export function calculateWorkload(
  vehicleSpeedKmh: number,
  obstacleDistanceM: number,
  obstacleSize: ObstacleSize
): number {
  const baseWorkload = 10;
  const speedFactor = vehicleSpeedKmh / 100;
  const distanceFactor = Math.max(0.5, (50 - obstacleDistanceM) / 50);
  const sizeFactor = OBSTACLE_SIZE_FACTORS[obstacleSize] ?? 1.0;

  return baseWorkload * speedFactor * distanceFactor * sizeFactor;
}

/**
 * Calculates processing delay (ms):
 * processing_delay = (total_workload / effective_capacity) * random_variation (0.9 - 1.1)
 */
export function calculateProcessingDelay(
  workload: number,
  effectiveCapacity: number,
  applyVariation: boolean = true,
  forcedVariation?: number
): number {
  const variation = applyVariation
    ? forcedVariation ?? (0.9 + Math.random() * 0.2)
    : 1.0;
  return (workload / effectiveCapacity) * variation;
}

/**
 * Simulates a single architecture for given parameters.
 */
export function simulateArchitecture(
  archName: ArchitectureType,
  params: SimulationParameters,
  options?: { queueVariation?: number; procVariation?: number }
): ArchitectureResult {
  const config = ARCHITECTURE_CONFIGS[archName];
  const applyVariation = params.randomVariation ?? true;

  // Transmission delay
  const transmissionDelayMs = calculateTransmissionDelay(params.packetSizeKb, config.bandwidthMbps);

  // Network Congestion: combines architecture's baseline congestion with user scenario multiplier
  const congestionMultiplier = CONGESTION_MULTIPLIERS[params.networkCongestion] ?? 1.0;
  const effectiveCongestion = config.baseCongestionLevel * congestionMultiplier;

  // Queue delay
  const queueDelayMs = calculateQueueDelay(
    config.baseQueueDelayMs,
    effectiveCongestion,
    applyVariation,
    options?.queueVariation
  );

  // Propagation delay
  const propagationDelayMs = config.propagationDelayMs;

  // Total network delay
  const networkDelayMs = transmissionDelayMs + propagationDelayMs + queueDelayMs;

  // Workload computation
  const workload = calculateWorkload(
    params.vehicleSpeedKmh,
    params.obstacleDistanceM,
    params.obstacleSize
  );

  // Effective processing capacity: modified by processing load
  const loadMultiplier = PROCESSING_LOAD_MULTIPLIERS[params.processingLoad] ?? 1.0;
  const effectiveCapacity = config.processingCapacity / loadMultiplier;

  // Processing delay
  const processingDelayMs = calculateProcessingDelay(
    workload,
    effectiveCapacity,
    applyVariation,
    options?.procVariation
  );

  // Total response latency
  const totalLatencyMs = networkDelayMs + processingDelayMs;

  // Determine neutral status indicator based on latency thresholds
  // e.g. < 15ms is nominal, 15-35ms is warning, > 35ms alert for autonomous safety margins
  let status: 'nominal' | 'warning' | 'alert' = 'nominal';
  if (totalLatencyMs > 35) {
    status = 'alert';
  } else if (totalLatencyMs > 15) {
    status = 'warning';
  }

  return {
    architecture: archName,
    bandwidthMbps: config.bandwidthMbps,
    processingCapacity: config.processingCapacity,
    effectiveCapacity,
    transmissionDelayMs: Number(transmissionDelayMs.toFixed(3)),
    propagationDelayMs: Number(propagationDelayMs.toFixed(3)),
    queueDelayMs: Number(queueDelayMs.toFixed(3)),
    networkDelayMs: Number(networkDelayMs.toFixed(3)),
    processingDelayMs: Number(processingDelayMs.toFixed(3)),
    totalLatencyMs: Number(totalLatencyMs.toFixed(3)),
    status
  };
}

/**
 * Main simulation runner:
 * Runs the dynamic scenario simultaneously across Cloud, Fog, and Edge architectures.
 * 
 * Returns:
 * {
 *   cloud: {...},
 *   fog: {...},
 *   edge: {...},
 *   severity: "...",
 *   action: "..."
 * }
 */
export function runSimulation(params: SimulationParameters): SimulationResult {
  const severity = determineSeverity(params.obstacleDistanceM);
  const action = determineAction(severity);

  const cloud = simulateArchitecture('Cloud', params);
  const fog = simulateArchitecture('Fog', params);
  const edge = simulateArchitecture('Edge', params);

  return {
    timestamp: Date.now(),
    parameters: { ...params },
    severity,
    action,
    cloud,
    fog,
    edge
  };
}
