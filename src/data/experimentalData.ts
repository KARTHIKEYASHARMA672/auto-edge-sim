/**
 * AutoEdgeSim - Precomputed Experimental Data
 * 
 * Extracted directly from the validated simulation batch runs:
 * - AutoEdgeSim_Congestion_Results.csv
 * - AutoEdgeSim_Processing_Results.csv
 * - AutoEdgeSim_Packet_Results.csv
 * - AutoEdgeSim_Severity_Results.csv
 * - AutoEdgeSim_Architecture_Comparison.csv
 */

import {
  ArchitectureComparisonRow,
  CongestionExperimentRow,
  PacketExperimentRow,
  ProcessingExperimentRow,
  SeverityExperimentRow
} from '../types/simulation';

// Experiment 1: Network Congestion vs Average Latency (ms)
export const CONGESTION_EXPERIMENT_DATA: CongestionExperimentRow[] = [
  { congestion: 'Low', architecture: 'Cloud', averageLatencyMs: 29.002 },
  { congestion: 'Low', architecture: 'Fog', averageLatencyMs: 12.530 },
  { congestion: 'Low', architecture: 'Edge', averageLatencyMs: 3.963 },
  { congestion: 'Medium', architecture: 'Cloud', averageLatencyMs: 32.982 },
  { congestion: 'Medium', architecture: 'Fog', averageLatencyMs: 14.486 },
  { congestion: 'Medium', architecture: 'Edge', averageLatencyMs: 4.734 },
  { congestion: 'High', architecture: 'Cloud', averageLatencyMs: 40.903 },
  { congestion: 'High', architecture: 'Fog', averageLatencyMs: 18.428 },
  { congestion: 'High', architecture: 'Edge', averageLatencyMs: 6.271 }
];

// Experiment 2: Processing Load vs Average Latency (ms)
export const PROCESSING_EXPERIMENT_DATA: ProcessingExperimentRow[] = [
  { processingLoad: 'Low', architecture: 'Cloud', averageLatencyMs: 34.604 },
  { processingLoad: 'Low', architecture: 'Fog', averageLatencyMs: 14.170 },
  { processingLoad: 'Low', architecture: 'Edge', averageLatencyMs: 4.131 },
  { processingLoad: 'Medium', architecture: 'Cloud', averageLatencyMs: 37.018 },
  { processingLoad: 'Medium', architecture: 'Fog', averageLatencyMs: 15.279 },
  { processingLoad: 'Medium', architecture: 'Edge', averageLatencyMs: 4.736 },
  { processingLoad: 'High', architecture: 'Cloud', averageLatencyMs: 41.879 },
  { processingLoad: 'High', architecture: 'Fog', averageLatencyMs: 17.764 },
  { processingLoad: 'High', architecture: 'Edge', averageLatencyMs: 5.921 },
  { processingLoad: 'Very High', architecture: 'Cloud', averageLatencyMs: 46.423 },
  { processingLoad: 'Very High', architecture: 'Fog', averageLatencyMs: 19.786 },
  { processingLoad: 'Very High', architecture: 'Edge', averageLatencyMs: 7.046 }
];

// Experiment 3: Packet Size vs Transmission Delay (ms)
export const PACKET_EXPERIMENT_DATA: PacketExperimentRow[] = [
  { architecture: 'Cloud', packetSizeKb: 1, transmissionDelayMs: 0.080 },
  { architecture: 'Cloud', packetSizeKb: 2, transmissionDelayMs: 0.160 },
  { architecture: 'Cloud', packetSizeKb: 3, transmissionDelayMs: 0.240 },
  { architecture: 'Cloud', packetSizeKb: 4, transmissionDelayMs: 0.320 },
  { architecture: 'Cloud', packetSizeKb: 5, transmissionDelayMs: 0.400 },
  { architecture: 'Fog', packetSizeKb: 1, transmissionDelayMs: 0.040 },
  { architecture: 'Fog', packetSizeKb: 2, transmissionDelayMs: 0.080 },
  { architecture: 'Fog', packetSizeKb: 3, transmissionDelayMs: 0.120 },
  { architecture: 'Fog', packetSizeKb: 4, transmissionDelayMs: 0.160 },
  { architecture: 'Fog', packetSizeKb: 5, transmissionDelayMs: 0.200 },
  { architecture: 'Edge', packetSizeKb: 1, transmissionDelayMs: 0.016 },
  { architecture: 'Edge', packetSizeKb: 2, transmissionDelayMs: 0.032 },
  { architecture: 'Edge', packetSizeKb: 3, transmissionDelayMs: 0.048 },
  { architecture: 'Edge', packetSizeKb: 4, transmissionDelayMs: 0.064 },
  { architecture: 'Edge', packetSizeKb: 5, transmissionDelayMs: 0.080 }
];

// Experiment 4: Obstacle Severity Distribution (1000 Scenarios)
export const SEVERITY_EXPERIMENT_DATA: SeverityExperimentRow[] = [
  { severity: 'SAFE', scenarioCount: 542, percentage: 54.2 },
  { severity: 'WARNING', scenarioCount: 357, percentage: 35.7 },
  { severity: 'CRITICAL', scenarioCount: 101, percentage: 10.1 }
];

// Architecture Statistical Comparison from 1000 Simulated Scenarios
export const ARCHITECTURE_COMPARISON_DATA: ArchitectureComparisonRow[] = [
  {
    architecture: 'Cloud',
    scenarios: 1000,
    averageLatencyMs: 36.934,
    minimumLatencyMs: 31.699,
    maximumLatencyMs: 45.255,
    networkDelayMs: 32.147,
    processingDelayMs: 4.787,
    transmissionDelayMs: 0.239,
    queueDelayMs: 11.908,
    propagationDelayMs: 20.000,
    differenceFromCloudMs: 0.000,
    percentageDifferenceFromCloud: 0.0
  },
  {
    architecture: 'Fog',
    scenarios: 1000,
    averageLatencyMs: 15.298,
    minimumLatencyMs: 12.971,
    maximumLatencyMs: 19.664,
    networkDelayMs: 12.919,
    processingDelayMs: 2.379,
    transmissionDelayMs: 0.120,
    queueDelayMs: 4.799,
    propagationDelayMs: 8.000,
    differenceFromCloudMs: -21.636,
    percentageDifferenceFromCloud: -58.58
  },
  {
    architecture: 'Edge',
    scenarios: 1000,
    averageLatencyMs: 4.738,
    minimumLatencyMs: 3.699,
    maximumLatencyMs: 7.007,
    networkDelayMs: 3.550,
    processingDelayMs: 1.189,
    transmissionDelayMs: 0.048,
    queueDelayMs: 1.502,
    propagationDelayMs: 2.000,
    differenceFromCloudMs: -32.196,
    percentageDifferenceFromCloud: -87.17
  }
];

export const EXPERIMENT_METADATA = [
  {
    id: 'exp1',
    title: 'Network Congestion vs Average Latency',
    description: 'Evaluates the sensitivity of each tier to fluctuating network saturation levels (Low = 0.5x, Medium = 1.0x, High = 2.0x base queue delay).',
    insight: 'Cloud latency degrades substantially (+41.0% from Low to High) due to long transmission hops and higher base queue sensitivity, while Edge exhibits resilience with minimal absolute delay expansion (under 6.3 ms even at peak congestion).'
  },
  {
    id: 'exp2',
    title: 'Processing Load vs Average Latency',
    description: 'Demonstrates the effect of escalating algorithmic computational complexity on decision times across computing nodes.',
    insight: 'While higher processing load amplifies decision delays across all architectures, the high base computational capacity of Edge (4.0 units) maintains latency in safety-critical ranges, whereas Cloud experiences noticeable cumulative delay.'
  },
  {
    id: 'exp3',
    title: 'Packet Size vs Transmission Delay',
    description: 'Examines pure transmission latency across varying sensor telemetry payload sizes (1 KB to 5 KB) given bandwidth constraints.',
    insight: 'Higher bandwidth at the Edge (500 Mbps) yields near-zero transmission latency (< 0.08 ms for 5 KB), compared to Cloud (100 Mbps) where transmission times scale linearly up to 0.40 ms.'
  },
  {
    id: 'exp4',
    title: 'Obstacle Severity Distribution',
    description: 'Characterizes the statistical distribution of simulated obstacle encounters across 1,000 randomized urban driving scenarios.',
    insight: 'Safe scenarios constitute 54.2% of occurrences, Warnings represent 35.7%, and Critical emergency brake encounters comprise 10.1%. These proportions highlight that autonomous vehicles regularly operate in warning and critical zones requiring guaranteed low-latency decisions.'
  }
];
