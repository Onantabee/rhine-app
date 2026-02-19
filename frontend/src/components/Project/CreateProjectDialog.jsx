import React from "react";
import { Dialog } from "../ui";
import CreateProjectForm from "./CreateProjectForm";

const CreateProjectDialog = ({ open, onClose }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            title="Create a Project"
            size="md"
        >
            <div className="flex flex-col gap-4">
                <p className="text-gray-500 font-light text-sm">
                    Projects organize your tasks and team. You'll be the admin.
                </p>
                <CreateProjectForm
                    onSuccess={onClose}
                    onCancel={onClose}
                    showCancel={true}
                />
            </div>
        </Dialog>
    );
};

export default CreateProjectDialog;
