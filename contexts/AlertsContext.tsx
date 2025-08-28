import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { TriggeredAlert } from '../types';
import { getTriggeredAlerts as fetchAlerts } from '../data/mockData';

interface AlertsContextType {
  alerts: TriggeredAlert[];
  unreadCount: number;
  markAsRead: (alertId: string) => void;
  markAllAsRead: () => void;
}

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

export const AlertsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<TriggeredAlert[]>([]);

  useEffect(() => {
    // In a real app, you might fetch this from an API
    setAlerts(fetchAlerts());
  }, []);

  const unreadCount = useMemo(() => alerts.filter(alert => !alert.isRead).length, [alerts]);

  const markAsRead = (alertId: string) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };

  const markAllAsRead = () => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert => ({ ...alert, isRead: true }))
    );
  };

  return (
    <AlertsContext.Provider value={{ alerts, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </AlertsContext.Provider>
  );
};

export const useAlerts = (): AlertsContextType => {
  const context = useContext(AlertsContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertsProvider');
  }
  return context;
};
