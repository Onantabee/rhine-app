const ProfileDropdown = ({ open, userName }) => {
    if (!open) return null;

    return (
        <div className="absolute right-0 top-full mt-2 min-w-[250px] bg-white border border-gray-200 p-3 z-50">
            <p className="text-center text-lg font-semibold text-gray-700 mb-3">
                {userName || "User"}
            </p>
        </div>
    );
};

export default ProfileDropdown;
