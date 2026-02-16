import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAcceptInviteMutation } from '../store/api/projectsApi';
import { useSnackbar } from '../context/SnackbarContext';

const AcceptInvite = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const [acceptInvite, { isLoading, isSuccess, isError, error }] = useAcceptInviteMutation();
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        if (token) {
            acceptInvite(token)
                .unwrap()
                .then((projectId) => {
                    showSnackbar('Invitation accepted successfully!', 'success');
                    setTimeout(() => navigate(`/project/${projectId}`), 2000);
                })
                .catch((err) => {
                    console.error("Failed to accept invite:", err);
                    showSnackbar(err.data?.message || 'Failed to accept invitation.', 'error');
                });
        }
    }, [token, acceptInvite, navigate, showSnackbar]);

    if (!token) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-800">Invalid Invitation Link</h2>
                    <p className="text-gray-600 mt-2">No token provided.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                {isLoading && (
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7733ff] mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800">Verifying Invitation...</h2>
                        <p className="text-gray-600 mt-2">Please wait while we process your request.</p>
                    </div>
                )}
                {isSuccess && (
                    <div className="flex flex-col items-center">
                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>

                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800">Welcome Aboard!</h2>
                        <p className="text-gray-600 mt-2">You have successfully joined the project.</p>
                        <p className="text-sm text-gray-500 mt-4">Redirecting you to the dashboard...</p>
                    </div>
                )}
                {isError && (
                    <div className="flex flex-col items-center">
                        <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                            </svg>

                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">Invitation Failed</h2>
                        <p className="text-red-600 mt-2">{error?.data?.message || 'Unable to accept invitation. It may be invalid or expired.'}</p>
                        <button onClick={() => navigate('/')} className="mt-6 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors">
                            Go to Home
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AcceptInvite;
