import React from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';

const Chip = ({
    variant = 'default',
    color,
    size = 'md',
    onDelete,
    children,
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center gap-2 font-medium rounded-[5px] justify-center';

    const sizeStyles = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base',
    };

    const statusVariants = {
        PENDING: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
        ONGOING: 'bg-blue-100 text-blue-800 border border-blue-300',
        COMPLETED: 'bg-green-100 text-green-800 border border-green-300',
        CANCELLED: 'bg-gray-100 text-gray-500 border border-gray-200 dark:border-[#404040]',
        OVERDUE: 'bg-gray-100 text-gray-500 border border-gray-200 dark:border-[#404040]',
    };

    const priorityVariants = {
        High: 'bg-red-100 text-red-800 border border-red-300',
        Medium: 'bg-orange-100 text-orange-800 border border-orange-300',
        Low: 'bg-green-100 text-green-800 border border-green-300',
    };

    const customColor = color
        ? `bg-${color}-100 text-${color}-800 border border-${color}-300`
        : '';

    const variantStyle =
        statusVariants[variant] ||
        priorityVariants[variant] ||
        customColor ||
        'bg-gray-100 text-gray-700 dark:text-[#cccccc] border border-gray-200 dark:border-[#404040]';

    return (
        <span
            className={`${baseStyles} ${sizeStyles[size]} ${variantStyle} ${className}`}
            {...props}
        >
            {children}
            {onDelete && (
                <button
                    onClick={onDelete}
                    className="hover:opacity-70 p-0.5 cursor-pointer"
                >
                    <X size={14} />
                </button>
            )}
        </span>
    );
};

Chip.propTypes = {
    variant: PropTypes.oneOf([
        'default',
        'PENDING',
        'ONGOING',
        'COMPLETED',
        'CANCELLED',
        'OVERDUE',
        'High',
        'Medium',
        'Low',
    ]),
    color: PropTypes.string,
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    onDelete: PropTypes.func,
    children: PropTypes.node,
    className: PropTypes.string,
};

export default Chip;
