
import React from 'react';
import ReactDOM from 'react-dom';
import { XMarkIcon } from './icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const modalContent = (
    <div 
        className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 transition-opacity"
        onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg m-4 border border-gray-700"
        onClick={e => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
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

export default Modal;