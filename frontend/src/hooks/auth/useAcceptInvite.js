import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAcceptInviteMutation } from '../../store/api/projectsApi';
import { setHasProjects } from '../../store/slices/authSlice';
import { useSnackbar } from '../../context/SnackbarContext';

export const useAcceptInvite = () => {
    const dispatch = useDispatch();
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
                    dispatch(setHasProjects(true));
                    showSnackbar('Invitation accepted successfully!', 'success');
                    setTimeout(() => navigate(`/project/${projectId}`), 2000);
                })
                .catch((err) => {
                    console.error("Failed to accept invite:", err);
                    showSnackbar(err.data?.message || 'Failed to accept invitation.', 'error');
                });
        }
    }, [token, acceptInvite, navigate, showSnackbar, dispatch]);

    return {
        token,
        isLoading,
        isSuccess,
        isError,
        error,
        navigate
    };
};
