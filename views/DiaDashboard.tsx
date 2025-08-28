import React from 'react';
import KpiCard from '../components/KpiCard';
import TrendChart from '../components/charts/TrendChart';
import { ArrowLeftIcon } from '../components/icons';
import { getDiaDashboardKpis, getTrendData, getModuleLogs } from '../data/mockData';
import { useDashboard } from '../contexts/DashboardContext';

interface DiaDashboardProps {
    onBack: () => void;
}

const DiaDashboard: React.FC<DiaDashboardProps> = ({ onBack }) => {
    const { selectedSubscribers, selectedZones, selectedTimeRange } = useDashboard();
    const kpis = getDiaDashboardKpis(selectedSubscribers, selectedZones, selectedTimeRange);
    const trendData1 = getTrendData('DIA MFT Trend', selectedSubscribers, selectedZones, selectedTimeRange);
    const trendData2 = getTrendData('DIA Throughput Trend', selectedSubscribers, selectedZones, selectedTimeRange);
    const logs = getModuleLogs('DIA', selectedSubscribers, selectedZones);

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center space-x-3">
                <button onClick={onBack} className="text-gray-400 hover:text-white">
                    <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold text-white">DIA Module Dashboard</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map(kpi => (
                    <KpiCard key={kpi.id} data={kpi} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TrendChart title="DIA File Transfers Trend" data={trendData1} />
                <TrendChart title="DIA Throughput Trend" data={trendData2} />
            </div>

            {/* Recent Logs */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-md font-semibold text-white mb-4">Recent Logs</h3>
              <div className="h-64 overflow-y-auto font-mono text-xs space-y-2">
                  {logs.length > 0 ? logs.map(log => (
                      <div key={log.id} className={`flex items-start space-x-3 p-1 rounded ${log.severity === 'ERROR' ? 'bg-status-red/10' : ''} ${log.severity === 'WARN' ? 'bg-status-amber/10' : ''}`}>
                         <span className="text-gray-500">{log.timestamp.split('T')[1].replace('Z','')}</span>
                         <span className={`font-bold w-12 ${log.severity === 'ERROR' ? 'text-status-red' : log.severity === 'WARN' ? 'text-status-amber' : 'text-gray-400'}`}>{log.severity}</span>
                         <span className="text-gray-300 flex-1 truncate pr-2" title={log.message}>{log.message.replace('[DIA] ', '')}</span>
                         <span className="text-brand-purple">{log.subscriber}</span>
                      </div>
                  )) : <p className="text-gray-500 text-center pt-8">No recent logs found for DIA module.</p>}
              </div>
            </div>
        </div>
    );
};

export default DiaDashboard;