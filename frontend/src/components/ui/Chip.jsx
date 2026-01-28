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
    const baseStyles = 'inline-flex items-center gap-2 rounded-full font-medium transition-all duration-300';

    const sizeStyles = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base',
    };

    // Predefined status variants
    const statusVariants = {
        PENDING: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
        ONGOING: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
        COMPLETED: 'bg-green-500/20 text-green-300 border border-green-500/30',
        CANCELLED: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
        OVERDUE: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
    };

    // Predefined priority variants
    const priorityVariants = {
        High: 'bg-red-500/20 text-red-300 border border-red-500/30',
        Medium: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
        Low: 'bg-green-500/20 text-green-300 border border-green-500/30',
    };

    const customColor = color
        ? `bg-${color}-500/20 text-${color}-300 border border-${color}-500/30`
        : '';

    const variantStyle =
        statusVariants[variant] ||
        priorityVariants[variant] ||
        customColor ||
        'bg-[#737373]/20 text-gray-300 border border-[#737373]/30';

    return (
        <span
            className={`${baseStyles} ${sizeStyles[size]} ${variantStyle} ${className}`}
            {...props}
        >
            {children}
            {onDelete && (
                <button
                    onClick={onDelete}
                    className="hover:bg-white/10 rounded-full p-0.5 transition-colors"
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
