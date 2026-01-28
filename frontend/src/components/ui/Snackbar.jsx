import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
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
            styles: 'bg-green-500/20 border-green-500/50 text-green-200',
        },
        error: {
            icon: <XCircle size={20} />,
            styles: 'bg-red-500/20 border-red-500/50 text-red-200',
        },
        warning: {
            icon: <AlertTriangle size={20} />,
            styles: 'bg-orange-500/20 border-orange-500/50 text-orange-200',
        },
        info: {
            icon: <Info size={20} />,
            styles: 'bg-blue-500/20 border-blue-500/50 text-blue-200',
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

    // Auto-close after duration
    useEffect(() => {
        if (open && duration > 0) {
            const timer = setTimeout(() => {
                onClose && onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [open, duration, onClose]);

    const { icon, styles } = variantConfig[variant];

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: position.includes('bottom') ? 50 : -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: position.includes('bottom') ? 50 : -50 }}
                    transition={{ duration: 0.3 }}
                    className={`fixed ${positionStyles[position]} z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border-2 backdrop-blur-lg shadow-lg min-w-[300px] max-w-md ${styles} ${className}`}
                    {...props}
                >
                    {icon}
                    <span className="flex-1 font-medium">{message}</span>
                    {action && <div>{action}</div>}
                    <button
                        onClick={onClose}
                        className="text-current hover:opacity-70 transition-opacity"
                    >
                        <X size={18} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
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
