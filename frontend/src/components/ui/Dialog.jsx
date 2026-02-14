import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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
    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && open) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [open, onClose]);

    if (!open) return null;

    const sizeStyles = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-full mx-4',
    };

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black/30 z-40"
            />

            {/* Dialog */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div
                    className={`w-full ${sizeStyles[size]} bg-white border border-gray-200 ${className}`}
                    {...props}
                >
                    {/* Header */}
                    {(title || showClose) && (
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            {title && (
                                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                            )}
                            {showClose && (
                                <button
                                    onClick={onClose}
                                    className="ml-auto text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                                >
                                    <X size={24} />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6">{children}</div>
                </div>
            </div>
        </>
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
