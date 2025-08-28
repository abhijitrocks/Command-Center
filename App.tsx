import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import WorkbenchPage from './views/WorkbenchPage';
import { DashboardProvider } from './contexts/DashboardContext';
import { DrilldownProvider } from './contexts/DrilldownContext';
import DrilldownModal from './components/DrilldownModal';
import { ViewProvider } from './contexts/ViewContext';
import { JobRunsProvider } from './contexts/JobRunsContext';
import JobRunsModal from './components/JobRunsModal';

const App: React.FC = () => {
  const [selectedWorkbench, setSelectedWorkbench] = useState<string>('Olympus HUB');

  return (
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
          </JobRunsProvider>
        </ViewProvider>
      </DrilldownProvider>
    </DashboardProvider>
  );
};

export default App;
