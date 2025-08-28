
import React from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { CheckCircleIcon, XCircleIcon } from './icons';

const NotificationContainer: React.FC = () => {
  const { notifications } = useNotification();

  return (
    <div className="fixed top-5 right-5 z-[100] space-y-3 w-full max-w-sm">
      {notifications.map(notification => {
        const icon = {
          success: <CheckCircleIcon className="h-6 w-6 text-status-green" />,
          error: <XCircleIcon className="h-6 w-6 text-status-red" />,
        }[notification.type];

        const bgColor = {
            success: 'bg-status-green/10 border-status-green/50',
            error: 'bg-status-red/10 border-status-red/50',
        }[notification.type];

        return (
          <div
            key={notification.id}
            className={`flex items-start p-4 rounded-lg shadow-lg border ${bgColor} bg-gray-800 animate-fade-in-right`}
            role="alert"
          >
            <div className="flex-shrink-0">{icon}</div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{notification.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationContainer;
