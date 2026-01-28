import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(
    (
        {
            options = [],
            value,
            onChange,
            placeholder = 'Select an option',
            label,
            error,
            helperText,
            disabled = false,
            fullWidth = false,
            className = '',
            ...props
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false);

        const baseStyles =
            'w-full px-4 py-3 bg-[#4d4d4d]/40 text-gray-200 rounded-2xl border-2 transition-all duration-300 outline-none appearance-none cursor-pointer';
        const focusStyles = isFocused
            ? 'border-[#C77BBF] bg-[#C77BBF]/10'
            : 'border-[#666666]';
        const errorStyles = error ? 'border-red-500' : '';
        const disabledStyles = disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:border-[#C77BBF]';

        return (
            <div className={`flex flex-col gap-2 ${fullWidth ? 'w-full' : ''} ${className}`}>
                {label && (
                    <label className="text-sm text-[#8c8c8c] font-medium px-2 uppercase tracking-wider">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className={`${baseStyles} ${focusStyles} ${errorStyles} ${disabledStyles}`}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                className="bg-[#333333] text-gray-200"
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#C77BBF]">
                        <ChevronDown size={20} />
                    </div>
                </div>
                {helperText && (
                    <p
                        className={`text-sm px-2 ${error ? 'text-red-400' : 'text-[#737373]'
                            }`}
                    >
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';

Select.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    label: PropTypes.string,
    error: PropTypes.bool,
    helperText: PropTypes.string,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
};

export default Select;
