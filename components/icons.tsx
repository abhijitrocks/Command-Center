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

export const ChevronLeftIcon = createIcon(
  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01.02 1.06L9.06 10l3.75 3.71a.75.75 0 11-1.08 1.04l-4.25-4.25a.75.75 0 010-1.08l4.25-4.25a.75.75 0 011.06-.02z" clipRule="evenodd" />
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

export const InformationCircleIcon = createIcon(
  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
);

export const XMarkIcon = createIcon(
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
);

export const ArrowLeftIcon = createIcon(
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-11.293a1 1 0 00-1.414-1.414L8 9.586V7a1 1 0 00-2 0v6a1 1 0 001 1h6a1 1 0 000-2H8.414l4.293-4.293z" clipRule="evenodd" />
);

export const TrashIcon = createIcon(
    <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v.5a2 2 0 00-4.5 0v-.5A.75.75 0 0110 2zM8.5 4.75a.75.75 0 01.75.75v7.5a.75.75 0 01-1.5 0v-7.5a.75.75 0 01.75-.75zM11.5 5.5a.75.75 0 00-1.5 0v7.5a.75.75 0 001.5 0v-7.5zM3.375 5a1.5 1.5 0 00-1.5 1.5v9A1.5 1.5 0 003.375 17h13.25A1.5 1.5 0 0018.125 15.5v-9A1.5 1.5 0 0016.625 5H3.375z" clipRule="evenodd" />
);

export const ArrowUpIcon = createIcon(
    <path fillRule="evenodd" d="M10 5a.75.75 0 01.53.22l3.25 3.25a.75.75 0 11-1.06 1.06L10 6.81l-2.72 2.72a.75.75 0 01-1.06-1.06l3.25-3.25A.75.75 0 0110 5z" clipRule="evenodd" />
);

export const ArrowDownIcon = createIcon(
    <path fillRule="evenodd" d="M10 15a.75.75 0 01-.53-.22l-3.25-3.25a.75.75 0 011.06-1.06L10 13.19l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25A.75.75 0 0110 15z" clipRule="evenodd" />
);

export const QueueListIcon = createIcon(
  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
);

export const ComputerDesktopIcon = createIcon(
  <path d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h5l-.621-.621A3 3 0 0111 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h9.5A2.25 2.25 0 0115 5.25z" />
);

export const EllipsisHorizontalIcon = createIcon(
  <path fillRule="evenodd" d="M10 5.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-10 1.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
);

export const UserIcon = createIcon(
  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
);

export const DocumentDuplicateIcon = createIcon(
    <path fillRule="evenodd" d="M15.5 2.75a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0V4.26L12.76 6.24a.75.75 0 01-1.02-1.1l3-4a.75.75 0 011.01-.01zM4.5 3.5A1.5 1.5 0 003 5v10A1.5 1.5 0 004.5 16.5h8A1.5 1.5 0 0014 15V5a1.5 1.5 0 00-1.5-1.5h-8z" clipRule="evenodd" />
);

export const CheckIcon = createIcon(
  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
);

export const LinkIcon = createIcon(
  <path fillRule="evenodd" d="M8.912 6.02a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.182-.938l.122-.122-2.86-2.859a.75.75 0 010-1.061l2.86-2.859-.122-.122a.75.75 0 01-.938-1.182zM12 4.5a.75.75 0 00-1.06 0l-4.25 4.25a.75.75 0 000 1.06l4.25 4.25a.75.75 0 101.06-1.06L8.06 10l3.94-3.94a.75.75 0 00-1.06-1.06z" clipRule="evenodd" />
);

export const ChatBubbleLeftIcon = createIcon(
  <path fillRule="evenodd" d="M2 10.5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10.5zM2 6.5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 6.5zM2 14.5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 14.5z" clipRule="evenodd" />
);

export const EyeIcon = createIcon(
  <>
    <path fillRule="evenodd" d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clipRule="evenodd" />
    <path d="M10 3.5a9.44 9.44 0 00-7.394 3.968C1.83 8.356 1 9.22 1 10s.83 1.644 1.606 2.532A9.44 9.44 0 0010 16.5a9.44 9.44 0 007.394-3.968C18.17 11.644 19 10.78 19 10s-.83-1.644-1.606-2.532A9.44 9.44 0 0010 3.5zM2.5 10a8.033 8.033 0 0115 0 8.033 8.033 0 01-15 0z" />
  </>
);

export const HandThumbUpIcon = createIcon(
  <>
    <path d="M13.5 6.475c0-.622.503-1.125 1.125-1.125h2.25c.622 0 1.125.503 1.125 1.125v4.5A2.25 2.25 0 0115.75 13.5h-2.25a2.25 2.25 0 01-2.25-2.25v-4.75zM4.875 12.375a2.625 2.625 0 100-5.25 2.625 2.625 0 000 5.25z" />
    <path fillRule="evenodd" d="M11.625 3.375a2.625 2.625 0 00-2.625 2.625v.875c0 .341-.106.666-.29.938C8.528 7.55 7.886 7.5 7.125 7.5c-.778 0-1.43.053-1.612.088a.75.75 0 00-.563.708v7.954a.75.75 0 00.75.75h.375c.162 0 .317-.03.46-.086.136-.053.256-.13.35-.226l.115-.115c.133-.133.228-.293.278-.465.053-.18.066-.368.036-.552l-.24-1.439c.14-.07.288-.13.44-.175.148-.045.3-.075.45-.091.2-.022.4-.031.6-.031h1.125c.414 0 .807-.123 1.125-.348.318-.225.563-.538.682-.91l.369-1.106c.1-.3.15-.615.15-.938v-.625a2.625 2.625 0 00-2.625-2.625z" clipRule="evenodd" />
  </>
);

export const ShareIcon = createIcon(
  <>
    <path fillRule="evenodd" d="M15.04 10.23a.75.75 0 00-1.06 0l-5.22 5.22a.75.75 0 001.06 1.06l5.22-5.22a.75.75 0 000-1.06z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M12.25 5a.75.75 0 000 1.5h1.163l-4.72 4.72a.75.75 0 101.06 1.06l4.72-4.72v1.164a.75.75 0 001.5 0v-2.5a.75.75 0 00-.75-.75h-2.5zM4.75 5A2.25 2.25 0 002.5 7.25v7.5A2.25 2.25 0 004.75 17h7.5A2.25 2.25 0 0014.5 14.75v-2a.75.75 0 00-1.5 0v2A.75.75 0 0112.25 15.5h-7.5A.75.75 0 014 14.75v-7.5A.75.75 0 014.75 6.5h2a.75.75 0 000-1.5h-2z" clipRule="evenodd" />
  </>
);

export const BoltIcon = createIcon(
  <path fillRule="evenodd" d="M11.936 2.37a.75.75 0 01.529.937l-2.5 10.5a.75.75 0 01-1.43-.34zL10.38 7.5H7.75a.75.75 0 01-.722-1.026l3.25-4.5a.75.75 0 01.936-.104z" clipRule="evenodd" />
);

export const PaperClipIcon = createIcon(
  <path fillRule="evenodd" d="M12.5 4.75a.75.75 0 00-1.5 0v9.5a2.75 2.75 0 005.5 0V8.25a1.25 1.25 0 00-2.5 0v7.5a.25.25 0 01-.5 0v-7.5a.75.75 0 00-1.5 0v7.5a2.25 2.25 0 004.5 0V8.25a2.75 2.75 0 00-5.5 0v6.25a.75.75 0 001.5 0v-6.25a1.25 1.25 0 012.5 0v7.5a.75.75 0 01-.75.75h-.001a.75.75 0 01-.75-.75v-9.5z" clipRule="evenodd" />
);