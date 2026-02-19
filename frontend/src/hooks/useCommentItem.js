import { useState, useRef, useLayoutEffect } from "react";
import { differenceInSeconds } from "date-fns";

export const useCommentItem = ({
    comment,
    currentUserEmail,
    now,
    isCommentingAllowed,
    isDropdownOpen,
}) => {
    const isOwnComment = comment.authorEmail === currentUserEmail;
    const canEdit = differenceInSeconds(now, new Date(comment.createdAt)) <= 300 && isCommentingAllowed;

    const triggerRef = useRef(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    useLayoutEffect(() => {
        if (isDropdownOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                left: rect.right + window.scrollX - 144,
            });
        }
    }, [isDropdownOpen]);

    return {
        isOwnComment,
        canEdit,
        triggerRef,
        dropdownPosition,
    };
};
