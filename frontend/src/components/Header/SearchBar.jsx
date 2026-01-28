import React from "react";
import { Search, X } from "lucide-react";

/**
 * SearchBar component - Task search input with clear functionality
 * @param {string} value - Current search term
 * @param {function} onChange - Handler for search input changes
 * @param {function} onClear - Handler for clearing search
 */
const SearchBar = ({ value, onChange, onClear }) => {
    return (
        <div className="flex items-center justify-center w-[30rem] transition-colors duration-300 ease-in-out border-2 border-[#404040] focus-within:border-[#737373] pl-6 pr-1 bg-[#404040] py-1 rounded-[15px]">
            <input
                type="text"
                placeholder="Search tasks…"
                className="text-[16px] w-full text-gray-300 py-1 focus:outline-0 bg-transparent"
                value={value}
                onChange={onChange}
            />
            <div
                className={`rounded-full p-1 cursor-pointer flex items-center justify-center ${value && "bg-[#4d4d4d] hover:bg-[#ff3333] transition-colors duration-300 group"
                    }`}
                onClick={value ? onClear : undefined}
            >
                {value ? (
                    <X className="text-[#ff8080] group-hover:text-[#404040]" size={25} />
                ) : (
                    <Search color="#9966ff" size={25} />
                )}
            </div>
        </div>
    );
};

export default SearchBar;
