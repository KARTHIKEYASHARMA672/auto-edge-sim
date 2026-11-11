/**
 * AutoEdgeSim - CSV Exporter Utility
 * Facilitates academic data export for viva demonstrations and documentation.
 */

import { SimulationResult } from '../types/simulation';

export function exportSimulationToCsv(result: SimulationResult): void {
  const headers = [
    'Architecture',
    'Vehicle Speed (km/h)',
    'Obstacle Distance (m)',
    'Obstacle Size',
    'Packet Size (KB)',
    'Congestion Level',
    'Processing Load',
    'Severity',
    'Vehicle Action',
    'Transmission Delay (ms)',
    'Propagation Delay (ms)',
    'Queue Delay (ms)',
    'Network Delay (ms)',
    'Processing Delay (ms)',
    'Total Latency (ms)',
    'Timestamp'
  ];

  const rows = [result.cloud, result.fog, result.edge].map((arch) => [
    arch.architecture,
    result.parameters.vehicleSpeedKmh,
    result.parameters.obstacleDistanceM,
    result.parameters.obstacleSize,
    result.parameters.packetSizeKb,
    result.parameters.networkCongestion,
    result.parameters.processingLoad,
    result.severity,
    result.action,
    arch.transmissionDelayMs,
    arch.propagationDelayMs,
    arch.queueDelayMs,
    arch.networkDelayMs,
    arch.processingDelayMs,
    arch.totalLatencyMs,
    new Date(result.timestamp).toISOString()
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute(
    'download',
    `AutoEdgeSim_Scenario_${result.parameters.vehicleSpeedKmh}kmh_${result.parameters.obstacleDistanceM}m_${Date.now()}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
