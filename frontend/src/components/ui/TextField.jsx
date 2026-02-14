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
            backgroundColor = '#1a1a1a', // Default background
            ...props
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false);
        const textareaRef = useRef(ref);

        // Auto-resize functionality
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
            `w-full px-4 py-3 text-gray-200 rounded-2xl border-2 transition-all duration-300 outline-none resize-none`;
        const focusStyles = isFocused
            ? 'border-[#C77BBF] ring-1 ring-[#C77BBF]/50'
            : 'border-[#333333] hover:border-[#666666]';
        const errorStyles = error ? 'border-red-500' : '';
        const disabledStyles = disabled
            ? 'opacity-50 cursor-not-allowed bg-[#1a1a1a]/50'
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
                    <label className="text-sm text-[#8c8c8c] font-medium px-2">
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
                    style={{ backgroundColor: disabled ? undefined : backgroundColor }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`${baseStyles} ${focusStyles} ${errorStyles} ${disabledStyles} ${className}`}
                    {...props}
                />
                <div className="flex justify-between items-center px-2">
                    {helperText && (
                        <p className={`text-sm ${error ? 'text-red-400' : 'text-[#737373]'}`}>
                            {helperText}
                        </p>
                    )}
                    {showCount && maxLength && (
                        <p className="text-sm text-[#737373] ml-auto">
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
    backgroundColor: PropTypes.string,
};

export default TextField;
