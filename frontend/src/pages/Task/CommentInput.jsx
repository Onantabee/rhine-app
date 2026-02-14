import React from "react";
import { ArrowUp, Check, X } from "lucide-react";

/**
 * CommentInput component - Input area for adding/editing comments
 */
const CommentInput = ({
    isCommentingAllowed,
    newComment,
    editingComment,
    onCommentChange,
    onSubmit,
    onCancelEdit,
    inputRef,
}) => {
    if (!isCommentingAllowed) {
        return (
            <div className="sticky bottom-0 w-full max-w-3xl mx-auto bg-white pb-7 p-2">
                <div className="text-center text-gray-400 py-4">
                    Commenting is disabled for cancelled tasks
                </div>
            </div>
        );
    }

    return (
        <div className="sticky bottom-0 w-full max-w-3xl mx-auto bg-white pb-7 p-2">
            <div className="flex gap-2 items-end bg-gray-100 p-2 border border-gray-200">
                <div
                    contentEditable="true"
                    ref={inputRef}
                    onInput={onCommentChange}
                    data-placeholder={!editingComment ? "Add a comment..." : ""}
                    className="w-full p-2 text-gray-800 resize-none overflow-y-auto outline-none relative before:absolute before:left-2 before:top-2 before:text-gray-400 before:pointer-events-none before:content-[attr(data-placeholder)]"
                    style={{
                        maxHeight: `${5 * 24}px`,
                        backgroundColor: "transparent",
                        display: "block",
                        whiteSpace: "pre-wrap",
                        overflowWrap: "break-word",
                    }}
                    role="textbox"
                />
                <button
                    onClick={onSubmit}
                    disabled={newComment.trim() === ""}
                    className={`flex justify-center items-center border h-10 font-semibold cursor-pointer ${newComment.trim() !== ""
                        ? editingComment
                            ? "bg-green-500 border-green-400 w-12 text-white hover:bg-green-600"
                            : "bg-[#7733ff] border-[#7733ff] w-11 text-white hover:bg-[#661aff]"
                        : "bg-gray-200 border-gray-300 w-11 text-gray-400"
                        }`}
                >
                    {editingComment ? (
                        <Check size={24} />
                    ) : (
                        <ArrowUp size={24} />
                    )}
                </button>
                {editingComment && (
                    <button
                        onClick={onCancelEdit}
                        className="flex justify-center items-center border border-red-400 bg-red-500 h-10 w-11 font-semibold hover:bg-red-600 cursor-pointer"
                    >
                        <X className="text-white" size={24} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default CommentInput;
