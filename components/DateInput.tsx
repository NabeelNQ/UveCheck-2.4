import React, { useState, useRef, useEffect } from 'react';
import Calendar from './Calendar';

interface DateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minDate?: Date;
  maxDate?: Date;
}

const DateInput: React.FC<DateInputProps> = ({ label, value, onChange, minDate, maxDate }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/[^\d/]/g, '');

    if (input.length === 2 && !input.includes('/')) {
        input += '/';
    } else if (input.length === 5 && input.indexOf('/') === 2 && input.lastIndexOf('/') === 2) {
        input += '/';
    }
    
    if (input.length > 10) input = input.slice(0, 10);
    
    onChange(input);
  };
  
  const handleDateSelect = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    onChange(`${day}/${month}/${year}`);
    setShowCalendar(false);
  };
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);


  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-gray-700 font-semibold text-sm tracking-wide mb-2">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder="DD/MM/YYYY"
          className="w-full px-1 py-2 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-black transition-colors text-black placeholder-gray-400"
        />
        <button
          type="button"
          onClick={() => setShowCalendar(!showCalendar)}
          className="absolute inset-y-0 right-0 px-2 flex items-center text-gray-500 hover:text-black"
          aria-label="Open calendar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
      {showCalendar && (
        <div className="absolute z-10 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200">
            <Calendar onDateSelect={handleDateSelect} minDate={minDate} maxDate={maxDate} />
        </div>
      )}
    </div>
  );
};

export default DateInput;