import React, { createContext, useState, useContext, ReactNode } from 'react';
import { View } from '../types';

export interface ViewState {
    currentView: View;
    initialAlertConfig?: { metricId: string };
    selectedTenantId?: string;
}

interface ViewContextType {
  viewState: ViewState;
  setView: (view: View, context?: { metricId?: string; tenantId?: string }) => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export const ViewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [viewState, setViewState] = useState<ViewState>({ currentView: View.CONSOLE });

  const setView = (view: View, context?: { metricId?: string; tenantId?: string }) => {
    setViewState({
        currentView: view,
        initialAlertConfig: context?.metricId ? { metricId: context.metricId } : undefined,
        selectedTenantId: context?.tenantId
    });
  };

  return (
    <ViewContext.Provider value={{ viewState, setView }}>
      {children}
    </ViewContext.Provider>
  );
};

export const useView = (): ViewContextType => {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
};