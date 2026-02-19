import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";


const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, sessionChecked } = useSelector((state) => state.auth);

    if (!sessionChecked) {
        return null;
    }

    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
