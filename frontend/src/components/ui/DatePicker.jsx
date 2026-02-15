import React, { useState, useRef, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const DatePicker = forwardRef(
    (
        {
            label,
            value,
            onChange,
            error,
            helperText,
            minDate,
            maxDate,
            disabled = false,
            fullWidth = false,
            className = '',
            placeholder = 'Select a date',
            ...props
        },
        ref
    ) => {
        const [open, setOpen] = useState(false);
        const [viewDate, setViewDate] = useState(() => {
            if (value) return new Date(value + 'T00:00:00');
            return new Date();
        });

        const containerRef = useRef(null);

        useEffect(() => {
            const handleClickOutside = (e) => {
                if (containerRef.current && !containerRef.current.contains(e.target)) {
                    setOpen(false);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

        useEffect(() => {
            if (value) setViewDate(new Date(value + 'T00:00:00'));
        }, [value]);

        const toggleOpen = () => {
            if (!disabled) setOpen((prev) => !prev);
        };

        const handleSelect = (day) => {
            const y = viewDate.getFullYear();
            const m = String(viewDate.getMonth() + 1).padStart(2, '0');
            const d = String(day).padStart(2, '0');
            const dateStr = `${y}-${m}-${d}`;
            onChange && onChange(dateStr);
            setOpen(false);
        };

        const prevMonth = (e) => {
            e.stopPropagation();
            setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
        };

        const nextMonth = (e) => {
            e.stopPropagation();
            setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
        };

        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const selectedDate = value ? new Date(value + 'T00:00:00') : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const isDateDisabled = (day) => {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            if (minDate && dateStr < minDate) return true;
            if (maxDate && dateStr > maxDate) return true;
            return false;
        };

        const formatDisplay = (val) => {
            if (!val) return null;
            const d = new Date(val + 'T00:00:00');
            const day = d.getDate();
            const monthName = MONTHS[d.getMonth()];
            const yr = d.getFullYear();
            return `${monthName} ${day}, ${yr}`;
        };

        const displayValue = formatDisplay(value);

        const borderColor = error
            ? 'border-red-500'
            : open
                ? 'border-[#7733ff]'
                : 'border-gray-300 hover:border-gray-400';

        const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : '';

        return (
            <div
                ref={containerRef}
                className={`relative flex flex-col gap-2 ${fullWidth ? 'w-full' : ''} ${className}`}
            >
                {label && (
                    <label className="text-sm text-gray-600 font-medium px-1">
                        {label}
                    </label>
                )}

                <div
                    onClick={toggleOpen}
                    className={`flex items-center justify-between w-full px-4 py-3 bg-white border outline-none cursor-pointer select-none ${borderColor} ${disabledStyles}`}
                >
                    <span className={displayValue ? 'text-gray-800' : 'text-gray-400'}>
                        {displayValue || placeholder}
                    </span>
                    <Calendar size={18} className="text-gray-400 flex-shrink-0" />
                </div>

                {open && (
                    <div className="absolute max-w-[350px] min-h-[300px] bottom-full left-0 mb-1 w-full bg-white border border-gray-300 shadow-md z-50 select-none">
                        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
                            <button
                                type="button"
                                onClick={prevMonth}
                                className="p-1 text-gray-500 hover:text-gray-800 cursor-pointer"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="text-sm font-semibold text-gray-700">
                                {MONTHS[month]} {year}
                            </span>
                            <button
                                type="button"
                                onClick={nextMonth}
                                className="p-1 text-gray-500 hover:text-gray-800 cursor-pointer"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 px-2 pt-2">
                            {DAYS.map((d) => (
                                <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">
                                    {d}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 px-2 pb-2">
                            {Array.from({ length: firstDay }).map((_, i) => (
                                <div key={`empty-${i}`} />
                            ))}

                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const isSelected =
                                    selectedDate &&
                                    selectedDate.getFullYear() === year &&
                                    selectedDate.getMonth() === month &&
                                    selectedDate.getDate() === day;
                                const isToday =
                                    today.getFullYear() === year &&
                                    today.getMonth() === month &&
                                    today.getDate() === day;
                                const isDayDisabled = isDateDisabled(day);

                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        disabled={isDayDisabled}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSelect(day);
                                        }}
                                        className={`
                                            aspect-square text-sm text-center cursor-pointer rounded-full flex items-center justify-center
                                            ${isSelected
                                                ? 'bg-[#7733ff] text-white font-semibold'
                                                : isToday
                                                    ? 'font-semibold text-[#7733ff]'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }
                                            ${isDayDisabled ? 'opacity-30 cursor-not-allowed' : ''}
                                        `}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {(error || helperText) && (
                    <p className={`text-sm px-1 ${error ? 'text-red-500' : 'text-gray-500'}`}>
                        {error ? (helperText || 'This field is required') : helperText}
                    </p>
                )}
            </div>
        );
    }
);

DatePicker.displayName = 'DatePicker';

DatePicker.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    error: PropTypes.bool,
    helperText: PropTypes.string,
    minDate: PropTypes.string,
    maxDate: PropTypes.string,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
    placeholder: PropTypes.string,
};

export default DatePicker;
