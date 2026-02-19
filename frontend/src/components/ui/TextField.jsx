import React, { forwardRef, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const TextField = forwardRef(
    (
        {
            label,
            error,
            helperText,
            disabled = false,
            fullWidth = false,
            rows = 3,
            maxRows,
            maxLength,
            showCount = false,
            className = '',
            value = '',
            onChange,
            placeholder,
            autoResize = false,
            ...props
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false);
        const textareaRef = useRef(ref);

        useEffect(() => {
            if (autoResize && textareaRef.current) {
                const textarea = textareaRef.current;
                textarea.style.height = 'auto';
                const newHeight = textarea.scrollHeight;
                const maxHeight = maxRows ? maxRows * 24 : Infinity;
                textarea.style.height = `${Math.min(newHeight, maxHeight)}px`;
            }
        }, [value, autoResize, maxRows]);

        const baseStyles =
            'w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 outline-none resize-none';
        const focusStyles = isFocused
            ? 'border-primary'
            : 'hover:border-gray-400';
        const errorStyles = error ? 'border-red-500' : '';
        const disabledStyles = disabled
            ? 'opacity-50 cursor-not-allowed bg-gray-50'
            : '';

        const handleChange = (e) => {
            if (maxLength && e.target.value.length > maxLength) {
                return;
            }
            onChange && onChange(e);
        };

        return (
            <div className={`flex flex-col gap-2 ${fullWidth ? 'w-full' : ''} ${className}`}>
                {label && (
                    <label className="text-sm text-gray-600 font-medium px-1">
                        {label}
                    </label>
                )}
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    rows={rows}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`${baseStyles} ${focusStyles} ${errorStyles} ${disabledStyles}`}
                    {...props}
                />
                <div className="flex justify-between items-center px-1">
                    {(error || helperText) && (
                        <p className={`text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}>
                            {error ? (helperText || 'This field is invalid') : helperText}
                        </p>
                    )}
                    {showCount && maxLength && (
                        <p className="text-sm text-gray-400 ml-auto">
                            {value.length}/{maxLength}
                        </p>
                    )}
                </div>
            </div>
        );
    }
);

TextField.displayName = 'TextField';

TextField.propTypes = {
    label: PropTypes.string,
    error: PropTypes.bool,
    helperText: PropTypes.string,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    rows: PropTypes.number,
    maxRows: PropTypes.number,
    maxLength: PropTypes.number,
    showCount: PropTypes.bool,
    className: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    autoResize: PropTypes.bool,
};

export default TextField;
