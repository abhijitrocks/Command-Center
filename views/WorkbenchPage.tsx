import React, { useState } from 'react';
import Header from '../components/Header';
import FileApplicationConsole from './FileApplicationConsole';
import MessageApplicationConsole from './MessageApplicationConsole';
import DiaDashboard from './DiaDashboard';
import PerseusDashboard from './PerseusDashboard';
import AtroposDashboard from './AtroposDashboard';
import AlertsPage from './AlertsPage';
import { ConsoleTab, View } from '../types';
import { useView } from '../contexts/ViewContext';
import TenantDetailView from './TenantDetailView';

const WorkbenchPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ConsoleTab>(ConsoleTab.FILE_APP);
  const { viewState, setView } = useView();

  const handleBackToConsole = () => {
    setView(View.CONSOLE);
  };

  const renderActiveView = () => {
    switch (viewState.currentView) {
      case View.DIA:
        return <DiaDashboard onBack={handleBackToConsole} />;
      case View.PERSEUS:
        return <PerseusDashboard onBack={handleBackToConsole} />;
      case View.ATROPOS:
        return <AtroposDashboard onBack={handleBackToConsole} />;
      case View.ALERTS:
        return <AlertsPage />;
      case View.TENANT_DETAIL:
        return <TenantDetailView onBack={handleBackToConsole} />;
      case View.CONSOLE:
      default:
        return (
          <>
            <div className="p-6 border-b border-gray-700">
              <div className="flex space-x-4">
                <TabButton
                  title={ConsoleTab.FILE_APP}
                  isActive={activeTab === ConsoleTab.FILE_APP}
                  onClick={() => setActiveTab(ConsoleTab.FILE_APP)}
                />
                <TabButton
                  title={ConsoleTab.MESSAGE_APP}
                  isActive={activeTab === ConsoleTab.MESSAGE_APP}
                  onClick={() => setActiveTab(ConsoleTab.MESSAGE_APP)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === ConsoleTab.FILE_APP && <FileApplicationConsole />}
              {activeTab === ConsoleTab.MESSAGE_APP && <MessageApplicationConsole />}
            </div>
          </>
        );
    }
  };
  
  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      <Header />
      {renderActiveView()}
    </div>
  );
};

interface TabButtonProps {
  title: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ title, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none ${
        isActive
          ? 'bg-brand-blue text-white'
          : 'text-gray-400 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {title}
    </button>
  );
};

export default WorkbenchPage;