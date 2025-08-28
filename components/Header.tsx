import React, { useState } from 'react';
// FIX: Removed TIME_RANGES from import as it does not exist in constants.ts
import { SUBSCRIBERS, ZONES } from '../constants';
import { useDashboard } from '../contexts/DashboardContext';
import { Subscriber, TimeRange, Zone, View } from '../types';
import { PlusIcon, ArrowPathIcon, ChevronDownIcon, DocumentTextIcon } from './icons';
import { useView } from '../contexts/ViewContext';

const Header: React.FC = () => {
    const { 
        selectedTimeRange, setSelectedTimeRange, 
        selectedSubscribers, setSelectedSubscribers,
        selectedZones, setSelectedZones
    } = useDashboard();
    const { setView } = useView();
    
    // For multiselect subscriber dropdown
    const SubscriberDropdown = () => {
        const [isOpen, setIsOpen] = useState(false);

        const handleSubscriberSelect = (subscriber: Subscriber) => {
             if (subscriber.id === 'all') {
                setSelectedSubscribers([SUBSCRIBERS[0]]);
             } else {
                let newSelection;
                const isAllSelected = selectedSubscribers.find(t => t.id === 'all');
                if (isAllSelected) {
                    newSelection = [subscriber];
                } else {
                    const existing = selectedSubscribers.find(t => t.id === subscriber.id);
                    if(existing) {
                        newSelection = selectedSubscribers.filter(t => t.id !== subscriber.id);
                        if(newSelection.length === 0) newSelection = [SUBSCRIBERS[0]];
                    } else {
                        newSelection = [...selectedSubscribers, subscriber];
                    }
                }
                setSelectedSubscribers(newSelection);
             }
        }
        
        const displayValue = selectedSubscribers.length === 1 ? selectedSubscribers[0].name : `${selectedSubscribers.length} subscribers`;

        const isAllZones = selectedZones.some(z => z.id === 'all');
        const availableSubscribers = isAllZones
            ? SUBSCRIBERS
            : [SUBSCRIBERS[0], ...SUBSCRIBERS.filter(t => t.id !== 'all' && selectedZones.some(z => z.id === t.zoneId))];


        return (
             <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between w-40 bg-gray-700 px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-600"
                >
                    <span className="truncate">{displayValue}</span>
                    <ChevronDownIcon className="h-4 w-4 ml-2 flex-shrink-0" />
                </button>
                {isOpen && (
                    <div className="absolute mt-1 w-48 bg-gray-700 rounded-md shadow-lg z-10 p-2">
                        {availableSubscribers.map((subscriber) => (
                            <label key={subscriber.id} className="flex items-center space-x-2 px-2 py-1.5 hover:bg-gray-600 rounded">
                                <input 
                                    type="checkbox" 
                                    className="form-checkbox h-4 w-4 rounded bg-gray-800 border-gray-600 text-brand-blue focus:ring-brand-blue"
                                    checked={selectedSubscribers.some(t => t.id === subscriber.id)}
                                    onChange={() => handleSubscriberSelect(subscriber)}
                                />
                                <span className="text-sm text-gray-300">{subscriber.name}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    const ZoneDropdown = () => {
        const [isOpen, setIsOpen] = useState(false);

        const handleZoneSelect = (zone: Zone) => {
            let newZoneSelection;
            if (zone.id === 'all') {
                newZoneSelection = [ZONES[0]];
            } else {
                const isAllSelected = selectedZones.some(z => z.id === 'all');
                if (isAllSelected) {
                    newZoneSelection = [zone];
                } else {
                    const existing = selectedZones.find(z => z.id === zone.id);
                    if (existing) {
                        newZoneSelection = selectedZones.filter(z => z.id !== zone.id);
                        if (newZoneSelection.length === 0) newZoneSelection = [ZONES[0]];
                    } else {
                        newZoneSelection = [...selectedZones, zone];
                    }
                }
            }
            setSelectedZones(newZoneSelection);

            // Prune selected subscribers to remove any that are not in the new zone selection.
            const isAllSubscribersSelected = selectedSubscribers.some(t => t.id === 'all');
            const isAllZonesSelectedNow = newZoneSelection.some(z => z.id === 'all');
            
            if (!isAllSubscribersSelected && !isAllZonesSelectedNow) {
                const validSubscribers = selectedSubscribers.filter(t => newZoneSelection.some(z => z.id === t.zoneId));
                if (validSubscribers.length !== selectedSubscribers.length) {
                    setSelectedSubscribers(validSubscribers.length > 0 ? validSubscribers : [SUBSCRIBERS[0]]);
                }
            }
        }
        
        const displayValue = selectedZones.length === 1 ? selectedZones[0].name : `${selectedZones.length} zones`;

        return (
             <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between w-40 bg-gray-700 px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-600"
                >
                    <span className="truncate">{displayValue}</span>
                    <ChevronDownIcon className="h-4 w-4 ml-2 flex-shrink-0" />
                </button>
                {isOpen && (
                    <div className="absolute mt-1 w-48 bg-gray-700 rounded-md shadow-lg z-10 p-2">
                        {ZONES.map((zone) => (
                            <label key={zone.id} className="flex items-center space-x-2 px-2 py-1.5 hover:bg-gray-600 rounded">
                                <input 
                                    type="checkbox" 
                                    className="form-checkbox h-4 w-4 rounded bg-gray-800 border-gray-600 text-brand-blue focus:ring-brand-blue"
                                    checked={selectedZones.some(z => z.id === zone.id)}
                                    onChange={() => handleZoneSelect(zone)}
                                />
                                <span className="text-sm text-gray-300">{zone.name}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    const TimeRangeDropdown = () => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between w-36 bg-gray-700 px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-600"
                >
                    <span>{selectedTimeRange}</span>
                    <ChevronDownIcon className="h-4 w-4 ml-2" />
                </button>
                {isOpen && (
                    <div className="absolute mt-1 w-36 bg-gray-700 rounded-md shadow-lg z-10">
                        {(Object.values(TimeRange) as TimeRange[]).map((item) => (
                            <a
                                key={item}
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedTimeRange(item);
                                    setIsOpen(false);
                                }}
                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                            >
                                {item}
                            </a>
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
      <div className="flex items-center space-x-2">
        <SubscriberDropdown/>
        <ZoneDropdown />
        <TimeRangeDropdown />
        <button className="bg-gray-700 p-2 rounded-md text-white hover:bg-gray-600" title="Create Alert" onClick={() => setView(View.ALERTS)}>
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