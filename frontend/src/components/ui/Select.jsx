import React, { forwardRef, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { ChevronDown, Check } from "lucide-react";

const Select = forwardRef(
    (
        {
            options = [],
            value,
            onChange,
            placeholder = "Select an option",
            label,
            error,
            helperText,
            disabled = false,
            fullWidth = false,
            size = "md",
            className = "",
            ...props
        },
        ref
    ) => {
        const [isOpen, setIsOpen] = useState(false);
        const containerRef = useRef(null);

        useEffect(() => {
            const handleClickOutside = (event) => {
                if (containerRef.current && !containerRef.current.contains(event.target)) {
                    setIsOpen(false);
                }
            };

            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, []);

        const handleSelect = (optionValue) => {
            if (!disabled) {
                const event = {
                    target: { value: optionValue, name: props.name },
                };
                onChange(event);
                setIsOpen(false);
            }
        };

        const selectedOption = options.find((opt) => opt.value === value);

        const sizeStyles = size === "sm"
            ? "px-3 py-1.5 text-sm"
            : "px-4 py-3";
        const baseStyles =
            `w-full text-gray-800 dark:text-[#cccccc] border border-gray-200 dark:border-[#404040] flex justify-between items-center outline-none cursor-pointer relative z-10 ${sizeStyles}`;
        const bgStyle = className.includes("bg-") ? "" : "bg-white dark:bg-[#1a1a1a]";
        const focusStyles = isOpen
            ? "border-primary"
            : "hover:border-gray-400";
        const errorStyles = error ? "border-red-500 dark:border-red-500" : "";
        const disabledStyles = disabled
            ? "opacity-50 cursor-not-allowed bg-gray-50"
            : "";

        return (
            <div
                ref={containerRef}
                className={`flex flex-col gap-2 ${fullWidth ? "w-full" : ""} relative`}
            >
                {label && (
                    <label className="text-sm text-gray-600 dark:text-[#bfbfbf] font-medium px-1">
                        {label}
                    </label>
                )}

                <div
                    ref={ref}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={`${baseStyles} ${bgStyle} ${focusStyles} ${errorStyles} ${disabledStyles} ${className}`}
                    {...props}
                >
                    <span className={!selectedOption ? "text-gray-400" : ""}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown
                        size={20}
                        className={`text-gray-400 ${isOpen ? "rotate-180" : ""}`}
                    />
                </div>

                {isOpen && (
                    <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#404040] overflow-hidden z-50 max-h-60 overflow-y-auto">
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={`${size === "sm" ? "px-3 py-2 text-sm" : "px-4 py-3"} flex items-center justify-between cursor-pointer ${value === option.value
                                    ? "bg-primary/10 text-primary"
                                    : "text-gray-700 dark:text-[#cccccc] hover:bg-gray-50 dark:hover:bg-[#262626]"
                                    }`}
                            >
                                <span className="truncate">{option.label}</span>
                                {value === option.value && <Check size={16} />}
                            </div>
                        ))}
                        {options.length === 0 && (
                            <div className="px-4 py-3 text-gray-400 text-center text-sm">
                                No options available
                            </div>
                        )}
                    </div>
                )}

                {(error || helperText) && (
                    <p
                        className={`text-sm px-1 ${error ? "text-red-500" : "text-gray-500"
                            }`}
                    >
                        {error ? (helperText || "Please select an option") : helperText}
                    </p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';

Select.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    label: PropTypes.string,
    error: PropTypes.bool,
    helperText: PropTypes.string,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
};

export default Select;
