
import React, { useState } from 'react';
import Header from '../components/Header';
import FileApplicationConsole from './FileApplicationConsole';
import MessageApplicationConsole from './MessageApplicationConsole';
import { ConsoleTab } from '../types';

const WorkbenchPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ConsoleTab>(ConsoleTab.FILE_APP);

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      <Header />
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
