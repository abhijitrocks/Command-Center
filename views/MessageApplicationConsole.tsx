
import React from 'react';
import KpiCard from '../components/KpiCard';
import TrendChart from '../components/charts/TrendChart';
import { getMessageAppKpis, getTrendData, getTopFailureReasons, getLogs, getTenantMetrics } from '../data/mockData';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '../components/icons';
import { FailureReason } from '../types';

const MessageApplicationConsole: React.FC = () => {
  const kpis = getMessageAppKpis();
  const nsmTrend = getTrendData('MJR Trend');
  const errorTrend = getTrendData('Error Rate Trend');
  const failureReasons = getTopFailureReasons().slice(0,5).map(r => ({...r, reason: r.reason.replace('file', 'event')}));
  const logs = getLogs();
  const tenantMetrics = getTenantMetrics();

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.id} data={kpi} onClick={() => alert(`Open drilldown for ${kpi.title}`)} />
        ))}
        {/* Atropos specific KPIs */}
         <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-status-green flex flex-col justify-center">
            <h3 className="text-sm font-medium text-gray-400">Customer Satisfaction (CSS)</h3>
            <p className="text-3xl font-bold text-white mt-1">4.8/5</p>
         </div>
         <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-status-green flex flex-col justify-center">
            <h3 className="text-sm font-medium text-gray-400">Feature Adoption (FAR)</h3>
            <p className="text-3xl font-bold text-white mt-1">82%</p>
         </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Trend Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <TrendChart title="NSM Trend (MJR)" data={nsmTrend} />
             <TrendChart title="Error Rate Trend" data={errorTrend} />
          </div>
          
          {/* Lag & Failures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-md font-semibold text-white mb-4">Queue Lag / Backlog</h3>
                <div className="flex justify-around items-center h-full">
                    <div className="text-center">
                        <p className="text-4xl font-bold text-status-amber">1,204</p>
                        <p className="text-sm text-gray-400">Pending Items</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-bold text-status-red">15m 42s</p>
                        <p className="text-sm text-gray-400">Oldest Event</p>
                    </div>
                </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-md font-semibold text-white mb-4">Top Failure Reasons</h3>
                <div className="space-y-2">
                    {failureReasons.map(reason => (
                        <FailureReasonBar key={reason.reason} reason={reason} />
                    ))}
                </div>
            </div>
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
                       <span className="text-brand-purple">{log.tenant}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Sticky Column */}
        <div className="space-y-6">
            <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-md font-semibold text-white mb-4">Tenants</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-4 py-2">Tenant</th>
                                <th scope="col" className="px-4 py-2">Errors</th>
                                <th scope="col" className="px-4 py-2">Lag</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tenantMetrics.map(t => (
                                <tr key={t.tenantId} className="border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="px-4 py-2 font-medium text-white">{t.tenantName}</td>
                                    <td className={`px-4 py-2 ${t.errorRate > 1 ? 'text-status-red' : 'text-status-green'}`}>{t.errorRate}%</td>
                                    <td className={`px-4 py-2 ${t.lag > 1000 ? 'text-status-red' : t.lag > 500 ? 'text-status-amber' : 'text-status-green'}`}>{t.lag}</td>
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
                    <ActionButton text="Attach SOP" />
                    <ActionButton text="Escalate to Exception Console" />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};


const FailureReasonBar: React.FC<{reason: FailureReason}> = ({reason}) => (
    <div>
        <div className="flex justify-between items-center text-sm mb-1">
            <span className="text-gray-300 truncate">{reason.reason}</span>
            <span className="text-gray-400 font-medium">{reason.count.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-brand-purple h-2 rounded-full" style={{width: `${reason.percentage}%`}}></div>
        </div>
    </div>
);

const ActionButton: React.FC<{text: string}> = ({text}) => (
    <button className="w-full bg-brand-blue/80 hover:bg-brand-blue text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
        {text}
    </button>
);

export default MessageApplicationConsole;
