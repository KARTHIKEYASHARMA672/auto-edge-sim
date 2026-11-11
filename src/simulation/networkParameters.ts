/**
 * AutoEdgeSim - Architecture and Network Simulation Parameters
 * 
 * IMPORTANT: These are simulation assumptions for a university Edge Computing
 * research model. They do not represent physical hardware measurements.
 */

import {
  ArchitectureConfig,
  ArchitectureType,
  NetworkCongestion,
  ProcessingLoad,
  ObstacleSize,
  SimulationParameters
} from '../types/simulation';

export const ARCHITECTURE_CONFIGS: Record<ArchitectureType, ArchitectureConfig> = {
  Cloud: {
    name: 'Cloud',
    bandwidthMbps: 100,
    propagationDelayMs: 20,
    baseQueueDelayMs: 8,
    baseCongestionLevel: 1.5,
    processingCapacity: 1.0,
    description: 'Centralized cloud datacenter with extensive computational capacity but higher network latency.'
  },
  Fog: {
    name: 'Fog',
    bandwidthMbps: 200,
    propagationDelayMs: 8,
    baseQueueDelayMs: 4,
    baseCongestionLevel: 1.2,
    processingCapacity: 2.0,
    description: 'Regional edge aggregator or roadside unit (RSU) bridging local edge nodes and centralized cloud.'
  },
  Edge: {
    name: 'Edge',
    bandwidthMbps: 500,
    propagationDelayMs: 2,
    baseQueueDelayMs: 1.5,
    baseCongestionLevel: 1.0,
    processingCapacity: 4.0,
    description: 'On-vehicle or near-field micro-servers enabling ultra-low propagation delay and rapid critical response.'
  }
};

export const CONGESTION_MULTIPLIERS: Record<NetworkCongestion, number> = {
  Low: 0.5,
  Medium: 1.0,
  High: 2.0
};

export const PROCESSING_LOAD_MULTIPLIERS: Record<ProcessingLoad, number> = {
  Low: 0.5,
  Medium: 1.0,
  High: 2.0,
  'Very High': 3.0
};

export const OBSTACLE_SIZE_FACTORS: Record<ObstacleSize, number> = {
  Small: 1.0,
  Medium: 1.2,
  Large: 1.5
};

export const DEFAULT_PARAMETERS: SimulationParameters = {
  vehicleSpeedKmh: 70,
  obstacleDistanceM: 18,
  obstacleSize: 'Medium',
  packetSizeKb: 2,
  networkCongestion: 'Medium',
  processingLoad: 'Medium',
  randomVariation: true
};

export const PARAMETER_BOUNDS = {
  speed: { min: 30, max: 100, step: 1, unit: 'km/h' },
  distance: { min: 5, max: 50, step: 1, unit: 'm' },
  packetSize: { min: 1, max: 5, step: 0.5, unit: 'KB' }
};

export const SIMULATION_DISCLAIMER =
  'This application uses simulated parameters and mathematical models developed for academic comparative analysis. It does not represent measurements from a physical autonomous vehicle or real-world cellular/optical network.';
