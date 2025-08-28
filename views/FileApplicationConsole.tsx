
import React from 'react';
import KpiCard from '../components/KpiCard';
import TrendChart from '../components/charts/TrendChart';
import { getFileAppKpis, getTrendData, getTopFailureReasons, getLogs, getTenantMetrics } from '../data/mockData';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '../components/icons';
import { FailureReason } from '../types';

const FileApplicationConsole: React.FC = () => {
  const kpis = getFileAppKpis();
  const trendData = getTrendData('MFT Trend');
  const errorTrendData = getTrendData('Error Rate Trend');
  const throughputTrendData = getTrendData('Throughput Trend');
  const failureReasons = getTopFailureReasons();
  const logs = getLogs();
  const tenantMetrics = getTenantMetrics();

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.id} data={kpi} onClick={() => alert(`Open drilldown for ${kpi.title}`)} />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Trend Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <TrendChart title="NSM Trend (MFT)" data={trendData} />
             <TrendChart title="Error Rate Trend" data={errorTrendData} />
          </div>
          
          {/* Health & Failures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-md font-semibold text-white mb-4">Health & Alerts Summary</h3>
                <div className="space-y-3">
                    <div className="flex items-center space-x-3"><CheckCircleIcon className="text-status-green h-6 w-6"/><span>DIA Module: Healthy</span></div>
                    <div className="flex items-center space-x-3"><CheckCircleIcon className="text-status-green h-6 w-6"/><span>Perseus Module: Healthy</span></div>
                    <div className="flex items-center space-x-3"><ExclamationTriangleIcon className="text-status-amber h-6 w-6"/><span>Alert: High Latency (HDFC UAT)</span></div>
                    <div className="flex items-center space-x-3"><XCircleIcon className="text-status-red h-6 w-6"/><span>Alert: High Error Rate (HDFC LZ)</span></div>
                </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-md font-semibold text-white mb-4">Top Failure Reasons</h3>
                <div className="space-y-2">
                    {failureReasons.slice(0, 5).map(reason => (
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


export default FileApplicationConsole;
