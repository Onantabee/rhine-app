import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const Card = ({
    variant = 'default',
    hoverable = false,
    onClick,
    padding = 'default',
    children,
    className = '',
    ...props
}) => {
    const baseStyles = 'rounded-2xl transition-all duration-300';

    const variantStyles = {
        default: 'bg-[#1f1f1f] border-2 border-[#404040]',
        elevated: 'bg-[#2a2a2a] shadow-lg border-2 border-[#4d4d4d]',
        outlined: 'bg-transparent border-2 border-[#666666]',
    };

    const hoverStyles = hoverable
        ? 'cursor-pointer hover:border-[#C77BBF] hover:shadow-xl'
        : '';

    const paddingStyles = {
        none: 'p-0',
        sm: 'p-3',
        default: 'p-5',
        lg: 'p-7',
    };

    const CardComponent = hoverable || onClick ? motion.div : 'div';
    const motionProps = hoverable || onClick
        ? {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
        }
        : {};

    return (
        <CardComponent
            className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${paddingStyles[padding]} ${className}`}
            onClick={onClick}
            {...motionProps}
            {...props}
        >
            {children}
        </CardComponent>
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
