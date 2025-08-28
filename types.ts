export enum ConsoleTab {
  FILE_APP = 'File Application',
  MESSAGE_APP = 'Message Application',
  ADOPTION_USAGE = 'Adoption & Usage',
}

export enum TimeRange {
  LAST_1H = 'Last 1h',
  LAST_24H = 'Last 24h',
  LAST_7D = 'Last 7d',
  LAST_30D = 'Last 30d',
}

export interface Zone {
  id: string;
  name: string;
}

export interface Subscriber {
  id: string;
  name: string;
  zoneId: string;
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
  description: string;
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
  subscriber: string;
  traceId: string;
}

export interface SubscriberMetric {
  subscriberId: string;
  subscriberName: string;
  nsm: string;
  health: number;
  errorRate: number;
  lag: number;
  lastContact: string;
  mau: number;
  adoptionRate: number;
}

export interface BatchJobSummary {
  jobsRun: number;
  jobsFailed: number;
  recordsProcessed: number;
  jobsSucceeded: number;
  jobsRunChange: string;
  jobsFailedChange: string;
  jobsSucceededChange: string;
}

export interface LatencyData {
  name: string;
  count: number;
}

export interface TraceEntry {
    traceId: string;
    rootService: string;
    rootOperation: string;
    duration: string;
    spanCount: number;
    timestamp: string;
    status: 'ok' | 'error';
}

export interface ModuleMetric {
  id: string;
  name: string;
  value: string;
  status: 'green' | 'amber' | 'red' | 'neutral';
  description: string;
  change?: string;
}

export interface TopContributor {
    name: string;
    value: string;
    change: string;
}

export interface DrilldownData {
    metricId: string;
    metricTitle: string;
    trendData: TrendData[];
    contributors: TopContributor[];
    logs: LogEntry[];
    contributorTitle: string;
}

export enum View {
    CONSOLE = 'CONSOLE',
    DIA = 'DIA',
    PERSEUS = 'PERSEUS',
    ATROPOS = 'ATROPOS',
    ALERTS = 'ALERTS',
    TENANT_DETAIL = 'TENANT_DETAIL',
}

export interface AlertableMetric {
    id: string;
    name: string;
    unit: 'percent' | 'count' | 'seconds' | 'mbs' | 'k_events_s';
}

export enum AlertCondition {
    ABOVE = 'is above',
    BELOW = 'is below',
    OUTSIDE_RANGE = 'is outside range of',
    ANOMALY = 'has an anomaly detected'
}

export enum AlertAction {
    EMAIL = 'Send Email',
    SLACK = 'Notify Slack',
    PAGERDUTY = 'Create PagerDuty Incident',
    WIN_TASK = 'Create Win Task'
}

export interface AlertRule {
    id: string;
    name: string;
    metricId: string;
    condition: AlertCondition;
    threshold: number;
    duration: number; // in minutes
    actions: AlertAction[];
    isEnabled: boolean;
}

export interface JobRun {
  id: string;
  name: string;
  subscriberName: string;
  startTime: string;
  duration: string;
  status: 'succeeded' | 'failed';
  failureReason?: string;
}

// T-Sheet format data
export interface TSheetMetric {
  key: string;
  label: string;
  isGroupSeparator: boolean; // To add top padding/border for visual grouping
}

export interface TSheetData {
  [subscriberName: string]: {
    [metricKey: string]: string; // Values are strings like '1547', '18 Mil', 'NA'
  };
}

export interface FeatureAdoption {
    name: string;
    adoption: number;
    description: string;
    change: number;
}

export interface TriggeredAlert {
  id: string;
  title: string;
  severity: 'red' | 'amber';
  timestamp: string; // ISO string
  isRead: boolean;
  subscriberId: string;
  subscriberName: string;
}