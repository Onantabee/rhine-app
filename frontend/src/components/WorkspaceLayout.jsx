import React from "react";
import { Outlet } from "react-router-dom";
import SidePane from "./SidePane";

const WorkspaceLayout = () => {
    return (
        <div className="flex w-full h-[calc(100vh-70px)] overflow-hidden">
            <SidePane />
            <main className="flex-1 h-full overflow-y-auto p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default WorkspaceLayout;
