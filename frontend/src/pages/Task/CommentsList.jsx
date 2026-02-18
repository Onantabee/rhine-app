import React from "react";
import CommentItem from "./CommentItem";

const CommentsList = ({
    comments,
    currentUserEmail,
    getAuthorName,
    now,
    isCommentingAllowed,
    openDropdownId,
    onToggleDropdown,
    onEditComment,
    onDeleteComment,
    dropdownRef,
    containerRef,
}) => {
    const sortedComments = [...comments].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    return (
        <div className="flex-1 flex flex-col gap-3 min-h-0">
            <h2 className="text-lg font-semibold text-gray-700 shrink-0">Comments</h2>
            <div
                ref={containerRef}
                className="flex flex-col px-3 overflow-y-auto h-full"
            >
                {comments.length === 0 ? (
                    <div className="flex items-center justify-center flex-1 h-full">
                        <p className="text-gray-300 text-5xl font-semibold">No comments yet.</p>
                    </div>
                ) : (
                    sortedComments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            currentUserEmail={currentUserEmail}
                            authorName={getAuthorName(comment.authorEmail)}
                            now={now}
                            isCommentingAllowed={isCommentingAllowed}
                            isDropdownOpen={openDropdownId === comment.id}
                            onToggleDropdown={onToggleDropdown}
                            onEdit={onEditComment}
                            onDelete={onDeleteComment}
                            dropdownRef={dropdownRef}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentsList;
