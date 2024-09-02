import React from 'react';
import { CalendarEvent } from '../../types/events';

interface EventModalProps {
  event: CalendarEvent | null;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-96">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Proposal</h3>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-100 text-sm font-bold mb-2">Nama (NIM)</label>
          <input
            className="w-full px-3 py-2 border rounded-md text-gray-700 dark:text-gray-100 bg-gray-200 dark:bg-gray-600 focus:outline-none"
            value={event.title}
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-100 text-sm font-bold mb-2">Judul</label>
          <textarea
            className="w-full px-3 py-2 border rounded-md text-gray-700 dark:text-gray-100 bg-gray-200 dark:bg-gray-600 focus:outline-none"
            value={event.description}
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-100 text-sm font-bold mb-2">Jadwal</label>
          <input
            className="w-full px-3 py-2 border rounded-md text-gray-700 dark:text-gray-100 bg-gray-200 dark:bg-gray-600 focus:outline-none"
            value={event.date.toISOString()}
            readOnly
          />
        </div>
        <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded-md">Tutup</button>
      </div>
    </div>
  );
};

export default EventModal;
