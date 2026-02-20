import { Outlet, useLocation, Navigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import SidePane from "./SidePane";
import { closeMobileMenu } from "../../store/slices/uiSlice";
import { useGetProjectByIdQuery } from "../../store/api/projectsApi";
import NotFound from "../../pages/NotFound";
import { LoadingSpinner } from "../ui";

const WorkspaceLayout = () => {
    const dispatch = useDispatch();
    const mobileMenuOpen = useSelector((state) => state.ui.mobileMenuOpen);
    const location = useLocation();
    const { hasProjects, sessionChecked } = useSelector((state) => state.auth);
    const { projectId } = useParams();

    const { error, isLoading } = useGetProjectByIdQuery(projectId, {
        skip: !projectId,
    });

    if (sessionChecked && !hasProjects) {
        return <Navigate to="/create-project" replace />;
    }

    if (projectId && isLoading) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (projectId && error) {
        return <NotFound title="Project Not Found" message="The project you are looking for doesn't exist or you don't have access to it." />;
    }

    return (
        <div className="flex w-full h-[calc(100vh-70px)] overflow-hidden">
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
