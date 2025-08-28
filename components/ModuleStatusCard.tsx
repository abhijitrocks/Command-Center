import React from 'react';
import { ModuleMetric } from '../types';
import { ArrowUpRightIcon, InformationCircleIcon } from './icons';
import Tooltip from './Tooltip';
import { useDrilldown } from '../contexts/DrilldownContext';
import { getDrilldownData } from '../data/mockData';
import { useDashboard } from '../contexts/DashboardContext';

interface ModuleStatusCardProps {
  title: string;
  metrics: ModuleMetric[];
  onExpand: () => void;
}

const statusColors: { [key: string]: string } = {
  green: 'text-status-green',
  amber: 'text-status-amber',
  red: 'text-status-red',
  neutral: 'text-white'
};

const ModuleStatusCard: React.FC<ModuleStatusCardProps> = ({ title, metrics, onExpand }) => {
    const { openDrilldown } = useDrilldown();
    const { selectedSubscribers, selectedZones } = useDashboard();

    const handleMetricInteraction = (metric: ModuleMetric) => {
        const drilldownData = getDrilldownData(metric.id, metric.name, selectedSubscribers, selectedZones);
        openDrilldown(drilldownData);
    };

  return (
    <div className="bg-gray-800 p-4 rounded-lg flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-semibold text-white">{title}</h3>
        <button onClick={onExpand} className="text-sm text-brand-blue hover:underline flex items-center">
          Expand <ArrowUpRightIcon className="h-4 w-4 ml-1" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {metrics.map(metric => (
          <div 
            key={metric.id} 
            className="cursor-pointer group rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
            onClick={() => handleMetricInteraction(metric)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault(); // Prevent scrolling on spacebar press
                    handleMetricInteraction(metric);
                }
            }}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${metric.name}`}
          >
            <div className="flex items-center space-x-1">
                <p className="text-xs text-gray-400 group-hover:text-white transition-colors">{metric.name}</p>
                <Tooltip content={metric.description}>
                    <InformationCircleIcon className="h-3 w-3 text-gray-500" />
                </Tooltip>
            </div>
            <div className="flex items-baseline space-x-2">
                <p className={`text-xl font-bold ${statusColors[metric.status]} group-hover:brightness-125 transition-all`}>{metric.value}</p>
                {metric.change && (
                    <span className={`text-xs font-semibold ${metric.change.startsWith('+') ? 'text-status-green' : 'text-status-red'}`}>{metric.change}</span>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModuleStatusCard;