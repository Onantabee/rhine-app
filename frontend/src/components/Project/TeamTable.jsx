import { createPortal } from "react-dom";
import { Trash2, AlertCircle, CheckCircle, MoreVertical, Eye } from "lucide-react";
import { highlightSearchMatch } from "../../utils/taskUtils";
import { useTeamTable } from "../../hooks/project/useTeamTable";

export const TeamTable = ({ members, userEmail, isAdmin, onRemove, searchTerm }) => {
    const {
        actionMenuOpen,
        menuPosition,
        toggleActionMenu,
        closeMenu,
        handleViewTasks,
        handleRemoveMember
    } = useTeamTable({ members, userEmail, onRemove });

    return (
        <div className="bg-white h-fit flex flex-col min-h-0">
            <div className="overflow-auto flex-1 border border-gray-200 dark:border-[#404040]">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr className="border-b border-gray-200 dark:border-[#404040] text-xs uppercase text-gray-500 font-semibold">
                            <th className="sticky top-0 z-10 bg-gray-50 px-6 py-4">Name</th>
                            <th className="sticky top-0 z-10 bg-gray-50 px-6 py-4">Email</th>
                            <th className="sticky top-0 z-10 bg-gray-50 px-6 py-4">Role</th>
                            <th className="sticky top-0 z-10 bg-gray-50 px-6 py-4 text-center truncate">Active Tasks</th>
                            {isAdmin && <th className="sticky top-0 z-10 bg-gray-50 px-6 py-4 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {members.map((member) => (
                            <tr key={member.email} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full border border-primary/30 bg-primary/10 text-primary flex justify-center items-center text-sm flex-shrink-0">
                                            {member.name?.[0]?.toUpperCase() || "?"}
                                        </div>
                                        <p className="flex items-center gap-2 text-sm font-medium text-gray-900 truncate">
                                            {highlightSearchMatch(member.name.replace(/\(Pending\)/g, "").trim(), searchTerm)}
                                            {member.name.includes("(Pending)") && member.projectRole !== "PROJECT_ADMIN" ? (
                                                <AlertCircle size={16} className="text-amber-500" />
                                            ) : member.projectRole === "PROJECT_ADMIN" ? (
                                                null
                                            ) : (
                                                <CheckCircle size={16} className="text-green-500" />
                                            )}
                                            {member.email === userEmail && (
                                                <span className="ml-0 text-sm text-gray-400">
                                                    [you]
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm text-gray-600 dark:text-[#bfbfbf]">
                                        {highlightSearchMatch(member.email, searchTerm)}
                                    </p>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex items-center gap-1.5 text-xs capitalize font-medium px-2.5 py-1 rounded-[5px] ${member.projectRole === "PROJECT_ADMIN"
                                            ? "bg-primary/10 text-primary border border-primary/40"
                                            : "bg-gray-100 text-gray-600 dark:text-[#bfbfbf] border border-gray-200 dark:border-[#404040]/40"
                                            }`}
                                    >
                                        {member.projectRole === "PROJECT_ADMIN"
                                            ? "Admin"
                                            : "Member"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center justify-center min-w-[30px] h-[30px] text-gray-700 dark:text-[#cccccc] text-sm font-medium">
                                        {member.activeTaskCount || 0}
                                    </span>
                                </td>
                                {isAdmin && (
                                    <td className="px-6 py-4 text-right relative">
                                        <div className="relative inline-block text-left">
                                            <button
                                                onClick={(e) => toggleActionMenu(member.email, e)}
                                                className="p-2 text-gray-400 hover:text-gray-600 dark:text-[#bfbfbf] rounded-lg transition-colors cursor-pointer"
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
                <div className="px-6 py-4 text-center text-gray-500">
                    No team members found.
                </div>
            )}

            {actionMenuOpen && createPortal(
                <div className="fixed inset-0 z-[9999] flex flex-col" style={{ top: 0, left: 0 }}>
                    <div className="fixed inset-0 bg-transparent" onClick={closeMenu} />
                    <div
                        className="absolute z-[10000] w-48 bg-white py-1 ring-1 ring-gray-400 ring-opacity-5 focus:outline-none"
                        style={{ top: menuPosition.top, left: menuPosition.left }}
                    >
                        <div className="absolute -top-[7px] right-[10px] w-3 h-3 rotate-45 bg-white border-t border-l border-gray-400 z-[-1]" />
                        <button
                            onClick={handleViewTasks}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-[#cccccc] hover:bg-gray-100"
                        >
                            <Eye className="mr-3 h-4 w-4 text-gray-400" />
                            View Tasks
                        </button>
                        {(() => {
                            const member = members.find(m => m.email === actionMenuOpen);
                            if (member && member.email !== userEmail) {
                                return (
                                    <button
                                        onClick={handleRemoveMember}
                                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="mr-3 h-4 w-4 text-red-500" />
                                        Remove Member
                                    </button>
                                );
                            }
                            return null;
                        })()}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};
