import React from "react";
import { Search, X } from "lucide-react";

const SearchBar = ({ value, onChange, onClear, placeholder = "Search tasks…" }) => {
    return (
        <div className="flex items-center justify-center w-[30rem] border border-gray-200 dark:border-[#404040] focus-within:border-primary pl-6 pr-1 bg-white dark:bg-[#1a1a1a] text-gray-800 dark:text-[#cccccc] py-1">
            <input
                type="text"
                placeholder={placeholder}
                className="text-[16px] w-full text-gray-800 py-1 focus:outline-0 bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:text-[#cccccc]"
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
                    <Search color="var(--color-primary)" size={25} />
                )}
            </div>
        </div>
    );
};

export default SearchBar;
