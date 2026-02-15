import React from "react";
import { MoreVerticalIcon } from "lucide-react";
import { differenceInSeconds, formatDistanceToNowStrict } from "date-fns";

/**
 * CommentItem component - Individual comment display
 */
const CommentItem = ({
    comment,
    currentUserEmail,
    authorName,
    now,
    isCommentingAllowed,
    isDropdownOpen,
    onToggleDropdown,
    onEdit,
    onDelete,
    dropdownRef,
}) => {
    const isOwnComment = comment.authorEmail === currentUserEmail;
    const canEdit = differenceInSeconds(now, new Date(comment.createdAt)) <= 300 && isCommentingAllowed;

    return (
        <div className="relative overflow-visible">
            <div
                className={`py-2 pl-2 flex group items-center gap-2 ${isOwnComment ? "bg-[#7733ff]/5 hover:bg-[#7733ff]/10" : "bg-gray-50"
                    }`}
            >
                <div
                    className={`h-10 w-[4px] rounded ${isOwnComment ? "bg-[#7733ff]/30 group-hover:bg-[#7733ff]" : "bg-gray-300"
                        }`}
                />
                <div className="flex justify-between w-full items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span
                                className={`text-xs uppercase ${isOwnComment
                                    ? "text-gray-500 group-hover:text-[#7733ff]"
                                    : "text-gray-500"
                                    }`}
                            >
                                {authorName}
                            </span>
                            <div className="bg-gray-300 w-1 h-1 rounded-full" />
                            <p
                                className={`text-xs ${isOwnComment
                                    ? "text-gray-400 group-hover:text-[#7733ff]/70"
                                    : "text-gray-400"
                                    }`}
                            >
                                {differenceInSeconds(now, new Date(comment.createdAt)) < 60
                                    ? "just now"
                                    : formatDistanceToNowStrict(new Date(comment.createdAt), {
                                        addSuffix: true,
                                    })}
                            </p>
                        </div>
                        <p className="text-md text-gray-700">{comment.content}</p>
                    </div>
                    {isOwnComment && (
                        <div className="relative top-0 opacity-0 right-0 group-hover:opacity-100">
                            <button
                                onClick={() => onToggleDropdown(comment.id)}
                                className="cursor-pointer p-1 text-gray-400 hover:text-[#7733ff]"
                            >
                                <MoreVerticalIcon size={25} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {isDropdownOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute py-1 gap-1 right-0 mt-0 w-36 bg-white border border-gray-200 z-50"
                >
                    <div className="absolute -top-[7px] right-[17px] w-3 h-3 rotate-45 bg-white border-t border-l border-gray-200 z-[-1]" />
                    {canEdit ? (
                        <button
                            onClick={() => onEdit(comment)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left cursor-pointer"
                        >
                            Edit
                        </button>

                    ) : (
                        null
                    )}
                    {isCommentingAllowed && (
                        <button
                            onClick={() => onDelete(comment.id)}
                            className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-50 w-full text-left cursor-pointer"
                        >
                            Delete
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default CommentItem;
