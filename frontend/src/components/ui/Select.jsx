import React, { forwardRef, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
            className = "",
            ...props
        },
        ref
    ) => {
        const [isOpen, setIsOpen] = useState(false);
        const containerRef = useRef(null);

        // Close dropdown when clicking outside
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
                // Create a synthetic event to match standard select onChange behavior
                const event = {
                    target: { value: optionValue, name: props.name },
                };
                onChange(event);
                setIsOpen(false);
            }
        };

        const selectedOption = options.find((opt) => opt.value === value);

        const baseStyles =
            "w-full px-4 py-3 bg-[#1a1a1a] text-gray-200 rounded-2xl border-2 transition-all duration-300 flex justify-between items-center outline-none cursor-pointer relative z-10";
        const focusStyles = isOpen
            ? "border-[#C77BBF] ring-1 ring-[#C77BBF]/50"
            : "border-[#333333] hover:border-[#666666]";
        const errorStyles = error ? "border-red-500" : "";
        const disabledStyles = disabled
            ? "opacity-50 cursor-not-allowed bg-[#1a1a1a]/50"
            : "hover:bg-[#262626]";

        return (
            <div
                ref={containerRef}
                className={`flex flex-col gap-2 ${fullWidth ? "w-full" : ""} ${className} relative`}
            >
                {label && (
                    <label className="text-sm text-[#8c8c8c] font-medium px-2 uppercase tracking-wider">
                        {label}
                    </label>
                )}

                {/* Trigger Button */}
                <div
                    ref={ref}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={`${baseStyles} ${focusStyles} ${errorStyles} ${disabledStyles}`}
                    {...props}
                >
                    <span className={!selectedOption ? "text-gray-500" : ""}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown
                        size={20}
                        className={`text-[#C77BBF] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                </div>

                {/* Dropdown Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#1a1a1a] border border-[#333333] rounded-2xl shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto"
                        >
                            {options.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${value === option.value
                                            ? "bg-[#C77BBF]/20 text-[#C77BBF]"
                                            : "text-gray-300 hover:bg-[#262626]"
                                        }`}
                                >
                                    <span className="truncate">{option.label}</span>
                                    {value === option.value && <Check size={16} />}
                                </div>
                            ))}
                            {options.length === 0 && (
                                <div className="px-4 py-3 text-gray-500 text-center text-sm">
                                    No options available
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {helperText && (
                    <p
                        className={`text-sm px-2 ${error ? "text-red-400" : "text-[#737373]"
                            }`}
                    >
                        {helperText}
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
