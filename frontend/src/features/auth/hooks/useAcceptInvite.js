import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAcceptInviteMutation } from '../../project/api/projectsApi';
import { setHasProjects } from '../store/authSlice';
import { useSnackbar } from '../../../core/context/SnackbarContext';

export const useAcceptInvite = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const [acceptInvite, { isLoading, isSuccess, isError, error }] = useAcceptInviteMutation();
    const { showSnackbar } = useSnackbar();

    const hasRequested = useRef(false);
    useEffect(() => {
        if (token && !hasRequested.current) {
            hasRequested.current = true;
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
