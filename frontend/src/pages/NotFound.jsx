import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui";

const NotFound = () => {

    return (
        <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="text-center max-w-md">
                <h1 className="text-9xl font-bold text-gray-200">404</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mt-4 mb-2">Page Not Found</h2>
                <p className="text-gray-600 mb-8">
                    The page you are looking for doesn't exist or you don't have permission to access it.
                </p>
            </div>
        </div>
    );
};

export default NotFound;
