import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, TrashIcon } from '../components/icons';
import { useView } from '../contexts/ViewContext';
import { getAlertableMetrics, getExistingAlerts } from '../data/mockData';
import { AlertRule, AlertCondition, AlertAction, View, AlertableMetric } from '../types';

const initialNewAlertState: Omit<AlertRule, 'id'> = {
    name: '',
    metricId: '',
    condition: AlertCondition.ABOVE,
    threshold: 0,
    duration: 5,
    actions: [],
    isEnabled: true,
};

const AlertsPage: React.FC = () => {
    const { viewState, setView } = useView();
    const [alerts, setAlerts] = useState<AlertRule[]>(getExistingAlerts());
    const [newAlert, setNewAlert] = useState<Omit<AlertRule, 'id'>>(initialNewAlertState);
    const alertableMetrics = getAlertableMetrics();

    useEffect(() => {
        if (viewState.initialAlertConfig?.metricId) {
            setNewAlert(prev => ({ ...prev, metricId: viewState.initialAlertConfig.metricId }));
        }
    }, [viewState.initialAlertConfig]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewAlert(prev => ({ ...prev, [name]: name === 'threshold' || name === 'duration' ? parseFloat(value) : value }));
    };

    const handleActionChange = (action: AlertAction) => {
        setNewAlert(prev => {
            const newActions = prev.actions.includes(action)
                ? prev.actions.filter(a => a !== action)
                : [...prev.actions, action];
            return { ...prev, actions: newActions };
        });
    };

    const handleSaveAlert = () => {
        if (!newAlert.name || !newAlert.metricId) {
            alert("Please fill in Alert Name and select a Metric.");
            return;
        }
        const alertToAdd: AlertRule = {
            id: new Date().toISOString(),
            ...newAlert
        };
        setAlerts(prev => [alertToAdd, ...prev]);
        setNewAlert(initialNewAlertState);
    };

    const handleDeleteAlert = (id: string) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    const getMetricName = (metricId: string) => {
        return alertableMetrics.find(m => m.id === metricId)?.name || 'Unknown Metric';
    };

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div className="flex items-center space-x-3">
                <button onClick={() => setView(View.CONSOLE)} className="text-gray-400 hover:text-white">
                    <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold text-white">Alerts Builder</h2>
            </div>

            {/* Alert Builder Form */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-6">
                <h3 className="text-lg font-semibold text-white">Create New Alert Rule</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Alert Name */}
                    <div className="col-span-1 md:col-span-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Alert Name</label>
                        <input type="text" name="name" id="name" value={newAlert.name} onChange={handleInputChange} className="w-full bg-gray-700 border-gray-600 rounded-md text-white px-3 py-2 text-sm focus:ring-brand-blue focus:border-brand-blue" placeholder="e.g., High Error Rate (Production)" />
                    </div>
                    {/* Metric */}
                    <div>
                        <label htmlFor="metricId" className="block text-sm font-medium text-gray-400 mb-1">Metric</label>
                        <select name="metricId" id="metricId" value={newAlert.metricId} onChange={handleInputChange} className="w-full bg-gray-700 border-gray-600 rounded-md text-white px-3 py-2 text-sm focus:ring-brand-blue focus:border-brand-blue">
                            <option value="">Select a metric...</option>
                            {alertableMetrics.map(metric => <option key={metric.id} value={metric.id}>{metric.name}</option>)}
                        </select>
                    </div>
                     {/* Condition */}
                     <div>
                        <label htmlFor="condition" className="block text-sm font-medium text-gray-400 mb-1">Condition</label>
                        <select name="condition" id="condition" value={newAlert.condition} onChange={handleInputChange} className="w-full bg-gray-700 border-gray-600 rounded-md text-white px-3 py-2 text-sm focus:ring-brand-blue focus:border-brand-blue">
                            {Object.values(AlertCondition).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    {/* Threshold & Duration */}
                    <div>
                         <label htmlFor="threshold" className="block text-sm font-medium text-gray-400 mb-1">Threshold</label>
                         <input type="number" name="threshold" id="threshold" value={newAlert.threshold} onChange={handleInputChange} className="w-full bg-gray-700 border-gray-600 rounded-md text-white px-3 py-2 text-sm focus:ring-brand-blue focus:border-brand-blue" />
                    </div>
                    <div>
                         <label htmlFor="duration" className="block text-sm font-medium text-gray-400 mb-1">Sustained For (minutes)</label>
                         <input type="number" name="duration" id="duration" value={newAlert.duration} onChange={handleInputChange} className="w-full bg-gray-700 border-gray-600 rounded-md text-white px-3 py-2 text-sm focus:ring-brand-blue focus:border-brand-blue" />
                    </div>
                </div>
                 {/* Actions */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Actions</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.values(AlertAction).map(action => (
                             <label key={action} className="flex items-center space-x-2">
                                <input type="checkbox" checked={newAlert.actions.includes(action)} onChange={() => handleActionChange(action)} className="form-checkbox h-4 w-4 rounded bg-gray-800 border-gray-600 text-brand-blue focus:ring-brand-blue" />
                                <span className="text-sm text-gray-300">{action}</span>
                            </label>
                        ))}
                    </div>
                </div>
                {/* Save Button */}
                <div className="flex justify-end">
                    <button onClick={handleSaveAlert} className="bg-brand-blue hover:bg-brand-blue/80 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">Save Alert</button>
                </div>
            </div>

            {/* My Alerts List */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">My Alerts</h3>
                <div className="space-y-4">
                    {alerts.map(alert => (
                        <div key={alert.id} className="bg-gray-700/50 p-4 rounded-lg flex items-center justify-between">
                           <div className="flex-1">
                               <p className="font-semibold text-white">{alert.name}</p>
                               <p className="text-sm text-gray-400 mt-1">
                                   <span className="font-medium text-gray-300">IF</span> {getMetricName(alert.metricId)}{' '}
                                   <span className="font-medium text-gray-300">{alert.condition}</span> {alert.threshold}{' '}
                                   <span className="font-medium text-gray-300">for</span> {alert.duration} mins
                               </p>
                               <p className="text-xs text-brand-purple mt-2">{alert.actions.join(', ')}</p>
                           </div>
                           <div className="flex items-center space-x-4">
                               <label htmlFor={`toggle-${alert.id}`} className="flex items-center cursor-pointer">
                                  <div className="relative">
                                    <input type="checkbox" id={`toggle-${alert.id}`} className="sr-only" checked={alert.isEnabled} onChange={() => setAlerts(alerts.map(a => a.id === alert.id ? {...a, isEnabled: !a.isEnabled} : a))} />
                                    <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${alert.isEnabled ? 'translate-x-4 bg-brand-blue' : ''}`}></div>
                                  </div>
                                </label>
                                <button onClick={() => handleDeleteAlert(alert.id)} className="text-gray-500 hover:text-status-red">
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                           </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AlertsPage;
