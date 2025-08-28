import React from 'react';
import { useAlerts } from '../contexts/AlertsContext';
import { useView } from '../contexts/ViewContext';
import { View } from '../types';
import { ExclamationTriangleIcon, XCircleIcon } from './icons';

const NotificationsPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { alerts, unreadCount, markAsRead, markAllAsRead } = useAlerts();
    const { setView } = useView();
    
    if (!isOpen) return null;

    const handleViewDetails = (subscriberId: string, alertId: string) => {
        markAsRead(alertId);
        setView(View.TENANT_DETAIL, { tenantId: subscriberId });
        onClose();
    };
    
    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const diff = Math.round((new Date().getTime() - date.getTime()) / 60000); // difference in minutes
        if (diff < 1) return 'Just now';
        if (diff < 60) return `${diff}m ago`;
        const diffHours = Math.round(diff / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="absolute top-16 right-4 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
            <div className="flex justify-between items-center p-3 border-b border-gray-700">
                <h3 className="text-md font-semibold text-white">Notifications</h3>
                {unreadCount > 0 && (
                     <button onClick={markAllAsRead} className="text-xs text-brand-blue hover:underline">
                        Mark all as read
                    </button>
                )}
            </div>
            <div className="max-h-96 overflow-y-auto">
                {alerts.length > 0 ? (
                    alerts.map(alert => (
                         <div key={alert.id} className={`p-3 border-b border-gray-700/50 last:border-b-0 flex items-start space-x-3 ${!alert.isRead ? 'bg-brand-blue/10' : ''}`}>
                            <div className="mt-1 flex-shrink-0">
                                {alert.severity === 'red' ? <XCircleIcon className="h-5 w-5 text-status-red" /> : <ExclamationTriangleIcon className="h-5 w-5 text-status-amber" />}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-white">{alert.title} for {alert.subscriberName}</p>
                                <p className="text-xs text-gray-400 mt-1">{formatTimestamp(alert.timestamp)}</p>
                                <button onClick={() => handleViewDetails(alert.subscriberId, alert.id)} className="text-xs text-brand-blue hover:underline mt-2">
                                    View Details
                                </button>
                            </div>
                         </div>
                    ))
                ) : (
                    <p className="p-4 text-sm text-gray-500 text-center">No new notifications.</p>
                )}
            </div>
        </div>
    );
};

export default NotificationsPanel;
