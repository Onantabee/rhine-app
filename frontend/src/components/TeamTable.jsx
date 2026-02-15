import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Trash2, Shield, UserCheck, MoreVertical, Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export const TeamTable = ({ members, userEmail, isAdmin, onRemove }) => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [actionMenuOpen, setActionMenuOpen] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    const toggleActionMenu = (email, event) => {
        if (actionMenuOpen === email) {
            setActionMenuOpen(null);
        } else {
            const rect = event.currentTarget.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + window.scrollY,
                left: rect.right + window.scrollX - 192 // Align right, w-48 is 192px
            });
            setActionMenuOpen(email);
        }
    };

    const closeMenu = () => setActionMenuOpen(null);

    return (
        <div className="bg-white border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4 text-center">Active Tasks</th>
                            {isAdmin && <th className="px-6 py-4 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {members.map((member) => (
                            <tr key={member.email} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full border border-[#7733ff]/30 bg-[#7733ff]/10 text-[#7733ff] flex justify-center items-center text-sm">
                                            {member.name?.[0]?.toUpperCase() || "?"}
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {member.name}
                                            {member.email === userEmail && (
                                                <span className="ml-2 text-sm text-gray-400">
                                                    [you]
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm text-gray-600">
                                        {member.email}
                                    </p>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex items-center gap-1.5 text-xs capitalize font-medium px-2.5 py-1 rounded-[5px] ${member.projectRole === "PROJECT_ADMIN"
                                            ? "bg-[#7733ff]/10 text-[#7733ff] border border-[#7733ff]/40"
                                            : "bg-gray-100 text-gray-600 border border-gray-100/40"
                                            }`}
                                    >
                                        {member.projectRole === "PROJECT_ADMIN"
                                            ? "Admin"
                                            : "Member"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center justify-center min-w-[30px] h-[30px] text-gray-700 text-sm font-medium">
                                        {member.activeTaskCount || 0}
                                    </span>
                                </td>
                                {isAdmin && (
                                    <td className="px-6 py-4 text-right relative">
                                        <div className="relative inline-block text-left">
                                            <button
                                                onClick={(e) => toggleActionMenu(member.email, e)}
                                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {members.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                    No team members found.
                </div>
            )}

            {actionMenuOpen && createPortal(
                <div className="fixed inset-0 z-[9999] flex flex-col" style={{ top: 0, left: 0 }}>
                    <div className="fixed inset-0 bg-transparent" onClick={closeMenu} />
                    <div
                        className="absolute z-[10000] w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        style={{ top: menuPosition.top, left: menuPosition.left }}
                    >
                        <button
                            onClick={() => {
                                navigate(`/project/${projectId}?assigneeEmail=${actionMenuOpen}`);
                                closeMenu();
                            }}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <Eye className="mr-3 h-4 w-4 text-gray-400" />
                            View Tasks
                        </button>
                        <button
                            onClick={() => {
                                const memberToRemove = members.find(m => m.email === actionMenuOpen);
                                onRemove(memberToRemove);
                                closeMenu();
                            }}
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                            <Trash2 className="mr-3 h-4 w-4 text-red-500" />
                            Remove Member
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};
