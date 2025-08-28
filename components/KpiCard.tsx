import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { KpiData } from '../types';
import { ChevronRightIcon, InformationCircleIcon } from './icons';
import Tooltip from './Tooltip';
import { useDrilldown } from '../contexts/DrilldownContext';
import { getDrilldownData } from '../data/mockData';
import { useDashboard } from '../contexts/DashboardContext';

interface KpiCardProps {
  data: KpiData;
}

const KpiCard: React.FC<KpiCardProps> = ({ data }) => {
  const { openDrilldown } = useDrilldown();
  const { selectedSubscribers, selectedZones } = useDashboard();
  
  const changeColor = data.change.startsWith('+') ? 'text-status-green' : 'text-status-red';
  const statusColor = {
    green: 'border-status-green',
    amber: 'border-status-amber',
    red: 'border-status-red',
  }[data.status];
  
  const handleClick = () => {
    const drilldownData = getDrilldownData(data.id, data.title, selectedSubscribers, selectedZones);
    openDrilldown(drilldownData);
  };

  return (
    <div
      className={`bg-gray-800 p-4 rounded-lg border-l-4 ${statusColor} transition-all hover:bg-gray-700/50 cursor-pointer flex flex-col justify-between`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
      aria-label={`View details for ${data.title}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-1.5">
            <h3 className="text-sm font-medium text-gray-400">{data.title}</h3>
            <Tooltip content={data.description}>
              <InformationCircleIcon className="h-4 w-4 text-gray-500" />
            </Tooltip>
          </div>
          <p className="text-3xl font-bold text-white mt-1">{data.value}</p>
        </div>
        <ChevronRightIcon className="h-6 w-6 text-gray-500" />
      </div>
      <div className="flex items-end justify-between mt-4">
        <p className={`text-sm font-medium ${changeColor}`}>{data.change} vs prior period</p>
        <div className="w-24 h-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.sparkline} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={data.change.startsWith('+') ? '#10B981' : '#EF4444'}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default KpiCard;