
export enum ConsoleTab {
  FILE_APP = 'File Application',
  MESSAGE_APP = 'Message Application',
}

export enum TimeRange {
  LAST_1H = 'Last 1h',
  LAST_24H = 'Last 24h',
  LAST_7D = 'Last 7d',
  LAST_30D = 'Last 30d',
}

export interface Tenant {
  id: string;
  name: string;
}

export interface KpiData {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  sparkline: { name: string; value: number }[];
  status: 'green' | 'amber' | 'red';
  unit?: string;
}

export interface TrendData {
  name: string;
  value: number;
  previousValue?: number;
}

export interface FailureReason {
  reason: string;
  count: number;
  percentage: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  severity: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  tenant: string;
  traceId: string;
}

export interface TenantMetric {
  tenantId: string;
  tenantName: string;
  nsm: string;
  health: number;
  errorRate: number;
  lag: number;
  lastContact: string;
}
