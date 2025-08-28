
import React from 'react';

const createIcon = (path: React.ReactNode) => (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
    {...props}
  >
    {path}
  </svg>
);

export const OlympusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
    </svg>
);

export const BellIcon = createIcon(
  <path
    fillRule="evenodd"
    d="M10 2a1 1 0 011 1v1.334A6.992 6.992 0 0115.667 9H17a1 1 0 110 2h-1.333a6.992 6.992 0 01-4.667 4.667V17a1 1 0 11-2 0v-1.333A6.992 6.992 0 014.333 11H3a1 1 0 110-2h1.333A6.992 6.992 0 019 4.334V3a1 1 0 011-1zM9 18.5a2.5 2.5 0 105 0H9z"
    clipRule="evenodd"
  />
);

export const ChevronDownIcon = createIcon(
  <path
    fillRule="evenodd"
    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
    clipRule="evenodd"
  />
);

export const ChevronRightIcon = createIcon(
  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L10.94 10 7.23 6.29a.75.75 0 111.04-1.08l4.25 4.25a.75.75 0 010 1.08l-4.25 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
);

export const PlusIcon = createIcon(
    <path fillRule="evenodd" d="M10 5a.75.75 0 01.75.75v3.5h3.5a.75.75 0 010 1.5h-3.5v3.5a.75.75 0 01-1.5 0v-3.5h-3.5a.75.75 0 010-1.5h3.5v-3.5A.75.75 0 0110 5z" clipRule="evenodd" />
);

export const ArrowPathIcon = createIcon(
    <path fillRule="evenodd" d="M15.312 5.312a.75.75 0 010 1.061l-2.75 2.75a.75.75 0 01-1.06 0l-2.75-2.75a.75.75 0 111.06-1.06l1.72 1.72V3a.75.75 0 011.5 0v4.03l1.72-1.72a.75.75 0 011.06 0zm-1.06 8.378a.75.75 0 010-1.06l2.75-2.75a.75.75 0 011.06 0l2.75 2.75a.75.75 0 11-1.06 1.06l-1.72-1.72V17a.75.75 0 01-1.5 0v-4.03l-1.72 1.72a.75.75 0 01-1.06 0z" clipRule="evenodd" />
);

export const ChartBarIcon = createIcon(
  <path fillRule="evenodd" d="M9 2a1 1 0 00-1 1v12a1 1 0 001 1h2a1 1 0 001-1V3a1 1 0 00-1-1H9zM3 8a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1V9a1 1 0 00-1-1H3zm12 0a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1V9a1 1 0 00-1-1h-2z" clipRule="evenodd" />
);

export const CheckCircleIcon = createIcon(
  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
);
export const ExclamationTriangleIcon = createIcon(
  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
);
export const XCircleIcon = createIcon(
  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
);

export const DocumentTextIcon = createIcon(
    <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V4.25A2.25 2.25 0 0015.75 2H4.25zM5.5 6a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5H6.25A.75.75 0 015.5 6zm.75 3.75a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z" clipRule="evenodd" />
);

export const ArrowUpRightIcon = createIcon(
    <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 010-1.06z" clipRule="evenodd" />
);
