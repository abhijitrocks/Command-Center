
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import WorkbenchPage from './views/WorkbenchPage';
import { DashboardProvider } from './contexts/DashboardContext';

const App: React.FC = () => {
  const [selectedWorkbench, setSelectedWorkbench] = useState<string>('Olympus HUB');

  return (
    <DashboardProvider>
      <div className="flex h-screen bg-gray-900 font-sans">
        <Sidebar selectedWorkbench={selectedWorkbench} onSelectWorkbench={setSelectedWorkbench} />
        <main className="flex-1 flex flex-col overflow-hidden">
          {selectedWorkbench === 'Olympus HUB' && <WorkbenchPage />}
        </main>
      </div>
    </DashboardProvider>
  );
};

export default App;
