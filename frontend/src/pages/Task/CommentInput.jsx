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
            <div className="sticky bottom-0 w-full max-w-3xl mx-auto bg-[#1a1a1a]/70 backdrop-blur-2xl rounded-lg pb-7 p-2">
                <div className="text-center text-gray-500 py-4">
                    Commenting is disabled for cancelled tasks
                </div>
            </div>
        );
    }

    return (
        <div className="sticky bottom-0 w-full max-w-3xl mx-auto bg-[#1a1a1a]/70 backdrop-blur-2xl rounded-lg pb-7 p-2">
            <div className="flex gap-2 items-end bg-[#404040] rounded-2xl p-2">
                <div
                    contentEditable="true"
                    ref={inputRef}
                    onInput={onCommentChange}
                    data-placeholder={!editingComment ? "Add a comment..." : ""}
                    className="w-full p-2 text-gray-200 resize-none overflow-y-auto outline-none relative before:absolute before:left-2 before:top-2 before:text-gray-400 before:pointer-events-none before:content-[attr(data-placeholder)]"
                    style={{
                        maxHeight: `${5 * 24}px`,
                        borderRadius: "8px",
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
                    className={`flex justify-center items-center border-2 h-10 font-semibold rounded-full transition-all duration-300 ease-in-out transform ${newComment.trim() !== ""
                            ? editingComment
                                ? "bg-green-600 border-green-400 w-12 text-white hover:bg-green-700"
                                : "bg-blue-600 border-blue-400 w-11 text-white hover:bg-blue-700"
                            : "bg-gray-500 border-[#595959] w-11 text-[#404040]"
                        }`}
                >
                    {editingComment ? (
                        <Check className="text-[#404040]" size={24} />
                    ) : (
                        <ArrowUp size={24} />
                    )}
                </button>
                {editingComment && (
                    <button
                        onClick={onCancelEdit}
                        className="flex justify-center items-center border-2 border-red-400 bg-red-600 h-10 w-11 font-semibold rounded-full hover:bg-red-700"
                    >
                        <X className="text-white" size={24} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default CommentInput;
