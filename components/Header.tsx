import React, { useState } from 'react';
import { TENANTS, TIME_RANGES } from '../constants';
import { useDashboard } from '../contexts/DashboardContext';
import { Tenant, TimeRange } from '../types';
// Fix: Add DocumentTextIcon to imports to resolve 'Cannot find name' error.
import { PlusIcon, ArrowPathIcon, ChevronDownIcon, DocumentTextIcon } from './icons';

const Header: React.FC = () => {
    const { selectedTimeRange, setSelectedTimeRange, selectedTenants, setSelectedTenants } = useDashboard();

    // A simple dropdown component
    const Dropdown = <T,>({ items, selected, onSelect, displayFn }: { items: T[], selected: T, onSelect: (item: T) => void, displayFn: (item: T) => string }) => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between w-36 bg-gray-700 px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-600"
                >
                    <span>{displayFn(selected)}</span>
                    <ChevronDownIcon className="h-4 w-4 ml-2" />
                </button>
                {isOpen && (
                    <div className="absolute mt-1 w-36 bg-gray-700 rounded-md shadow-lg z-10">
                        {items.map((item, index) => (
                            <a
                                key={index}
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onSelect(item);
                                    setIsOpen(false);
                                }}
                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                            >
                                {displayFn(item)}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        );
    };
    
    // For multiselect tenant dropdown
    const TenantDropdown = () => {
        const [isOpen, setIsOpen] = useState(false);

        const handleTenantSelect = (tenant: Tenant) => {
             if (tenant.id === 'all') {
                setSelectedTenants([TENANTS[0]]);
             } else {
                let newSelection;
                if (selectedTenants.find(t => t.id === 'all')) {
                    newSelection = [tenant];
                } else {
                    const existing = selectedTenants.find(t => t.id === tenant.id);
                    if(existing) {
                        newSelection = selectedTenants.filter(t => t.id !== tenant.id);
                        if(newSelection.length === 0) newSelection = [TENANTS[0]];
                    } else {
                        newSelection = [...selectedTenants, tenant];
                    }
                }
                setSelectedTenants(newSelection);
             }
        }
        
        const displayValue = selectedTenants.length === 1 ? selectedTenants[0].name : `${selectedTenants.length} tenants`;

        return (
             <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between w-40 bg-gray-700 px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-600"
                >
                    <span>{displayValue}</span>
                    <ChevronDownIcon className="h-4 w-4 ml-2" />
                </button>
                {isOpen && (
                    <div className="absolute mt-1 w-48 bg-gray-700 rounded-md shadow-lg z-10 p-2">
                        {TENANTS.map((tenant) => (
                            <label key={tenant.id} className="flex items-center space-x-2 px-2 py-1.5 hover:bg-gray-600 rounded">
                                <input 
                                    type="checkbox" 
                                    className="form-checkbox h-4 w-4 rounded bg-gray-800 border-gray-600 text-brand-blue focus:ring-brand-blue"
                                    checked={selectedTenants.some(t => t.id === tenant.id)}
                                    onChange={() => handleTenantSelect(tenant)}
                                />
                                <span className="text-sm text-gray-300">{tenant.name}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        )
    }

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
      <div>
        <h1 className="text-2xl font-bold text-white">Olympus HUB</h1>
        <p className="text-sm text-gray-400">File & Message Apps</p>
      </div>
      <div className="flex items-center space-x-4">
        <Dropdown
          items={TIME_RANGES as TimeRange[]}
          selected={selectedTimeRange}
          onSelect={(item) => setSelectedTimeRange(item)}
          displayFn={(item) => item}
        />
        <TenantDropdown/>
        {/* Fix: The 'title' prop is not valid for these icon components. It has been moved to the parent button to provide a tooltip and fix the prop type error. */}
        <button className="bg-gray-700 p-2 rounded-md text-white hover:bg-gray-600" title="Create Alert">
            <PlusIcon />
        </button>
        <button className="bg-gray-700 p-2 rounded-md text-white hover:bg-gray-600" title="New Engagement Task">
            <DocumentTextIcon />
        </button>
        <button className="bg-gray-700 p-2 rounded-md text-white hover:bg-gray-600" title="Refresh">
            <ArrowPathIcon className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;