import React from "react";
import { LogOut, PenSquare } from "lucide-react";

/**
 * ProfileDropdown component - Desktop profile menu dropdown
 */
const ProfileDropdown = ({ open, userName, isAdmin, onEditProfile, onLogout }) => {
    if (!open) return null;

    return (
        <div className="absolute right-0 top-full mt-2 min-w-[250px] bg-white border border-gray-200 p-3 z-50">
            <p className="text-center text-lg font-semibold text-gray-700 mb-3">
                {userName || "User"}
            </p>

            {/* <div className="flex flex-col gap-2">
                <button
                    onClick={onEditProfile}
                    className="flex items-center gap-3 w-full px-3 py-2 text-gray-600 border border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                    <PenSquare size={18} />
                    <span>Edit Profile</span>
                </button>
                <button
                    onClick={onLogout}
                    className="flex items-center gap-3 w-full px-3 py-2 text-white bg-red-500 hover:bg-red-600 cursor-pointer"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div> */}
        </div>
    );
};

export default ProfileDropdown;
