import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Bar,
  Line,
  Legend,
} from 'recharts';
import { RedChartDataPoint } from '../../types';

interface ComposedTrendChartProps {
  data: RedChartDataPoint[];
  bars: { dataKey: string; color: string; name?: string; stackId?: string }[];
  line: { dataKey: string; color: string; name?: string; yAxisId?: string };
  yAxisLabel?: string;
  lineYAxisLabel?: string;
}

const ComposedTrendChart: React.FC<ComposedTrendChartProps> = ({ data, bars, line, yAxisLabel, lineYAxisLabel }) => {
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-md p-3 text-sm shadow-lg">
          <p className="label text-gray-400 mb-2">{label}</p>
          {payload.map((p: any) => (
            <p key={p.dataKey} style={{ color: p.color || p.stroke }} className="font-semibold">
              {p.name}: {p.value.toLocaleString()}{p.dataKey === 'avgLatency' ? 'ms' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis yAxisId="left" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', fill: '#9CA3AF', fontSize: 12 }} />
          {lineYAxisLabel && <YAxis yAxisId={line.yAxisId} orientation="right" stroke={line.color} fontSize={12} tickLine={false} axisLine={false} label={{ value: lineYAxisLabel, angle: 90, position: 'insideRight', fill: line.color, fontSize: 12 }} />}
          <Tooltip content={customTooltip} />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          {bars.map(bar => (
            <Bar key={bar.dataKey} yAxisId="left" dataKey={bar.dataKey} fill={bar.color} name={bar.name} stackId={bar.stackId} barSize={10} />
          ))}
          <Line yAxisId={line.yAxisId || "left"} type="monotone" dataKey={line.dataKey} stroke={line.color} name={line.name} strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComposedTrendChart;
