
import React, { useState } from 'react';
import { ArrowLeftIcon, InformationCircleIcon, ChevronDownIcon } from '../components/icons';
import { useDashboard } from '../contexts/DashboardContext';
import { getDiaNorthStarKpis, getDiaSupplementaryData } from '../data/mockData';
import { DiaNsmKpi } from '../types';
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Area,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line,
} from 'recharts';

interface DiaDashboardProps {
    onBack: () => void;
}

const TabButton: React.FC<{title: string, isActive: boolean, onClick: () => void}> = ({ title, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium focus:outline-none transition-colors ${
            isActive
            ? 'border-b-2 border-brand-blue text-white font-semibold'
            : 'text-gray-400 hover:text-white border-b-2 border-transparent'
        }`}
    >
        {title}
    </button>
);

const NsmCard: React.FC<{ kpi: DiaNsmKpi }> = ({ kpi }) => (
    <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center space-x-2 text-gray-400">
            <h3 className="text-sm font-medium">{kpi.title}</h3>
            <InformationCircleIcon className="h-4 w-4" />
        </div>
        <p className="text-4xl font-bold text-white mt-2">{kpi.value}</p>
        <div className="flex items-center text-sm mt-4 text-status-green">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span>{kpi.change}</span>
        </div>
    </div>
);

const ChartCard: React.FC<{ title: string, children: React.ReactNode, monthlyToggle?: boolean }> = ({ title, children, monthlyToggle = false }) => (
    <div className="bg-gray-800 rounded-lg p-6 flex flex-col h-[400px]">
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-white">{title}</h4>
                <InformationCircleIcon className="h-4 w-4 text-gray-400" />
            </div>
            {monthlyToggle && (
                <button className="flex items-center space-x-1 text-sm text-gray-300 border border-gray-600 rounded px-2 py-0.5 hover:bg-gray-700">
                    <span>Monthly</span>
                    <ChevronDownIcon className="h-3 w-3" />
                </button>
            )}
        </div>
        <div className="flex-1 -ml-6">
            {children}
        </div>
    </div>
);


const DiaDashboard: React.FC<DiaDashboardProps> = ({ onBack }) => {
    const { selectedSubscribers, selectedZones } = useDashboard();
    const [activeTab, setActiveTab] = useState('north_star');

    const nsmKpis = getDiaNorthStarKpis(selectedSubscribers, selectedZones);
    const supplementaryData = getDiaSupplementaryData(selectedSubscribers, selectedZones);

    const darkTooltipProps = {
        contentStyle: { backgroundColor: '#1E1E1E', borderColor: '#374151', borderRadius: '0.5rem' },
        itemStyle: { color: '#E5E7EB' },
        labelStyle: { color: '#9CA3AF' }
    };

    const renderNorthStarMetrics = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-4xl">
            {nsmKpis.map(kpi => <NsmCard key={kpi.id} kpi={kpi} />)}
        </div>
    );
    
    const renderSupplementaryMetrics = () => (
        <div className="space-y-8 mt-6">
            {/* Health Section */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <span className="w-1 h-5 bg-brand-blue mr-3 rounded-full"></span>Health
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ChartCard title="Yearly Uptime">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={supplementaryData.yearlyUptime} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="#9CA3AF" />
                                <YAxis domain={[99, 100]} axisLine={false} tickLine={false} fontSize={12} tickFormatter={val => `${val}%`} stroke="#9CA3AF" />
                                <RechartsTooltip {...darkTooltipProps} />
                                <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} dot={false} name="Uptime"/>
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartCard>
                    <ChartCard title="Error Rate" monthlyToggle>
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={supplementaryData.errorRate} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="#9CA3AF" />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} tickFormatter={val => `${val.toFixed(0)}%`} stroke="#9CA3AF" />
                                <RechartsTooltip {...darkTooltipProps} formatter={(value: number) => [`${value.toFixed(2)}%`, "Error Rate"]} />
                                <Bar dataKey="value" fill="#EF4444" name="Error Rate" barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>
            </div>

            {/* Performance Section */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <span className="w-1 h-5 bg-brand-blue mr-3 rounded-full"></span>Performance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <ChartCard title="Average Transfer Speed" monthlyToggle>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={supplementaryData.avgTransferSpeed} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="#9CA3AF" />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} tickFormatter={val => `${val.toFixed(0)} MB/s`} stroke="#9CA3AF" />
                                <RechartsTooltip {...darkTooltipProps} formatter={(value: number) => [`${value.toFixed(1)} MB/s`, "Speed"]} />
                                <Area type="monotone" dataKey="value" stroke="#10B981" fill="url(#colorSpeed)" strokeWidth={2} name="Speed"/>
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartCard>
                     <ChartCard title="Transfer Latency" monthlyToggle>
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={supplementaryData.transferLatency} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="#9CA3AF" />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} tickFormatter={val => `${val.toFixed(1)}s`} stroke="#9CA3AF" />
                                <RechartsTooltip {...darkTooltipProps} formatter={(value: number) => [`${value.toFixed(2)}s`, "Latency"]} />
                                <Bar dataKey="value" fill="#3B82F6" name="Latency" barSize={20}/>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>
            </div>

            {/* Business Section */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <span className="w-1 h-5 bg-brand-blue mr-3 rounded-full"></span>Business
                </h3>
                 <div className="grid grid-cols-1">
                    <ChartCard title="Monthly Cost (IN MILLIONS)">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={supplementaryData.monthlyClusterCost.data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="#9CA3AF" />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} tickFormatter={val => `$${val.toFixed(0)}`} stroke="#9CA3AF" />
                                <RechartsTooltip {...darkTooltipProps} />
                                <Legend iconType="circle" iconSize={8} />
                                {supplementaryData.monthlyClusterCost.keys.map(item => (
                                    <Bar key={item.key} dataKey={item.key} stackId="a" fill={item.color} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>
            </div>
        </div>
    );


    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center space-x-3">
                <button onClick={onBack} className="text-gray-400 hover:text-white">
                    <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold text-white">DIA Module Dashboard</h2>
            </div>
            
            <div className="border-b border-gray-700">
                <nav className="-mb-px flex space-x-6">
                    <TabButton title="North Star Metrics" isActive={activeTab === 'north_star'} onClick={() => setActiveTab('north_star')} />
                    <TabButton title="Supplementary Metrics" isActive={activeTab === 'supplementary'} onClick={() => setActiveTab('supplementary')} />
                </nav>
            </div>

            {/* Content */}
            {activeTab === 'north_star' ? renderNorthStarMetrics() : renderSupplementaryMetrics()}
        </div>
    );
};

export default DiaDashboard;
