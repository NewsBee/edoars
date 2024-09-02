import React from 'react';

interface ConfirmationModalProps {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  isOpen,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-9999">
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl max-w-sm w-full">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <span className="text-red-500">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m0-4h.01M12 20h.01M3 5h18M9 3h6m-7 0h1a2 2 0 012 2h2a2 2 0 012-2h1m4 0a2 2 0 012 2v2a2 2 0 01-2 2h-1m-6 0v10a2 2 0 01-2 2H8a2 2 0 01-2-2V9H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
              </svg>
            </span>
          </div>
          <h2 className="text-center text-xl font-bold mb-2">{title}</h2>
          <p className="text-center text-gray-600 dark:text-gray-300">{message}</p>
        </div>
        <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={onCancel}
            className="mr-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
