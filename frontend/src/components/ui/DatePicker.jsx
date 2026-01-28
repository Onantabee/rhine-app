import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const DatePicker = forwardRef(
    (
        {
            label,
            value,
            onChange,
            error,
            helperText,
            minDate,
            maxDate,
            disabled = false,
            fullWidth = false,
            className = '',
            ...props
        },
        ref
    ) => {
        return (
            <div className={`flex flex-col gap-2 ${fullWidth ? 'w-full' : ''} ${className}`}>
                {label && (
                    <label className="text-sm text-[#8c8c8c] font-medium px-2 uppercase tracking-wider">
                        {label}
                    </label>
                )}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MuiDatePicker
                        value={value ? dayjs(value) : null}
                        onChange={(newValue) => {
                            onChange && onChange(newValue ? newValue.format('YYYY-MM-DD') : '');
                        }}
                        minDate={minDate ? dayjs(minDate) : undefined}
                        maxDate={maxDate ? dayjs(maxDate) : undefined}
                        disabled={disabled}
                        sx={{
                            width: fullWidth ? '100%' : 'auto',
                            backgroundColor: 'rgba(77, 77, 77, 0.4)',
                            borderRadius: '16px',
                            '& fieldset': {
                                borderColor: error ? '#ef4444' : '#666666',
                                borderWidth: '2px',
                                borderRadius: '16px',
                            },
                            '&:hover fieldset': {
                                borderColor: '#C77BBF !important',
                                borderWidth: '2px',
                            },
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '16px',
                                backgroundColor: 'rgba(77, 77, 77, 0.1)',
                                cursor: 'pointer',
                                '&:hover fieldset': {
                                    borderColor: '#C77BBF',
                                    borderWidth: '2px',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#C77BBF',
                                    borderWidth: '2px',
                                    backgroundColor: 'rgba(199, 123, 191, 0.1)',
                                },
                                '& input': {
                                    cursor: 'pointer',
                                    caretColor: 'transparent',
                                    color: '#E0E0E0',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: '#a6a6a6',
                                '&.Mui-focused': {
                                    color: '#C77BBF',
                                },
                            },
                        }}
                        slotProps={{
                            textField: {
                                ref,
                                margin: 'dense',
                                onClick: (e) => {
                                    const button = e.currentTarget.querySelector(
                                        '.MuiInputAdornment-root button'
                                    );
                                    if (button) button.click();
                                },
                            },
                            popper: {
                                sx: {
                                    '& .MuiPaper-root': {
                                        borderRadius: '16px',
                                        backgroundColor: '#333333',
                                        color: '#d9d9d9',
                                        border: '2px solid #666666',
                                        '& .MuiPickersDay-root': {
                                            color: '#d9d9d9',
                                            '&.Mui-selected': {
                                                backgroundColor: '#C77BBF',
                                            },
                                            '&.Mui-disabled': {
                                                color: '#666666',
                                            },
                                        },
                                        '& .MuiPickersCalendarHeader-label': {
                                            color: '#d9d9d9',
                                        },
                                        '& .MuiIconButton-root': {
                                            color: '#C77BBF',
                                        },
                                    },
                                },
                            },
                        }}
                        {...props}
                    />
                </LocalizationProvider>
                {helperText && (
                    <p className={`text-sm px-2 ${error ? 'text-red-400' : 'text-[#737373]'}`}>
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

DatePicker.displayName = 'DatePicker';

DatePicker.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    error: PropTypes.bool,
    helperText: PropTypes.string,
    minDate: PropTypes.string,
    maxDate: PropTypes.string,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
};

export default DatePicker;
