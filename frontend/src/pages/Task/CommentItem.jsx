import { createPortal } from "react-dom";
import { MoreVerticalIcon } from "lucide-react";
import { differenceInSeconds, formatDistanceToNowStrict } from "date-fns";
import { useCommentItem } from "../../hooks/task/useCommentItem";

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
    const {
        isOwnComment,
        canEdit,
        triggerRef,
        dropdownPosition,
    } = useCommentItem({
        comment,
        currentUserEmail,
        now,
        isCommentingAllowed,
        isDropdownOpen,
    });

    return (
        <div className="relative overflow-visible border-b border-gray-200 last:border-b-0">
            <div className={`py-2 pl-2 flex group items-center gap-2 ${isOwnComment ? "bg-gray-100/30 hover:bg-gray-100/50" : ""}`}>
                <div className="flex justify-between w-full items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span
                                className={`text-sm capitalize ${isOwnComment
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
                        <p className="text-md text-gray-700 break-all whitespace-pre-wrap">{comment.content}</p>
                    </div>
                    {isOwnComment && (
                        <div className="relative top-0 opacity-0 right-0 group-hover:opacity-100">
                            <button
                                ref={triggerRef}
                                onClick={() => onToggleDropdown(comment.id)}
                                className="cursor-pointer p-1 text-gray-400 hover:text-[#7733ff]"
                            >
                                <MoreVerticalIcon size={25} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {isDropdownOpen && createPortal(
                <div
                    ref={dropdownRef}
                    style={{
                        top: dropdownPosition.top,
                        left: dropdownPosition.left,
                    }}
                    className="absolute py-1 gap-1 w-36 bg-white border border-gray-400 z-50"
                >
                    <div className="absolute -top-[7px] right-[10px] w-3 h-3 rotate-45 bg-white border-t border-l border-gray-400 z-[-1]" />
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
                </div>,
                document.body
            )}
        </div>
    );
};

export default CommentItem;
