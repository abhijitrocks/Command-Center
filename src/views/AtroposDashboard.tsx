import React, { useState, useEffect } from 'react';
import KpiCard from '../components/KpiCard';
import { ArrowLeftIcon, ChevronDownIcon } from '../components/icons';
import { getModuleLogs, getTopicMetrics, getSubscriptionMetrics, getAtroposDashboardKpis, getTopics, getSubscriptions } from '../data/mockData';
import { useDashboard } from '../contexts/DashboardContext';
import SloCard from '../components/SloCard';
import ComposedTrendChart from '../components/charts/ComposedTrendChart';
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';
import { Topic, Subscription } from '../types';

interface AtroposDashboardProps {
    onBack: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        {children}
    </div>
);


const AtroposDashboard: React.FC<AtroposDashboardProps> = ({ onBack }) => {
    const { selectedSubscribers, selectedZones, selectedTimeRange } = useDashboard();
    
    const [topics, setTopics] = useState<Topic[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [selectedTopicId, setSelectedTopicId] = useState<string>('topic_1');
    const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string>('sub_1');
    const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);
    const [isSubscriptionDropdownOpen, setIsSubscriptionDropdownOpen] = useState(false);

    useEffect(() => {
        setTopics(getTopics());
        setSubscriptions(getSubscriptions());
    }, []);

    const kpis = getAtroposDashboardKpis(selectedSubscribers, selectedZones, selectedTimeRange);
    const topicData = getTopicMetrics(selectedTopicId, selectedSubscribers, selectedZones);
    const subscriptionData = getSubscriptionMetrics(selectedSubscriptionId, selectedSubscribers, selectedZones);
    const logs = getModuleLogs('ATROPOS', selectedSubscribers, selectedZones);

    const isTopicHealthy = topicData.latencySlo.status === 'green' && topicData.messageMetrics.p99Latency.status !== 'red';
    const isSubscriptionHealthy = subscriptionData.slos.every(slo => slo.status === 'green');

    const darkTooltipProps = {
        contentStyle: { backgroundColor: '#1E1E1E', borderColor: '#374151', borderRadius: '0.5rem' },
        itemStyle: { color: '#E5E7EB' },
        labelStyle: { color: '#9CA3AF' }
    };
    
    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div className="flex items-center space-x-3">
                <button onClick={onBack} className="text-gray-400 hover:text-white">
                    <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold text-white">Atropos Module Dashboard</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kpis.map(kpi => (
                    <KpiCard key={kpi.id} data={kpi} />
                ))}
            </div>

            {/* Topic Monitoring Section */}
            <Section title="Topic Monitoring">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold text-brand-purple truncate max-w-md">{topicData.name}</span>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${isTopicHealthy ? 'bg-status-green/20 text-status-green' : 'bg-status-amber/20 text-status-amber'}`}>
                           {isTopicHealthy ? 'Healthy' : 'Warning'}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                         <div className="relative">
                            <button onClick={() => setIsTopicDropdownOpen(!isTopicDropdownOpen)} className="flex items-center space-x-1 text-sm text-gray-300 border border-gray-600 rounded px-3 py-1.5 hover:bg-gray-700 w-64 justify-between">
                                <span className="truncate">{topicData.name}</span>
                                <ChevronDownIcon className="h-4 w-4" />
                            </button>
                            {isTopicDropdownOpen && (
                                <div className="absolute mt-1 w-64 bg-gray-700 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                                    {topics.map((topic) => (
                                        <a
                                            key={topic.id}
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setSelectedTopicId(topic.id);
                                                setIsTopicDropdownOpen(false);
                                            }}
                                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 truncate"
                                        >
                                            {topic.name}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button className="flex items-center space-x-1 text-sm text-gray-300 border border-gray-600 rounded px-3 py-1.5 hover:bg-gray-700">
                            <span>Last 30 mins</span>
                            <ChevronDownIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1 space-y-4">
                        <h4 className="font-semibold text-gray-300">SLOs and metrics</h4>
                        <SloCard metric={topicData.latencySlo} />
                        <h4 className="font-semibold text-gray-300 pt-4">Message Metrics</h4>
                        <SloCard metric={topicData.messageMetrics.delayedEvents} />
                        <SloCard metric={topicData.messageMetrics.p95Latency} />
                        <SloCard metric={topicData.messageMetrics.p99Latency} />
                    </div>
                    <div className="md:col-span-3 bg-gray-900/50 p-4 rounded-lg">
                         <h4 className="font-semibold text-gray-300 mb-4">RED metrics</h4>
                         <ComposedTrendChart
                            data={topicData.redMetrics}
                            bars={[{ dataKey: 'success', color: '#10B981', name: 'Success', stackId: 'a' }, { dataKey: 'failed', color: '#EF4444', name: 'Failed', stackId: 'a' }]}
                            line={{ dataKey: 'avgLatency', color: '#F59E0B', name: 'Average Latency', yAxisId: 'right' }}
                            yAxisLabel="req"
                            lineYAxisLabel="ms"
                         />
                    </div>
                </div>
            </Section>

            {/* Subscription Monitoring Section */}
            <Section title="Subscription Monitoring">
                 <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold text-brand-purple truncate max-w-md">{subscriptionData.name}</span>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${isSubscriptionHealthy ? 'bg-status-green/20 text-status-green' : 'bg-status-amber/20 text-status-amber'}`}>
                           {isSubscriptionHealthy ? 'Healthy' : 'Warning'}
                        </span>
                         <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-600/50 text-gray-300">Internal</span>
                         <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-brand-blue/20 text-brand-blue">Active</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="relative">
                            <button onClick={() => setIsSubscriptionDropdownOpen(!isSubscriptionDropdownOpen)} className="flex items-center space-x-1 text-sm text-gray-300 border border-gray-600 rounded px-3 py-1.5 hover:bg-gray-700 w-64 justify-between">
                                <span className="truncate">{subscriptionData.name}</span>
                                <ChevronDownIcon className="h-4 w-4" />
                            </button>
                            {isSubscriptionDropdownOpen && (
                                <div className="absolute mt-1 w-64 bg-gray-700 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                                    {subscriptions.map((sub) => (
                                        <a
                                            key={sub.id}
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setSelectedSubscriptionId(sub.id);
                                                setIsSubscriptionDropdownOpen(false);
                                            }}
                                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 truncate"
                                        >
                                            {sub.name}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button className="flex items-center space-x-1 text-sm text-gray-300 border border-gray-600 rounded px-3 py-1.5 hover:bg-gray-700">
                            <span>Last 30 mins</span>
                            <ChevronDownIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <h4 className="font-semibold text-gray-300 mb-4">SLOs and metrics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
                    {subscriptionData.slos.map(slo => <SloCard key={slo.name} metric={slo} />)}
                    <SloCard metric={subscriptionData.dlqAge} />
                    <SloCard metric={subscriptionData.dlqDepth} />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2 bg-gray-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-300 mb-4">RED metrics</h4>
                        <ComposedTrendChart 
                            data={subscriptionData.redMetrics}
                            bars={[
                                { dataKey: 'success', color: '#FBBF24', name: 'Success', stackId: 'a' },
                                { dataKey: 'filtered', color: '#10B981', name: 'Filtered', stackId: 'a' }
                            ]}
                            line={{ dataKey: 'avgLatency', color: '#3B82F6', name: 'Average Latency', yAxisId: 'right' }}
                            yAxisLabel="req"
                            lineYAxisLabel="ms"
                        />
                    </div>
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-300 mb-4">Queue Depth</h4>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={subscriptionData.queueDepthMetrics} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                     <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                     <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                     <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                     <RechartsTooltip {...darkTooltipProps} />
                                     <Line type="monotone" dataKey="value" name="No. of events" stroke="#10B981" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <h4 className="font-semibold text-gray-300 mb-4">Message Metrics</h4>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <SloCard metric={subscriptionData.messageMetrics.totalEvents} />
                    <SloCard metric={subscriptionData.messageMetrics.filteredEvents} />
                    <SloCard metric={subscriptionData.messageMetrics.droppedEvents} />
                    <SloCard metric={subscriptionData.messageMetrics.successEvents} />
                </div>
            </Section>

            {/* Recent Logs */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-md font-semibold text-white mb-4">Recent Logs</h3>
              <div className="h-64 overflow-y-auto font-mono text-xs space-y-2">
                  {logs.length > 0 ? logs.map(log => (
                      <div key={log.id} className={`flex items-start space-x-3 p-1 rounded ${log.severity === 'ERROR' ? 'bg-status-red/10' : ''} ${log.severity === 'WARN' ? 'bg-status-amber/10' : ''}`}>
                         <span className="text-gray-500">{log.timestamp.split('T')[1].replace('Z','')}</span>
                         <span className={`font-bold w-12 ${log.severity === 'ERROR' ? 'text-status-red' : log.severity === 'WARN' ? 'text-status-amber' : 'text-gray-400'}`}>{log.severity}</span>
                         <span className="text-gray-300 flex-1 truncate pr-2" title={log.message}>{log.message.replace('[Atropos] ', '')}</span>
                         <span className="text-brand-purple">{log.subscriber}</span>
                      </div>
                  )) : <p className="text-gray-500 text-center pt-8">No recent logs found for Atropos module.</p>}
              </div>
            </div>
        </div>
    );
};

export default AtroposDashboard;