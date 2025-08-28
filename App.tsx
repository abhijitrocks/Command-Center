
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import WorkbenchPage from './views/WorkbenchPage';
import { DashboardProvider } from './contexts/DashboardContext';
import { DrilldownProvider } from './contexts/DrilldownContext';
import DrilldownModal from './components/DrilldownModal';
import { ViewProvider } from './contexts/ViewContext';
import { JobRunsProvider } from './contexts/JobRunsContext';
import JobRunsModal from './components/JobRunsModal';
import { NotificationProvider } from './contexts/NotificationContext';
import NotificationContainer from './components/NotificationContainer';
import { AlertsProvider } from './contexts/AlertsContext';

const App: React.FC = () => {
  const [selectedWorkbench, setSelectedWorkbench] = useState<string>('Olympus HUB');

  return (
    <NotificationProvider>
      <AlertsProvider>
        <DashboardProvider>
          <DrilldownProvider>
            <ViewProvider>
              <JobRunsProvider>
                <div className="flex h-screen bg-gray-900 font-sans">
                  <Sidebar selectedWorkbench={selectedWorkbench} onSelectWorkbench={setSelectedWorkbench} />
                  <main className="flex-1 flex flex-col">
                    {selectedWorkbench === 'Olympus HUB' && <WorkbenchPage />}
                  </main>
                </div>
                <DrilldownModal />
                <JobRunsModal />
                <NotificationContainer />
              </JobRunsProvider>
            </ViewProvider>
          </DrilldownProvider>
        </DashboardProvider>
      </AlertsProvider>
    </NotificationProvider>
  );
};

export default App;