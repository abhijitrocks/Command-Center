import React from 'react';
import ReactDOM from 'react-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDrilldown } from '../contexts/DrilldownContext';
import { XMarkIcon, DocumentTextIcon, PlusIcon } from './icons';
import { useView } from '../contexts/ViewContext';
import { View } from '../types';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload.find(p => p.dataKey === 'value');
      const previousValue = payload.find(p => p.dataKey === 'previousValue');
  
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-md p-3 text-sm shadow-lg">
          <p className="label text-gray-400 mb-2">{`${label}`}</p>
          {value && <p className="font-semibold" style={{color: '#3B82F6'}}>{`Current Period: ${value.value.toLocaleString()}`}</p>}
          {previousValue && <p className="font-semibold" style={{color: '#9CA3AF'}}>{`Previous Period: ${previousValue.value.toLocaleString()}`}</p>}
        </div>
      );
    }
  
    return null;
};

const DrilldownModal: React.FC = () => {
    const { isOpen, data, closeDrilldown } = useDrilldown();
    const { setView } = useView();

    if (!isOpen || !data) return null;
    
    const handleCreateAlert = () => {
        setView(View.ALERTS, { metricId: data.metricId });
        closeDrilldown();
    };

    const getChangeClasses = (change: string): string => {
        const lowerChange = change.toLowerCase();
        if (lowerChange.startsWith('+') || lowerChange === 'healthy' || lowerChange === 'normal') {
            return 'bg-status-green/20 text-status-green';
        }
        if (lowerChange.startsWith('-') || lowerChange === 'high' || lowerChange === 'needs attention') {
            return 'bg-status-red/20 text-status-red';
        }
        if(lowerChange === '') return '';
        return 'bg-gray-600/50 text-gray-300';
    };

    const modalContent = (
        <div
            className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 transition-opacity"
            onClick={closeDrilldown}
        >
            <div
                className="bg-gray-800 rounded-lg shadow-xl w-full max-w-5xl m-4 border border-gray-700 flex flex-col"
                style={{ height: '90vh' }}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
                    <h2 className="text-lg font-semibold text-white">{data.metricTitle}</h2>
                    <button onClick={closeDrilldown} className="text-gray-400 hover:text-white">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-grow p-6 overflow-y-auto space-y-6">
                    {/* Chart */}
                    <div className="h-80 bg-gray-900/50 p-4 rounded-lg">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.trendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorValueDrill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                     <linearGradient id="colorPreviousValueDrill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6B7280" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#6B7280" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => typeof value === 'number' ? value.toLocaleString() : value} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="#3B82F6" 
                                    fillOpacity={1} 
                                    fill="url(#colorValueDrill)" 
                                    strokeWidth={2} 
                                    name="Current Period"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="previousValue"
                                    stroke="#6B7280"
                                    strokeDasharray="3 3"
                                    fillOpacity={1}
                                    fill="url(#colorPreviousValueDrill)"
                                    strokeWidth={2}
                                    name="Previous Period"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Contributors and Logs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-900/50 p-4 rounded-lg">
                            <h3 className="text-md font-semibold text-white mb-4">{data.contributorTitle}</h3>
                            <div className="space-y-2">
                                {data.contributors.map(c => (
                                    <div key={c.name} className="flex justify-between items-center text-sm border-b border-gray-700/50 py-2.5 last:border-b-0">
                                        <span className="font-medium text-gray-300">{c.name}</span>
                                        <div className="flex items-center text-right">
                                            <span className="font-semibold text-white mr-4">{c.value}</span>
                                            {c.change && <span className={`w-28 text-center text-xs font-semibold px-2 py-0.5 rounded-full ${getChangeClasses(c.change)}`}>{c.change}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gray-900/50 p-4 rounded-lg">
                            <h3 className="text-md font-semibold text-white mb-4">Relevant Logs</h3>
                             <div className="font-mono text-xs space-y-2 h-48 overflow-y-auto">
                                {data.logs.length > 0 ? data.logs.map(log => (
                                     <div key={log.id} className={`flex items-start space-x-3 p-1 rounded ${log.severity === 'ERROR' ? 'bg-status-red/10' : ''} ${log.severity === 'WARN' ? 'bg-status-amber/10' : ''}`}>
                                        <span className="text-gray-500">{log.timestamp.split('T')[1].replace('Z','')}</span>
                                        <span className={`font-bold w-12 ${log.severity === 'ERROR' ? 'text-status-red' : log.severity === 'WARN' ? 'text-status-amber' : 'text-gray-400'}`}>{log.severity}</span>
                                        <span className="text-gray-300 flex-1 truncate pr-2" title={log.message}>{log.message}</span>
                                     </div>
                                )) : <p className="text-gray-500 text-center pt-8">No relevant logs found.</p>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end items-center p-4 border-t border-gray-700 flex-shrink-0 space-x-3">
                    <button className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                        <DocumentTextIcon className="h-4 w-4"/>
                        <span>Create Engagement Task</span>
                    </button>
                    <button onClick={handleCreateAlert} className="flex items-center space-x-2 bg-brand-blue/80 hover:bg-brand-blue text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                        <PlusIcon className="h-4 w-4"/>
                        <span>Create Alert Rule</span>
                    </button>
                </div>
            </div>
        </div>
    );

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) {
        console.error("The element #modal-root was not found");
        return null;
    }

    return ReactDOM.createPortal(modalContent, modalRoot);
};

export default DrilldownModal;