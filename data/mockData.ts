
import { KpiData, TrendData, FailureReason, LogEntry, SubscriberMetric, BatchJobSummary, LatencyData, TraceEntry, ModuleMetric, DrilldownData, TopContributor, Subscriber, Zone, AlertableMetric, AlertRule, AlertCondition, AlertAction, JobRun, TSheetMetric, TSheetData, FeatureAdoption, TimeRange, TriggeredAlert, PerseusCategorizedMetrics, DiaNsmKpi, DiaSupplementaryData, MessageAppHeroMetrics, TopicMetrics, SubscriptionMetrics, RedChartDataPoint, SloMetric, Topic, Subscription, Task } from '../types';
import { SUBSCRIBERS } from '../constants';

const generateSparkline = (length = 12, max = 100) => {
  return Array.from({ length }, (_, i) => ({
    name: `t${i}`,
    value: Math.floor(Math.random() * max) + 20,
  }));
};

// Helper to format large numbers into human-readable strings (K, M, B)
const formatNumber = (num: number): string => {
    if (num >= 1_000_000_000) {
        return `${(num / 1_000_000_000).toFixed(1)}B`;
    }
    if (num >= 1_000_000) {
        return `${(num / 1_000_000).toFixed(1)}M`;
    }
    if (num >= 1_000) {
        return `${(num / 1_000).toFixed(1)}K`;
    }
    return num.toLocaleString();
};

const parseUnitString = (s: string): number => {
    if (typeof s !== 'string' || s === 'NA') return 0;
    const value = parseFloat(s);
    if (isNaN(value)) return 0;
    const lower = s.toLowerCase();
    if (lower.includes('bil')) return value * 1_000_000_000;
    if (lower.includes('mil')) return value * 1_000_000;
    if (lower.includes('k')) return value * 1_000;
    return value;
}

// Helper to generate a consistent randomization factor based on selected subscribers and zones
const getFilterFactor = (subscribers: Subscriber[], zones: Zone[]): number => {
    const isAllSubscribers = !subscribers || subscribers.length === 0 || subscribers.some(t => t.id === 'all');
    const isAllZones = !zones || zones.length === 0 || zones.some(z => z.id === 'all');

    if (isAllSubscribers && isAllZones) {
        return 1.0;
    }
    
    let seed = 0;
    if (!isAllSubscribers) {
        seed += subscribers.reduce((acc, t) => acc + t.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0), 0);
    }
     if (!isAllZones) {
        seed += zones.reduce((acc, z) => acc + z.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0), 0);
    }

    const random = Math.sin(seed) * 10000;
    return 0.2 + (random - Math.floor(random)) * 0.6;
};

const getTimeRangeFactor = (timeRange: TimeRange): number => {
    switch (timeRange) {
        case TimeRange.LAST_1H: return 1 / (24 * 30);
        case TimeRange.LAST_24H: return 1 / 30;
        case TimeRange.LAST_7D: return 7 / 30;
        case TimeRange.LAST_30D: return 1;
        default: return 1;
    }
};

const SUBSCRIBERS_WITH_FILE_APPS = ['Cardworks', 'Sparrow', 'HDFC', 'Optum', 'Jenius Bank', 'Lakestack', 'ITP', 'Tachyon Credit'];

export const getFileAppKpis = (subscribers: Subscriber[] = [], zones: Zone[] = [], timeRange: TimeRange): KpiData[] => {
    const filterFactor = getFilterFactor(subscribers, zones);
    const timeFactor = getTimeRangeFactor(timeRange);
    const factor = filterFactor * timeFactor;
    const isAll = !subscribers || subscribers.length === 0 || subscribers.some(t => t.id === 'all');
    
    const batchJobSummary = getBatchJobSummary(subscribers, zones, timeRange);

    const isSingleSubscriber = subscribers.length === 1 && !isAll;
    const numApps = isAll 
        ? SUBSCRIBERS_WITH_FILE_APPS.length
        : isSingleSubscriber
        ? 1
        : subscribers.filter(s => SUBSCRIBERS_WITH_FILE_APPS.includes(s.name)).length;


    return [
      {
        id: 'num_file_apps',
        title: 'Number of File applications',
        value: numApps.toString(),
        change: `+2 this month`,
        changeType: 'increase',
        sparkline: generateSparkline(12, 8),
        status: 'green',
        description: 'Total count of distinct applications configured for file transfers.',
      },
      {
        id: 'files_processed',
        title: 'Number of Files Processed',
        value: formatNumber(batchJobSummary.filesProcessed),
        change: batchJobSummary.filesProcessedChange,
        changeType: 'increase',
        sparkline: generateSparkline(12, 100 * factor),
        status: 'green',
        description: 'Total number of files processed by file applications.',
      },
      {
        id: 'file_downloads',
        title: 'File Downloads',
        value: formatNumber(900000 * factor),
        change: `+4.8%`,
        changeType: 'increase',
        sparkline: generateSparkline(12, 1 * factor),
        status: 'green',
        description: 'Total number of successful file downloads in the selected period.',
      },
      {
        id: 'file_uploads',
        title: 'File Uploads',
        value: formatNumber(300000 * factor),
        change: `+6.1%`,
        changeType: 'increase',
        sparkline: generateSparkline(12, 1 * factor),
        status: 'green',
        description: 'Total number of successful file uploads in the selected period.',
      },
      {
        id: 'job_runs',
        title: 'Job Runs',
        value: formatNumber(batchJobSummary.jobsRun),
        change: batchJobSummary.jobsRunChange,
        changeType: 'increase',
        sparkline: generateSparkline(12, 500 * factor),
        status: 'green',
        description: 'Total number of batch jobs executed in the selected period. Primarily driven by the Perseus module.',
      },
      {
        id: 'error_rate',
        title: 'Error Rate',
        value: `0.85%`,
        change: `+15.0%`,
        changeType: 'increase',
        sparkline: generateSparkline(12, 10),
        status: 'amber',
        description: 'The percentage of file transfer operations that resulted in a failure (5xx error code). Spikes can indicate systemic issues.',
      },
      {
        id: 'avg_latency',
        title: 'Avg. Transfer Latency',
        value: `1.2s`,
        change: `+12.1%`,
        changeType: 'increase',
        sparkline: generateSparkline(12, 2000),
        status: 'amber',
        description: 'The average time taken for a file transfer to complete, from initiation to final confirmation.',
      },
    ];
}
export const getMessageAppKpis = (subscribers: Subscriber[] = [], zones: Zone[] = [], timeRange: TimeRange): KpiData[] => {
    const filterFactor = getFilterFactor(subscribers, zones);
    const timeFactor = getTimeRangeFactor(timeRange);
    const factor = filterFactor * timeFactor;
    const isAll = !subscribers || subscribers.length === 0 || subscribers.some(t => t.id === 'all');

    return [
    {
        id: 'events_published',
        title: 'Events Published',
        value: `${(25.4 * factor * 30).toFixed(1)}M`,
        change: `${isAll ? '+' : (Math.random() > 0.5 ? '+' : '-')}${(12.3 * filterFactor).toFixed(1)}%`,
        changeType: 'increase',
        sparkline: generateSparkline(12, 8000 * factor),
        status: 'green',
        description: 'Total number of events successfully published to a topic in the selected period. This is the North-Star Metric (NSM) for the Message Application.',
    },
    {
        id: 'health_msg',
        title: 'Health',
        value: `${(99.91 - (1 - filterFactor) * 0.5).toFixed(2)}%`,
        change: `-${(0.08 * filterFactor).toFixed(2)}%`,
        changeType: 'decrease',
        sparkline: generateSparkline(12, 100).map(d => ({ ...d, value: d.value > 5 ? 99.9 + Math.random() * 0.1 : 97 })),
        status: 'amber',
        description: 'The uptime percentage of all services backing the Message Application. Target: 99.99%.',
    },
    {
        id: 'error_rate_msg',
        title: 'Error Rate',
        value: `${(1.52 / filterFactor).toFixed(2)}%`,
        change: `+${(25.3 * (1 / filterFactor)).toFixed(1)}%`,
        changeType: 'increase',
        sparkline: generateSparkline(12, 20 * (1 / filterFactor)),
        status: 'red',
        description: 'The percentage of event processing operations that resulted in a failure.',
    },
    {
        id: 'p99_latency',
        title: 'p99 Publish Latency',
        value: `${(950 * (1 / filterFactor)).toFixed(0)}ms`,
        change: `+${(8.5 * (1/filterFactor)).toFixed(1)}%`,
        changeType: 'increase',
        sparkline: generateSparkline(12, 1500 * (1 / filterFactor)),
        status: 'amber',
        description: 'The 99th percentile latency for publishing an event. This indicates the worst-case experience for the vast majority of requests.',
      },
]};

export const getAdoptionKpis = (subscribers: Subscriber[] = [], zones: Zone[] = [], timeRange: TimeRange): KpiData[] => {
    const filterFactor = getFilterFactor(subscribers, zones);
    const timeFactor = getTimeRangeFactor(timeRange);
    const factor = filterFactor * timeFactor;
    return [
        {
            id: 'mau',
            title: 'Active Users',
            value: `${(12.5 * factor * 30).toFixed(1)}K`,
            change: `+${(8.1 * filterFactor).toFixed(1)}%`,
            changeType: 'increase',
            sparkline: generateSparkline(12, 500 * factor),
            status: 'green',
            description: 'The number of unique users who have performed at least one significant action in the selected period.',
        },
        {
            id: 'far',
            title: 'Feature Adoption Rate',
            value: `${(68 * filterFactor).toFixed(0)}%`,
            change: `+${(2.5 * filterFactor).toFixed(1)}%`,
            changeType: 'increase',
            sparkline: generateSparkline(12, 80 * filterFactor),
            status: 'green',
            description: 'An overall score representing the percentage of key features being actively used by subscribers.',
        },
        {
            id: 'stickiness',
            title: 'Stickiness (DAU/MAU)',
            value: `${(45 - (1 - filterFactor) * 10).toFixed(0)}%`,
            change: `-${(1.2 * (1 - filterFactor)).toFixed(1)}%`,
            changeType: 'decrease',
            sparkline: generateSparkline(12, 50 * filterFactor),
            status: 'amber',
            description: 'The ratio of Daily Active Users to Monthly Active Users, indicating how frequently users return.',
        },
        {
            id: 'new_feature_uptake',
            title: 'New Feature Uptake',
            value: `${(35 * filterFactor).toFixed(0)}%`,
            change: `+${(15 * filterFactor).toFixed(1)}%`,
            changeType: 'increase',
            sparkline: generateSparkline(12, 40 * factor),
            status: 'green',
            description: 'Percentage of subscribers who have adopted the newest flagship feature within the first month of release.',
        },
    ];
};

export const getTrendData = (name: string, subscribers: Subscriber[] = [], zones: Zone[] = [], timeRange: TimeRange): TrendData[] => {
    const factor = getFilterFactor(subscribers, zones);
    let length = 30;
    let unit = 'Day';
    switch (timeRange) {
        case TimeRange.LAST_1H: length = 60; unit = 'Min'; break;
        case TimeRange.LAST_24H: length = 24; unit = 'Hour'; break;
        case TimeRange.LAST_7D: length = 7; unit = 'Day'; break;
        case TimeRange.LAST_30D: length = 30; unit = 'Day'; break;
    }

    return Array.from({ length }, (_, i) => ({
      name: `${unit} ${length - i}`,
      value: Math.floor((Math.random() * (i + 1) * 100) + 500) * factor,
      previousValue: Math.floor((Math.random() * (i + 1) * 80) + 400) * factor * 0.8,
    }));
};

export const getTopFailureReasons = (subscribers: Subscriber[] = [], zones: Zone[] = []): FailureReason[] => {
    const factor = getFilterFactor(subscribers, zones);
    const reasons = [
        { reason: 'Schema validation failed', count: 1204, percentage: 35 },
        { reason: 'Upstream service timeout', count: 855, percentage: 25 },
        { reason: 'Authentication error (401)', count: 513, percentage: 15 },
        { reason: 'Payload too large (413)', count: 342, percentage: 10 },
        { reason: 'Internal server error (500)', count: 205, percentage: 6 },
        { reason: 'Other', count: 342, percentage: 9 },
    ];
    return reasons.map(r => ({...r, count: Math.round(r.count * factor)})).sort((a,b) => b.count - a.count);
}

const ALL_LOGS: LogEntry[] = [
    { id: '1', timestamp: '2023-10-27T10:00:01Z', severity: 'ERROR', message: '[DIA] Failed to process file: connection refused by peer.', subscriber: 'HDFC', traceId: 'a1b2c3d4' },
    { id: '2', timestamp: '2023-10-27T10:00:05Z', severity: 'INFO', message: '[DIA] File transfer started for customer_data.csv.', subscriber: 'Cardworks', traceId: 'e5f6g7h8' },
    { id: '3', timestamp: '2023-10-27T10:01:10Z', severity: 'WARN', message: '[Atropos] Queue latency approaching threshold: 950ms.', subscriber: 'Optum', traceId: 'i9j0k1l2' },
    { id: '4', timestamp: '2023-10-27T10:01:15Z', severity: 'ERROR', message: '[Atropos] Schema validation failed for event_type: USER_CREATED.', subscriber: 'Sparrow', traceId: 'm3n4o5p6' },
    { id: '5', timestamp: '2023-10-27T10:02:00Z', severity: 'INFO', message: '[Perseus] Batch job "daily-report" completed successfully.', subscriber: 'Jenius Bank', traceId: 'q7r8s9t0' },
    { id: '6', timestamp: '2023-10-27T10:02:30Z', severity: 'DEBUG', message: '[Atropos] Payload received: { "user_id": 123 }', subscriber: 'Cardworks', traceId: 'u1v2w3x4' },
    { id: '7', timestamp: '2023-10-27T10:03:00Z', severity: 'INFO', message: '[DIA] New file detected for processing.', subscriber: 'Lakestack', traceId: 'a2b3c4d5' },
    { id: '8', timestamp: '2023-10-27T10:03:15Z', severity: 'WARN', message: '[Atropos] Message delivery delayed.', subscriber: 'ITP', traceId: 'e6f7g8h9' },
    { id: '9', timestamp: '2023-10-27T10:04:00Z', severity: 'ERROR', message: '[Perseus] Credit check service unavailable during batch run.', subscriber: 'Tachyon Credit', traceId: 'i0j1k2l3' },
    { id: '10', timestamp: '2023-10-27T10:05:00Z', severity: 'INFO', message: '[Perseus] Job "monthly-billing" started for Sparrow.', subscriber: 'Sparrow', traceId: 'j4k5l6m7' },
    { id: '11', timestamp: '2023-10-27T10:05:30Z', severity: 'ERROR', message: '[DIA] File integrity check failed for transactions.zip.', subscriber: 'Optum', traceId: 'n8o9p0q1' },
    { id: '12', timestamp: '2023-10-27T10:06:15Z', severity: 'INFO', message: '[Atropos] New subscriber topic created: "tachyon-updates".', subscriber: 'Tachyon Credit', traceId: 'r2s3t4u5' },
];

export const getLogs = (subscribers: Subscriber[] = [], zones: Zone[] = []): LogEntry[] => {
    const isAllSubscribers = !subscribers || subscribers.length === 0 || subscribers.some(t => t.id === 'all');
    const isAllZones = !zones || zones.length === 0 || zones.some(z => z.id === 'all');

    let filteredLogs = ALL_LOGS;

    if (!isAllZones) {
        const selectedZoneIds = zones.map(z => z.id);
        const subscribersInZones = SUBSCRIBERS.filter(t => selectedZoneIds.includes(t.zoneId)).map(t => t.name);
        filteredLogs = filteredLogs.filter(log => subscribersInZones.includes(log.subscriber));
    }

    if (!isAllSubscribers) {
        const selectedSubscriberNames = subscribers.map(t => t.name);
        filteredLogs = filteredLogs.filter(log => selectedSubscriberNames.includes(log.subscriber));
    }

    return filteredLogs;
};

export const getModuleLogs = (module: 'DIA' | 'PERSEUS' | 'ATROPOS', subscribers: Subscriber[] = [], zones: Zone[] = []): LogEntry[] => {
    const allLogs = getLogs(subscribers, zones);
    const prefix = `[${module}]`;
    return allLogs.filter(log => log.message.startsWith(prefix));
};


const ALL_SUBSCRIBER_METRICS: SubscriberMetric[] = [
    { subscriberId: 'cardworks', subscriberName: 'Cardworks', nsm: '350K', health: 99.99, errorRate: 0.1, lag: 12, lastContact: '2d ago', mau: 1500, adoptionRate: 85 },
    { subscriberId: 'sparrow', subscriberName: 'Sparrow', nsm: '280K', health: 99.80, errorRate: 1.2, lag: 850, lastContact: '1d ago', mau: 800, adoptionRate: 45 },
    { subscriberId: 'optum', subscriberName: 'Optum', nsm: '2.1M', health: 99.95, errorRate: 0.5, lag: 201, lastContact: '8h ago', mau: 8200, adoptionRate: 92 },
    { subscriberId: 'hdfc', subscriberName: 'HDFC', nsm: '150K', health: 99.20, errorRate: 4.5, lag: 1500, lastContact: '3d ago', mau: 500, adoptionRate: 60 },
    { subscriberId: 'jenius_bank', subscriberName: 'Jenius Bank', nsm: '890K', health: 99.98, errorRate: 0.2, lag: 5, lastContact: '5d ago', mau: 2500, adoptionRate: 75 },
    { subscriberId: 'lakestack', subscriberName: 'Lakestack', nsm: '500K', health: 99.90, errorRate: 0.8, lag: 50, lastContact: '6h ago', mau: 1200, adoptionRate: 55 },
    { subscriberId: 'itp', subscriberName: 'ITP', nsm: '1.5M', health: 99.97, errorRate: 0.3, lag: 15, lastContact: '10h ago', mau: 4500, adoptionRate: 88 },
    { subscriberId: 'tachyon_credit', subscriberName: 'Tachyon Credit', nsm: '720K', health: 98.50, errorRate: 2.5, lag: 1200, lastContact: '2d ago', mau: 1800, adoptionRate: 35 },
];

export const getSubscribersMetrics = (subscribers: Subscriber[] = [], zones: Zone[] = []): SubscriberMetric[] => {
    const isAllSubscribers = !subscribers || subscribers.length === 0 || subscribers.some(t => t.id === 'all');
    const isAllZones = !zones || zones.length === 0 || zones.some(z => z.id === 'all');
    
    let filteredMetrics = ALL_SUBSCRIBER_METRICS;

    if (!isAllZones) {
        const selectedZoneIds = zones.map(z => z.id);
        const subscriberIdsInZones = SUBSCRIBERS.filter(t => selectedZoneIds.includes(t.zoneId)).map(t => t.id);
        filteredMetrics = filteredMetrics.filter(metric => subscriberIdsInZones.includes(metric.subscriberId));
    }
    
    if (!isAllSubscribers) {
        const selectedSubscriberIds = subscribers.map(t => t.id);
        filteredMetrics = filteredMetrics.filter(metric => selectedSubscriberIds.includes(metric.subscriberId));
    }
    
    return filteredMetrics;
};


export const getBatchJobSummary = (subscribers: Subscriber[] = [], zones: Zone[] = [], timeRange: TimeRange): BatchJobSummary => {
    const filterFactor = getFilterFactor(subscribers, zones);
    const timeFactor = getTimeRangeFactor(timeRange);
    const factor = filterFactor * timeFactor;

    const jobsRun = Math.round(508 * factor * 30); // Base value from screenshot
    const jobsFailed = Math.round(78 / (filterFactor || 0.1) * timeFactor); // Prevent division by zero, make failures more pronounced
    const jobsSucceeded = jobsRun > jobsFailed ? jobsRun - jobsFailed : 0;
    
    return {
        jobsRun: jobsRun,
        jobsFailed: jobsFailed,
        recordsProcessed: Math.round(3456789 * factor),
        recordsProcessedChange: `+${(3.1 * filterFactor).toFixed(1)}%`,
        jobsSucceeded: jobsSucceeded,
        jobsRunChange: `+2.0%`,
        jobsFailedChange: `-${(5 * filterFactor).toFixed(1)}%`,
        jobsSucceededChange: `+${(2.2 * filterFactor).toFixed(1)}%`,
        filesProcessed: Math.round(47 * factor * 30),
        filesProcessedChange: `+5.8%`,
    }
};

export const getLatencyDistributionData = (subscribers: Subscriber[] = [], zones: Zone[] = []): LatencyData[] => {
    const factor = getFilterFactor(subscribers, zones);
    const data = [
        { name: '0-200ms', count: 1890 },
        { name: '200-500ms', count: 2340 },
        { name: '500-1s', count: 1230 },
        { name: '1-2s', count: 450 },
        { name: '2s+', count: 120 },
    ];
    return data.map(d => ({ ...d, count: Math.round(d.count * factor)}));
};

export const getTracesData = (subscribers: Subscriber[] = [], zones: Zone[] = []): TraceEntry[] => {
    // Note: Trace data isn't directly tied to subscriber in this mock, so we just return all
    return [
    { traceId: 'a1b2c3d4', rootService: 'file-ingress', rootOperation: 'upload', duration: '1.2s', spanCount: 15, timestamp: '10:00:01Z', status: 'error'},
    { traceId: 'e5f6g7h8', rootService: 'file-processor', rootOperation: 'process-csv', duration: '5.6s', spanCount: 45, timestamp: '10:00:05Z', status: 'ok'},
    { traceId: 'i9j0k1l2', rootService: 'file-processor', rootOperation: 'process-csv', duration: '8.1s', spanCount: 52, timestamp: '10:01:10Z', status: 'ok'},
    { traceId: 'm3n4o5p6', rootService: 'file-ingress', rootOperation: 'upload', duration: '200ms', spanCount: 8, timestamp: '10:01:15Z', status: 'error'},
    { traceId: 'q7r8s9t0', rootService: 'file-egress', rootOperation: 'send-report', duration: '3.4s', spanCount: 22, timestamp: '10:02:00Z', status: 'ok'},
]};

export const getDiaModuleMetrics = (subscribers: Subscriber[] = [], zones: Zone[] = [], timeRange: TimeRange): ModuleMetric[] => {
    const filterFactor = getFilterFactor(subscribers, zones);
    const timeFactor = getTimeRangeFactor(timeRange);
    const factor = filterFactor * timeFactor;
    return [
        { id: 'dia_downloads', name: 'File Downloads', value: formatNumber(900000 * factor), status: 'green', description: 'Total files downloaded by the DIA module.', change: `+${(4.8 * filterFactor).toFixed(1)}%` },
        { id: 'dia_uploads', name: 'File Uploads', value: formatNumber(300000 * factor), status: 'green', description: 'Total files uploaded by the DIA module.', change: `+${(6.1 * filterFactor).toFixed(1)}%` },
        { id: 'dia_error_rate', name: 'Error Rate', value: '0.85%', status: 'amber', description: 'Percentage of failed transfers within the DIA module.', change: '+15.0%' },
        { id: 'dia_latency', name: 'Avg Latency', value: `1.2s`, status: 'amber', description: 'Average file transfer latency for the DIA module.', change: `+12.1%` },
]};

export const getPerseusDashboardKpis = (subscribers: Subscriber[] = [], zones: Zone[] = [], timeRange: TimeRange): KpiData[] => {
    const fileKpis = getFileAppKpis(subscribers, zones, timeRange);
    const filterFactor = getFilterFactor(subscribers, zones);
    return [
        {...fileKpis[0], id: 'perseus_mjr_dash', title: 'Perseus Job Runs', value: '4.5M'},
        {...fileKpis[1], id: 'perseus_health_dash', title: 'Perseus Health', value: '99.99%'},
        {...fileKpis[2], id: 'perseus_error_dash', title: 'Perseus Error Rate', value: '0.21%'},
        {
            ...fileKpis[3],
            id: 'perseus_records_dash', 
            title: 'Records Processed', 
            value: '1.2B', 
            change: `+${(10.1 * filterFactor).toFixed(1)}%`,
            changeType: 'increase',
            status: 'green',
            description: 'Total number of individual records processed by all jobs in the Perseus module.'
        },
    ];
};

export const getPerseusModuleMetrics = (subscribers: Subscriber[] = [], zones: Zone[] = [], timeRange: TimeRange): ModuleMetric[] => {
    const filterFactor = getFilterFactor(subscribers, zones);
    const timeFactor = getTimeRangeFactor(timeRange);
    const factor = filterFactor * timeFactor;
    return [
    { id: 'perseus_mjr', name: 'Job Runs', value: `${(4.5 * factor * 30).toFixed(1)}M`, status: 'green', description: 'Total number of batch jobs executed by the Perseus module.', change: `+${(8.2 * filterFactor).toFixed(1)}%` },
    { id: 'perseus_records', name: 'Records Processed', value: `${(1.2 * factor * 30).toFixed(1)}B`, status: 'green', description: 'Total number of individual records processed by all jobs in the Perseus module.', change: `+${(10.1 * filterFactor).toFixed(1)}%` },
    { id: 'perseus_health', name: 'Health', value: '99.99%', status: 'green', description: 'Uptime of the Perseus job processing engine.', change: '+0.00%' },
    { id: 'perseus_error_rate', name: 'Error Rate', value: '0.21%', status: 'green', description: 'Percentage of jobs that failed to complete successfully.', change: '-2.0%' },
]};

export const getPerseusCategorizedMetrics = (subscribers: Subscriber[] = [], zones: Zone[] = [], timeRange: TimeRange): PerseusCategorizedMetrics => {
    const filterFactor = getFilterFactor(subscribers, zones);
    const timeFactor = getTimeRangeFactor(timeRange);
    const factor = filterFactor * timeFactor;

    return {
        health: [
            { id: 'perseus_uptime', name: 'Uptime Percentage', value: `${(99.99 - (1-filterFactor) * 0.05).toFixed(4)}%`, status: 'green', description: 'Measures the availability of Perseus by tracking the percentage of time the service is available. Target: 99.99%.' },
            { id: 'perseus_error_rate_detail', name: 'Error Rate', value: `${(0.21 / (filterFactor || 0.5)).toFixed(2)}%`, status: 'green', description: 'Tracks the percentage of records that fail to process due to system errors, indicating reliability and stability.' },
        ],
        performance: [
            { id: 'perseus_throughput', name: 'Throughput (RPS)', value: `${formatNumber(Math.round(2000 * filterFactor))}`, status: 'neutral', description: 'The number of records processed by Perseus per second (RPS), indicating the system\'s capacity to handle large volumes of data efficiently.' },
        ],
        business: [
            { id: 'perseus_mcc', name: 'Monthly Cluster Cost (MCC)', value: `$${formatNumber(Math.round(15234 * filterFactor * timeFactor * 30))}`, status: 'neutral', description: 'Total sum of compute, storage & network cost per month for the Perseus module.' },
            { id: 'perseus_cost_per_record', name: 'Cost per Processed Record', value: `$${(0.00012 / (filterFactor || 0.5)).toFixed(5)}`, status: 'neutral', description: 'The cost associated with processing a single record, helping to measure the platform\'s cost-efficiency.' },
        ],
        featureUsage: [
            { id: 'perseus_operator_usage', name: 'Operator Usage', value: `${formatNumber(Math.round(125 * filterFactor))}`, status: 'neutral', description: 'The number of new operator instances integrated with Perseus, indicating its growing adoption within the ecosystem.' },
        ]
    };
};

export const getAtroposDashboardKpis = (subscribers: Subscriber[] = [], zones: Zone[] = [], timeRange: TimeRange): KpiData[] => {
    const msgKpis = getMessageAppKpis(subscribers, zones, timeRange);
    const fileKpis = getFileAppKpis(subscribers, zones, timeRange);
    return [
        {...msgKpis[0], id: 'atropos_events_dash', title: 'Atropos Events Published', value: '25.4M'},
        {...msgKpis[1], id: 'atropos_health_dash', title: 'Atropos Health', value: '99.91%', status: 'amber'},
        {...fileKpis[3], id: 'atropos_css_dash', title: 'Customer Satisfaction', value: '4.8/5', change: '+0.1', changeType: 'increase', status: 'green', description: 'Quarterly customer satisfaction score.'},
    ];
};

export const getAtroposModuleMetrics = (subscribers: Subscriber[] = [], zones: Zone[] = [], timeRange: TimeRange): ModuleMetric[] => {
    const filterFactor = getFilterFactor(subscribers, zones);
    const timeFactor = getTimeRangeFactor(timeRange);
    const factor = filterFactor * timeFactor;
    return [
    { id: 'atropos_css', name: 'CSS', value: '4.8/5', status: 'green', description: 'Customer Satisfaction Score (Quarterly). A measure of customer happiness with the message application features.', change: '+0.1' },
    { id: 'atropos_events', name: 'Events Published', value: `${(25.4 * factor * 30).toFixed(1)}M`, status: 'green', description: 'Total number of events published via the Atropos module.', change: `+${(12.3 * filterFactor).toFixed(1)}%` },
    { id: 'atropos_latency', name: 'p99 Latency', value: `${(950 * (1 / filterFactor)).toFixed(0)}ms`, status: 'amber', description: '99th percentile publish latency for the Atropos module.', change: `+${(8.5 * (1/filterFactor)).toFixed(1)}%` },
]};

export const getDrilldownData = (metricId: string, metricTitle: string, subscribers: Subscriber[] = [], zones: Zone[] = []): DrilldownData => {
    const factor = getFilterFactor(subscribers, zones);
    let contributors: TopContributor[];
    let contributorTitle: string;
    let modalTitle: string;

    const isSingleSubscriber = subscribers.length === 1 && subscribers[0].id !== 'all';

    if (isSingleSubscriber) {
        const selectedSubscriber = subscribers[0];
        const subscriberMetrics = ALL_SUBSCRIBER_METRICS.find(m => m.subscriberId === selectedSubscriber.id) || { nsm: 'N/A', errorRate: 0, health: 100, lag: 0 };

        // The `TopContributor` type is repurposed here to show key-value pairs for a single subscriber.
        contributors = [
            { name: 'NSM (MFT/Events)', value: subscriberMetrics.nsm, change: '' },
            { name: 'Health', value: `${subscriberMetrics.health.toFixed(2)}%`, change: subscriberMetrics.health < 99.9 ? 'Needs Attention' : 'Healthy' },
            { name: 'Error Rate', value: `${subscriberMetrics.errorRate.toFixed(2)}%`, change: subscriberMetrics.errorRate > 1 ? 'High' : 'Normal' },
            { name: 'Queue Lag', value: `${subscriberMetrics.lag} items`, change: subscriberMetrics.lag > 500 ? 'High' : 'Normal' },
            { name: 'Top Failure Reason', value: getTopFailureReasons(subscribers, zones)[0]?.reason || 'N/A', change: '' }
        ];
        contributorTitle = `Key Metrics for ${selectedSubscriber.name}`;
        modalTitle = `${metricTitle} - ${selectedSubscriber.name}`;
    } else {
        // Existing logic for "All Subscribers" or multi-select
        contributors = [
            { name: 'HDFC', value: `${(350 * factor).toFixed(0)}K`, change: '+15.2%' },
            { name: 'Optum', value: `${(280 * factor).toFixed(0)}K`, change: '-2.1%' },
            { name: 'Cardworks', value: `${(150 * factor).toFixed(0)}K`, change: '+5.8%' },
            { name: 'Jenius Bank', value: `${(120 * factor).toFixed(0)}K`, change: '+8.0%' },
            { name: 'Sparrow', value: `${(80 * factor).toFixed(0)}K`, change: '-10.5%' },
            { name: 'Lakestack', value: `${(95 * factor).toFixed(0)}K`, change: '+3.2%' },
            { name: 'ITP', value: `${(400 * factor).toFixed(0)}K`, change: '+1.1%' },
            { name: 'Tachyon Credit', value: `${(110 * factor).toFixed(0)}K`, change: '-5.3%' },
        ].sort(() => Math.random() - 0.5).slice(0, 5); // Keep list tidy
        contributorTitle = 'Top Contributing Subscribers';
        modalTitle = `${metricTitle} - Details`;
    }

    return {
        metricId: metricId,
        metricTitle: modalTitle,
        trendData: getTrendData(metricTitle, subscribers, zones, TimeRange.LAST_30D), // Drilldown always shows 30d
        contributors,
        logs: getLogs(subscribers, zones).filter(log => !isSingleSubscriber || log.subscriber === subscribers[0]?.name).slice(0, 3),
        contributorTitle: contributorTitle,
    }
};

export const getAlertableMetrics = (): AlertableMetric[] => [
    { id: 'file_downloads', name: 'File App: File Downloads', unit: 'count' },
    { id: 'file_uploads', name: 'File App: File Uploads', unit: 'count' },
    { id: 'health', name: 'File App: Health', unit: 'percent' },
    { id: 'error_rate', name: 'File App: Error Rate', unit: 'percent' },
    { id: 'avg_latency', name: 'File App: Avg Latency', unit: 'seconds' },
    { id: 'throughput', name: 'File App: Throughput', unit: 'mbs' },
    { id: 'events_published', name: 'Message App: Events Published', unit: 'count' },
    { id: 'health_msg', name: 'Message App: Health', unit: 'percent' },
    { id: 'error_rate_msg', name: 'Message App: Error Rate', unit: 'percent' },
    { id: 'p99_latency', name: 'Message App: p99 Latency', unit: 'seconds' },
    { id: 'throughput_msg', name: 'Message App: Throughput', unit: 'k_events_s' },
];

export const getExistingAlerts = (): AlertRule[] => [
    {
        id: '1',
        name: 'High File App Error Rate',
        metricId: 'error_rate',
        condition: AlertCondition.ABOVE,
        threshold: 5,
        duration: 5,
        actions: [AlertAction.PAGERDUTY, AlertAction.SLACK],
        isEnabled: true,
    },
    {
        id: '2',
        name: 'File App Uptime Degradation',
        metricId: 'health',
        condition: AlertCondition.BELOW,
        threshold: 99.9,
        duration: 10,
        actions: [AlertAction.EMAIL, AlertAction.SLACK],
        isEnabled: true,
    },
    {
        id: '3',
        name: 'Message App Throughput Anomaly',
        metricId: 'throughput_msg',
        condition: AlertCondition.ANOMALY,
        threshold: 0,
        duration: 15,
        actions: [AlertAction.WIN_TASK],
        isEnabled: false,
    }
];

const ALL_JOB_RUNS: JobRun[] = [
    { id: 'job_run_1', name: 'daily-report-cardworks', subscriberName: 'Cardworks', startTime: '2023-10-27T09:00:00Z', duration: '5m 12s', status: 'succeeded' },
    { id: 'job_run_2', name: 'data-ingest-hdfc', subscriberName: 'HDFC', startTime: '2023-10-27T08:45:10Z', duration: '1m 5s', status: 'failed', failureReason: 'Upstream service timeout' },
    { id: 'job_run_3', name: 'file-cleanup-optum', subscriberName: 'Optum', startTime: '2023-10-27T08:30:00Z', duration: '12m 30s', status: 'succeeded' },
    { id: 'job_run_4', name: 'data-archive-sparrow', subscriberName: 'Sparrow', startTime: '2023-10-27T08:15:20Z', duration: '2m 15s', status: 'failed', failureReason: 'Schema validation failed' },
    { id: 'job_run_5', name: 'daily-report-jenius', subscriberName: 'Jenius Bank', startTime: '2023-10-27T08:00:00Z', duration: '4m 55s', status: 'succeeded' },
    { id: 'job_run_6', name: 'data-ingest-lakestack', subscriberName: 'Lakestack', startTime: '2023-10-27T07:45:00Z', duration: '8m 10s', status: 'succeeded' },
    { id: 'job_run_7', name: 'file-cleanup-itp', subscriberName: 'ITP', startTime: '2023-10-27T07:30:00Z', duration: '10m 5s', status: 'succeeded' },
    { id: 'job_run_8', name: 'data-archive-tachyon', subscriberName: 'Tachyon Credit', startTime: '2023-10-27T07:15:00Z', duration: '3m 0s', status: 'failed', failureReason: 'Authentication error (401)' },
    { id: 'job_run_9', name: 'daily-report-optum', subscriberName: 'Optum', startTime: '2023-10-27T07:00:00Z', duration: '6m 20s', status: 'succeeded' },
    { id: 'job_run_10', name: 'data-ingest-cardworks', subscriberName: 'Cardworks', startTime: '2023-10-27T06:45:00Z', duration: '9m 45s', status: 'succeeded' },
];

export const getJobRuns = (subscribers: Subscriber[] = [], zones: Zone[] = [], status: 'succeeded' | 'failed', failureReason?: string): JobRun[] => {
    const isAllSubscribers = !subscribers || subscribers.length === 0 || subscribers.some(t => t.id === 'all');
    
    // If a failure reason is provided, we must be looking for failed jobs.
    const effectiveStatus = failureReason ? 'failed' : status;

    let filteredRuns = ALL_JOB_RUNS.filter(run => run.status === effectiveStatus);

    if (failureReason) {
        filteredRuns = filteredRuns.filter(run => run.failureReason === failureReason);
    }

    if (!isAllSubscribers) {
        const selectedSubscriberNames = subscribers.map(t => t.name);
        filteredRuns = filteredRuns.filter(run => selectedSubscriberNames.includes(run.subscriberName));
    }
    
    return filteredRuns;
};

// --- T-Sheet Data for Message Application ---

export const MESSAGE_APP_TIME_BASED_TSHEET_METRICS: TSheetMetric[] = [
    { key: 'group_topics', label: 'Topics & Messages', isGroupHeader: true, isGroupSeparator: false, color: 'bg-brand-blue/20' },
    { key: 'topics', label: 'Number of topics created', isGroupSeparator: false },
    { key: 'msgPublished', label: 'Number of Message Published', isGroupSeparator: false },
    
    { key: 'group_subs', label: 'Subscriptions', isGroupHeader: true, isGroupSeparator: true, color: 'bg-brand-purple/20' },
    { key: 'subscriptions', label: 'Number of subscriptions created', isGroupSeparator: false },
    { key: 'msgProcessedBySub', label: 'Number of Messages Processed By Subscriptions', isGroupSeparator: false },
    { key: 'msgConsumedBySub', label: 'Number of Messages Consumed By Subscriptions', isGroupSeparator: false },
    
    { key: 'group_apps', label: 'Message Applications', isGroupHeader: true, isGroupSeparator: true, color: 'bg-status-green/20' },
    { key: 'msgApps', label: 'Number of Message Apps created', isGroupSeparator: false },
    { key: 'msgProcessedByApp', label: 'Number of Messages Processed By Message Applications', isGroupSeparator: false },
    { key: 'msgConsumedByApp', label: 'Number of Messages Consumed By Message Applications', isGroupSeparator: false },

    { key: 'group_schedules', label: 'Schedules', isGroupHeader: true, isGroupSeparator: true, color: 'bg-status-amber/20' },
    { key: 'schedulesCreated', label: 'Number of Schedules created', isGroupSeparator: false },
    { key: 'schedulesTriggered', label: 'Number of Schedules triggered', isGroupSeparator: false },
];

export const getMessageAppTimeBasedTSheetData = (selectedSubscribers: Subscriber[] = [], selectedZones: Zone[] = []): { metrics: TSheetMetric[]; data: TSheetData; timeRanges: string[] } => {
    const today = new Date().toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' });
    const tillDateHeader = `Till Date (${today})`;
    
    const timeBasedTSheetData: TSheetData = {
        'Last 1 hour':    { topics: '1', msgPublished: '700', subscriptions: '5', msgProcessedBySub: '25K', msgConsumedBySub: '1K', msgApps: '4K', msgProcessedByApp: '1K', msgConsumedByApp: '1K', schedulesCreated: '1', schedulesTriggered: '15' },
        'Last 24 h':   { topics: '2', msgPublished: '10.0K', subscriptions: '20', msgProcessedBySub: '80K', msgConsumedBySub: '5K', msgApps: '15K', msgProcessedByApp: '10K', msgConsumedByApp: '12K', schedulesCreated: '6', schedulesTriggered: '45' },
        'Last 7 days':  { topics: '5', msgPublished: '35.0K', subscriptions: '80', msgProcessedBySub: '260K', msgConsumedBySub: '20K', msgApps: '50K', msgProcessedByApp: '40K', msgConsumedByApp: '55K', schedulesCreated: '5', schedulesTriggered: '120' },
        'Last 30 days': { topics: '8', msgPublished: '40.0K', subscriptions: '120', msgProcessedBySub: '300K', msgConsumedBySub: '25K', msgApps: '60K', msgProcessedByApp: '50K', msgConsumedByApp: '70K', schedulesCreated: '15', schedulesTriggered: '170' },
        [tillDateHeader]: { topics: '10', msgPublished: '42.5K', subscriptions: '125', msgProcessedBySub: '310K', msgConsumedBySub: '26K', msgApps: '62K', msgProcessedByApp: '52K', msgConsumedByApp: '73K', schedulesCreated: '16', schedulesTriggered: '175' }
    };
    
    const timeRangesForTSheet = ['Last 1 hour', 'Last 24 h', 'Last 7 days', 'Last 30 days', tillDateHeader];

    return {
        metrics: MESSAGE_APP_TIME_BASED_TSHEET_METRICS,
        data: timeBasedTSheetData,
        timeRanges: timeRangesForTSheet,
    };
};

// --- T-Sheet Data for File Application ---

export const FILE_APP_TIME_BASED_TSHEET_METRICS: TSheetMetric[] = [
    { key: 'group_apps', label: 'File Applications & Transfers', isGroupHeader: true, isGroupSeparator: false, color: 'bg-brand-blue/20' },
    { key: 'numFileApps', label: 'Number of File Applications Created', isGroupSeparator: false },
    { key: 'filesProcessed', label: 'No of files processed', isGroupSeparator: false },
    { key: 'totalUploads', label: 'Total File Uploads', isGroupSeparator: false },
    { key: 'totalDownloads', label: 'Total File Downloads', isGroupSeparator: false },

    { key: 'group_performance', label: 'Performance & Health', isGroupHeader: true, isGroupSeparator: true, color: 'bg-status-amber/20' },
    { key: 'jobRuns', label: 'Job Runs', isGroupSeparator: false },
    { key: 'errorRate', label: 'Error Rate', isGroupSeparator: false },
    { key: 'avgLatency', label: 'Avg Transfer Latency', isGroupSeparator: false },
];

export const getFileAppTimeBasedTSheetData = (selectedSubscribers: Subscriber[] = [], selectedZones: Zone[] = []): { metrics: TSheetMetric[]; data: TSheetData; timeRanges: string[] } => {
    const today = new Date().toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' });
    const tillDateHeader = `Till Date (${today})`;
    
    const timeBasedTSheetData: TSheetData = {
        'Last 1 hour': { numFileApps: '1', filesProcessed: '1.0K', totalDownloads: '45K', totalUploads: '3K', jobRuns: '6K', errorRate: '0.85%', avgLatency: '1.2 s' },
        'Last 24 h': { numFileApps: '3', filesProcessed: '20.0K', totalDownloads: '150K', totalUploads: '9K', jobRuns: '22K', errorRate: '0.95%', avgLatency: '1.3 s' },
        'Last 7 days': { numFileApps: '8', filesProcessed: '60.0K', totalDownloads: '509K', totalUploads: '35K', jobRuns: '75K', errorRate: '1.02%', avgLatency: '1.5 s' },
        'Last 30 days': { numFileApps: '12', filesProcessed: '90.0K', totalDownloads: '610K', totalUploads: '40K', jobRuns: '90K', errorRate: '0.96%', avgLatency: '1.4 s' },
        [tillDateHeader]: { numFileApps: '13', filesProcessed: '92.5K', totalDownloads: '625K', totalUploads: '41K', jobRuns: '94K', errorRate: '0.94%', avgLatency: '1.4 s' }
    };
    
    const timeRangesForTSheet = ['Last 1 hour', 'Last 24 h', 'Last 7 days', 'Last 30 days', tillDateHeader];

    return {
        metrics: FILE_APP_TIME_BASED_TSHEET_METRICS,
        data: timeBasedTSheetData,
        timeRanges: timeRangesForTSheet,
    };
};

export const getFeatureAdoptionData = (subscribers: Subscriber[] = [], zones: Zone[] = [], timeRange: TimeRange): FeatureAdoption[] => {
    const factor = getFilterFactor(subscribers, zones);
    const baseData = [
        { name: 'Batch Processing (Perseus)', adoption: 92, description: 'Usage of scheduled, large-scale data processing jobs.' },
        { name: 'Real-time Event Streaming (Atropos)', adoption: 78, description: 'Publishing and subscribing to topics for real-time data flow.' },
        { name: 'Scheduled Jobs (Atropos)', adoption: 45, description: 'Creating automated, time-based triggers for events.' },
        { name: 'File Validation Workflows (DIA)', adoption: 85, description: 'Using built-in validation rules during file transfers.' },
        { name: 'Custom Connectors', adoption: 35, description: 'Development and deployment of custom connectors for bespoke integrations.' },
    ];

    // Simulate lower adoption for specific subscribers/zones
    return baseData.map(feature => ({
        ...feature,
        adoption: Math.max(10, Math.min(100, Math.round(feature.adoption * factor))),
        change: (Math.random() - 0.4) * 5 * getTimeRangeFactor(timeRange) * 30, // random change
    })).sort((a,b) => b.adoption - a.adoption);
};

export const getTriggeredAlerts = (): TriggeredAlert[] => {
    const now = new Date();
    return [
        {
            id: 'alert_1',
            title: 'High Error Rate (>5%)',
            severity: 'red',
            timestamp: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
            isRead: false,
            subscriberId: 'sparrow',
            subscriberName: 'Sparrow'
        },
        {
            id: 'alert_2',
            title: 'High Latency (>1.5s)',
            severity: 'amber',
            timestamp: new Date(now.getTime() - 22 * 60 * 1000).toISOString(),
            isRead: false,
            subscriberId: 'hdfc',
            subscriberName: 'HDFC'
        },
        {
            id: 'alert_3',
            title: 'Uptime Degradation (<99.9%)',
            severity: 'amber',
            timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
            isRead: true,
            subscriberId: 'cardworks',
            subscriberName: 'Cardworks'
        },
        {
            id: 'alert_4',
            title: 'Queue Lag > 1000 items',
            severity: 'red',
            timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
            isRead: true,
            subscriberId: 'tachyon_credit',
            subscriberName: 'Tachyon Credit'
        }
    ];
};

export const getDiaNorthStarKpis = (subscribers: Subscriber[] = [], zones: Zone[] = []): DiaNsmKpi[] => {
  const filterFactor = getFilterFactor(subscribers, zones);
  return [
    {
      id: 'file_downloads_nsm',
      title: 'File Downloads',
      value: (915400 * filterFactor).toLocaleString('en-US', { maximumFractionDigits: 0 }),
      change: `+${(2.2 * filterFactor).toFixed(1)}% vs last month`,
      changeType: 'increase',
    },
    {
      id: 'file_uploads_nsm',
      title: 'File Uploads',
      value: (300000 * filterFactor).toLocaleString('en-US', { maximumFractionDigits: 0 }),
      change: `+${(3.1 * filterFactor).toFixed(1)}% vs last month`,
      changeType: 'increase',
    },
    {
      id: 'active_users_nsm',
      title: 'Active Users',
      value: (124 * filterFactor).toLocaleString('en-US', { maximumFractionDigits: 0 }),
      change: `+${(2.5 * filterFactor).toFixed(1)}% vs last month`,
      changeType: 'increase',
    },
  ];
}

export const getDiaSupplementaryData = (subscribers: Subscriber[] = [], zones: Zone[] = []): DiaSupplementaryData => {
  const filterFactor = getFilterFactor(subscribers, zones);
  const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  
  return {
    yearlyUptime: months.map(m => ({ name: m, value: (99.5 + (Math.random() - 0.5) * 0.3) * filterFactor })),
    errorRate: months.map(m => ({ name: m, value: (5 + (Math.random() - 0.7) * 4) * (1/filterFactor) })),
    avgTransferSpeed: months.map(m => ({ name: m, value: (126 + (Math.random() - 0.5) * 50) * filterFactor })),
    transferLatency: months.map(m => ({ name: m, value: (0.9 + (Math.random() - 0.5) * 0.5) * (1/filterFactor) })),
    monthlyClusterCost: {
      data: months.map(m => ({
        name: m,
        'ZONE AUTH': (20 + Math.random() * 10) * filterFactor,
        'AURA': (15 + Math.random() * 10) * filterFactor,
        'HADES': (25 + Math.random() * 15) * filterFactor,
        'ZONE PROD': (10 + Math.random() * 5) * filterFactor,
        'ZONE TRAFFIC': (5 + Math.random() * 5) * filterFactor,
        'OTHERS': (10 + Math.random() * 8) * filterFactor,
      })),
      keys: [
        { key: 'ZONE AUTH', color: '#F59E0B' },
        { key: 'AURA', color: '#EF4444' },
        { key: 'HADES', color: '#3B82F6' },
        { key: 'ZONE PROD', color: '#10B981' },
        { key: 'ZONE TRAFFIC', color: '#8B5CF6' },
        { key: 'OTHERS', color: '#6B7280' },
      ],
    },
  };
};

export const MOCK_TOPICS: Topic[] = [
    { id: 'topic_1', name: '_tenant_1_bot-evaluation.switch-authorization' },
    { id: 'topic_2', name: 'tenant_2_user-profile-updates.v1' },
    { id: 'topic_3', name: 'global.payment-gateway.events' },
];

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
    { id: 'sub_1', name: 'subscription_1_RESOURCE_PAYMENT_UPDATED_V3' },
    { id: 'sub_2', name: 'subscription_2_AUDIT_LOG_PROCESSOR' },
    { id: 'sub_3', name: 'subscription_3_NOTIFICATION_SERVICE_V2' },
];

export const getTopics = (): Topic[] => MOCK_TOPICS;
export const getSubscriptions = (): Subscription[] => MOCK_SUBSCRIPTIONS;

export const getTopicMetrics = (topicId: string, subscribers: Subscriber[] = [], zones: Zone[] = []): TopicMetrics => {
    const factor = getFilterFactor(subscribers, zones);
    const topic = MOCK_TOPICS.find(t => t.id === topicId) || MOCK_TOPICS[0];
    
    let seed = topicId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seededRandom = () => {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }
    
    const generateRedMetrics = (): RedChartDataPoint[] => {
        return Array.from({ length: 20 }, (_, i) => {
            const date = new Date();
            date.setMinutes(date.getMinutes() - (20 - i) * 1);
            return {
                time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                success: Math.floor((600 + seededRandom() * 100) * factor),
                failed: Math.floor((2 + seededRandom() * 15) * (1/factor)),
                avgLatency: Math.floor(400 + seededRandom() * 300),
            };
        });
    };

    return {
        id: topicId,
        name: topic.name,
        latencySlo: { name: 'Latency', value: `${(99.5 + seededRandom() * 0.5).toFixed(2)}%`, status: 'green' },
        redMetrics: generateRedMetrics(),
        messageMetrics: {
            delayedEvents: { name: 'Delayed Events', value: `${Math.floor(seededRandom() * 5)}`, status: 'green' },
            p95Latency: { name: 'Latency P95', value: `${(1.2 + seededRandom() * 0.5).toFixed(2)}s`, status: seededRandom() > 0.5 ? 'amber' : 'green' },
            p99Latency: { name: 'Latency P99', value: `${(1.8 + seededRandom() * 0.5).toFixed(2)}s`, status: seededRandom() > 0.3 ? 'red' : 'amber' },
        }
    }
};

export const getSubscriptionMetrics = (subscriptionId: string, subscribers: Subscriber[] = [], zones: Zone[] = []): SubscriptionMetrics => {
    const factor = getFilterFactor(subscribers, zones);
    const subscription = MOCK_SUBSCRIPTIONS.find(s => s.id === subscriptionId) || MOCK_SUBSCRIPTIONS[0];
    
    let seed = subscriptionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seededRandom = () => {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }

    const generateRedMetrics = (): RedChartDataPoint[] => {
        return Array.from({ length: 20 }, (_, i) => {
            const date = new Date();
            date.setMinutes(date.getMinutes() - (20 - i) * 1);
            return {
                time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                success: Math.floor((1400 + seededRandom() * 300) * factor),
                filtered: Math.floor((150 + seededRandom() * 100) * factor),
                avgLatency: Math.floor(15 + seededRandom() * 15),
            };
        });
    };

    return {
        id: subscriptionId,
        name: subscription.name,
        slos: [
            { name: 'Pipeline Availability', value: `${(99.9 + seededRandom() * 0.1).toFixed(2)}%`, status: 'green' },
            { name: 'Subscriber Availability', value: `${(99.9 + seededRandom() * 0.1).toFixed(2)}%`, status: 'green' },
            { name: 'Subscriber Latency', value: `${(20 + seededRandom() * 10).toFixed(2)}ms`, status: 'green' },
            { name: 'Pipeline Latency', value: `${(0.7 + seededRandom() * 0.3).toFixed(2)}ms`, status: 'green' },
            { name: 'Queue Depth', value: `${Math.floor(seededRandom() * 50)}`, status: 'green' },
        ],
        redMetrics: generateRedMetrics(),
        queueDepthMetrics: Array.from({ length: 20 }, (_, i) => ({
            time: `${23}:${30 + i}`,
            value: Math.floor(10 + seededRandom() * 80)
        })),
        dlqDepth: { name: 'DLQ Depth', value: seededRandom() > 0.9 ? `${Math.floor(seededRandom()*5)}` : '-', status: 'neutral' },
        dlqAge: { name: 'DLQ Age', value: '-', status: 'neutral' },
        messageMetrics: {
            totalEvents: { name: 'Total Events', value: (50000 * (0.8 + seededRandom() * 0.4) * factor).toLocaleString('en-US', { maximumFractionDigits: 0 }), status: 'neutral' },
            filteredEvents: { name: 'Filtered Out Events', value: (45000 * (0.8 + seededRandom() * 0.4) * factor).toLocaleString('en-US', { maximumFractionDigits: 0 }), status: 'neutral' },
            droppedEvents: { name: 'Dropped Events', value: '-', status: 'neutral' },
            successEvents: { name: 'Success Events', value: (5000 * (0.8 + seededRandom() * 0.4) * factor).toLocaleString('en-US', { maximumFractionDigits: 0 }), status: 'green' },
        }
    }
};

export const getTasks = (): Task[] => {
    return [
        { key: 'ABHI-1', summary: 'test', reporter: 'Abhijit Kumar Bhowmick', assignee: 'Unassigned', status: 'OPEN', created: '03/Sep/25', due: '10/Sep/25' },
        { key: 'TASK-123', summary: 'Fix login button alignment', reporter: 'Jane Doe', assignee: 'John Smith', status: 'IN_PROGRESS', created: '01/Sep/25', due: '05/Sep/25' },
        { key: 'TASK-122', summary: 'Deploy new feature to production', reporter: 'Admin', assignee: 'Jane Doe', status: 'OPEN', created: '30/Aug/25', due: '08/Sep/25' },
        { key: 'TASK-121', summary: 'Update documentation for API v2', reporter: 'John Smith', assignee: 'Unassigned', status: 'DONE', created: '25/Aug/25', due: '30/Aug/25' },
    ];
};
