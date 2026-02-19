import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import SidePane from "./SidePane";
import { closeMobileMenu } from "../store/slices/uiSlice";

const WorkspaceLayout = () => {
    const dispatch = useDispatch();
    const mobileMenuOpen = useSelector((state) => state.ui.mobileMenuOpen);
    const location = useLocation();
    const { hasProjects, sessionChecked } = useSelector((state) => state.auth);

    if (sessionChecked && !hasProjects) {
        return <Navigate to="/create-project" replace />;
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
