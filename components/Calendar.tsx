import React, { useState } from 'react';

interface CalendarProps {
  onDateSelect: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect, minDate, maxDate }) => {
  const [displayDate, setDisplayDate] = useState(maxDate || new Date());

  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();

  const handlePrevMonth = () => {
    setDisplayDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setDisplayDate(new Date(year, month + 1, 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDisplayDate(new Date(Number(e.target.value), month, 1));
  };

  const renderHeader = () => {
    const monthName = displayDate.toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - 99 + i).reverse();

    return (
      <div className="flex justify-between items-center p-2">
        <button type="button" onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div className="flex items-center space-x-2">
           <span className="font-bold text-gray-800">{monthName}</span>
           <div className="relative">
             <select value={year} onChange={handleYearChange} className="font-bold appearance-none bg-transparent pr-5 py-1 cursor-pointer focus:outline-none text-gray-800">
                {years.map(y => <option key={y} value={y}>{y}</option>)}
             </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
        </div>
        <button type="button" onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    );
  };
  
  const renderDays = () => {
      const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
      return (
        <div className="grid grid-cols-7 text-center text-xs text-gray-500 font-semibold my-2">
            {daysOfWeek.map(day => <div key={day} className="w-8 h-8 flex items-center justify-center">{day}</div>)}
        </div>
      );
  };

  const renderCells = () => {
    const monthStart = new Date(year, month, 1);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay());
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const min = minDate ? new Date(minDate) : null;
    if (min) min.setHours(0, 0, 0, 0);
    const max = maxDate ? new Date(maxDate) : null;
    if (max) max.setHours(0, 0, 0, 0);

    const cells = [];
    let currentDate = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      const dateKey = currentDate.toISOString().split('T')[0];
      const day = currentDate.getDate();
      
      const isCurrentMonth = currentDate.getMonth() === month;
      const isToday = currentDate.getTime() === today.getTime();
      const isDisabled = (min && currentDate < min) || (max && currentDate > max);

      const getCellClasses = () => {
        if (isDisabled) return 'text-gray-300 cursor-not-allowed';
        if (!isCurrentMonth) return 'text-gray-300';
        
        let classes = 'cursor-pointer ';
        if (isToday) {
            classes += 'bg-black text-white';
        } else {
            classes += 'text-gray-800 hover:bg-black hover:text-white';
        }
        return classes;
      };

      cells.push(
        <div
          key={dateKey}
          className={`flex items-center justify-center h-8 w-8 text-sm rounded-full transition-colors duration-200 ${getCellClasses()}`}
          onClick={() => !isDisabled && isCurrentMonth && onDateSelect(new Date(currentDate))}
        >
          {day}
        </div>
      );
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return <div className="grid grid-cols-7 p-2">{cells}</div>;
  };

  return (
    <div className="w-64">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;