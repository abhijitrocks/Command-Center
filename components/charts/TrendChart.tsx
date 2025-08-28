import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { TrendData, LatencyData } from '../../types';

interface TrendChartProps {
  title: string;
  data: TrendData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload.find(p => p.dataKey === 'value');
    const previousValue = payload.find(p => p.dataKey === 'previousValue');

    return (
      <div className="bg-gray-900 border border-gray-700 rounded-md p-3 text-sm shadow-lg">
        <p className="label text-gray-400 mb-2">{`${label}`}</p>
        {value && <p className="font-semibold" style={{color: value.stroke}}>{`Current Period: ${value.value.toLocaleString()}`}</p>}
        {previousValue && <p className="font-semibold" style={{color: '#9CA3AF'}}>{`Previous Period: ${previousValue.value.toLocaleString()}`}</p>}
      </div>
    );
  }

  return null;
};

const TrendChart: React.FC<TrendChartProps> = ({ title, data }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg h-80 flex flex-col">
      <h3 className="text-md font-semibold text-white mb-4">{title}</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
               <linearGradient id="colorPreviousValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6B7280" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6B7280" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => typeof value === 'number' ? value.toLocaleString() : value} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorValue)"
              strokeWidth={2}
              name="Current Period"
            />
            <Area
              type="monotone"
              dataKey="previousValue"
              stroke="#6B7280"
              strokeDasharray="3 3"
              fillOpacity={1}
              fill="url(#colorPreviousValue)"
              strokeWidth={2}
              name="Previous Period"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface HistogramChartProps {
  title: string;
  data: LatencyData[];
}

export const HistogramChart: React.FC<HistogramChartProps> = ({ title, data }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg h-80 flex flex-col">
      <h3 className="text-md font-semibold text-white mb-4">{title}</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E1E1E',
                borderColor: '#374151',
                borderRadius: '0.5rem',
              }}
              labelStyle={{ color: '#D1D5DB' }}
              cursor={{fill: 'rgba(139, 92, 246, 0.1)'}}
            />
            <Bar dataKey="count" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


export default TrendChart;