import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Users, UserPlus, Trash2, Shield, UserCheck, AlertCircle } from "lucide-react";
import { Button, Input, Dialog } from "../components/ui";
import {
    useGetProjectMembersQuery,
    useInviteMemberMutation,
    useRemoveMemberMutation,
} from "../store/api/projectsApi";
import { TeamTable } from "../components/TeamTable";
import { useSnackbar } from "../context/SnackbarContext";

const TeamMembers = () => {
    const { projectId } = useParams();
    const activeProject = useSelector((state) => state.project.activeProject);
    const userEmail = useSelector((state) => state.auth.userEmail);
    const isAdmin = activeProject?.role === "PROJECT_ADMIN";
    const { showSnackbar } = useSnackbar();

    const { data: members = [], isLoading } = useGetProjectMembersQuery(projectId);
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
            // setInviteError({ email: errorMessage }); // Optional: if you want to keep the field error
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7733ff]" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex justify-between gap-2">
                    <h1 className="text-3xl text-gray-600 truncate">Team Members</h1>
                    <span className="text-gray-500 text-2xl p-2 rounded-full bg-gray-100 w-10 h-10 flex items-center justify-center">
                        {members.length}
                    </span>
                </div>
                {isAdmin && (
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => setInviteDialogOpen(true)}
                    >
                        <UserPlus size={16} />
                        Invite
                    </Button>
                )}
            </div>

            <TeamTable
                members={members}
                userEmail={userEmail}
                isAdmin={isAdmin}
                onRemove={setRemoveTarget}
            />

            {/* Invite Dialog */}
            <Dialog
                open={inviteDialogOpen}
                onClose={() => {
                    setInviteDialogOpen(false);
                    setInviteEmail("");
                }}
                title="Invite Team Member"
                size="sm"
            >
                <form onSubmit={handleInvite} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Email Address
                        </label>
                        <Input
                            type="email"
                            placeholder="colleague@example.com"
                            value={inviteEmail}
                            onChange={(e) => {
                                setInviteEmail(e.target.value);
                                if (inviteError.email) setInviteError({});
                            }}
                            autoFocus
                            error={!!inviteError.email}
                            helperText={inviteError.email}
                        />
                        <p className="text-orange-400 text-sm font-light mt-2 flex gap-2 items-center">
                            <AlertCircle size={16} />
                            The user must already have a Rhine account.
                        </p>
                    </div>
                    <div className="flex gap-3 justify-end">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setInviteDialogOpen(false);
                                setInviteEmail("");
                                setInviteError({});
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={inviteLoading}
                        >
                            Send Invite
                        </Button>
                    </div>
                </form>
            </Dialog>

            {/* Remove Confirmation Dialog */}
            <Dialog
                open={!!removeTarget}
                onClose={() => setRemoveTarget(null)}
                title="Remove Member?"
                size="sm"
            >
                <p className="text-gray-600 mb-6">
                    Remove <strong>{removeTarget?.name}</strong> from this project?
                    They will lose access to all tasks and data.
                </p>
                <div className="flex gap-3 justify-end">
                    <Button variant="secondary" onClick={() => setRemoveTarget(null)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleRemove}>
                        Remove
                    </Button>
                </div>
            </Dialog>
        </div>
    );
};

export default TeamMembers;
