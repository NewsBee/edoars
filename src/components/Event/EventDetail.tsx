import React from 'react';
import { useParams } from 'next/navigation';

interface Event {
  title: string;
  description: string;
  date: string;
}

const eventDetails: Record<string, Event> = {
  '1': {
    title: 'Event 1',
    description: 'Deskripsi Event 1',
    date: '2023-11-13 13:00:00',
  },
  '2': {
    title: 'Event 2',
    description: 'Deskripsi Event 2',
    date: '2023-11-14 13:00:00',
  },
  '3': {
    title: 'Event 3',
    description: 'Deskripsi Event 3',
    date: '2023-11-15 13:00:00',
  },
};

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const event = eventDetails[id];

  if (!event) {
    return <div>Event tidak ditemukan</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{event.title}</h3>
        <p className="text-gray-800 dark:text-gray-100 mb-4">{event.description}</p>
        <p className="text-gray-800 dark:text-gray-100 mb-4">{event.date}</p>
        <button onClick={() => history.back()} className="px-4 py-2 bg-blue-500 text-white rounded-md">Kembali</button>
      </div>
    </div>
  );
};

export default EventDetail;
