import React from 'react';
import KpiCard from '../components/KpiCard';
import TrendChart from '../components/charts/TrendChart';
import { ArrowLeftIcon, InformationCircleIcon } from '../components/icons';
import { getPerseusDashboardKpis, getTrendData, getModuleLogs, getPerseusCategorizedMetrics } from '../data/mockData';
import { useDashboard } from '../contexts/DashboardContext';
import { ModuleMetric, OperatorUsageCategory, CostScenario } from '../types';
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
    const allOperators = metrics.flatMap(cat => cat.operators);
    const totalRuns = allOperators.reduce((sum, op) => sum + op.runs, 0);
    const maxRuns = allOperators.reduce((max, op) => Math.max(max, op.runs), 0);

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
                                            <Tooltip content={category.categoryName.replace(' Operator', '')}>
                                                <span className="text-gray-300 truncate cursor-help" title={metric.name}>{metric.name}</span>
                                            </Tooltip>
                                            <div className="flex items-baseline space-x-2 flex-shrink-0 ml-2">
                                                <span className="text-white font-medium">{metric.runs.toLocaleString()}</span>
                                                <span className="text-xs text-gray-400">({totalRuns > 0 ? ((metric.runs / totalRuns) * 100).toFixed(2) : '0.00'}%)</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-brand-purple h-2 rounded-full"
                                                style={{ width: maxRuns > 0 ? `${(metric.runs / maxRuns) * 100}%` : '0%' }}
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

const Tag: React.FC<{ text: string; color: 'blue' | 'purple' | 'amber' | 'green' }> = ({ text, color }) => {
    const colors = {
        blue: 'bg-blue-500/20 text-blue-300',
        purple: 'bg-purple-500/20 text-purple-300',
        amber: 'bg-amber-500/20 text-amber-300',
        green: 'bg-green-500/20 text-green-300',
    };
    return (
        <span className={`px-2 py-0.5 text-xs font-medium rounded ${colors[color]}`}>
            {text}
        </span>
    );
};


const CostScenariosTable: React.FC<{ scenarios: CostScenario[] }> = ({ scenarios }) => {
    if (!scenarios || scenarios.length === 0) {
        return null;
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white">Cost per Record Breakdown</h3>
            <p className="text-sm text-gray-400 mt-1 mb-4">
                The table below outlines the estimated cost per record based on various job configurations and attributes.
            </p>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                        <tr>
                            <th scope="col" className="px-4 py-3">Execution Mode</th>
                            <th scope="col" className="px-4 py-3">Cluster Type</th>
                            <th scope="col" className="px-4 py-3">Job Criticality</th>
                            <th scope="col" className="px-4 py-3">Nature of Job</th>
                            <th scope="col" className="px-4 py-3 text-right">Job Runs</th>
                            <th scope="col" className="px-4 py-3 text-right">Est. Cost / Record</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scenarios.map((scenario, index) => (
                            <React.Fragment key={index}>
                                <tr className="hover:bg-gray-700/30">
                                    <td className="px-4 py-3">
                                        <Tag text={scenario.executionMode} color={scenario.executionMode === 'STREAMING' ? 'purple' : 'blue'} />
                                    </td>
                                    <td className="px-4 py-3 font-medium text-white">
                                        <Tag text={scenario.clusterType} color={scenario.clusterType === 'ON_DEMAND' ? 'amber' : 'green'} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <Tag text={scenario.jobCriticality} color={scenario.jobCriticality === 'HIGH' ? 'amber' : 'green'} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-gray-300">{scenario.natureOfJob}</span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="font-semibold text-white">{scenario.jobRuns.toLocaleString()}</div>
                                        <div className="text-xs text-gray-400">({scenario.jobRunsPercentage.toFixed(2)}%)</div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <span className="font-mono font-semibold text-white">${scenario.estimatedCostPerRecord.toFixed(6)}</span>
                                    </td>
                                </tr>
                                <tr className="bg-gray-800/50">
                                    <td colSpan={6} className="px-6 py-2 text-xs text-gray-400 border-b-2 border-gray-900">
                                        <div className="flex items-start">
                                            <InformationCircleIcon className="h-4 w-4 inline-block mr-2 flex-shrink-0 text-brand-blue/80" />
                                            <span>{scenario.explanation}</span>
                                        </div>
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
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

            {/* Cost Scenarios */}
            <CostScenariosTable scenarios={categorizedMetrics.costScenarios} />

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