"use client";
import { useState, useEffect } from 'react';

const CalendarActionCard = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [daysInMonth, setDaysInMonth] = useState<(number | null)[]>([]);

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Calculate the number of days in the current month
    const days = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();

    // Create an array representing the days in the calendar grid
    const emptyDays = Array.from({ length: startDay }, () => null) as (number | null)[];
    const monthDays = Array.from({ length: days }, (_, i) => i + 1) as (number | null)[];

    setDaysInMonth(emptyDays.concat(monthDays));
  }, [currentDate]);

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (day: number | null) => {
    return (
      day === currentDate.getDate() &&
      currentDate.getMonth() === new Date().getMonth() &&
      currentDate.getFullYear() === new Date().getFullYear()
    );
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-4 rounded-lg shadow-lg max-w-md mx-auto">
      {/* "AYO! Ajukan" Section */}
      <div className="bg-gradient-to-r from-blue-500 to-green-400 rounded-lg p-4 w-full flex items-center justify-between shadow-md mb-4">
        <div>
          <h3 className="text-white text-lg font-semibold">AYO! Ajukan</h3>
          <p className="text-white text-sm">Skripsi Sekarang</p>
        </div>
        <button className="text-white bg-secondaryBlue p-2 rounded-full shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Calendar Section */}
      <div className="w-full p-4 bg-white rounded-lg shadow-md">
        {/* Calendar Controls */}
        <div className="flex justify-between mb-4">
          <button onClick={handleToday} className="text-gray-600 bg-gray-200 px-4 py-2 rounded-lg hover:bg-blue-100 focus:bg-blue-100 focus:text-blue-600">
            Today
          </button>
          <button className="text-gray-600 bg-gray-200 px-4 py-2 rounded-lg hover:bg-blue-100 focus:bg-blue-100 focus:text-blue-600">
            Week
          </button>
          <button className="text-gray-600 bg-gray-200 px-4 py-2 rounded-lg hover:bg-blue-100 focus:bg-blue-100 focus:text-blue-600">
            Month
          </button>
          <button className="text-gray-600 bg-gray-200 px-4 py-2 rounded-lg hover:bg-blue-100 focus:bg-blue-100 focus:text-blue-600">
            Year
          </button>
        </div>

        {/* Calendar Days Display */}
        <div className="flex">
          {/* Calendar Grid */}
          <div className="w-4/5">
            <div className="grid grid-cols-7 gap-2 text-gray-600 text-sm mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div key={day} className="text-center font-semibold">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2 text-sm">
              {daysInMonth.map((day, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-full text-center ${isToday(day) ? 'bg-blue-500 text-white' : 'text-gray-700'} ${day === null ? 'opacity-0' : ''}`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Month Scroller */}
          <div className="w-1/5 flex flex-col items-center justify-center space-y-1 text-gray-500 text-sm">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
              <div
                key={month}
                className={`p-1 rounded-lg w-full text-center ${index === currentDate.getMonth() ? 'bg-gray-300 font-semibold' : ''}`}
              >
                {month}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Button */}
        <button className="mt-6 w-full px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          Cek Lebih lengkap &gt;&gt;&gt;
        </button>
      </div>
    </div>
  );
};

export default CalendarActionCard;
