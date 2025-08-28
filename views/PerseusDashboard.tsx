import React from 'react';
import KpiCard from '../components/KpiCard';
import TrendChart from '../components/charts/TrendChart';
import { ArrowLeftIcon } from '../components/icons';
import { getPerseusDashboardKpis, getTrendData, getBatchJobSummary, getModuleLogs } from '../data/mockData';
import { useDashboard } from '../contexts/DashboardContext';
import { useJobRuns } from '../contexts/JobRunsContext';

interface PerseusDashboardProps {
    onBack: () => void;
}

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

const PerseusDashboard: React.FC<PerseusDashboardProps> = ({ onBack }) => {
    const { selectedSubscribers, selectedZones, selectedTimeRange } = useDashboard();
    const { openModal: openJobRunsModal } = useJobRuns();
    const kpis = getPerseusDashboardKpis(selectedSubscribers, selectedZones, selectedTimeRange);
    const trendData1 = getTrendData('Perseus MJR Trend', selectedSubscribers, selectedZones, selectedTimeRange);
    const trendData2 = getTrendData('Perseus Error Rate Trend', selectedSubscribers, selectedZones, selectedTimeRange);
    const batchJobSummary = getBatchJobSummary(selectedSubscribers, selectedZones, selectedTimeRange);
    const logs = getModuleLogs('PERSEUS', selectedSubscribers, selectedZones);

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center space-x-3">
                <button onClick={onBack} className="text-gray-400 hover:text-white">
                    <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold text-white">Perseus Module Dashboard</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map(kpi => (
                    <KpiCard key={kpi.id} data={kpi} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TrendChart title="Perseus Job Runs Trend" data={trendData1} />
                <TrendChart title="Perseus Error Rate Trend" data={trendData2} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-md font-semibold text-white mb-4">Batch Job Summary</h3>
                    <div className="flex justify-around items-center h-full text-center py-6">
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
                        <div className="p-2">
                           <MetricWithChange value={batchJobSummary.jobsRun.toLocaleString()} label={`Total Runs (${selectedTimeRange})`} change={batchJobSummary.jobsRunChange} positiveIsGood={true} />
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-md font-semibold text-white mb-4">Operator Usage</h3>
                    <p className="text-gray-400 text-center pt-8">Operator usage data not available.</p>
                </div>
            </div>

            {/* Recent Logs */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-md font-semibold text-white mb-4">Recent Logs</h3>
              <div className="h-64 overflow-y-auto font-mono text-xs space-y-2">
                  {logs.length > 0 ? logs.map(log => (
                      <div key={log.id} className={`flex items-start space-x-3 p-1 rounded ${log.severity === 'ERROR' ? 'bg-status-red/10' : ''} ${log.severity === 'WARN' ? 'bg-status-amber/10' : ''}`}>
                         <span className="text-gray-500">{log.timestamp.split('T')[1].replace('Z','')}</span>
                         <span className={`font-bold w-12 ${log.severity === 'ERROR' ? 'text-status-red' : log.severity === 'WARN' ? 'text-status-amber' : 'text-gray-400'}`}>{log.severity}</span>
                         <span className="text-gray-300 flex-1 truncate pr-2" title={log.message}>{log.message.replace('[Perseus] ', '')}</span>
                         <span className="text-brand-purple">{log.subscriber}</span>
                      </div>
                  )) : <p className="text-gray-500 text-center pt-8">No recent logs found for Perseus module.</p>}
              </div>
            </div>
        </div>
    );
};

export default PerseusDashboard;