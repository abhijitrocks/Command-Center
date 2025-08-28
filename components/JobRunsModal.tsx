import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useJobRuns } from '../contexts/JobRunsContext';
import { useDashboard } from '../contexts/DashboardContext';
import { getJobRuns } from '../data/mockData';
import { JobRun } from '../types';
import { XMarkIcon } from './icons';

const JobRunsModal: React.FC = () => {
    const { isModalOpen, statusFilter, failureReasonFilter, closeModal } = useJobRuns();
    const { selectedSubscribers, selectedZones } = useDashboard();
    const [jobs, setJobs] = useState<JobRun[]>([]);

    useEffect(() => {
        if (isModalOpen && statusFilter) {
            setJobs(getJobRuns(selectedSubscribers, selectedZones, statusFilter, failureReasonFilter || undefined));
        }
    }, [isModalOpen, statusFilter, failureReasonFilter, selectedSubscribers, selectedZones]);

    if (!isModalOpen || !statusFilter) return null;

    const title = failureReasonFilter
        ? `Failed Runs: ${failureReasonFilter}`
        : statusFilter === 'succeeded' ? 'Successful Job Runs' : 'Failed Job Runs';

    const modalContent = (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 transition-opacity" onClick={closeModal}>
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl m-4 border border-gray-700 flex flex-col" style={{ height: '80vh' }} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
                    <h2 className="text-lg font-semibold text-white">{title}</h2>
                    <button onClick={closeModal} className="text-gray-400 hover:text-white">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="flex-grow p-6 overflow-y-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700/50 sticky top-0">
                            <tr>
                                <th scope="col" className="px-4 py-3">Job Name</th>
                                <th scope="col" className="px-4 py-3">Subscriber</th>
                                <th scope="col" className="px-4 py-3">Start Time</th>
                                <th scope="col" className="px-4 py-3">Duration</th>
                                <th scope="col" className="px-4 py-3">Status</th>
                                {statusFilter === 'failed' && <th scope="col" className="px-4 py-3">Reason for Failure</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {jobs.map(job => (
                                <tr key={job.id} className="hover:bg-gray-700/50">
                                    <td className="px-4 py-3 font-mono text-xs text-white">{job.name}</td>
                                    <td className="px-4 py-3 text-gray-300">{job.subscriberName}</td>
                                    <td className="px-4 py-3 text-gray-300">{new Date(job.startTime).toLocaleString()}</td>
                                    <td className="px-4 py-3 text-gray-300">{job.duration}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${job.status === 'succeeded' ? 'bg-status-green/20 text-status-green' : 'bg-status-red/20 text-status-red'}`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    {statusFilter === 'failed' && <td className="px-4 py-3 text-gray-300">{job.failureReason || 'N/A'}</td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {jobs.length === 0 && <p className="text-gray-500 text-center pt-8">No {statusFilter} jobs found for the selected filters.</p>}
                </div>
            </div>
        </div>
    );

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) {
        console.error("The element #modal-root was not found");
        return null;
    }

    return ReactDOM.createPortal(modalContent, modalRoot);
};

export default JobRunsModal;
