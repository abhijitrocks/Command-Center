import React, { useState } from 'react';
import { getTaskById } from '../data/mockData';
import { Task } from '../types';
import { 
    ChevronLeftIcon, 
    CheckIcon, 
    ChevronDownIcon, 
    ArrowUpIcon, 
    ArrowDownIcon,
    DocumentDuplicateIcon,
    LinkIcon,
    EllipsisHorizontalIcon,
    ChatBubbleLeftIcon,
    EyeIcon,
    HandThumbUpIcon,
    ShareIcon,
    BoltIcon,
    UserIcon,
    PaperClipIcon,
    XMarkIcon,
    DocumentTextIcon
} from '../components/icons';

interface TaskDetailPageProps {
    taskId: string;
    onBack: () => void;
}

const ActionButton: React.FC<{ children: React.ReactNode; icon?: React.ReactNode, hasDropdown?: boolean }> = ({ children, icon, hasDropdown }) => (
    <button className="flex items-center space-x-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700">
        {icon}
        <span>{children}</span>
        {hasDropdown && <ChevronDownIcon className="h-4 w-4 text-gray-500" />}
    </button>
);

const IconButton: React.FC<{ children: React.ReactNode; className?: string, hasBadge?: boolean, badgeContent?: string | number }> = ({ children, className, hasBadge, badgeContent }) => (
    <div className="relative">
        <button className={`p-2 rounded-md hover:bg-gray-100 text-gray-600 ${className}`}>
            {children}
        </button>
        {hasBadge && (
            <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                {badgeContent}
            </span>
        )}
    </div>
);

const DetailItem: React.FC<{ label: string; children: React.ReactNode; }> = ({ label, children }) => (
    <div className="grid grid-cols-3 gap-4 items-center text-sm">
        <dt className="text-gray-500">{label}</dt>
        <dd className="col-span-2 text-gray-800 flex items-center">{children}</dd>
    </div>
);

const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode, actions?: React.ReactNode }> = ({ title, children, actions }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="border-b border-gray-200 pb-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800">{title}</h3>
                <div className="flex items-center space-x-2">
                    {actions}
                    <button onClick={() => setIsOpen(!isOpen)} className="p-1 rounded-full hover:bg-gray-100">
                        <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? '' : '-rotate-90'}`} />
                    </button>
                </div>
            </div>
            {isOpen && children}
        </div>
    );
}

const TaskDetailPage: React.FC<TaskDetailPageProps> = ({ taskId, onBack }) => {
    const task = getTaskById(taskId);
    const [activeActivityTab, setActiveActivityTab] = useState('Comments');

    if (!task) {
        return (
            <div className="p-6 text-gray-800">
                <p>Task not found.</p>
                <button onClick={onBack} className="text-blue-600 hover:underline mt-4">Go Back</button>
            </div>
        );
    }
    
    const activityTabs = ['All', 'Comments', 'History', 'Work log', 'Approvals'];

    return (
        <div className="flex-1 flex flex-col bg-white text-gray-800 overflow-hidden font-sans">
            {/* Header */}
            <header className="flex-shrink-0 flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-2">
                    <button onClick={onBack} className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 text-sm">
                        <ChevronLeftIcon className="h-5 w-5" />
                        <span>Back</span>
                    </button>
                    <span className="text-gray-300">|</span>
                    <div className="flex items-center space-x-1 bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded">
                        <CheckIcon className="h-4 w-4" />
                        <span>{task.key}</span>
                    </div>
                    <IconButton><ArrowUpIcon className="h-5 w-5" /></IconButton>
                    <IconButton><ArrowDownIcon className="h-5 w-5" /></IconButton>
                </div>
                <div className="flex items-center space-x-2">
                    <IconButton hasBadge badgeContent={1}><ChatBubbleLeftIcon className="h-5 w-5" /></IconButton>
                    <IconButton><EyeIcon className="h-5 w-5" /></IconButton>
                    <IconButton><HandThumbUpIcon className="h-5 w-5" /></IconButton>
                    <IconButton><ShareIcon className="h-5 w-5" /></IconButton>
                    <IconButton><EllipsisHorizontalIcon className="h-5 w-5" /></IconButton>
                </div>
            </header>
            
            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Pane */}
                <main className="flex-1 overflow-y-auto p-6 space-y-6">
                    <h1 className="text-2xl font-bold text-gray-900">{task.summary}</h1>
                    <div className="flex items-center space-x-2">
                        <ActionButton icon={<DocumentDuplicateIcon className="h-4 w-4" />}>Create subtask</ActionButton>
                        <ActionButton icon={<LinkIcon className="h-4 w-4" />}>Link work item</ActionButton>
                        <ActionButton hasDropdown>Create</ActionButton>
                        <IconButton><EllipsisHorizontalIcon className="h-5 w-5" /></IconButton>
                    </div>

                    <div className="border border-gray-200 rounded-md p-4 bg-gray-50 flex items-center space-x-3">
                        <img src="https://i.pravatar.cc/40?u=abhijit" alt="Reporter" className="h-8 w-8 rounded-full" />
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold text-gray-800">{task.reporter}</span> raised this request via <span className="font-semibold text-gray-800">Jira</span>
                        </p>
                    </div>

                    <div>
                        <h2 className="font-semibold text-gray-600 mb-1">Description</h2>
                        <div className="p-3 bg-gray-100 rounded-md text-gray-500 cursor-pointer hover:bg-gray-200">
                            Add a description...
                        </div>
                    </div>

                     <CollapsibleSection title="Similar requests">
                        <div className="p-4 text-center text-gray-500">
                            <p>No similar requests found.</p>
                        </div>
                    </CollapsibleSection>

                    <div>
                        <h2 className="font-semibold text-gray-600 mb-2">Activity</h2>
                        <div className="border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                                {activityTabs.map(tab => (
                                    <button 
                                        key={tab} 
                                        onClick={() => setActiveActivityTab(tab)}
                                        className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${activeActivityTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4 flex items-start space-x-3">
                            <img src="https://i.pravatar.cc/40?u=user" alt="User" className="h-8 w-8 rounded-full" />
                            <div className="flex-1 border border-gray-300 rounded-md">
                                <div className="p-2 border-b border-gray-200">
                                    <button className="px-2 py-1 text-blue-600 font-medium text-sm hover:bg-blue-50 rounded">Add internal note</button>
                                    <span className="text-gray-300 mx-1">/</span>
                                    <button className="px-2 py-1 text-gray-600 font-medium text-sm hover:bg-gray-100 rounded">Reply to customer</button>
                                </div>
                                <div className="p-4 flex justify-end">
                                    <button className="text-gray-500 hover:text-gray-800">
                                        <PaperClipIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 ml-11 mt-2">Pro tip: press <kbd className="font-sans border bg-gray-100 border-gray-300 rounded px-1.5 py-0.5">M</kbd> to comment</p>
                    </div>
                </main>
              
                {/* Right Pane (Sidebar) */}
                <aside className="w-96 border-l border-gray-200 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                    <div className="flex items-center space-x-2">
                        <button className="flex-1 flex items-center justify-between bg-gray-200 hover:bg-gray-300 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700">
                            <span>Open</span>
                            <ChevronDownIcon className="h-4 w-4" />
                        </button>
                        <IconButton className="bg-gray-200 hover:bg-gray-300"><BoltIcon className="h-5 w-5" /></IconButton>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-md p-4">
                        <div className="flex justify-between items-center">
                             <h3 className="font-semibold text-gray-800">Pinned fields</h3>
                             <button className="p-1 rounded-full hover:bg-gray-100"><XMarkIcon className="h-5 w-5 text-gray-500" /></button>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Click on the <DocumentDuplicateIcon className="h-4 w-4 inline-block -mt-1" /> next to a field label to start pinning.</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-md">
                         <CollapsibleSection title="Details">
                            <dl className="space-y-3 p-4">
                                <DetailItem label="Assignee">
                                    <div className="flex items-center space-x-2">
                                        <UserIcon className="h-6 w-6 bg-gray-200 text-gray-600 rounded-full p-1" />
                                        <div>
                                            <p>{task.assignee}</p>
                                            <a href="#" className="text-blue-600 hover:underline">Assign to me</a>
                                        </div>
                                    </div>
                                </DetailItem>
                                <DetailItem label="Reporter">
                                    <div className="flex items-center space-x-2">
                                         <img src="https://i.pravatar.cc/40?u=abhijit" alt="Reporter" className="h-6 w-6 rounded-full" />
                                         <span>{task.reporter}</span>
                                    </div>
                                </DetailItem>
                                <DetailItem label="Request Type">{task.requestType}</DetailItem>
                                <DetailItem label="Knowledge base">
                                    <div className="flex items-center space-x-2 text-gray-500">
                                        <DocumentTextIcon className="h-5 w-5" />
                                        <span>No related articles</span>
                                         <button className="p-1 rounded-full hover:bg-gray-100">
                                            <ChevronDownIcon className={`h-5 w-5 text-gray-500`} />
                                        </button>
                                    </div>
                                </DetailItem>
                                <DetailItem label="Components">None</DetailItem>
                                <DetailItem label="Priority">
                                    <div className="flex items-center space-x-2">
                                        <span className="h-2.5 w-4 bg-amber-500"></span>
                                        <span>{task.priority}</span>
                                    </div>
                                </DetailItem>
                            </dl>
                        </CollapsibleSection>
                    </div>
                    
                     <div className="bg-white border border-gray-200 rounded-md">
                        <CollapsibleSection title="More fields">
                            <p className="text-sm text-gray-500 p-4">Team, Labels, Urgency, Impact, Affected se...</p>
                        </CollapsibleSection>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-md">
                         <CollapsibleSection title="Automation" actions={<BoltIcon className="h-5 w-5 text-gray-500" />}>
                           <p className="text-sm text-gray-500 p-4">Rule executions</p>
                        </CollapsibleSection>
                    </div>
                    
                    <div className="text-center text-xs text-gray-500 pt-4">
                        <p>{task.created}</p>
                        <p>{task.updated}</p>
                    </div>

                </aside>
            </div>
        </div>
    );
};

export default TaskDetailPage;
