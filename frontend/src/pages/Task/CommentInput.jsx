import React from "react";
import { ArrowUp, Check, X } from "lucide-react";

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
            <div className="sticky bottom-0 md:sticky md:bottom-0 shrink-0 w-full max-w-3xl mx-auto bg-white pb-7 p-2">
                <div className="text-center text-gray-400 py-4">
                    Commenting is disabled for cancelled tasks
                </div>
            </div>
        );
    }

    return (
        <div className="sticky bottom-0 md:sticky md:bottom-0 shrink-0 w-full max-w-3xl mx-auto p-2 ">
            <div className={`w-full ${editingComment ? "bg-gray-600" : "bg-none"}`}>
                {editingComment && (
                    <div className="flex justify-between items-center p-2 px-4">
                        <p className="text-gray-300">Editing comment...</p>
                        <button
                            onClick={onCancelEdit}
                            className="flex justify-center items-center p-1 font-semibold cursor-pointer rounded-full text-gray-300 hover:text-gray-50"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}
                <div className="flex gap-2 items-end bg-gray-100 dark:bg-[#333333] p-2 border border-gray-200 dark:border-[#404040]">
                    <div
                        contentEditable="true"
                        ref={inputRef}
                        onInput={onCommentChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                if (newComment.trim() !== "") onSubmit();
                            }
                        }}
                        data-placeholder={!newComment ? "Add a comment..." : ""}
                        className="w-full p-2 text-gray-800 resize-none overflow-y-auto outline-none relative before:absolute before:left-2 before:top-2 before:text-gray-400 before:pointer-events-none before:content-[attr(data-placeholder)] break-all whitespace-pre-wrap"
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
                        className={`flex justify-center items-center border h-10 font-semibold cursor-pointer rounded-full ${newComment.trim() !== ""
                            ? "bg-primary border-primary w-11 text-white hover:bg-primary-hover"
                            : "bg-gray-200 border-gray-200 dark:border-[#404040] w-11 text-gray-400"
                            }`}
                    >
                        <ArrowUp size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommentInput;
