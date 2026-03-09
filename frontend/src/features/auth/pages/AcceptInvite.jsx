import { AlertCircle, Check, Info } from "lucide-react";
import { Button, LoadingSpinner } from "../../../core/ui";
import { useAcceptInvite } from '../hooks/useAcceptInvite';
import { useSelector } from 'react-redux';

const AcceptInvite = () => {
    const {
        token,
        isLoading,
        isSuccess,
        isError,
        error,
        navigate
    } = useAcceptInvite();

    const { lastProjectId } = useSelector((state) => state.auth);
    const activeProject = useSelector((state) => state.project.activeProject);

    const handleGoHome = () => {
        if (activeProject) {
            navigate(`/project/${activeProject.id}`);
        } else if (lastProjectId) {
            navigate(`/project/${lastProjectId}`);
        } else {
            navigate('/create-project');
        }
    };

    if (!token) {
        return (
            <div className="flex items-center justify-center h-[100dvh]">
                <div className="flex flex-col gap-2 items-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle size={50} className="text-red-500" />
                    </div>
                    <h2 className="text-3xl font-semibold text-center text-gray-700 dark:text-[#cccccc]">Invalid Invitation Link!!</h2>
                    <p className="text-red-400 font-light text-md text-center">No token provided.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-[100dvh] px-4 md:px-6">
            <div className="text-center bg-white dark:bg-[#1a1a1a] p-5 py-12 max-w-md w-full">
                {isLoading && (
                    <div className="flex flex-col items-center gap-6">
                        <LoadingSpinner size="lg" />
                        <h2 className="text-3xl font-semibold text-center text-gray-700 dark:text-[#cccccc]">Verifying Invitation...</h2>
                        <p className="text-gray-600 dark:text-[#bfbfbf] font-light text-md text-center">Please wait while we process your request.</p>
                    </div>
                )}
                {isSuccess && (
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <Check size={50} className="text-green-500" />
                        </div>
                        <h2 className="text-3xl font-semibold text-center text-gray-700 dark:text-[#cccccc]">Welcome Aboard!</h2>
                        <p className="text-green-600 font-light text-md text-center">You have successfully joined the project.</p>
                        <span className="flex items-center gap-2">
                            <p className="text-md text-gray-500 dark:text-[#666666]">Redirecting </p>
                            <LoadingSpinner size="md" />
                        </span>
                    </div>
                )}
                {isError && (
                    <div className="flex flex-col items-center gap-6">
                        {error?.status === 409 ? (
                            <>
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                    <Info size={50} className="text-blue-500" />
                                </div>
                                <h2 className="text-3xl font-semibold text-center text-gray-700 dark:text-[#cccccc]">Already a Member</h2>
                                <p className="text-gray-600 dark:text-[#bfbfbf] font-light text-md text-center">
                                    You are already an active member of this project.
                                </p>
                                <span className="flex items-center gap-2">
                                    <p className="text-md text-gray-500 dark:text-[#666666]">Redirecting </p>
                                    <LoadingSpinner size="md" />
                                </span>
                            </>
                        ) : error?.status === 404 ? (
                            <>
                                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                                    <AlertCircle size={50} className="text-red-500" />
                                </div>
                                <h2 className="text-3xl font-semibold text-center text-gray-700 dark:text-[#cccccc]">Invalid Link</h2>
                                <p className="text-red-400 font-light text-md text-center">
                                    This invitation link is invalid or has never existed.
                                </p>
                            </>
                        ) : error?.status === 400 ? (
                            <>
                                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                                    <AlertCircle size={50} className="text-orange-500" />
                                </div>
                                <h2 className="text-3xl font-semibold text-center text-gray-700 dark:text-[#cccccc]">Invite Revoked</h2>
                                <p className="text-orange-400 font-light text-md text-center">
                                    {error?.data?.message || 'Invitation has been revoked by the project admin.'}
                                </p>
                            </>
                        ) : error?.status === 403 ? (
                            <>
                                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                                    <AlertCircle size={50} className="text-red-500" />
                                </div>
                                <h2 className="text-3xl font-semibold text-center text-gray-700 dark:text-[#cccccc]">Unauthorized</h2>
                                <p className="text-red-400 font-light text-md text-center">
                                    {error?.data?.message || 'This invitation was intended for another user account.'}
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                                    <AlertCircle size={50} className="text-red-500" />
                                </div>
                                <h2 className="text-3xl font-semibold text-center text-gray-700 dark:text-[#cccccc]">Invitation Failed</h2>
                                <p className="text-red-400 font-light text-md text-center">
                                    Unable to accept invitation. It may be expired or invalid.
                                </p>
                            </>
                        )}
                        <Button
                            onClick={error?.status === 409 && error?.data?.data
                                ? () => navigate(`/project/${error.data.data}`)
                                : handleGoHome}
                            className="w-fit"
                        >
                            {error?.status === 409 ? 'Go to Dashboard' : 'Go to Home'}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AcceptInvite;
