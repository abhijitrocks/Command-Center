import React, { createContext, useState, useContext, ReactNode } from 'react';
import { DrilldownData } from '../types';

interface DrilldownContextType {
  isOpen: boolean;
  data: DrilldownData | null;
  openDrilldown: (data: DrilldownData) => void;
  closeDrilldown: () => void;
}

const DrilldownContext = createContext<DrilldownContextType | undefined>(undefined);

export const DrilldownProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<DrilldownData | null>(null);

  const openDrilldown = (drilldownData: DrilldownData) => {
    setData(drilldownData);
    setIsOpen(true);
  };

  const closeDrilldown = () => {
    setIsOpen(false);
    setData(null);
  };

  return (
    <DrilldownContext.Provider value={{ isOpen, data, openDrilldown, closeDrilldown }}>
      {children}
    </DrilldownContext.Provider>
  );
};

export const useDrilldown = (): DrilldownContextType => {
  const context = useContext(DrilldownContext);
  if (context === undefined) {
    throw new Error('useDrilldown must be used within a DrilldownProvider');
  }
  return context;
};
