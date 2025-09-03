import React, { useState } from 'react';
import { getTasks } from '../data/mockData';
import { Task } from '../types';
import { ChevronDownIcon, UserIcon, ArrowUpIcon, DocumentDuplicateIcon } from '../components/icons';

interface TasksPageProps {
    queueId: string;
    onTaskSelect: (taskId: string) => void;
}

const TasksPage: React.FC<TasksPageProps> = ({ queueId, onTaskSelect }) => {
    const [tasks, setTasks] = useState<Task[]>(getTasks());
    const [sortAsc, setSortAsc] = useState(true);

    const queueTitles: { [key: string]: string } = {
        'tasks-all': 'All open',
        'tasks-assigned': 'Assigned to me',
        'tasks-open': 'Open tasks',
    };

    const handleSort = () => {
        const newSortAsc = !sortAsc;
        setSortAsc(newSortAsc);
        const sortedTasks = [...tasks].sort((a, b) => {
            const dateA = new Date(a.due.replace(/(\d+)\/(\w+)\/(\d+)/, '$2 $1, 20$3'));
            const dateB = new Date(b.due.replace(/(\d+)\/(\w+)\/(\d+)/, '$2 $1, 20$3'));
            return newSortAsc ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
        });
        setTasks(sortedTasks);
    };
    
    const workItemCount = tasks.length; 

    return (
        <div className="flex-1 flex flex-col bg-gray-900 text-gray-300 p-6 space-y-4">
            {/* Header */}
            <div className="flex-shrink-0">
                <p className="text-sm text-gray-400">Projects / TEST@ABI / Queues</p>
                <h2 className="text-3xl font-bold text-white mt-1">{queueTitles[queueId] || 'Open tasks'}</h2>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2 flex-shrink-0">
                <input type="text" placeholder="Search work" className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1.5 w-64 focus:ring-brand-blue focus:border-brand-blue" />
                <FilterButton label="Assignee" />
                <FilterButton label="Status" />
                <FilterButton label="Request type" />
                <FilterButton label="More filters" />
            </div>

            {/* Task Table */}
            <p className="text-sm text-gray-400">{workItemCount} work item{workItemCount !== 1 ? 's' : ''}</p>
            <div className="flex-grow overflow-auto border border-gray-700 rounded-lg">
                <table className="w-full text-sm">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="p-3 w-10"><input type="checkbox" className="bg-gray-900 border-gray-600 rounded" /></th>
                            <th className="p-3 text-left font-semibold text-gray-400">Key</th>
                            <th className="p-3 text-left font-semibold text-gray-400">Summary</th>
                            <th className="p-3 text-left font-semibold text-gray-400">Reporter</th>
                            <th className="p-3 text-left font-semibold text-gray-400">Assignee</th>
                            <th className="p-3 text-left font-semibold text-gray-400">Status</th>
                            <th className="p-3 text-left font-semibold text-gray-400">Created</th>
                            <th className="p-3 text-left font-semibold text-gray-400">
                                <button onClick={handleSort} className="flex items-center hover:text-white">
                                    Due <ArrowUpIcon className={`h-4 w-4 ml-1 transition-transform ${sortAsc ? '' : 'rotate-180'}`} />
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {tasks.map(task => (
                            <tr key={task.key} className="hover:bg-gray-800/50">
                                <td className="p-3"><input type="checkbox" className="bg-gray-900 border-gray-600 rounded" /></td>
                                <td className="p-3 text-gray-400">{task.key}</td>
                                <td className="p-3">
                                    <button onClick={() => onTaskSelect(task.key)} className="text-brand-blue hover:underline flex items-center space-x-2 text-left">
                                        <DocumentDuplicateIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                        <span>{task.summary}</span>
                                    </button>
                                </td>
                                <td className="p-3">{task.reporter}</td>
                                <td className="p-3">
                                    <div className="flex items-center space-x-2">
                                        <UserIcon className="h-5 w-5 bg-gray-700 rounded-full p-0.5" />
                                        <span>{task.assignee}</span>
                                    </div>
                                </td>
                                <td className="p-3">
                                    <span className="bg-gray-700 text-xs font-bold px-2 py-1 rounded-sm uppercase flex items-center w-min">
                                        {task.status} <ChevronDownIcon className="h-4 w-4 ml-1" />
                                    </span>
                                </td>
                                <td className="p-3">{task.created.startsWith('Created') ? '03/Sep/25' : task.created}</td>
                                <td className="p-3">{task.due}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const FilterButton: React.FC<{ label: string }> = ({ label }) => (
    <button className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1.5 flex items-center space-x-2 hover:bg-gray-700">
        <span>{label}</span>
        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
    </button>
);

export default TasksPage;