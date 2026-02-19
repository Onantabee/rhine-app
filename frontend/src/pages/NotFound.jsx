import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui";

const NotFound = ({
    title = "Page Not Found",
    message = "The page you are looking for doesn't exist or you don't have permission to access it."
}) => {

    return (
        <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="text-center max-w-md flex flex-col items-center justify-center gap-3">
                <h1 className="text-9xl font-bold text-gray-200 flex items-center justify-center"><span className="text-gray-400 text-[150px]">4</span>0<span className="text-gray-400 text-[150px]">4</span></h1>
                <h2 className="text-3xl font-semibold text-gray-800">{title}</h2>
                <p className="text-gray-600 font-light text-md text-center">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default NotFound;
