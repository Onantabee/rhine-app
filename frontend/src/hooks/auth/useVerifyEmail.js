import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "../../context/SnackbarContext";
import { useVerifyEmailMutation, useResendOtpMutation } from "../../store/api/authApi";
import { login } from "../../store/slices/authSlice";

export const useVerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showSnackbar } = useSnackbar();
    
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    
    const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
    const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

    const { userEmail } = useSelector((state) => state.auth);

    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        } else if (userEmail) {
            setEmail(userEmail);
        } else {
            navigate("/");
        }
    }, [location.state, userEmail, navigate]);

    const handleVerify = async (e) => {
        e.preventDefault();

        const errors = {};
        if (otp.length !== 6) errors.name = "Verification code must be 6 digits";
        setFieldErrors(errors);

        if (Object.keys(errors).length > 0) return;

        try {
            const userData = await verifyEmail({ email, code: otp }).unwrap();
            showSnackbar("Email verified successfully!", "success");

            dispatch(login(userData));

            navigate("/");
        } catch (error) {
            console.error("Verification failed:", error);
            showSnackbar(error.data?.message || "Verification failed", "error");
        }
    };

    const handleResend = async () => {
        try {
            await resendOtp({ email }).unwrap();
            showSnackbar("OTP resent successfully", "success");
        } catch (error) {
            console.error("Resend failed:", error);
            showSnackbar("Failed to resend OTP", "error");
        }
    };

    return {
        email,
        otp,
        setOtp,
        fieldErrors,
        isLoading,
        isResending,
        handleVerify,
        handleResend
    };
};
