import { Button, Input, Dialog, LoadingSpinner } from "../../../core/ui";
import { TeamTable } from '../components/TeamTable';
import { useTeamMembers } from '../hooks/useTeamMembers';
import { AlertCircle, UserPlus } from "lucide-react";

const TeamMembers = () => {
    const {
        userEmail,
        isAdmin,
        searchTerm,
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
    } = useTeamMembers();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 h-full">
            <div className="p-4 md:p-6 pb-0">
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#404040] pb-3 flex-shrink-0">
                    <div className="flex justify-between gap-2">
                        <h1 className="text-2xl md:text-3xl text-gray-600 dark:text-[#bfbfbf] truncate">Team Members</h1>
                        <span className="text-gray-500 dark:text-[#bfbfbf] text-sm md:text-2xl p-2 rounded-full bg-gray-100 dark:bg-[#404040] w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                            {filteredMembers.length}
                        </span>
                    </div>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => setInviteDialogOpen(true)}
                    >
                        <UserPlus size={20} />
                        <span className="hidden md:block">Invite</span>
                    </Button>
                </div>
            </div>

            <div className="w-full h-full p-4 md:p-6 pt-0">
                <TeamTable
                    members={filteredMembers}
                    userEmail={userEmail}
                    isAdmin={isAdmin}
                    onRemove={setRemoveTarget}
                    searchTerm={searchTerm}
                />
            </div>
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#cccccc] mb-1.5">
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

            <Dialog
                open={!!removeTarget}
                onClose={() => setRemoveTarget(null)}
                title="Remove Member?"
                size="sm"
            >
                <p className="text-gray-600 dark:text-[#bfbfbf] mb-6">
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
