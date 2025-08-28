import React from 'react';
import { OlympusIcon, BellIcon, ChartBarIcon } from './icons';
import { useAlerts } from '../contexts/AlertsContext';

interface SidebarProps {
  selectedWorkbench: string;
  onSelectWorkbench: (name: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedWorkbench, onSelectWorkbench }) => {
  const { unreadCount } = useAlerts();
  
  const workbenches = [
    { name: 'Olympus HUB', nsm: '1.2M MFT', alerts: unreadCount, icon: <ChartBarIcon /> },
  ];

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col p-4 space-y-6">
      <div className="flex items-center space-x-3 px-2">
        <OlympusIcon className="h-8 w-8 text-brand-blue" />
        <h1 className="text-xl font-bold text-white">Command Center</h1>
      </div>

      <div className="flex-1 space-y-4">
        <h2 className="text-sm font-semibold text-gray-400 px-2">WORKBENCHES</h2>
        <div className="space-y-2">
          {workbenches.map((wb) => (
            <div
              key={wb.name}
              onClick={() => onSelectWorkbench(wb.name)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedWorkbench === wb.name
                  ? 'bg-brand-blue/20 text-white'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{wb.name}</span>
                {wb.alerts > 0 && (
                  <div className="relative">
                    <BellIcon className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-status-red text-xs font-bold text-white">
                      {wb.alerts}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">{wb.nsm}</p>
            </div>
          ))}
        </div>
         <div className="px-2">
            <button className="w-full text-sm text-brand-blue/80 hover:text-brand-blue text-left">+ Create Workbench</button>
            <button className="w-full text-sm text-brand-blue/80 hover:text-brand-blue text-left mt-2">Manage Subscribers</button>
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex items-center space-x-3 p-2">
          <img
            className="h-9 w-9 rounded-full"
            src="https://picsum.photos/100"
            alt="User avatar"
          />
          <div>
            <p className="font-semibold text-white">Win Team User</p>
            <p className="text-xs text-gray-400">user@company.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;