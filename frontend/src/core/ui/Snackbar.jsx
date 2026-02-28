import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    Info,
    X,
} from 'lucide-react';

const Snackbar = ({
    open,
    onClose,
    message,
    variant = 'info',
    duration = 6000,
    action,
    position = 'bottom-left',
    className = '',
    ...props
}) => {
    const variantConfig = {
        success: {
            icon: <CheckCircle size={20} />,
            styles: 'bg-green-50 dark:bg-green-900 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200',
        },
        error: {
            icon: <XCircle size={20} />,
            styles: 'bg-red-50 dark:bg-red-900 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200',
        },
        warning: {
            icon: <AlertTriangle size={20} />,
            styles: 'bg-orange-50 dark:bg-orange-900 border-orange-300 dark:border-orange-700 text-orange-800 dark:text-orange-200',
        },
        info: {
            icon: <Info size={20} />,
            styles: 'bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200',
        },
    };

    const positionStyles = {
        'top-left': 'top-4 left-4',
        'top-center': 'top-4 left-1/2 -translate-x-1/2',
        'top-right': 'top-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
        'bottom-right': 'bottom-4 right-4',
    };

    useEffect(() => {
        if (open && duration > 0) {
            const timer = setTimeout(() => {
                onClose && onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [open, duration, onClose]);

    if (!open) return null;

    const { icon, styles } = variantConfig[variant];

    return (
        <div
            className={`fixed ${positionStyles[position]} z-50 flex items-center gap-3 px-4 py-3 border min-w-[300px] max-w-md ${styles} ${className}`}
            {...props}
        >
            {icon}
            <span className="flex-1 font-medium">{message}</span>
            {action && <div>{action}</div>}
            <button
                onClick={onClose}
                className="text-current hover:opacity-70 cursor-pointer"
            >
                <X size={18} />
            </button>
        </div>
    );
};

Snackbar.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    message: PropTypes.string.isRequired,
    variant: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
    duration: PropTypes.number,
    action: PropTypes.node,
    position: PropTypes.oneOf([
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
    ]),
    className: PropTypes.string,
};

export default Snackbar;
