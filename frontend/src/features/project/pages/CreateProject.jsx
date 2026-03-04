import CreateProjectForm from '../components/CreateProjectForm';

const CreateProject = () => {
    return (
        <div className="flex-1 overflow-y-auto w-full">
            <div className="min-h-full flex flex-col items-center justify-center p-5 py-8">
                <div className="z-30 w-full max-w-[500px] md:p-5 p-2">
                    <div className="flex flex-col items-center mb-8">
                        <h1 className="text-3xl font-semibold text-center text-gray-700 dark:text-[#cccccc]">
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
