import React from "react";
import { X } from "lucide-react";

const MobileDrawer = ({
    open,
    isLoggedIn,
    onClose,
    onLogin,
    onSignup,
    onLogout
}) => {
    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            <div
                className={`fixed top-0 right-0 h-full w-full md:w-[480px] bg-white dark:bg-[#1a1a1a] z-50 transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex justify-between items-center h-[70px] px-4 py-3 md:px-8 border-b border-gray-200 dark:border-[#404040]">
                    <h1 className="text-2xl text-primary font-semibold cursor-pointer" onClick={onClose}>
                        Rhine
                    </h1>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 dark:text-[#bfbfbf] p-1 cursor-pointer">
                        <X size={24} />
                    </button>
                </div>

                {!isLoggedIn ? (
                    <div className="flex flex-col gap-2 p-4">
                        <button
                            onClick={onLogin}
                            className="w-full px-5 py-3 text-left text-gray-700 dark:text-[#cccccc] hover:bg-gray-50 dark:hover:bg-[#262626] cursor-pointer transition-colors"
                        >
                            Login
                        </button>
                        <button
                            onClick={onSignup}
                            className="w-full px-5 py-3 text-left text-gray-700 dark:text-[#cccccc] hover:bg-gray-50 dark:hover:bg-[#262626] cursor-pointer transition-colors"
                        >
                            Signup
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 p-4">
                        <button
                            onClick={onLogout}
                            className="w-full px-5 py-3 text-left text-red-700 dark:text-red-500 hover:bg-red-50 dark:hover:bg-[#262626] cursor-pointer transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default MobileDrawer;
