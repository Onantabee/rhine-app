import React from 'react';
import PropTypes from 'prop-types';

const Card = ({
    variant = 'default',
    hoverable = false,
    onClick,
    padding = 'default',
    children,
    className = '',
    ...props
}) => {
    const variantStyles = {
        default: 'bg-white border border-gray-200',
        elevated: 'bg-white border border-gray-200',
        outlined: 'bg-transparent border border-gray-300',
    };

    const hoverStyles = hoverable ? 'cursor-pointer hover:bg-gray-50' : '';

    const paddingStyles = {
        none: 'p-0',
        sm: 'p-3',
        default: 'p-5',
        lg: 'p-7',
    };

    return (
        <div
            className={`${variantStyles[variant]} ${hoverStyles} ${paddingStyles[padding]} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
};

Card.propTypes = {
    variant: PropTypes.oneOf(['default', 'elevated', 'outlined']),
    hoverable: PropTypes.bool,
    onClick: PropTypes.func,
    padding: PropTypes.oneOf(['none', 'sm', 'default', 'lg']),
    children: PropTypes.node,
    className: PropTypes.string,
};

export default Card;
