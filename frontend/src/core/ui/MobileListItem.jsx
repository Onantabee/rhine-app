import React from 'react';
import PropTypes from 'prop-types';

const MobileListItem = ({
    title,
    titleClassName = "text-gray-800 dark:text-[#cccccc]",
    subtitle,
    teamSubtitle,
    avatarChar,
    avatarColorClass = "bg-primary/10 text-primary border-primary/30",
    chips = [],
    details = [],
    actions,
    onClick,
    isNew = false,
    badgeCount = 0,
    className = "",
}) => {
    return (
        <div
            onClick={onClick}
            className={`p-4 bg-white dark:bg-[#1a1a1a] border-b border-gray-100 dark:border-[#404040] flex flex-col gap-2 relative ${onClick ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-[#262626]" : ""} ${className}`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 overflow-hidden flex-1">
                    {avatarChar && (
                        <div className={`w-10 h-10 rounded-full border flex justify-center items-center text-sm flex-shrink-0 ${avatarColorClass}`}>
                            {avatarChar}
                        </div>
                    )}

                    <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className={`text-base font-semibold truncate ${titleClassName}`}>
                                <span className="flex items-center gap-2">
                                    {title} {teamSubtitle && <div className="bg-gray-300 w-1 h-1 rounded-full" />} <span className="text-sm text-gray-500 dark:text-[#bfbfbf] truncate mt-0.5 font-normal">{teamSubtitle}</span>
                                </span>
                            </h3>
                            {isNew && (
                                <span className="rounded-full h-5 px-2 bg-[#14B8A6] dark:bg-[#0f8a7b] text-white text-[10px] font-medium flex justify-center items-center flex-shrink-0">
                                    New
                                </span>
                            )}
                            {badgeCount > 0 && (
                                <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-medium flex justify-center items-center rounded-full flex-shrink-0">
                                    {badgeCount > 99 ? "99+" : badgeCount}
                                </span>
                            )}
                        </div>
                        {subtitle && (
                            <p className="text-sm text-gray-500 dark:text-[#bfbfbf] truncate mt-0.5">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {actions && (
                    <div className="flex flex-shrink-0 items-center justify-end" onClick={e => e.stopPropagation()}>
                        {actions}
                    </div>
                )}
            </div>

            <div className="pl-[52px] w-full flex justify-between">
                {chips.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {chips.map((chip, idx) => (
                            <div key={idx}>
                                {chip}
                            </div>
                        ))}
                    </div>
                )}

                {details.length > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                        {details.map((detail, idx) => (
                            <p key={idx} className="flex items-center gap-1.5 text-[13px] text-gray-500 dark:text-gray-400">
                                {detail.icon && <span className="text-gray-400">{detail.icon}</span>}
                                <span className="flex items-center gap-1 pr-3">{detail.label && `${detail.label} :`}<span className="font-medium text-gray-700 dark:text-[#cccccc]">{detail.value}</span></span>
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

MobileListItem.propTypes = {
    title: PropTypes.node.isRequired,
    titleClassName: PropTypes.string,
    subtitle: PropTypes.node,
    avatarChar: PropTypes.string,
    avatarColorClass: PropTypes.string,
    chips: PropTypes.arrayOf(PropTypes.node),
    details: PropTypes.arrayOf(
        PropTypes.shape({
            icon: PropTypes.node,
            label: PropTypes.string,
            value: PropTypes.node.isRequired,
        })
    ),
    actions: PropTypes.node,
    onClick: PropTypes.func,
    isNew: PropTypes.bool,
    badgeCount: PropTypes.number,
    className: PropTypes.string,
};

export default MobileListItem;
