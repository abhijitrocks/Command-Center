import React from 'react';
import { useView } from '../contexts/ViewContext';
import { useDashboard } from '../contexts/DashboardContext';
import { ArrowLeftIcon } from '../components/icons';
import { getFileAppKpis, getMessageAppKpis, getTrendData, getLogs, getJobRuns } from '../data/mockData';
import { SUBSCRIBERS } from '../constants';
import KpiCard from '../components/KpiCard';
import TrendChart from '../components/charts/TrendChart';

interface TenantDetailViewProps {
    onBack: () => void;
}

const TenantDetailView: React.FC<TenantDetailViewProps> = ({ onBack }) => {
    const { viewState } = useView();
    const { selectedTenantId } = viewState;
    const { selectedTimeRange } = useDashboard();

    const tenant = SUBSCRIBERS.find(s => s.id === selectedTenantId);

    if (!tenant) {
        return (
            <div className="flex-1 overflow-y-auto p-6 text-center">
                <h2 className="text-xl text-white">Tenant not found.</h2>
                <button onClick={onBack} className="mt-4 text-brand-blue hover:underline">
                    Go Back
                </button>
            </div>
        );
    }
    
    // Create a subscriber filter array to pass to data fetching functions
    const subscriberFilter = [tenant];
    
    // Fetch data for the specific tenant
    const fileKpis = getFileAppKpis(subscriberFilter, [], selectedTimeRange);
    const msgKpis = getMessageAppKpis(subscriberFilter, [], selectedTimeRange);
    const mftTrendData = getTrendData('MFT Trend', subscriberFilter, [], selectedTimeRange);
    const eventsTrendData = getTrendData('Events Published Trend', subscriberFilter, [], selectedTimeRange);
    const logs = getLogs(subscriberFilter);
    const recentFailedJobs = getJobRuns(subscriberFilter, [], 'failed');

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center space-x-3">
                <button onClick={onBack} className="text-gray-400 hover:text-white">
                    <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold text-white">Tenant Detail: {tenant.name}</h2>
            </div>

            <h3 className="text-lg font-semibold text-white pt-4">File Application KPIs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {fileKpis.map(kpi => (
                    <KpiCard key={kpi.id} data={kpi} />
                ))}
            </div>

            <h3 className="text-lg font-semibold text-white pt-4">Message Application KPIs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {msgKpis.map(kpi => (
                    <KpiCard key={kpi.id} data={kpi} />
                ))}
            </div>

            <h3 className="text-lg font-semibold text-white pt-4">Trends</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TrendChart title="File Transfers Trend" data={mftTrendData} />
                <TrendChart title="Events Published Trend" data={eventsTrendData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                 {/* Recent Logs */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-md font-semibold text-white mb-4">Recent Logs</h3>
                  <div className="h-64 overflow-y-auto font-mono text-xs space-y-2">
                      {logs.length > 0 ? logs.map(log => (
                          <div key={log.id} className={`flex items-start space-x-3 p-1 rounded ${log.severity === 'ERROR' ? 'bg-status-red/10' : ''} ${log.severity === 'WARN' ? 'bg-status-amber/10' : ''}`}>
                             <span className="text-gray-500">{log.timestamp.split('T')[1].replace('Z','')}</span>
                             <span className={`font-bold w-12 ${log.severity === 'ERROR' ? 'text-status-red' : log.severity === 'WARN' ? 'text-status-amber' : 'text-gray-400'}`}>{log.severity}</span>
                             <span className="text-gray-300 flex-1 truncate pr-2" title={log.message}>{log.message}</span>
                          </div>
                      )) : <p className="text-gray-500 text-center pt-8">No recent logs found for this tenant.</p>}
                  </div>
                </div>

                {/* Recent Failed Jobs */}
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-md font-semibold text-white mb-4">Recent Failed Jobs</h3>
                    <div className="h-64 overflow-y-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-700/50 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-4 py-2">Job Name</th>
                                    <th scope="col" className="px-4 py-2">Failure Reason</th>
                                    <th scope="col" className="px-4 py-2">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {recentFailedJobs.length > 0 ? recentFailedJobs.slice(0, 5).map(job => (
                                    <tr key={job.id} className="hover:bg-gray-700/50">
                                        <td className="px-4 py-2 font-mono text-xs text-white">{job.name}</td>
                                        <td className="px-4 py-2 text-status-red text-xs">{job.failureReason}</td>
                                        <td className="px-4 py-2 text-gray-400 text-xs">{new Date(job.startTime).toLocaleTimeString()}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} className="text-center py-8 text-gray-500">No recent failed jobs.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default TenantDetailView;