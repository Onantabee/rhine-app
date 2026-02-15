import React from "react";

/**
 * UserAvatar component - Displays user initials in a square avatar
 */
const UserAvatar = ({ userName = "", size = "md", onClick }) => {
    const fullName = String(userName || "");
    const names = fullName.split(/\s+/);
    const firstName = names[0] || "";
    const lastName = names[1] || "";

    const sizeClasses = {
        sm: "w-10 h-10 text-lg",
        md: "w-15 h-15 text-3xl",
        lg: "w-16 h-16 text-2xl",
    };

    return (
        <div
            className={`bg-[#7733ff] text-white flex justify-center items-center rounded-full ${sizeClasses[size]} ${onClick ? "cursor-pointer" : ""
                }`}
            onClick={onClick}
        >
            <span>
                {firstName?.charAt(0) || "U"}
                {/* {lastName?.charAt(0) || " "} */}
            </span>
        </div>
    );
};

export default UserAvatar;
