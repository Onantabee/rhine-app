import { X } from "lucide-react";
import Profile from "../../User/Profile";
import UserAvatar from "./UserAvatar";

const EditProfileDrawer = ({ open, userName, onClose }) => {
    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 bg-black/30 z-40"
                    onClick={onClose}
                />
            )}

            <div
                className={`fixed top-0 right-0 w-full  md:w-[480px] h-full bg-white border-l border-gray-200 z-50 p-5 overflow-y-auto ${open ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer">
                        <X size={24} />
                    </button>
                </div>

                <div className="relative bg-white p-5 z-40">
                    <div className="absolute -top-5 left-0 flex w-full justify-center items-center">
                        <div className="bg-white p-4">
                            <UserAvatar userName={userName} size="lg" />
                        </div>
                    </div>
                </div>

                <Profile setEditProfileOpen={onClose} />
            </div>
        </>
    );
};

export default EditProfileDrawer;
