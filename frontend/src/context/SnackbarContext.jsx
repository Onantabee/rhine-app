import { createContext, useContext, useState, useCallback } from "react";
import Snackbar from "../components/ui/Snackbar";

const SnackbarContext = createContext(null);

export const useSnackbar = () => {
    const ctx = useContext(SnackbarContext);
    if (!ctx) throw new Error("useSnackbar must be used within SnackbarProvider");
    return ctx;
};

export const SnackbarProvider = ({ children }) => {
    const [state, setState] = useState({
        open: false,
        message: "",
        variant: "info",
    });

    const showSnackbar = useCallback((message, variant = "info") => {
        setState({ open: true, message, variant });
    }, []);

    const handleClose = useCallback(() => {
        setState((prev) => ({ ...prev, open: false }));
    }, []);

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Snackbar
                open={state.open}
                onClose={handleClose}
                message={state.message}
                variant={state.variant}
                position="bottom-left"
            />
        </SnackbarContext.Provider>
    );
};
