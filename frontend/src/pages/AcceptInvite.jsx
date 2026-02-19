import { Button, LoadingSpinner } from "../components/ui";
import { useAcceptInvite } from "../hooks/auth/useAcceptInvite";

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
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col gap-2 items-center">
                    <h2 className="text-3xl font-semibold text-center text-gray-700">Invalid Invitation Link</h2>
                    <p className="text-red-400 font-light text-md text-center">No token provided.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center bg-white p-5 max-w-md border border-gray-200 w-full">
                {isLoading && (
                    <div className="flex flex-col items-center gap-6">
                        <LoadingSpinner size="lg" />
                        <h2 className="text-3xl font-semibold text-center text-gray-700">Verifying Invitation...</h2>
                        <p className="text-gray-600 font-light text-md text-center">Please wait while we process your request.</p>
                    </div>
                )}
                {isSuccess && (
                    <div className="flex flex-col items-center gap-6">
                        <h2 className="text-3xl font-semibold text-center text-gray-700">Welcome Aboard!</h2>
                        <p className="text-green-600 font-light text-md text-center">You have successfully joined the project.</p>
                        <p className="text-sm text-gray-500">Redirecting you to the dashboard...</p>
                    </div>
                )}
                {isError && (
                    <div className="flex flex-col items-center gap-6">
                        <h2 className="text-3xl font-semibold text-center text-gray-700">Invitation Failed</h2>
                        <p className="text-red-600 font-light text-md text-center">{error?.data?.message || 'Unable to accept invitation. It may be invalid or expired.'}</p>
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
