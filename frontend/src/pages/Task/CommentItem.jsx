import React, { useRef } from "react";
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
                className={`rounded-lg py-2 pl-2 flex group items-center gap-2 ${isOwnComment ? "bg-[#595959]/20 hover:bg-blue-300/10" : "bg-red-300/10"
                    }`}
            >
                <div
                    className={`h-10 w-[4px] rounded-2xl ${isOwnComment ? "bg-[#595959] group-hover:bg-blue-300" : "bg-red-300"
                        }`}
                />
                <div className="flex justify-between w-full items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span
                                className={`text-xs uppercase ${isOwnComment
                                        ? "text-[#737373] group-hover:text-blue-200"
                                        : "text-red-200"
                                    }`}
                            >
                                {authorName}
                            </span>
                            <div className="bg-[#4d4d4d] w-1 h-1 rounded-full" />
                            <p
                                className={`text-xs text-gray-500 ${isOwnComment
                                        ? "text-[#4d4d4d] group-hover:text-blue-200"
                                        : "text-red-200"
                                    }`}
                            >
                                {differenceInSeconds(now, new Date(comment.createdAt)) < 60
                                    ? "just now"
                                    : formatDistanceToNowStrict(new Date(comment.createdAt), {
                                        addSuffix: true,
                                    })}
                            </p>
                        </div>
                        <p className="text-md text-gray-300">{comment.content}</p>
                    </div>
                    {isOwnComment && (
                        <div className="relative top-0 opacity-0 right-0 mt-2 mr-2 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                                onClick={() => onToggleDropdown(comment.id)}
                                className="cursor-pointer transition-colors duration-300 ease-in-out rounded-full p-1 text-blue-200/50 hover:text-blue-200"
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
                    className="absolute py-1 gap-1 right-0 mt-0 w-36 bg-[#262626] border border-[#444] rounded-md shadow-lg z-50"
                >
                    <div className="absolute -top-[7px] right-[17px] w-3 h-3 rotate-45 bg-[#262626] border-t border-l border-[#444] z-[-1]" />
                    {canEdit ? (
                        <button
                            onClick={() => onEdit(comment)}
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#333] w-full text-left"
                        >
                            Edit
                        </button>
                    ) : (
                        <p className="uppercase block px-4 py-2 text-sm italic text-[#595959] w-full text-left">
                            disabled
                        </p>
                    )}
                    {isCommentingAllowed && (
                        <button
                            onClick={() => onDelete(comment.id)}
                            className="block px-4 py-2 text-sm text-red-400 hover:bg-[#333] w-full text-left"
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
