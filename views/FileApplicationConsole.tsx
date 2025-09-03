import React, { useState } from 'react';
import KpiCard from '../components/KpiCard';
import TrendChart, { HistogramChart } from '../components/charts/TrendChart';
import { getFileAppKpis, getTrendData, getTopFailureReasons, getLogs, getSubscribersMetrics, getBatchJobSummary, getLatencyDistributionData, getTracesData, getDiaModuleMetrics, getPerseusModuleMetrics, getFileAppTimeBasedTSheetData } from '../data/mockData';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, ArrowUpRightIcon } from '../components/icons';
import { FailureReason, TSheetMetric, View } from '../types';
import ModuleStatusCard from '../components/ModuleStatusCard';
import { useDashboard } from '../contexts/DashboardContext';
import { useView } from '../contexts/ViewContext';
import { useJobRuns } from '../contexts/JobRunsContext';
import TSheet from '../components/TSheet';
import { SUBSCRIBERS } from '../constants';

const MetricWithChange = ({ value, label, change, positiveIsGood }: { value: string, label: string, change: string, positiveIsGood: boolean }) => {
    const isPositive = change.startsWith('+');
    const changeColor = (isPositive && positiveIsGood) || (!isPositive && !positiveIsGood) ? 'text-status-green' : 'text-status-red';
    return (
        <div className="text-center p-2">
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{label}</p>
            <p className={`text-xs font-semibold ${changeColor}`}>{change}</p>
        </div>
    );
};

const FileApplicationConsole: React.FC = () => {
  const { selectedSubscribers, selectedZones, selectedTimeRange } = useDashboard();
  const { setView } = useView();
  const { openModal: openJobRunsModal } = useJobRuns();

  const [logSubscriberFilter, setLogSubscriberFilter] = useState('all');
  const [logSeverityFilter, setLogSeverityFilter] = useState('all');
  const [logDateRange, setLogDateRange] = useState({ start: '', end: '' });
  const [subscriberSearch, setSubscriberSearch] = useState('');
    
  const kpis = getFileAppKpis(selectedSubscribers, selectedZones, selectedTimeRange);
  const fileDownloadsTrendData = getTrendData('File Downloads Trend', selectedSubscribers, selectedZones, selectedTimeRange);
  const fileUploadsTrendData = getTrendData('File Uploads Trend', selectedSubscribers, selectedZones, selectedTimeRange);
  const errorTrendData = getTrendData('Error Rate Trend', selectedSubscribers, selectedZones, selectedTimeRange);
  const failureReasons = getTopFailureReasons(selectedSubscribers, selectedZones);
  const logs = getLogs(selectedSubscribers, selectedZones);
  const subscriberMetrics = getSubscribersMetrics(selectedSubscribers, selectedZones);
  const batchJobSummary = getBatchJobSummary(selectedSubscribers, selectedZones, selectedTimeRange);
  const latencyData = getLatencyDistributionData(selectedSubscribers, selectedZones);
  const traces = getTracesData(selectedSubscribers, selectedZones);
  const diaMetrics = getDiaModuleMetrics(selectedSubscribers, selectedZones, selectedTimeRange);
  const perseusMetrics = getPerseusModuleMetrics(selectedSubscribers, selectedZones, selectedTimeRange);
  const { metrics: tsheetMetrics, data: tsheetData, timeRanges: tsheetColumns } = getFileAppTimeBasedTSheetData(selectedSubscribers, selectedZones);

  const displayedLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const startDate = logDateRange.start ? new Date(logDateRange.start) : null;
    const endDate = logDateRange.end ? new Date(logDateRange.end) : null;

    if (startDate) startDate.setHours(0, 0, 0, 0);
    if (endDate) endDate.setHours(23, 59, 59, 999);

    const subscriberName = SUBSCRIBERS.find(s => s.id === logSubscriberFilter)?.name || logSubscriberFilter;

    return (
        (logSubscriberFilter === 'all' || log.subscriber === subscriberName) &&
        (logSeverityFilter === 'all' || log.severity === logSeverityFilter) &&
        (!startDate || logDate >= startDate) &&
        (!endDate || logDate <= endDate)
    );
  });

  const filteredSubscriberMetrics = subscriberMetrics.filter(metric =>
    metric.subscriberName.toLowerCase().includes(subscriberSearch.toLowerCase())
  );

  const handleTSheetMetricClick = (metric: TSheetMetric) => {
    console.log(`Drill-down triggered for metric: "${metric.label}"`);
    console.log('Current Context:', {
        timeRange: selectedTimeRange,
        subscribers: selectedSubscribers.map(s => s.name),
        zones: selectedZones.map(z => z.name),
    });
  };

  const handleTenantClick = (tenantId: string) => {
    setView(View.TENANT_DETAIL, { tenantId: tenantId });
  };

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.id} data={kpi} />
        ))}
      </div>

      {/* Module Status Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ModuleStatusCard title="DIA Module Status" metrics={diaMetrics} onExpand={() => setView(View.DIA)} />
          <ModuleStatusCard title="Perseus Module Status" metrics={perseusMetrics} onExpand={() => setView(View.PERSEUS)} />
      </div>

      {/* T-Sheet Metrics */}
      <TSheet
        title="File Application Metrics (T-Sheet)"
        header="Metric"
        metrics={tsheetMetrics}
        data={tsheetData}
        subscribers={tsheetColumns}
        onMetricClick={handleTSheetMetricClick}
      />


      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Trend Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <TrendChart title="File Downloads Trend" data={fileDownloadsTrendData} />
             <TrendChart title="File Uploads Trend" data={fileUploadsTrendData} />
             <TrendChart title="Error Rate Trend" data={errorTrendData} />
          </div>
          
          {/* Health & Failures */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-md font-semibold text-white mb-4">Health & Alerts Summary</h3>
                <div className="space-y-3">
                    <div className="flex items-center space-x-3"><CheckCircleIcon className="text-status-green h-6 w-6"/><span>DIA Module: Healthy</span></div>
                    <div className="flex items-center space-x-3"><CheckCircleIcon className="text-status-green h-6 w-6"/><span>Perseus Module: Healthy</span></div>
                    <div className="flex items-center space-x-3"><ExclamationTriangleIcon className="text-status-amber h-6 w-6"/><span>Alert: High Latency (HDFC)</span></div>
                    <div className="flex items-center space-x-3"><XCircleIcon className="text-status-red h-6 w-6"/><span>Alert: High Error Rate (Sparrow)</span></div>
                </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-md font-semibold text-white mb-4">Top Failure Reasons</h3>
                <div className="space-y-2">
                    {failureReasons.slice(0, 5).map(reason => (
                        <FailureReasonBar 
                            key={reason.reason} 
                            reason={reason}
                            onClick={() => openJobRunsModal('failed', reason.reason)}
                        />
                    ))}
                </div>
            </div>
            <HistogramChart title="Latency Distribution" data={latencyData} />
          </div>
          
          {/* Lag & Batch Jobs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-md font-semibold text-white mb-4">Lag / Backlog</h3>
                <div className="flex justify-around items-center h-full">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-status-green">58</p>
                        <p className="text-xs text-gray-400 mt-1">Pending Files</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-status-amber">2m 10s</p>
                        <p className="text-xs text-gray-400 mt-1">Oldest File</p>
                    </div>
                </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-md font-semibold text-white mb-4">Batch Job Summary</h3>
                <div className="flex justify-around items-center h-full">
                    <div
                      className="cursor-pointer hover:opacity-80 transition-opacity p-2"
                      onClick={() => openJobRunsModal('succeeded')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openJobRunsModal('succeeded')}
                      aria-label={`View ${batchJobSummary.jobsSucceeded.toLocaleString()} successful runs`}
                    >
                        <MetricWithChange value={batchJobSummary.jobsSucceeded.toLocaleString()} label="Successful Runs" change={batchJobSummary.jobsSucceededChange} positiveIsGood={true} />
                    </div>
                    <div
                      className="cursor-pointer hover:opacity-80 transition-opacity p-2"
                      onClick={() => openJobRunsModal('failed')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openJobRunsModal('failed')}
                      aria-label={`View ${batchJobSummary.jobsFailed.toLocaleString()} failed runs`}
                    >
                        <MetricWithChange value={batchJobSummary.jobsFailed.toLocaleString()} label="Failed Runs" change={batchJobSummary.jobsFailedChange} positiveIsGood={false} />
                    </div>
                    <div>
                        <MetricWithChange value={batchJobSummary.recordsProcessed.toLocaleString()} label="Records Processed" change={batchJobSummary.recordsProcessedChange} positiveIsGood={true} />
                    </div>
                </div>
            </div>
          </div>

          {/* Logs & Traces */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-md font-semibold text-white mb-4">Logs & Signals</h3>
              <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                <select
                    value={logSubscriberFilter}
                    onChange={(e) => setLogSubscriberFilter(e.target.value)}
                    className="bg-gray-700 border-gray-600 rounded-md text-white px-2 py-1 focus:ring-brand-blue focus:border-brand-blue"
                    aria-label="Filter logs by subscriber"
                >
                    {SUBSCRIBERS.map(s => <option key={s.id} value={s.id === 'all' ? 'all' : s.name}>{s.name}</option>)}
                </select>
                <select
                    value={logSeverityFilter}
                    onChange={(e) => setLogSeverityFilter(e.target.value)}
                    className="bg-gray-700 border-gray-600 rounded-md text-white px-2 py-1 focus:ring-brand-blue focus:border-brand-blue"
                    aria-label="Filter logs by severity"
                >
                    <option value="all">All Severities</option>
                    <option value="INFO">INFO</option>
                    <option value="WARN">WARN</option>
                    <option value="ERROR">ERROR</option>
                    <option value="DEBUG">DEBUG</option>
                </select>
                <input
                    type="date"
                    value={logDateRange.start}
                    onChange={(e) => setLogDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="bg-gray-700 border-gray-600 rounded-md text-white px-2 py-1 focus:ring-brand-blue focus:border-brand-blue"
                    aria-label="Log filter start date"
                />
                <span className="text-gray-400">to</span>
                <input
                    type="date"
                    value={logDateRange.end}
                    onChange={(e) => setLogDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="bg-gray-700 border-gray-600 rounded-md text-white px-2 py-1 focus:ring-brand-blue focus:border-brand-blue"
                    aria-label="Log filter end date"
                />
              </div>
              <div className="h-52 overflow-y-auto font-mono text-xs">
                  {displayedLogs.map(log => (
                      <div key={log.id} className={`flex items-start space-x-3 p-1 rounded ${log.severity === 'ERROR' ? 'bg-status-red/10' : ''} ${log.severity === 'WARN' ? 'bg-status-amber/10' : ''}`}>
                         <span className="text-gray-500">{log.timestamp.split('T')[1].replace('Z','')}</span>
                         <span className={`font-bold ${log.severity === 'ERROR' ? 'text-status-red' : log.severity === 'WARN' ? 'text-status-amber' : 'text-gray-400'}`}>{log.severity}</span>
                         <span className="text-gray-300 flex-1">{log.message}</span>
                         <span className="text-brand-purple">{log.subscriber}</span>
                      </div>
                  ))}
              </div>
            </div>
             <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-md font-semibold text-white mb-4">Traces</h3>
                <div className="h-64 overflow-y-auto space-y-2">
                    {traces.map(trace => (
                        <div key={trace.traceId} className="bg-gray-700/50 p-2 rounded-md text-xs font-mono">
                            <div className="flex justify-between items-center">
                                <span className={trace.status === 'error' ? 'text-status-red' : 'text-status-green'}>{trace.rootService}</span>
                                <span className="text-gray-400">{trace.timestamp}</span>
                            </div>
                            <div className="text-gray-300 mt-1">{trace.rootOperation}</div>
                            <div className="flex justify-between text-gray-500 mt-1">
                                <span>{trace.duration} / {trace.spanCount} spans</span>
                                <a href="#" className="text-brand-blue hover:underline flex items-center">
                                    Open <ArrowUpRightIcon className="h-3 w-3 ml-1" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Column */}
        <div className="space-y-6">
            <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-semibold text-white">Subscribers</h3>
                    <input
                        type="text"
                        placeholder="Search subscribers..."
                        value={subscriberSearch}
                        onChange={(e) => setSubscriberSearch(e.target.value)}
                        className="bg-gray-700 border-gray-600 rounded-md text-white px-3 py-1.5 text-sm focus:ring-brand-blue focus:border-brand-blue w-48"
                    />
                </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-4 py-2">Subscriber</th>
                                <th scope="col" className="px-4 py-2">MFT</th>
                                <th scope="col" className="px-4 py-2">Health</th>
                                <th scope="col" className="px-4 py-2">Errors</th>
                                <th scope="col" className="px-4 py-2">Lag</th>
                                <th scope="col" className="px-4 py-2">Last Contact</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSubscriberMetrics.map(t => (
                                <tr key={t.subscriberId} className="border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="px-4 py-2 font-medium text-white">
                                        <button onClick={() => handleTenantClick(t.subscriberId)} className="hover:text-brand-blue hover:underline text-left transition-colors">
                                            {t.subscriberName}
                                        </button>
                                    </td>
                                    <td className="px-4 py-2 text-white">{t.nsm}</td>
                                    <td className={`px-4 py-2 ${t.health < 99.9 ? 'text-status-amber' : 'text-status-green'}`}>{t.health.toFixed(2)}%</td>
                                    <td className={`px-4 py-2 ${t.errorRate > 1 ? 'text-status-red' : 'text-status-green'}`}>{t.errorRate}%</td>
                                    <td className={`px-4 py-2 ${t.lag > 1000 ? 'text-status-red' : t.lag > 500 ? 'text-status-amber' : 'text-status-green'}`}>{t.lag}</td>
                                    <td className="px-4 py-2 text-gray-400">{t.lastContact}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-md font-semibold text-white mb-4">Actions</h3>
                <div className="space-y-3">
                    <ActionButton text="Create Engagement Task" />
                    <ActionButton text="Log Adoption Opportunity" />
                    <ActionButton text="Attach SOP" />
                    <ActionButton text="Escalate to Exception Console" />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const FailureReasonBar: React.FC<{reason: FailureReason, onClick: () => void}> = ({reason, onClick}) => (
    <div 
        onClick={onClick} 
        className="cursor-pointer group"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
        aria-label={`View runs that failed due to: ${reason.reason}`}
    >
        <div className="flex justify-between items-center text-sm mb-1">
            <span className="text-gray-300 truncate group-hover:text-brand-blue transition-colors">{reason.reason}</span>
            <div className="flex items-baseline space-x-2 flex-shrink-0">
                <span className="text-white font-medium">{reason.count.toLocaleString()}</span>
                <span className="text-xs text-gray-400">({reason.percentage}%)</span>
            </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-brand-purple h-2 rounded-full group-hover:brightness-125 transition-all" style={{width: `${reason.percentage}%`}}></div>
        </div>
    </div>
);

const ActionButton: React.FC<{text: string}> = ({text}) => (
    <button className="w-full bg-brand-blue/80 hover:bg-brand-blue text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
        {text}
    </button>
);


export default FileApplicationConsole;