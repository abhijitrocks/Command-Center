
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import WorkbenchPage from './views/WorkbenchPage';
import TasksPage from './views/TasksPage';
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
  const [activeWorkbenchItem, setActiveWorkbenchItem] = useState('console-file');

  const renderWorkbenchContent = () => {
    if (activeWorkbenchItem.startsWith('console')) {
        const consoleType = activeWorkbenchItem === 'console-message' ? 'message' : 'file';
        return <WorkbenchPage activeConsole={consoleType} />;
    }
    if (activeWorkbenchItem.startsWith('tasks')) {
        return <TasksPage queueId={activeWorkbenchItem} />;
    }
    // Default to file console
    return <WorkbenchPage activeConsole="file" />;
  };

  return (
    <NotificationProvider>
      <AlertsProvider>
        <DashboardProvider>
          <DrilldownProvider>
            <ViewProvider>
              <JobRunsProvider>
                <div className="flex h-screen bg-gray-900 font-sans">
                  <Sidebar 
                    selectedWorkbench={selectedWorkbench} 
                    onSelectWorkbench={setSelectedWorkbench}
                    activeItem={activeWorkbenchItem}
                    onSelectItem={setActiveWorkbenchItem}
                  />
                  <main className="flex-1 flex flex-col">
                    {selectedWorkbench === 'Olympus HUB' && renderWorkbenchContent()}
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
