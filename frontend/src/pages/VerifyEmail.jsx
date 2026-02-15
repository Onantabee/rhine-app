import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input } from "../components/ui";
import { useSnackbar } from "../context/SnackbarContext";
import { useVerifyEmailMutation, useResendOtpMutation } from "../store/api/authApi";
import { login } from "../store/slices/authSlice";
import { ArrowLeft } from "lucide-react";

const VerifyEmail = () => {
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
            navigate("/login");
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

    return (
        <div className="h-[70vh] flex justify-center items-center">
            <div className="z-30 h-[500px] lg:h-auto"
                style={{ padding: '20px', width: '100%', maxWidth: '500px' }}>
                <div className="flex flex-col items-center mb-8">
                    <h1 className="text-3xl font-semibold text-center text-gray-700">Verify your email</h1>
                    <p className="text-gray-400 font-light text-md mt-2 text-center">
                        We've sent a verification code to <span className="font-medium text-gray-700">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-4">
                    <Input
                        label="Verification Code"
                        placeholder="Enter 6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        fullWidth
                        autoFocus
                        error={!!fieldErrors.name}
                        helperText={fieldErrors.name}
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        loading={isLoading}
                        className="w-full"
                    >
                        Verify Email
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="font-light text-md text-gray-500">
                        Didn't receive the code?{" "}
                        <button
                            onClick={handleResend}
                            disabled={isResending}
                            className="text-[#7733ff] hover:text-[#5a189a] text-center cursor-pointer"
                        >
                            {isResending ? "Resending..." : "Resend"}
                        </button>
                    </p>
                </div>

                <div className="mt-4 flex items-center justify-center">
                    <button
                        onClick={() => navigate("/login")}
                        className="font-light text-md text-center text-gray-400 hover:text-gray-600 flex gap-2 items-center cursor-pointer"
                    >
                        <ArrowLeft size={16} />
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
