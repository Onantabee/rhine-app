import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Input } from "../components/ui";
import { useSnackbar } from "../context/SnackbarContext";
import { useVerifyEmailMutation, useResendOtpMutation } from "../store/api/authApi";

const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
    const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        } else {
            // If no email in state, redirect to login or ask user to enter email?
            // For now, let's keep it empty or redirect
            // navigate("/login");
        }
    }, [location.state, navigate]);

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            await verifyEmail({ email, code: otp }).unwrap();
            showSnackbar("Email verified successfully!", "success");
            navigate("/login"); // Redirect to login after verification
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
        <div className="h-screen flex justify-center items-center bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Verify your email</h2>
                <p className="text-gray-500 text-center mb-6 text-sm">
                    We've sent a verification code to <span className="font-medium text-gray-700">{email}</span>
                </p>

                <form onSubmit={handleVerify} className="space-y-4">
                    <Input
                        label="Verification Code"
                        placeholder="Enter 6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        fullWidth
                        autoFocus
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        loading={isLoading}
                        disabled={otp.length < 6}
                        className="w-full"
                    >
                        Verify Email
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Didn't receive the code?{" "}
                        <button
                            onClick={handleResend}
                            disabled={isResending}
                            className="text-[#7733ff] font-medium hover:underline disabled:opacity-50"
                        >
                            {isResending ? "Resending..." : "Resend"}
                        </button>
                    </p>
                </div>

                <div className="mt-4 text-center">
                    <button
                        onClick={() => navigate("/login")}
                        className="text-xs text-gray-400 hover:text-gray-600"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
