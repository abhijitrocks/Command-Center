
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { TENANTS } from '../constants';
import { Tenant, TimeRange } from '../types';

interface DashboardContextType {
  selectedTimeRange: TimeRange;
  setSelectedTimeRange: (timeRange: TimeRange) => void;
  selectedTenants: Tenant[];
  setSelectedTenants: (tenants: Tenant[]) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>(TimeRange.LAST_24H);
  const [selectedTenants, setSelectedTenants] = useState<Tenant[]>([TENANTS[0]]);

  return (
    <DashboardContext.Provider
      value={{
        selectedTimeRange,
        setSelectedTimeRange,
        selectedTenants,
        setSelectedTenants,
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
