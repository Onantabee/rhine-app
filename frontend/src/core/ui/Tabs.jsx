import React from 'react';
import PropTypes from 'prop-types';

const Tabs = ({ tabs, activeTab, onChange, className = "" }) => {
    return (
        <div className={`flex gap-8 border-b border-gray-200 dark:border-[#404040] ${className}`}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`pb-3 text-[15px] font-medium transition-colors relative cursor-pointer flex items-center gap-2 ${activeTab === tab.id
                        ? "text-primary border-b-2 border-primary"
                        : "text-gray-500 hover:text-gray-700 dark:hover:text-[#e6e6e6] dark:text-[#cccccc]"
                        }`}
                    style={{ marginBottom: "-1px" }}
                >
                    {tab.label}
                    {tab.badge !== undefined && tab.badge > 0 && (
                        <span className="bg-red-500 text-white text-[12px] items-center justify-center flex h-5 w-5 rounded-full">
                            {tab.badge > 99 ? "99+" : tab.badge}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};

Tabs.propTypes = {
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.node.isRequired,
            badge: PropTypes.number,
        })
    ).isRequired,
    activeTab: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
};

export default Tabs;
