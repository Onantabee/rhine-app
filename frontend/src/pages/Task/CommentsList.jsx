import React from "react";
import CommentItem from "./CommentItem";

/**
 * CommentsList component - Displays list of comments
 */
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
        <div className="mt-2">
            <h2 className="text-lg font-semibold text-gray-700">Comments</h2>
            <div
                ref={containerRef}
                className="space-y-2 max-h-[300px] mt-3 px-5 overflow-y-auto"
            >
                {comments.length === 0 ? (
                    <p className="text-gray-400">No comments yet.</p>
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
