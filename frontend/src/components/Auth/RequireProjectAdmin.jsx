import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import NotFound from "../../pages/NotFound";

const RequireProjectAdmin = () => {
    const activeProject = useSelector((state) => state.project.activeProject);

    if (activeProject && activeProject.role !== "PROJECT_ADMIN") {
        return <NotFound />;
    }

    return <Outlet />;
};

export default RequireProjectAdmin;
