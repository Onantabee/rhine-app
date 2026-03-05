import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRemoveMemberMutation } from '../api/projectsApi';
import { useSnackbar } from "../../../core/context/SnackbarContext";

export const useTeamTable = ({ members, userEmail, onRemove }) => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [actionMenuOpen, setActionMenuOpen] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [dropDirection, setDropDirection] = useState("down");

    const toggleActionMenu = (email, event, isLast = false) => {
        if (actionMenuOpen === email) {
            setActionMenuOpen(null);
        } else {
            const member = members.find(m => m.email === email);
            const isPending = member?.name?.includes("(Pending)");
            const isSelf = member?.email === userEmail;
            
            let itemsCount = 0;
            if (!isPending) itemsCount++;
            if (!isSelf) itemsCount++;
            
            const menuHeight = itemsCount > 0 ? (itemsCount * 36) + 8 : 44;
            
            const rect = event.currentTarget.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const isDropUp = isLast || spaceBelow < menuHeight;
            
            setDropDirection(isDropUp ? "up" : "down");
            setMenuPosition({
                top: isDropUp ? rect.top + window.scrollY - menuHeight : rect.bottom + window.scrollY,
                left: rect.right + window.scrollX - 192
            });
            setActionMenuOpen(email);
        }
    };

    const closeMenu = () => setActionMenuOpen(null);

    const handleViewTasks = () => {
         navigate(`/project/${projectId}/tasks?assigneeEmail=${actionMenuOpen}`);
         closeMenu();
    };

    const handleRemoveMember = () => {
        const member = members.find(m => m.email === actionMenuOpen);
        if (member && member.email !== userEmail) {
            onRemove(member);
            closeMenu();
        }
    };

    return {
        projectId,
        actionMenuOpen,
        menuPosition,
        dropDirection,
        toggleActionMenu,
        closeMenu,
        handleViewTasks,
        handleRemoveMember
    };
};
