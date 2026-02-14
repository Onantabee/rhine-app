import React, { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(
    (
        {
            type = 'text',
            label,
            error,
            helperText,
            disabled = false,
            fullWidth = false,
            prefix,
            suffix,
            className = '',
            value,
            onChange,
            placeholder,
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false);
        const [isFocused, setIsFocused] = useState(false);

        const inputType = type === 'password' && showPassword ? 'text' : type;

        const baseInputStyles =
            'w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 outline-none';
        const focusStyles = isFocused
            ? 'border-[#7733ff]'
            : 'hover:border-gray-400';
        const errorStyles = error ? 'border-red-500' : '';
        const disabledStyles = disabled
            ? 'opacity-50 cursor-not-allowed bg-gray-50'
            : '';

        return (
            <div className={`flex flex-col gap-2 ${fullWidth ? 'w-full' : ''} ${className}`}>
                {label && (
                    <label className="text-sm text-gray-600 font-medium px-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {prefix && (
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            {prefix}
                        </div>
                    )}
                    <input
                        ref={ref}
                        type={inputType}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                        placeholder={placeholder}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className={`${baseInputStyles} ${focusStyles} ${errorStyles} ${disabledStyles} ${prefix ? 'pl-10' : ''
                            } ${type === 'password' || suffix ? 'pr-12' : ''}`}
                        {...props}
                    />
                    {type === 'password' && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    )}
                    {suffix && type !== 'password' && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            {suffix}
                        </div>
                    )}
                </div>
                {(error || helperText) && (
                    <p
                        className={`text-sm px-1 ${error ? 'text-red-500' : 'text-gray-500'
                            }`}
                    >
                        {error ? (helperText || 'This field is invalid') : helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

Input.propTypes = {
    type: PropTypes.oneOf(['text', 'password', 'email', 'number']),
    label: PropTypes.string,
    error: PropTypes.bool,
    helperText: PropTypes.string,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    prefix: PropTypes.node,
    suffix: PropTypes.node,
    className: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
};

export default Input;
