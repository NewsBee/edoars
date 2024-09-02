"use client"
import React, { useState } from 'react';

import { CalendarEvent } from '../../types/events';
import EventModal from '../Event/EventModal';

const events: CalendarEvent[] = [
  {
    title: 'Event 1',
    description: 'Deskripsi Event 1',
    date: new Date(new Date().setDate(new Date().getDate() - 1)), // Kemarin
    type: 'seminar_proposal',
  },
  {
    title: 'Event 2',
    description: 'Deskripsi Event 2',
    date: new Date(new Date().setDate(new Date().getDate() - 1)), // Kemarin
    type: 'seminar_hasil',
  },
  {
    title: 'Event 3',
    description: 'Deskripsi Event 3',
    date: new Date(new Date().setDate(new Date().getDate() - 1)), // Kemarin
    type: 'sidang_hasil',
  },
  {
    title: 'Event Hari Ini',
    description: 'Deskripsi Event Hari Ini',
    date: new Date(), // Hari ini
    type: 'seminar_proposal',
  },
];

const eventColors = {
  seminar_proposal: '#435EBE',
  seminar_hasil: '#0ABEF9',
  sidang_hasil: '#47FE89',
};

const CalendarClone: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const daysOfWeek = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const startDate = new Date(startOfMonth);
  startDate.setDate(startOfMonth.getDate() - startOfMonth.getDay() + 1);

  const endDate = new Date(endOfMonth);
  endDate.setDate(endOfMonth.getDate() + (7 - endOfMonth.getDay()));

  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  let date = new Date(startDate);

  while (date <= endDate) {
    currentWeek.push(new Date(date));
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    date.setDate(date.getDate() + 1);
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Jadwal Seminar</h2>
          <div className="flex items-center">
            <button onClick={handlePrevMonth} className="px-4 py-2 bg-gray-300 rounded-md mr-2">
              {"<"}
            </button>
            <span className="text-lg text-gray-800 dark:text-gray-100 mx-2">
              {currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={handleNextMonth} className="px-4 py-2 bg-gray-300 rounded-md ml-2">
              {">"}
            </button>
          </div>
        </div>
        <table className="table-fixed w-full bg-white">
          <thead>
            <tr className="bg-blue-500 text-white">
              {daysOfWeek.map(day => (
                <th key={day} className="w-1/7 py-2">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, index) => (
              <tr key={index}>
                {week.map(day => (
                  <td key={day.toISOString()} className="border h-32 relative">
                    <span className={`absolute top-1 left-1 text-sm ${day.getMonth() === currentDate.getMonth() ? 'text-gray-800 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}`}>
                      {day.getDate()}
                    </span>
                    <div className="p-2">
                      {events
                        .filter(event => event.date.toDateString() === day.toDateString())
                        .map((event, index) => (
                          <div
                            key={index}
                            onClick={() => handleEventClick(event)}
                            className="cursor-pointer px-2 py-1 rounded mb-1"
                            style={{ backgroundColor: eventColors[event.type], color: '#fff' }}
                          >
                            {event.title}
                          </div>
                        ))}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default CalendarClone;
