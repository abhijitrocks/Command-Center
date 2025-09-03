import React from 'react';
import { TSheetData, TSheetMetric } from '../types';

interface TSheetProps {
  title: string;
  header: string;
  metrics: TSheetMetric[];
  data: TSheetData;
  columns: string[];
  onMetricClick?: (metric: TSheetMetric) => void;
}

const TSheet: React.FC<TSheetProps> = ({ title, header, metrics, data, columns, onMetricClick }) => {
  const colorMap: { [key: string]: string } = {
    Amber: 'bg-status-amber',
    Green: 'bg-status-green',
    Red: 'bg-status-red',
  };

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
              {columns.map((columnName) => (
                <th key={columnName} className="p-2 font-semibold text-white text-center border-l border-gray-700">
                  {columnName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => {
              if (metric.isGroupHeader) {
                return (
                  <tr key={metric.key} className={`
                    ${metric.isGroupSeparator ? 'border-t-8 border-transparent' : ''}
                    ${metric.color || ''}
                  `}>
                    <td colSpan={columns.length + 1} className="p-2 pt-4 font-bold text-sm text-white">
                      {metric.label}
                    </td>
                  </tr>
                );
              }
              return (
                <tr 
                  key={metric.key} 
                  className={`
                    ${metric.isGroupSeparator ? 'border-t-8 border-transparent' : ''}
                    group
                    ${onMetricClick ? 'cursor-pointer hover:bg-gray-700/50 transition-colors' : ''}
                  `}
                  onClick={onMetricClick && !metric.isGroupHeader ? () => onMetricClick(metric) : undefined}
                  onKeyDown={onMetricClick && !metric.isGroupHeader ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onMetricClick(metric);
                      }
                  } : undefined}
                  tabIndex={onMetricClick && !metric.isGroupHeader ? 0 : -1}
                  role={onMetricClick && !metric.isGroupHeader ? 'button' : undefined}
                  aria-label={onMetricClick && !metric.isGroupHeader ? `Drill down into ${metric.label}` : undefined}
                >
                  <td className="p-2 font-semibold text-gray-300 group-hover:text-brand-blue transition-colors">
                    {metric.label}
                  </td>
                  {columns.map((columnName) => {
                    const cellValue = data[columnName]?.[metric.key];
                    return (
                      <td key={`${metric.key}-${columnName}`} className="p-2 text-gray-300 text-center border-l border-gray-700">
                        {metric.key === 'colorTag' && cellValue ? (
                          <div className="flex justify-center items-center">
                            <span
                              className={`h-4 w-4 rounded-full ${colorMap[cellValue] || 'bg-gray-600'}`}
                              title={cellValue}
                            ></span>
                          </div>
                        ) : (
                          cellValue ?? 'N/A'
                        )}
                      </td>
                    );
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TSheet;