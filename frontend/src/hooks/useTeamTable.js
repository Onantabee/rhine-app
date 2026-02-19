import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const useTeamTable = ({ members, userEmail, onRemove }) => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [actionMenuOpen, setActionMenuOpen] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    const toggleActionMenu = (email, event) => {
        if (actionMenuOpen === email) {
            setActionMenuOpen(null);
        } else {
            const rect = event.currentTarget.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + window.scrollY,
                left: rect.right + window.scrollX - 192
            });
            setActionMenuOpen(email);
        }
    };

    const closeMenu = () => setActionMenuOpen(null);

    const handleViewTasks = () => {
         navigate(`/project/${projectId}?assigneeEmail=${actionMenuOpen}`);
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
        toggleActionMenu,
        closeMenu,
        handleViewTasks,
        handleRemoveMember
    };
};
