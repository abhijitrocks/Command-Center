import React from 'react';
import KpiCard from '../components/KpiCard';
import TrendChart, { HistogramChart } from '../components/charts/TrendChart';
import { getMessageAppKpis, getTrendData, getTopFailureReasons, getLogs, getSubscribersMetrics, getAtroposModuleMetrics, getPerseusModuleMetrics, getMessageAppTSheetData, getLatencyDistributionData } from '../data/mockData';
import { FailureReason, TSheetMetric, View } from '../types';
import ModuleStatusCard from '../components/ModuleStatusCard';
import { useDashboard } from '../contexts/DashboardContext';
import { useView } from '../contexts/ViewContext';
import { useJobRuns } from '../contexts/JobRunsContext';
import TSheet from '../components/TSheet';

const MessageApplicationConsole: React.FC = () => {
  const { selectedSubscribers, selectedZones, selectedTimeRange } = useDashboard();
  const { setView } = useView();
  const { openModal: openJobRunsModal } = useJobRuns();

  const kpis = getMessageAppKpis(selectedSubscribers, selectedZones, selectedTimeRange);
  const nsmTrend = getTrendData('Events Trend', selectedSubscribers, selectedZones, selectedTimeRange);
  const errorTrend = getTrendData('Error Rate Trend', selectedSubscribers, selectedZones, selectedTimeRange);
  const failureReasons = getTopFailureReasons(selectedSubscribers, selectedZones).slice(0,5).map(r => ({...r, reason: r.reason.replace('file', 'event')}));
  const logs = getLogs(selectedSubscribers, selectedZones);
  const subscriberMetrics = getSubscribersMetrics(selectedSubscribers, selectedZones);
  const atroposMetrics = getAtroposModuleMetrics(selectedSubscribers, selectedZones, selectedTimeRange);
  const perseusMetrics = getPerseusModuleMetrics(selectedSubscribers, selectedZones, selectedTimeRange);
  const { metrics: tsheetMetrics, data: tsheetData, subscribers: tsheetSubscribers } = getMessageAppTSheetData(selectedSubscribers, selectedZones);
  const latencyData = getLatencyDistributionData(selectedSubscribers, selectedZones);

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
          <ModuleStatusCard title="Atropos Module Status" metrics={atroposMetrics} onExpand={() => setView(View.ATROPOS)} />
          <ModuleStatusCard title="Perseus Module Status" metrics={perseusMetrics} onExpand={() => setView(View.PERSEUS)} />
      </div>
      
      {/* T-Sheet Metrics */}
      <TSheet 
        title="Message Application Metrics (T-Sheet)" 
        header="Metric"
        metrics={tsheetMetrics} 
        data={tsheetData} 
        subscribers={tsheetSubscribers} 
        onMetricClick={handleTSheetMetricClick}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Trend Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <TrendChart title="Events Published Trend" data={nsmTrend} />
             <TrendChart title="Error Rate Trend" data={errorTrend} />
          </div>
          
          {/* Lag & Failures */}
            <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-md font-semibold text-white mb-4">Queue Lag / Backlog</h3>
                <div className="flex justify-around items-center py-8">
                    <div className="text-center">
                        <p className="text-4xl font-bold text-status-amber">1,204</p>
                        <p className="text-sm text-gray-400 mt-2">Pending Items</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-bold text-status-red">15m 42s</p>
                        <p className="text-sm text-gray-400 mt-2">Oldest Event</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-md font-semibold text-white mb-4">Top Failure Reasons</h3>
                    <div className="space-y-2">
                        {failureReasons.map(reason => (
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
          
          {/* Logs */}
           <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-md font-semibold text-white mb-4">Logs & Signals</h3>
            <div className="h-64 overflow-y-auto font-mono text-xs">
                {logs.map(log => (
                    <div key={log.id} className={`flex items-start space-x-3 p-1 rounded ${log.severity === 'ERROR' ? 'bg-status-red/10' : ''} ${log.severity === 'WARN' ? 'bg-status-amber/10' : ''}`}>
                       <span className="text-gray-500">{log.timestamp.split('T')[1].replace('Z','')}</span>
                       <span className={`font-bold ${log.severity === 'ERROR' ? 'text-status-red' : log.severity === 'WARN' ? 'text-status-amber' : 'text-gray-400'}`}>{log.severity}</span>
                       <span className="text-gray-300 flex-1">{log.message}</span>
                       <span className="text-brand-purple">{log.subscriber}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Sticky Column */}
        <div className="space-y-6">
            <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-md font-semibold text-white mb-4">Subscribers</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-4 py-2">Subscriber</th>
                                <th scope="col" className="px-4 py-2">Events</th>
                                <th scope="col" className="px-4 py-2">Health</th>
                                <th scope="col" className="px-4 py-2">Errors</th>
                                <th scope="col" className="px-4 py-2">Lag</th>
                                <th scope="col" className="px-4 py-2">Last Contact</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscriberMetrics.map(t => (
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

export default MessageApplicationConsole;