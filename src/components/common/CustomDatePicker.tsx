import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown, X } from 'lucide-react';

interface CustomDatePickerProps {
  value: string; // 'YYYY-MM-DD'
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  minDate?: string; // 'YYYY-MM-DD'
  className?: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const pad = (n: number) => n.toString().padStart(2, '0');

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select event date',
  required = false,
  minDate,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse initial year and month from value, or default to current date
  const parseDate = (dateStr: string) => {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      return new Date(y, m, d);
    }
    return null;
  };

  const selectedDateObj = parseDate(value);

  const [currentYear, setCurrentYear] = useState(() => {
    return selectedDateObj ? selectedDateObj.getFullYear() : new Date().getFullYear();
  });
  const [currentMonth, setCurrentMonth] = useState(() => {
    return selectedDateObj ? selectedDateObj.getMonth() : new Date().getMonth();
  });

  // Sync internal month/year view when value changes from outside
  useEffect(() => {
    if (value) {
      const parsed = parseDate(value);
      if (parsed) {
        setCurrentYear(parsed.getFullYear());
        setCurrentMonth(parsed.getMonth());
      }
    }
  }, [value]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const formatted = `${currentYear}-${pad(currentMonth + 1)}-${pad(day)}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const handleQuickSelect = (daysOffset: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysOffset);
    const formatted = `${target.getFullYear()}-${pad(target.getMonth() + 1)}-${pad(target.getDate())}`;
    onChange(formatted);
    setCurrentYear(target.getFullYear());
    setCurrentMonth(target.getMonth());
    setIsOpen(false);
  };

  // Format readable display string
  const formatDisplay = (dateStr: string) => {
    const d = parseDate(dateStr);
    if (!d) return '';
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    return `${dayName}, ${d.getDate()} ${monthName} ${d.getFullYear()}`;
  };

  // Calculate calendar grid
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const today = new Date();
  const todayFormatted = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Hidden input for HTML form requirement */}
      <input
        type="text"
        value={value}
        required={required}
        readOnly
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />

      {/* Custom Trigger Input Button */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 font-medium flex items-center justify-between cursor-pointer hover:border-slate-400 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none transition-colors"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <CalendarIcon className="h-4 w-4 text-purple-600 shrink-0" />
          {value ? (
            <span className="font-semibold text-slate-900 truncate">
              {formatDisplay(value)}
            </span>
          ) : (
            <span className="text-slate-400 truncate">{placeholder}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {value && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="p-0.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Clear date"
            >
              <X className="h-3 w-3" />
            </span>
          )}
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-purple-600' : ''}`}
          />
        </div>
      </button>

      {/* Calendar Dropdown Popover */}
      {isOpen && (
        <div className="absolute z-40 mt-1.5 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-xl animate-in fade-in zoom-in-95 duration-100">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-3 px-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-bold text-slate-900">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAY_NAMES.map(d => (
              <span key={d} className="text-[10px] font-bold text-slate-400 py-1">
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Trailing days of previous month */}
            {Array.from({ length: firstDayIndex }).map((_, i) => {
              const dayNum = daysInPrevMonth - firstDayIndex + i + 1;
              return (
                <div
                  key={`prev-${i}`}
                  className="h-8 flex items-center justify-center text-xs text-slate-300 font-medium select-none"
                >
                  {dayNum}
                </div>
              );
            })}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${currentYear}-${pad(currentMonth + 1)}-${pad(dayNum)}`;
              const isSelected = value === dateStr;
              const isToday = todayFormatted === dateStr;
              const isPast = minDate ? dateStr < minDate : false;

              return (
                <button
                  key={`cur-${dayNum}`}
                  type="button"
                  disabled={isPast}
                  onClick={() => handleSelectDay(dayNum)}
                  className={`h-8 w-full rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center justify-center ${
                    isSelected
                      ? 'bg-purple-600 text-white font-bold shadow-xs'
                      : isToday
                        ? 'border border-purple-300 text-purple-700 font-bold hover:bg-purple-50'
                        : isPast
                          ? 'text-slate-300 cursor-not-allowed'
                          : 'text-slate-700 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Quick Shortcuts */}
          <div className="pt-2.5 mt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickSelect(0)}
              className="text-purple-600 hover:text-purple-800 font-semibold cursor-pointer px-1 py-0.5 rounded hover:bg-purple-50 transition-colors"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect(1)}
              className="text-purple-600 hover:text-purple-800 font-semibold cursor-pointer px-1 py-0.5 rounded hover:bg-purple-50 transition-colors"
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect(7)}
              className="text-purple-600 hover:text-purple-800 font-semibold cursor-pointer px-1 py-0.5 rounded hover:bg-purple-50 transition-colors"
            >
              +1 Week
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
