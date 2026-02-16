import React, { useState } from "react";
import CreateProjectForm from "../components/CreateProjectForm";

const CreateProject = () => {
    return (
        <div className="h-[70vh] flex justify-center items-center">
            <div className="relative flex flex-col justify-center items-center lg:flex-row w-full p-2">
                <div className="z-30 h-[500px] lg:h-auto"
                    style={{ padding: '20px', width: '100%', maxWidth: '500px' }}>
                    <div className="flex flex-col items-center mb-8">
                        <h1 className="text-3xl font-semibold text-center text-gray-700">
                            Create a Project
                        </h1>
                        <p className="text-gray-400 font-light text-md mt-2 text-center">
                            Projects organize your tasks and team. You'll be the admin.
                        </p>
                    </div>
                    <CreateProjectForm />
                </div>
            </div>
        </div>
    );
};

export default CreateProject;
