
import React from 'react';
import { OlympusIcon, QueueListIcon, ComputerDesktopIcon, EllipsisHorizontalIcon } from './icons';
import { useAlerts } from '../contexts/AlertsContext';

interface SidebarProps {
  selectedWorkbench: string;
  onSelectWorkbench: (name: string) => void;
  activeItem: string;
  onSelectItem: (id: string) => void;
}

const NavItem: React.FC<{id: string; label: string; icon: React.ReactNode; activeItem: string; onSelect: (id: string) => void; count?: number; indent?: boolean}> = 
({ id, label, icon, activeItem, onSelect, count, indent = false }) => {
    const isActive = activeItem === id;
    return (
        <a
            href="#"
            onClick={(e) => { e.preventDefault(); onSelect(id); }}
            className={`flex items-center justify-between p-2 rounded-md text-sm transition-colors relative ${
                isActive ? 'bg-brand-blue/20 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            } ${indent ? 'pl-8' : ''}`}
        >
            {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-blue rounded-r-full"></div>}
            <div className="flex items-center space-x-3">
                {icon}
                <span>{label}</span>
            </div>
            {count !== undefined && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${isActive ? 'bg-brand-blue/50' : 'bg-gray-700'}`}>{count}</span>
            )}
        </a>
    );
};

const NavHeader: React.FC<{label: string}> = ({ label }) => (
    <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-2 flex justify-between items-center">
        {label}
        <button className="text-gray-500 hover:text-white"><EllipsisHorizontalIcon className="h-5 w-5" /></button>
    </h3>
);

const Sidebar: React.FC<SidebarProps> = ({ selectedWorkbench, onSelectWorkbench, activeItem, onSelectItem }) => {
  const { unreadCount } = useAlerts();

  return (
    <div className="w-72 bg-gray-800 border-r border-gray-700 flex flex-col p-4 space-y-4">
      <div className="flex items-center space-x-3 px-2 flex-shrink-0">
        <OlympusIcon className="h-8 w-8 text-brand-blue" />
        <h1 className="text-xl font-bold text-white">Command Center</h1>
      </div>
      
      {/* Project selector / Header */}
      <div className="border-t border-b border-gray-700 py-3 px-2 flex items-center space-x-3 flex-shrink-0">
          <div className="w-10 h-10 bg-brand-purple rounded-md flex items-center justify-center font-bold text-lg">
              T
          </div>
          <div>
              <p className="font-semibold text-white">TEST@ABI</p>
              <p className="text-xs text-gray-400">Service Project</p>
          </div>
      </div>
      
      {/* Main navigation */}
      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        <nav className="space-y-1">
            <NavHeader label="Queues" />
            <NavItem id="tasks-all" label="All open" icon={<QueueListIcon />} activeItem={activeItem} onSelect={onSelectItem} count={12} />
            <NavItem id="tasks-assigned" label="Assigned to me" icon={<QueueListIcon />} activeItem={activeItem} onSelect={onSelectItem} count={0} />
            <NavItem id="tasks-open" label="Open tasks" icon={<QueueListIcon />} activeItem={activeItem} onSelect={onSelectItem} count={1} />
        </nav>

        <nav className="space-y-1">
            <NavHeader label="Consoles" />
            <NavItem id="console-file" label="File Application" icon={<ComputerDesktopIcon />} activeItem={activeItem} onSelect={onSelectItem} />
            <NavItem id="console-message" label="Message Application" icon={<ComputerDesktopIcon />} activeItem={activeItem} onSelect={onSelectItem} />
        </nav>
      </div>


      <div className="mt-auto flex-shrink-0">
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
