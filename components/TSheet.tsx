import React from 'react';
import { TSheetData, TSheetMetric } from '../types';

interface TSheetProps {
  title: string;
  header: string;
  metrics: TSheetMetric[];
  data: TSheetData;
  subscribers: string[];
  onMetricClick?: (metric: TSheetMetric) => void;
}

const TSheet: React.FC<TSheetProps> = ({ title, header, metrics, data, subscribers, onMetricClick }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-md font-semibold text-white mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-gray-700/50">
              <th className="p-2 font-semibold text-gray-300 min-w-[300px]">
                {header}
              </th>
              {subscribers.map((subName) => (
                <th key={subName} className="p-2 font-semibold text-white text-center border-l border-gray-700">
                  {subName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => (
              <tr 
                key={metric.key} 
                className={`
                  ${metric.isGroupSeparator ? 'border-t-8 border-transparent' : ''}
                  group
                  ${onMetricClick ? 'cursor-pointer hover:bg-gray-700/50 transition-colors' : ''}
                `}
                onClick={onMetricClick ? () => onMetricClick(metric) : undefined}
                onKeyDown={onMetricClick ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onMetricClick(metric);
                    }
                } : undefined}
                tabIndex={onMetricClick ? 0 : -1}
                role={onMetricClick ? 'button' : undefined}
                aria-label={onMetricClick ? `Drill down into ${metric.label}` : undefined}
              >
                <td className="p-2 font-semibold text-gray-300 group-hover:text-brand-blue transition-colors">
                  {metric.label}
                </td>
                {subscribers.map((subName) => (
                  <td key={`${metric.key}-${subName}`} className="p-2 text-gray-300 text-center border-l border-gray-700">
                    {data[subName]?.[metric.key] ?? 'N/A'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TSheet;
