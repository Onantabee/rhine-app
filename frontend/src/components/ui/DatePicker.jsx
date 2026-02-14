import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

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
            ...props
        },
        ref
    ) => {
        const baseStyles =
            'w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 outline-none cursor-pointer';
        const focusStyles = 'focus:border-[#7733ff]';
        const normalStyles = 'hover:border-gray-400';
        const errorStyles = error ? 'border-red-500' : '';
        const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : '';

        return (
            <div className={`flex flex-col gap-2 ${fullWidth ? 'w-full' : ''} ${className}`}>
                {label && (
                    <label className="text-sm text-gray-600 font-medium px-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    type="date"
                    value={value || ''}
                    onChange={(e) => onChange && onChange(e.target.value)}
                    min={minDate}
                    max={maxDate}
                    disabled={disabled}
                    className={`${baseStyles} ${focusStyles} ${normalStyles} ${errorStyles} ${disabledStyles}`}
                    {...props}
                />
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
};

export default DatePicker;
