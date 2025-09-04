import React from 'react';
import KpiCard from '../components/KpiCard';
import TrendChart from '../components/charts/TrendChart';
import { ArrowLeftIcon, InformationCircleIcon } from '../components/icons';
import { getPerseusDashboardKpis, getTrendData, getModuleLogs, getPerseusCategorizedMetrics } from '../data/mockData';
import { useDashboard } from '../contexts/DashboardContext';
import { ModuleMetric, OperatorUsageCategory } from '../types';
import Tooltip from '../components/Tooltip';

interface PerseusDashboardProps {
    onBack: () => void;
}

const statusColors: { [key: string]: string } = {
  green: 'text-status-green',
  amber: 'text-status-amber',
  red: 'text-status-red',
  neutral: 'text-white'
};

const MetricDisplay: React.FC<{ metric: ModuleMetric }> = ({ metric }) => (
    <div>
        <div className="flex items-center space-x-1.5">
            <p className="text-sm text-gray-400">{metric.name}</p>
            <Tooltip content={metric.description}>
                <InformationCircleIcon className="h-4 w-4 text-gray-500" />
            </Tooltip>
        </div>
        <p className={`text-2xl font-bold ${statusColors[metric.status]}`}>{metric.value}</p>
    </div>
);

const MetricCategoryCard: React.FC<{ title: string; metrics: ModuleMetric[] }> = ({ title, metrics }) => (
    <div className="bg-gray-800 p-6 rounded-lg h-full">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            {metrics.map(metric => <MetricDisplay key={metric.id} metric={metric} />)}
        </div>
    </div>
);

const OperatorUsageCard: React.FC<{ metrics: OperatorUsageCategory[] }> = ({ metrics }) => {
    const totalRuns = metrics.flatMap(cat => cat.operators).reduce((sum, op) => sum + op.runs, 0);

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Operator Usage by Job Runs</h3>
            {metrics.length > 0 && totalRuns > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                    {metrics.map(category => (
                        <div key={category.categoryName}>
                            <h4 className="text-md font-semibold text-gray-300 mb-3 pb-2 border-b border-gray-700">{category.categoryName}</h4>
                            <div className="space-y-3">
                                {category.operators.sort((a, b) => b.runs - a.runs).map(metric => (
                                    <div key={metric.name}>
                                        <div className="flex justify-between items-center text-sm mb-1">
                                            <span className="text-gray-300 truncate" title={metric.name}>{metric.name}</span>
                                            <span className="text-white font-medium flex-shrink-0 ml-2">{metric.runs.toLocaleString()}</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-brand-purple h-2 rounded-full"
                                                style={{ width: totalRuns > 0 ? `${(metric.runs / totalRuns) * 100}%` : '0%' }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                 <p className="text-gray-500 text-center py-8">No operator usage data available.</p>
            )}
        </div>
    );
};


const PerseusDashboard: React.FC<PerseusDashboardProps> = ({ onBack }) => {
    const { selectedSubscribers, selectedZones, selectedTimeRange } = useDashboard();
    const kpis = getPerseusDashboardKpis(selectedSubscribers, selectedZones, selectedTimeRange);
    const jobRunsTrendData = getTrendData('Perseus Job Runs Trend', selectedSubscribers, selectedZones, selectedTimeRange);
    const recordsProcessedTrendData = getTrendData('Perseus Records Processed Trend', selectedSubscribers, selectedZones, selectedTimeRange);
    const categorizedMetrics = getPerseusCategorizedMetrics(selectedSubscribers, selectedZones, selectedTimeRange);
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
                <TrendChart title="Perseus Job Runs Trend" data={jobRunsTrendData} />
                <TrendChart title="Records Processed" data={recordsProcessedTrendData} />
            </div>

            {/* Categorized Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <MetricCategoryCard title="Health" metrics={categorizedMetrics.health} />
                <MetricCategoryCard title="Performance" metrics={categorizedMetrics.performance} />
                <MetricCategoryCard title="Business" metrics={categorizedMetrics.business} />
            </div>
            <div className="grid grid-cols-1 gap-6">
                <OperatorUsageCard metrics={categorizedMetrics.operatorUsage} />
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