
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { SUBSCRIBERS, ZONES } from '../constants';
import { Subscriber, TimeRange, Zone } from '../types';

interface DashboardContextType {
  selectedTimeRange: TimeRange;
  setSelectedTimeRange: (timeRange: TimeRange) => void;
  selectedSubscribers: Subscriber[];
  setSelectedSubscribers: (subscribers: Subscriber[]) => void;
  selectedZones: Zone[];
  setSelectedZones: (zones: Zone[]) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>(TimeRange.LAST_24H);
  const [selectedSubscribers, setSelectedSubscribers] = useState<Subscriber[]>([SUBSCRIBERS[0]]);
  const [selectedZones, setSelectedZones] = useState<Zone[]>([ZONES[0]]);

  return (
    <DashboardContext.Provider
      value={{
        selectedTimeRange,
        setSelectedTimeRange,
        selectedSubscribers,
        setSelectedSubscribers,
        selectedZones,
        setSelectedZones,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};