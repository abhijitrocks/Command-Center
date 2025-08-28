
import React from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { KpiData } from '../types';
import { ChevronRightIcon } from './icons';

interface KpiCardProps {
  data: KpiData;
  onClick: () => void;
}

const KpiCard: React.FC<KpiCardProps> = ({ data, onClick }) => {
  const changeColor = data.changeType === 'increase' ? 'text-status-green' : 'text-status-red';
  const statusColor = {
    green: 'border-status-green',
    amber: 'border-status-amber',
    red: 'border-status-red',
  }[data.status];

  return (
    <div
      className={`bg-gray-800 p-4 rounded-lg border-l-4 ${statusColor} transition-all hover:bg-gray-700/50 cursor-pointer flex flex-col justify-between`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-400">{data.title}</h3>
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
                stroke={data.changeType === 'increase' ? '#10B981' : '#EF4444'}
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
