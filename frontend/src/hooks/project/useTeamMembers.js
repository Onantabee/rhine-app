import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    useGetProjectMembersQuery,
    useInviteMemberMutation,
    useRemoveMemberMutation,
} from "../../store/api/projectsApi";
import { useSnackbar } from "../../context/SnackbarContext";

export const useTeamMembers = () => {
    const { projectId } = useParams();
    const activeProject = useSelector((state) => state.project.activeProject);
    const userEmail = useSelector((state) => state.auth.userEmail);
    const searchTerm = useSelector((state) => state.auth.searchTerm);
    const isAdmin = activeProject?.role === "PROJECT_ADMIN";
    const { showSnackbar } = useSnackbar();

    const { data: members = [], isLoading } = useGetProjectMembersQuery(projectId);

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [inviteMember, { isLoading: inviteLoading }] = useInviteMemberMutation();
    const [removeMember] = useRemoveMemberMutation();

    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [inviteError, setInviteError] = useState({});
    const [removeTarget, setRemoveTarget] = useState(null);

    const handleInvite = async (e) => {
        e.preventDefault();
        if (!inviteEmail.trim()) {
            setInviteError({ email: "Email is required" });
            return;
        }

        try {
            await inviteMember({
                projectId,
                email: inviteEmail.trim(),
            }).unwrap();
            showSnackbar(`Invited ${inviteEmail}`, "success");
            setInviteEmail("");
            setInviteDialogOpen(false);
        } catch (error) {
            const errorMessage = error?.data?.message || "Failed to invite member";
            showSnackbar(errorMessage, "error");
        }
    };

    const handleRemove = async () => {
        if (!removeTarget) return;
        try {
            await removeMember({
                projectId,
                email: removeTarget.email,
            }).unwrap();
            showSnackbar(`Removed ${removeTarget.name}`, "success");
            setRemoveTarget(null);
        } catch (error) {
            showSnackbar(error?.data?.message || "Failed to remove member", "error");
        }
    };

    return {
        projectId,
        activeProject,
        userEmail,
        searchTerm,
        isAdmin,
        members,
        isLoading,
        filteredMembers,
        inviteLoading,
        inviteEmail,
        setInviteEmail,
        inviteDialogOpen,
        setInviteDialogOpen,
        inviteError,
        setInviteError,
        removeTarget,
        setRemoveTarget,
        handleInvite,
        handleRemove
    };
};
