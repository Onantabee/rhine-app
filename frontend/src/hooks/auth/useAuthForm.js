import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSnackbar } from "../../context/SnackbarContext";
import { useLoginMutation, useRegisterMutation } from "../../store/api/authApi";
import { login } from "../../store/slices/authSlice";
import { capitalizeWords } from "../../utils/stringUtils";
import { checkPasswordStrength } from "../../utils/validationUtils";

export const useAuthForm = (isSignup) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [registerUser, { isLoading: isRegistering }] = useRegisterMutation();
    const [loginUser, { isLoading: isLoggingIn }] = useLoginMutation();

    const checkPasswordValid = (pwd) => {
        if (!isSignup) return pwd.length >= 6;
        return checkPasswordStrength(pwd).isValid;
    };

    const validateFields = () => {
        const errors = {};

        if (isSignup && name.trim() === "") {
            errors.name = "Name is required";
        }

        if (email.trim() === "") {
            errors.email = "Email is required";
        } else {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email.trim())) {
                errors.email = "Enter a valid email address";
            }
        }

        if (password === "") {
            errors.password = "Password is required";
        } else if (isSignup) {
            if (!checkPasswordStrength(password).isValid) {
                errors.password = "Please meet all password requirements";
            }
        } else if (password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const clearFieldError = (field) => {
        setFieldErrors((prev) => {
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!validateFields()) return;

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();

        try {
            const userData = await registerUser({
                name: capitalizeWords(trimmedName),
                email: trimmedEmail,
                pwd: btoa(password),
            }).unwrap();

            console.log("Signup successful!", userData);

            dispatch(login({
                ...userData,
                isVerified: false
            }));

            setName("");
            setEmail("");
            setPassword("");

            navigate("/verify-email", { state: { email: trimmedEmail } });
        } catch (error) {
            console.error("Signup failed:", error);
            const errorMessage = error.data?.message || "Couldn't Connect to Server";
            showSnackbar(errorMessage, "error");
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateFields()) return;

        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        try {
            const userData = await loginUser({
                email: trimmedEmail,
                password: btoa(trimmedPassword),
            }).unwrap();

            console.log("Login successful!", userData);
            dispatch(login(userData));
            setEmail("");
            setPassword("");
            navigate("/");
        } catch (error) {
            console.error("Login failed:", error);
            const errorMessage = error.data?.message || "Couldn't Connect to Server";
            showSnackbar(errorMessage, "error");
        }
    };

    return {
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        fieldErrors,
        isRegistering,
        isLoggingIn,
        handleSignup,
        handleLogin,
        clearFieldError,
        checkPasswordValid,
        checkPasswordStrength // Exporting this for UI usage if needed
    };
};
