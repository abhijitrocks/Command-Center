import React from 'react';
import { SloMetric } from '../types';
import { InformationCircleIcon } from './icons';
import Tooltip from './Tooltip';

interface SloCardProps {
  metric: SloMetric;
  description?: string;
}

const SloCard: React.FC<SloCardProps> = ({ metric, description }) => {
    const statusColor = {
        green: 'text-status-green',
        amber: 'text-status-amber',
        red: 'text-status-red',
        neutral: 'text-gray-300'
    }[metric.status];

  return (
    <div className="bg-gray-900/50 p-3 rounded-lg">
      <div className="flex items-center space-x-1.5 text-sm text-gray-400">
        <span>{metric.name}</span>
        {description && 
            <Tooltip content={description}>
                <InformationCircleIcon className="h-4 w-4" />
            </Tooltip>
        }
      </div>
      <p className={`text-2xl font-bold mt-1 ${statusColor}`}>{metric.value}</p>
    </div>
  );
};

export default SloCard;
