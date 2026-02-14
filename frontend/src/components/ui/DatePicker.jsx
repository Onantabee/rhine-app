import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';

const DatePicker = ({
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
    placeholder = "MM/DD/YYYY"
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(dayjs(value || undefined));
    const containerRef = useRef(null);

    // Sync internal state with external value
    useEffect(() => {
        if (value) {
            setCurrentMonth(dayjs(value));
        }
    }, [value]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDateSelect = (date) => {
        if (!disabled) {
            const formattedDate = date.format('YYYY-MM-DD');
            onChange(formattedDate);
            setIsOpen(false);
        }
    };

    const handleClear = (e) => {
        e.stopPropagation();
        onChange('');
    };

    const nextMonth = () => setCurrentMonth(currentMonth.add(1, 'month'));
    const prevMonth = () => setCurrentMonth(currentMonth.subtract(1, 'month'));

    const generateDays = () => {
        const startOfMonth = currentMonth.startOf('month');
        const endOfMonth = currentMonth.endOf('month');
        const startDate = startOfMonth.startOf('week');
        const endDate = endOfMonth.endOf('week');

        const days = [];
        let day = startDate;

        while (day.isBefore(endDate) || day.isSame(endDate, 'day')) {
            days.push(day);
            day = day.add(1, 'day');
        }
        return days;
    };

    const isDateDisabled = (date) => {
        if (minDate && date.isBefore(dayjs(minDate), 'day')) return true;
        if (maxDate && date.isAfter(dayjs(maxDate), 'day')) return true;
        return false;
    };

    const isSelected = (date) => {
        return value && dayjs(value).isSame(date, 'day');
    };

    const isToday = (date) => {
        return date.isSame(dayjs(), 'day');
    };

    const isCurrentMonth = (date) => {
        return date.isSame(currentMonth, 'month');
    };

    const days = generateDays();
    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const baseStyles = "w-full px-4 py-3 bg-[#1a1a1a] text-[#e5e7eb] rounded-2xl border-2 transition-all duration-300 flex justify-between items-center outline-none cursor-pointer relative z-10";
    const focusStyles = isOpen
        ? "border-[#C77BBF] ring-1 ring-[#C77BBF]/50"
        : "border-[#333333] hover:border-[#666666]";
    const errorStyles = error ? "border-red-500" : "";
    const disabledStyles = disabled
        ? "opacity-50 cursor-not-allowed bg-[#1a1a1a]/50"
        : "hover:bg-[#262626]";

    return (
        <div
            ref={containerRef}
            className={`flex flex-col gap-2 ${fullWidth ? 'w-full' : ''} ${className} relative`}
        >
            {label && (
                <label className="text-sm text-[#8c8c8c] font-medium px-2 uppercase tracking-wider">
                    {label}
                </label>
            )}

            {/* Trigger Input */}
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`${baseStyles} ${focusStyles} ${errorStyles} ${disabledStyles}`}
            >
                <div className="flex items-center gap-2 flex-1">
                    <span className={!value ? "text-[#e5e7eb]" : "text-[#e5e7eb]"}>
                        {value ? dayjs(value).format('MM/DD/YYYY') : placeholder}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {value && !disabled && (
                        <div
                            onClick={handleClear}
                            className="p-1 hover:bg-[#333333] rounded-full transition-colors text-gray-400 hover:text-white"
                        >
                            <X size={16} />
                        </div>
                    )}
                    <CalendarIcon
                        size={20}
                        className={`text-[#C77BBF] transition-colors ${isOpen ? 'text-[#C77BBF]' : 'text-[#C77BBF]'}`}
                    />
                </div>
            </div>

            {/* Calendar Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-[calc(100%+8px)] left-0 w-full sm:w-[320px] bg-[#1a1a1a] border border-[#333333] rounded-2xl shadow-xl p-4 z-50 select-none"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <button
                                onClick={prevMonth}
                                className="p-1 hover:bg-[#333333] rounded-lg text-gray-400 hover:text-white transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <h3 className="text-[#e5e7eb] font-semibold text-lg">
                                {currentMonth.format('MMMM YYYY')}
                            </h3>
                            <button
                                onClick={nextMonth}
                                className="p-1 hover:bg-[#333333] rounded-lg text-gray-400 hover:text-white transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        {/* Week Days */}
                        <div className="grid grid-cols-7 mb-2">
                            {weekDays.map(day => (
                                <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {days.map((date, index) => {
                                const isDisabled = isDateDisabled(date);
                                const isSelectedDate = isSelected(date);
                                const isTodayDate = isToday(date);
                                const isCurrentMonthDate = isCurrentMonth(date);

                                return (
                                    <button
                                        key={index}
                                        onClick={() => !isDisabled && handleDateSelect(date)}
                                        disabled={isDisabled}
                                        className={`
                                            h-9 w-9 rounded-full flex items-center justify-center text-sm transition-all relative
                                            ${!isCurrentMonthDate ? 'text-gray-600' : 'text-gray-300'}
                                            ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#333333]'}
                                            ${isSelectedDate
                                                ? 'bg-[#C77BBF] text-white hover:bg-[#d18cc9] shadow-[0_0_10px_rgba(199,123,191,0.5)]'
                                                : ''}
                                            ${isTodayDate && !isSelectedDate ? 'border border-[#C77BBF] text-[#C77BBF]' : ''}
                                        `}
                                    >
                                        {date.format('D')}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {helperText && (
                <p className={`text-sm px-2 ${error ? 'text-red-400' : 'text-[#737373]'}`}>
                    {helperText}
                </p>
            )}
        </div>
    );
};

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
