import React from 'react';
import KpiCard from '../components/KpiCard';
import { getAdoptionKpis, getSubscribersMetrics, getFeatureAdoptionData } from '../data/mockData';
import { useDashboard } from '../contexts/DashboardContext';
import { FeatureAdoption, View } from '../types';
import Tooltip from '../components/Tooltip';
import { InformationCircleIcon, ArrowUpIcon, ArrowDownIcon } from '../components/icons';
import { useView } from '../contexts/ViewContext';

const AdoptionConsole: React.FC = () => {
  const { selectedSubscribers, selectedZones, selectedTimeRange } = useDashboard();
  const { setView } = useView();
    
  const kpis = getAdoptionKpis(selectedSubscribers, selectedZones, selectedTimeRange);
  const subscriberMetrics = getSubscribersMetrics(selectedSubscribers, selectedZones);
  const featureAdoptionData = getFeatureAdoptionData(selectedSubscribers, selectedZones, selectedTimeRange);

  const handleTenantClick = (tenantId: string) => {
    setView(View.TENANT_DETAIL, { tenantId: tenantId });
  };
 
  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.id} data={kpi} />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-md font-semibold text-white mb-4">Feature Adoption Breakdown</h3>
                <div className="space-y-4">
                    {featureAdoptionData.map(feature => (
                        <FeatureAdoptionBar key={feature.name} feature={feature} />
                    ))}
                </div>
            </div>
        </div>

        {/* Right Sticky Column */}
        <div className="space-y-6">
            <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-md font-semibold text-white mb-4">Subscribers Usage</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-4 py-2">Subscriber</th>
                                <th scope="col" className="px-4 py-2">MAU</th>
                                <th scope="col" className="px-4 py-2">NSM</th>
                                <th scope="col" className="px-4 py-2">Adoption %</th>
                                <th scope="col" className="px-4 py-2">Last Contact</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscriberMetrics.map(t => (
                                <tr key={t.subscriberId} className="border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="px-4 py-2 font-medium text-white">
                                        <button onClick={() => handleTenantClick(t.subscriberId)} className="hover:text-brand-blue hover:underline text-left transition-colors">
                                            {t.subscriberName}
                                        </button>
                                    </td>
                                    <td className="px-4 py-2 text-white">{t.mau.toLocaleString()}</td>
                                    <td className="px-4 py-2 text-white">{t.nsm}</td>
                                    <td className={`px-4 py-2 ${t.adoptionRate < 50 ? 'text-status-amber' : 'text-status-green'}`}>{t.adoptionRate}%</td>
                                    <td className="px-4 py-2 text-gray-400">{t.lastContact}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-md font-semibold text-white mb-4">Actions</h3>
                <div className="space-y-3">
                    <ActionButton text="Create Engagement Task" />
                    <ActionButton text="Log Adoption Opportunity" />
                    <ActionButton text="Attach SOP" />
                    <ActionButton text="Escalate to Exception Console" />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const FeatureAdoptionBar: React.FC<{feature: FeatureAdoption}> = ({feature}) => {
    const getBarColor = (percentage: number) => {
        if (percentage < 40) return 'bg-status-red';
        if (percentage < 70) return 'bg-status-amber';
        return 'bg-status-green';
    }
    return (
        <div>
            <div className="flex justify-between items-center text-sm mb-1.5">
                <div className="flex items-center space-x-1.5">
                    <span className="text-gray-300">{feature.name}</span>
                    <Tooltip content={feature.description}>
                        <InformationCircleIcon className="h-4 w-4 text-gray-500" />
                    </Tooltip>
                </div>
                <div className="flex items-center space-x-2">
                    {feature.change !== 0 && (
                        <span className={`text-xs flex items-center font-semibold ${feature.change > 0 ? 'text-status-green' : 'text-status-red'}`}>
                            {feature.change > 0 ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
                            {Math.abs(feature.change).toFixed(1)}%
                        </span>
                    )}
                    <span className="text-white font-semibold">{feature.adoption}%</span>
                </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className={`${getBarColor(feature.adoption)} h-2.5 rounded-full transition-all duration-500`} style={{width: `${feature.adoption}%`}}></div>
            </div>
        </div>
    );
}

const ActionButton: React.FC<{text: string}> = ({text}) => (
    <button className="w-full bg-brand-blue/80 hover:bg-brand-blue text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
        {text}
    </button>
);


export default AdoptionConsole;