import React from 'react';
import PropTypes from 'prop-types';

import LoadingSpinner from './LoadingSpinner';

const Button = React.forwardRef(
    (
        {
            variant = 'primary',
            size = 'md',
            loading = false,
            disabled = false,
            fullWidth = false,
            icon,
            children,
            className = '',
            onClick,
            type = 'button',
            ...props
        },
        ref
    ) => {
        const baseStyles =
            'font-medium flex items-center truncate justify-center gap-2 outline-none focus:outline-none cursor-pointer';

        const sizeStyles = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2 text-base',
            lg: 'px-6 py-3 text-lg',
        };

        const variantStyles = {
            primary:
                'bg-[#7733ff] text-white hover:bg-[#661aff] disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed',
            secondary:
                'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed',
            outlined:
                'bg-transparent text-[#7733ff] border border-[#7733ff] hover:bg-[#7733ff]/10 disabled:opacity-50 disabled:cursor-not-allowed',
            ghost:
                'bg-transparent text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed',
            danger:
                'bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed',
        };

        const widthStyle = fullWidth ? 'w-full' : '';

        return (
            <button
                ref={ref}
                type={type}
                className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
                onClick={onClick}
                disabled={disabled || loading}
                {...props}
            >
                {loading && (
                    <LoadingSpinner
                        size={size === 'sm' ? 'sm' : 'md'}
                        color="currentColor"
                    />
                )}
                {icon && !loading && icon}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

Button.propTypes = {
    variant: PropTypes.oneOf(['primary', 'secondary', 'outlined', 'ghost', 'danger']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    icon: PropTypes.node,
    children: PropTypes.node,
    className: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default Button;
