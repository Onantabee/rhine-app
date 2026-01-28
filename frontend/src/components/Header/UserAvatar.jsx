import React from "react";

/**
 * UserAvatar component - Displays user initials in a circular avatar
 * @param {string} userName - Full name of the user
 * @param {string} size - Size variant: 'sm', 'md', 'lg'
 * @param {function} onClick - Click handler (optional)
 */
const UserAvatar = ({ userName = "", size = "md", onClick }) => {
    const fullName = String(userName || "");
    const names = fullName.split(/\s+/);
    const firstName = names[0] || "";
    const lastName = names[1] || "";

    const sizeClasses = {
        sm: "w-10 h-10 text-lg p-[23px]",
        md: "w-15 h-15 text-3xl",
        lg: "w-16 h-16 text-2xl",
    };

    return (
        <div
            className={`bg-[#C77BBF] rounded-full flex justify-center items-center ${sizeClasses[size]} ${onClick ? "cursor-pointer" : ""
                }`}
            onClick={onClick}
        >
            <span>
                {firstName?.charAt(0) || "U"}
                {lastName?.charAt(0) || " "}
            </span>
        </div>
    );
};

export default UserAvatar;
