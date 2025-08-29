
import React from 'react';
import { MessageAppHeroMetrics, ModuleMetric } from '../types';
import { InformationCircleIcon } from './icons';
import Tooltip from './Tooltip';

const MetricDisplay: React.FC<{ metric: ModuleMetric }> = ({ metric }) => (
    <div>
        <div className="flex items-center space-x-1.5">
            <p className="text-sm text-gray-400">{metric.name}</p>
            <Tooltip content={metric.description}>
                <InformationCircleIcon className="h-4 w-4 text-gray-500" />
            </Tooltip>
        </div>
        <p className="text-2xl font-bold text-white">{metric.value}</p>
    </div>
);

const MetricCategoryCard: React.FC<{ title: string; metrics: ModuleMetric[]; className?: string }> = ({ title, metrics, className }) => (
    <div className={`bg-gray-900/50 p-6 rounded-lg h-full ${className}`}>
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <div className="space-y-6">
            {metrics.map(metric => <MetricDisplay key={metric.id} metric={metric} />)}
        </div>
    </div>
);


const MessageAppHeroMetrics: React.FC<{ data: MessageAppHeroMetrics }> = ({ data }) => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-md font-semibold text-white mb-4 px-2">Key Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCategoryCard title="Topics & Messages" metrics={data.topicsAndMessages} />
                <MetricCategoryCard title="Subscriptions" metrics={data.subscriptions} />
                <MetricCategoryCard title="Message Applications" metrics={data.messageApps} />
                <MetricCategoryCard title="Schedules" metrics={data.schedules} />
            </div>
        </div>
    );
};

export default MessageAppHeroMetrics;