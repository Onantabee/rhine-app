import React from "react";
import { X, LogOut, PenSquare } from "lucide-react";
import UserAvatar from "./UserAvatar";
import ProjectPicker from "../../Project/ProjectPicker";

const MobileDrawer = ({
    open,
    isLoggedIn,
    userName,
    onClose,
    onLogin,
    onSignup,
    isVerified
}) => {
    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 bg-black/30 z-40"
                    onClick={onClose}
                />
            )}

            <div
                className={`fixed top-0 right-0 h-full w-full md:w-[480px] bg-white border-l border-gray-200 z-50 p-4 ${open ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex justify-between pr-2">
                    {isLoggedIn && isVerified ? <ProjectPicker /> : (
                        <div>
                            <h1
                                className="text-2xl text-[#7733ff] font-semibold cursor-pointer"
                                onClick={() =>
                                    activeProject
                                        ? navigate(`/project/${activeProject.id}`)
                                        : navigate("/")
                                }
                            >
                                Rhine
                            </h1>
                        </div>
                    )}
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer">
                        <X size={24} />
                    </button>
                </div>

                {!isLoggedIn ? (
                    <div className="flex flex-col gap-2 mt-4">
                        <button
                            onClick={onLogin}
                            className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                            Login
                        </button>
                        <button
                            onClick={onSignup}
                            className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                            Signup
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center mt-4">
                        <div className="bg-gray-50 w-full flex p-4 flex-col justify-center items-center">
                            <div className="mb-3">
                                <UserAvatar userName={userName} size="md" />
                            </div>
                            <p className="font-semibold text-xl text-gray-700">
                                {userName || "User"}
                            </p>
                        </div>

                        <div className="w-full h-px bg-gray-200 my-4" />
                    </div>
                )}
            </div>
        </>
    );
};

export default MobileDrawer;
