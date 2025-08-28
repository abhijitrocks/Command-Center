
import { KpiData, TrendData, FailureReason, LogEntry, TenantMetric } from '../types';

const generateSparkline = (length = 12, max = 100) => {
  return Array.from({ length }, (_, i) => ({
    name: `t${i}`,
    value: Math.floor(Math.random() * max) + 20,
  }));
};

export const getFileAppKpis = (): KpiData[] => [
  {
    id: 'mft',
    title: 'Monthly File Transfers',
    value: '1.2M',
    change: '+5.2%',
    changeType: 'increase',
    sparkline: generateSparkline(12, 1000),
    status: 'green',
  },
  {
    id: 'health',
    title: 'Health',
    value: '99.98%',
    change: '-0.01%',
    changeType: 'decrease',
    sparkline: generateSparkline(12, 100).map(d => ({ ...d, value: d.value > 10 ? 99.9 + Math.random() * 0.1 : 98 })),
    status: 'green',
  },
  {
    id: 'error_rate',
    title: 'Error Rate',
    value: '0.85%',
    change: '+15.0%',
    changeType: 'increase',
    sparkline: generateSparkline(12, 10),
    status: 'amber',
  },
  {
    id: 'throughput',
    title: 'Throughput',
    value: '256 MB/s',
    change: '+2.1%',
    changeType: 'increase',
    sparkline: generateSparkline(12, 300),
    status: 'green',
  },
];

export const getMessageAppKpis = (): KpiData[] => [
    {
        id: 'mjr',
        title: 'Monthly Job Runs',
        value: '7.8M',
        change: '+8.1%',
        changeType: 'increase',
        sparkline: generateSparkline(12, 5000),
        status: 'green',
    },
    {
        id: 'health_msg',
        title: 'Health',
        value: '99.91%',
        change: '-0.08%',
        changeType: 'decrease',
        sparkline: generateSparkline(12, 100).map(d => ({ ...d, value: d.value > 5 ? 99.9 + Math.random() * 0.1 : 97 })),
        status: 'amber',
    },
    {
        id: 'error_rate_msg',
        title: 'Error Rate',
        value: '1.52%',
        change: '+25.3%',
        changeType: 'increase',
        sparkline: generateSparkline(12, 20),
        status: 'red',
    },
    {
        id: 'throughput_msg',
        title: 'Throughput',
        value: '12.3k ev/s',
        change: '-1.5%',
        changeType: 'decrease',
        sparkline: generateSparkline(12, 15000),
        status: 'green',
    },
];

export const getTrendData = (name: string): TrendData[] => {
    return Array.from({ length: 30 }, (_, i) => ({
      name: `Day ${i + 1}`,
      value: Math.floor(Math.random() * (i + 1) * 100) + 500,
      previousValue: Math.floor(Math.random() * (i + 1) * 80) + 400,
    }));
};

export const getTopFailureReasons = (): FailureReason[] => [
    { reason: 'Schema validation failed', count: 1204, percentage: 35 },
    { reason: 'Upstream service timeout', count: 855, percentage: 25 },
    { reason: 'Authentication error (401)', count: 513, percentage: 15 },
    { reason: 'Payload too large (413)', count: 342, percentage: 10 },
    { reason: 'Internal server error (500)', count: 205, percentage: 6 },
    { reason: 'Other', count: 342, percentage: 9 },
];

export const getLogs = (): LogEntry[] => [
    { id: '1', timestamp: '2023-10-27T10:00:01Z', severity: 'ERROR', message: 'Failed to process file: connection refused by peer.', tenant: 'HDFC UAT', traceId: 'a1b2c3d4' },
    { id: '2', timestamp: '2023-10-27T10:00:05Z', severity: 'INFO', message: 'File transfer started for customer_data.csv.', tenant: 'Showroom', traceId: 'e5f6g7h8' },
    { id: '3', timestamp: '2023-10-27T10:01:10Z', severity: 'WARN', message: 'Queue latency approaching threshold: 950ms.', tenant: 'Common Prod', traceId: 'i9j0k1l2' },
    { id: '4', timestamp: '2023-10-27T10:01:15Z', severity: 'ERROR', message: 'Schema validation failed for event_type: USER_CREATED.', tenant: 'HDFC LZ', traceId: 'm3n4o5p6' },
    { id: '5', timestamp: '2023-10-27T10:02:00Z', severity: 'INFO', message: 'Batch job "daily-report" completed successfully.', tenant: 'US', traceId: 'q7r8s9t0' },
    { id: '6', timestamp: '2023-10-27T10:02:30Z', severity: 'DEBUG', message: 'Payload received: { "user_id": 123 }', tenant: 'Showroom', traceId: 'u1v2w3x4' },
];

export const getTenantMetrics = (): TenantMetric[] => [
    { tenantId: 'showroom', tenantName: 'Showroom', nsm: '350K', health: 99.99, errorRate: 0.1, lag: 12, lastContact: '2d ago' },
    { tenantId: 'hdfc_uat', tenantName: 'HDFC UAT', nsm: '280K', health: 99.80, errorRate: 1.2, lag: 850, lastContact: '1d ago' },
    { tenantId: 'common_prod', tenantName: 'Common Prod', nsm: '2.1M', health: 99.95, errorRate: 0.5, lag: 201, lastContact: '8h ago' },
    { tenantId: 'hdfc_lz', tenantName: 'HDFC LZ', nsm: '150K', health: 99.20, errorRate: 4.5, lag: 1500, lastContact: '3d ago' },
    { tenantId: 'us', tenantName: 'US', nsm: '890K', health: 99.98, errorRate: 0.2, lag: 5, lastContact: '5d ago' },
];
