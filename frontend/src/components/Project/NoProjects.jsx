import React, { useState } from "react";
import { FolderPlus } from "lucide-react";
import { Button } from "../ui";
import CreateProjectDialog from "./CreateProjectDialog";

const NoProjects = () => {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    return (
        <div className="h-[70vh] flex justify-center items-center">
            <div className="flex flex-col items-center p-8 text-center max-w-md">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <FolderPlus size={32} className="text-[#7733ff]" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                    No Projects Yet
                </h1>
                <p className="text-gray-500 mb-8">
                    Create your first project to start organizing tasks and collaborating with your team.
                </p>
                <Button
                    onClick={() => setCreateDialogOpen(true)}
                    variant="primary"
                    size="lg"
                    className="w-full"
                >
                    Create Project
                </Button>
            </div>

            <CreateProjectDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
            />
        </div>
    );
};

export default NoProjects;
