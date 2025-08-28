import React, { createContext, useState, useContext, ReactNode } from 'react';

type JobStatus = 'succeeded' | 'failed';

interface JobRunsContextType {
  isModalOpen: boolean;
  statusFilter: JobStatus | null;
  failureReasonFilter: string | null;
  openModal: (status: JobStatus, failureReason?: string) => void;
  closeModal: () => void;
}

const JobRunsContext = createContext<JobRunsContextType | undefined>(undefined);

export const JobRunsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<JobStatus | null>(null);
  const [failureReasonFilter, setFailureReasonFilter] = useState<string | null>(null);

  const openModal = (status: JobStatus, failureReason?: string) => {
    setStatusFilter(status);
    setFailureReasonFilter(failureReason || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setStatusFilter(null);
    setFailureReasonFilter(null);
  };

  return (
    <JobRunsContext.Provider value={{ isModalOpen, statusFilter, failureReasonFilter, openModal, closeModal }}>
      {children}
    </JobRunsContext.Provider>
  );
};

export const useJobRuns = (): JobRunsContextType => {
  const context = useContext(JobRunsContext);
  if (context === undefined) {
    throw new Error('useJobRuns must be used within a JobRunsProvider');
  }
  return context;
};
