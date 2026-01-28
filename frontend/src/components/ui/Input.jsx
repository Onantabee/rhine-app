import React, { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Visibility, VisibilityOff } from '@mui/icons-material';

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
            'w-full px-4 py-3 bg-[#4d4d4d]/10 text-gray-200 rounded-2xl border-2 transition-all duration-300 outline-none';
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
                    <label className="text-sm text-[#8c8c8c] font-medium px-2">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {prefix && (
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c8c8c]">
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
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#C77BBF] hover:text-[#9966ff] transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </button>
                    )}
                    {suffix && type !== 'password' && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8c8c8c]">
                            {suffix}
                        </div>
                    )}
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
