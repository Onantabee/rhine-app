import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAcceptInviteMutation } from '../../project/api/projectsApi';
import { setHasProjects } from '../store/authSlice';
import { useSnackbar } from '../../../core/context/SnackbarContext';
import { useSelector } from 'react-redux';

export const useAcceptInvite = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const [acceptInvite, { isLoading, isSuccess, isError, error }] = useAcceptInviteMutation();
    const { showSnackbar } = useSnackbar();

    const { isLoggedIn, isVerified } = useSelector((state) => state.auth);

    const hasRequested = useRef(false);

    useEffect(() => {
        if (!token) return;

        if (!isLoggedIn) {
            localStorage.setItem('redirect_to', `/accept-invite?token=${token}`);
            navigate('/');
            return;
        }

        if (isLoggedIn && !hasRequested.current) {
            hasRequested.current = true;
            acceptInvite(token)
                .unwrap()
                .then((projectId) => {
                    localStorage.removeItem('redirect_to');
                    dispatch(setHasProjects(true));
                    showSnackbar('Invitation accepted successfully!', 'success');
                    setTimeout(() => navigate(`/project/${projectId}`), 2000);
                })
                .catch((err) => {
                    console.error("Failed to accept invite:", err);
                    localStorage.removeItem('redirect_to');
                    
                    if (err.status === 409) {
                        showSnackbar('You are already a member of this project.', 'info');
                        const projectId = err.data?.data;
                        if (projectId) {
                            setTimeout(() => navigate(`/project/${projectId}`), 3000);
                        }
                    } else {
                        showSnackbar(err.data?.message || 'Invitation has expired or been revoked.', 'error');
                    }
                });
        }
    }, [token, isLoggedIn, isVerified, acceptInvite, navigate, showSnackbar, dispatch]);

    return {
        token,
        isLoading,
        isSuccess,
        isError,
        error,
        navigate
    };
};
