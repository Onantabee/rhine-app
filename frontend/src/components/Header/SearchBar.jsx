import React from "react";
import { Search, X } from "lucide-react";

/**
 * SearchBar component - Task search input with clear functionality
 */
const SearchBar = ({ value, onChange, onClear }) => {
    return (
        <div className="flex items-center justify-center w-[30rem] border border-gray-300 focus-within:border-[#7733ff] pl-6 pr-1 bg-white py-1">
            <input
                type="text"
                placeholder="Search tasks…"
                className="text-[16px] w-full text-gray-800 py-1 focus:outline-0 bg-transparent placeholder:text-gray-400"
                value={value}
                onChange={onChange}
            />
            <div
                className={`p-1 cursor-pointer flex items-center justify-center ${value && "hover:bg-gray-100 group"
                    }`}
                onClick={value ? onClear : undefined}
            >
                {value ? (
                    <X className="text-red-500" size={25} />
                ) : (
                    <Search color="#7733ff" size={25} />
                )}
            </div>
        </div>
    );
};

export default SearchBar;
