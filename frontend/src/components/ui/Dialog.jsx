import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Dialog = ({
    open,
    onClose,
    title,
    size = 'md',
    showClose = true,
    children,
    className = '',
    ...props
}) => {
    const sizeStyles = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-full mx-4',
    };

    // Handle escape key
    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && open) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />

                    {/* Dialog */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className={`w-full ${sizeStyles[size]} bg-[#2a2a2a] rounded-2xl border-2 border-[#4d4d4d] shadow-2xl ${className}`}
                            {...props}
                        >
                            {/* Header */}
                            {(title || showClose) && (
                                <div className="flex items-center justify-between p-6 border-b border-[#404040]">
                                    {title && (
                                        <h2 className="text-xl font-bold text-gray-200">{title}</h2>
                                    )}
                                    {showClose && (
                                        <button
                                            onClick={onClose}
                                            className="ml-auto text-gray-400 hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-gray-700"
                                        >
                                            <X size={24} />
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-6">{children}</div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

Dialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
    showClose: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
};

export default Dialog;
