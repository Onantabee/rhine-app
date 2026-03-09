import { AlertCircle, Check } from "lucide-react";
import { Button, LoadingSpinner } from "../../../core/ui";
import { useAcceptInvite } from '../hooks/useAcceptInvite';

const AcceptInvite = () => {
    const {
        token,
        isLoading,
        isSuccess,
        isError,
        error,
        navigate
    } = useAcceptInvite();

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
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                            <AlertCircle size={50} className="text-red-500" />
                        </div>
                        <h2 className="text-3xl font-semibold text-center text-gray-700 dark:text-[#cccccc]">
                            {error?.status === 404 || error?.status === 400 ? 'Invite has been revoked' : error?.status === 403 ? 'Unauthorized Access' : 'Invitation Failed'}
                        </h2>
                        <p className="text-red-400 font-light text-md text-center">
                            {error?.status === 404 || error?.status === 400
                                ? 'Your invite has been revoked by the project administrator.'
                                : error?.status === 403
                                    ? (error?.data?.message || 'You cannot accept an invite intended for another user.')
                                    : (error?.data?.message || 'Unable to accept invitation. It may be invalid or expired.')}
                        </p>
                        <Button onClick={() => navigate('/')} className="w-fit">
                            Go to Home
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AcceptInvite;
