import { Outlet, useLocation, Navigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import SidePane from './SidePane';
import { closeMobileMenu } from '../store/uiSlice';
import { useGetProjectByIdQuery } from '../../features/project/api/projectsApi';
import { setActiveProject, clearActiveProject, setProjectError } from '../../features/project/store/projectSlice';
import NotFound from '../pages/NotFound';
import { LoadingSpinner } from "../ui";
import useWebSocket from '../hooks/useWebSocket';

const WorkspaceLayout = () => {
    const dispatch = useDispatch();
    const mobileMenuOpen = useSelector((state) => state.ui.mobileMenuOpen);
    const location = useLocation();
    const { hasProjects, sessionChecked, userEmail } = useSelector((state) => state.auth);
    const activeProject = useSelector((state) => state.project.activeProject);
    const { projectId } = useParams();
    const { data: project, error, isLoading, isFetching } = useGetProjectByIdQuery(projectId, {
        skip: !projectId,
    });

    useWebSocket(projectId, userEmail);

    useEffect(() => {
        if (project && !error && !isLoading && !isFetching && (!activeProject || activeProject.id !== project.id)) {
            dispatch(
                setActiveProject({
                    id: project.id,
                    name: project.name,
                    role: project.currentUserRole,
                })
            );
        } else if (error) {
            dispatch(clearActiveProject());
            dispatch(setProjectError(true));
        }
    }, [project, activeProject, dispatch, error, isLoading, isFetching]);

    if (sessionChecked && !hasProjects) {
        return <Navigate to="/create-project" replace />;
    }

    if (projectId && isLoading) {
        return (
            <div className="flex justify-center items-center h-[100dvh] w-full">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (projectId && error) {
        return <NotFound title="Project Not Found" message="The project you are looking for doesn't exist or you don't have access to it." />;
    }

    return (
        <div className="flex w-full h-full overflow-hidden">
            <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex w-full md:w-auto h-full`}>
                <SidePane onLinkClick={() => dispatch(closeMobileMenu())} />
            </div>

            <main className={`${mobileMenuOpen ? 'hidden' : 'flex'} md:flex flex-1 flex-col h-full overflow-hidden`}>
                <div className="flex-1 overflow-hidden">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default WorkspaceLayout;
