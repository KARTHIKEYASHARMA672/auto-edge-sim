/**
 * AutoEdgeSim - Autonomous Vehicle Cloud-Fog-Edge Simulation Platform
 * TypeScript Type Definitions
 */

export type ObstacleSize = 'Small' | 'Medium' | 'Large';

export type NetworkCongestion = 'Low' | 'Medium' | 'High';

export type ProcessingLoad = 'Low' | 'Medium' | 'High' | 'Very High';

export type ObstacleSeverity = 'SAFE' | 'WARNING' | 'CRITICAL';

export type VehicleAction = 'CONTINUE' | 'SLOW DOWN' | 'EMERGENCY BRAKE';

export type ArchitectureType = 'Cloud' | 'Fog' | 'Edge';

export interface SimulationParameters {
  vehicleSpeedKmh: number;      // 30 - 100 km/h
  obstacleDistanceM: number;    // 5 - 50 m
  obstacleSize: ObstacleSize;   // 'Small' | 'Medium' | 'Large'
  packetSizeKb: number;         // 1 - 5 KB
  networkCongestion: NetworkCongestion; // 'Low' | 'Medium' | 'High'
  processingLoad: ProcessingLoad;       // 'Low' | 'Medium' | 'High' | 'Very High'
  randomVariation?: boolean;    // whether to apply 0.8-1.2 queue & 0.9-1.1 processing variations (default: true)
}

export interface ArchitectureConfig {
  name: ArchitectureType;
  bandwidthMbps: number;
  propagationDelayMs: number;
  baseQueueDelayMs: number;
  baseCongestionLevel: number;
  processingCapacity: number;
  description: string;
}

export interface DelayBreakdown {
  transmissionDelayMs: number;
  propagationDelayMs: number;
  queueDelayMs: number;
  networkDelayMs: number;
  processingDelayMs: number;
  totalLatencyMs: number;
}

export interface ArchitectureResult extends DelayBreakdown {
  architecture: ArchitectureType;
  bandwidthMbps: number;
  processingCapacity: number;
  effectiveCapacity: number;
  status: 'nominal' | 'warning' | 'alert';
}

export interface SimulationResult {
  scenarioId?: number;
  timestamp: number;
  parameters: SimulationParameters;
  severity: ObstacleSeverity;
  action: VehicleAction;
  cloud: ArchitectureResult;
  fog: ArchitectureResult;
  edge: ArchitectureResult;
}

export interface CongestionExperimentRow {
  congestion: NetworkCongestion;
  architecture: ArchitectureType;
  averageLatencyMs: number;
}

export interface ProcessingExperimentRow {
  processingLoad: ProcessingLoad;
  architecture: ArchitectureType;
  averageLatencyMs: number;
}

export interface PacketExperimentRow {
  architecture: ArchitectureType;
  packetSizeKb: number;
  transmissionDelayMs: number;
}

export interface SeverityExperimentRow {
  severity: ObstacleSeverity;
  scenarioCount: number;
  percentage: number;
}

export interface ArchitectureComparisonRow {
  architecture: ArchitectureType;
  scenarios: number;
  averageLatencyMs: number;
  minimumLatencyMs: number;
  maximumLatencyMs: number;
  networkDelayMs: number;
  processingDelayMs: number;
  transmissionDelayMs: number;
  queueDelayMs: number;
  propagationDelayMs: number;
  differenceFromCloudMs: number;
  percentageDifferenceFromCloud: number;
}
