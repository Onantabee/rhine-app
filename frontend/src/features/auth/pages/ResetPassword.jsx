import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Check, X, ArrowLeft, AlertCircle } from "lucide-react";
import { Button, Input, LoadingSpinner } from "../../../core/ui";
import { useForgotPasswordMutation, useResetPasswordMutation, useValidateResetTokenQuery } from "../api/authApi";
import { checkPasswordStrength } from "../../../core/utils/validationUtils";
import { useSnackbar } from "../../../core/context/SnackbarContext";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");
    const { showSnackbar } = useSnackbar();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [forgotPassword, { isLoading: isRequesting }] = useForgotPasswordMutation();
    const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

    const {
        data: validationData,
        isLoading: isValidating,
        isError: isValidationError,
        error: validationError
    } = useValidateResetTokenQuery(token, { skip: !token });

    const checkPasswordValid = (pwd) => {
        const { isValid } = checkPasswordStrength(pwd);
        return isValid;
    };

    const handleRequestLink = async (e) => {
        e.preventDefault();
        setErrors({});
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setErrors({ email: "Please enter a valid email address." });
            return;
        }

        try {
            await forgotPassword({ email }).unwrap();
            setIsSubmitted(true);
        } catch (err) {
            showSnackbar(err.data?.message || "Failed to send reset link.", "error");
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!checkPasswordValid(password)) {
            setErrors({ password: "Password does not meet requirements." });
            return;
        }

        try {
            const res = await resetPassword({ token, newPassword: btoa(password) }).unwrap();
            showSnackbar(res.message || "Password successfully reset.", "success");
            navigate("/");
        } catch (err) {
            showSnackbar(err.data?.message || "Failed to reset password. The link may be expired.", "error");
        }
    };

    return (
        <div className="flex-1 overflow-y-auto w-full bg-white dark:bg-[#1a1a1a]">
            <div className="min-h-[calc(100dvh-80px)] flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-[500px] md:p-5 p-2">
                    {token && isValidating ? (
                        <div className="flex flex-col items-center justify-center py-10 space-y-4">
                            <LoadingSpinner size="lg" />
                            <p className="text-gray-400 font-light text-md mt-2 text-center">Verifying secure link...</p>
                        </div>
                    ) : token && isValidationError ? (
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                                <AlertCircle size={50} className="text-red-500" />
                            </div>
                            <h2 className="text-3xl font-semibold text-center text-gray-700 dark:text-[#cccccc] mb-2">Link Expired or Invalid</h2>
                            <p className="text-gray-400 font-light text-md mt-2 text-center mb-8 max-w-[300px]">
                                {validationError?.data?.message || "This password reset link is invalid or has expired."}
                            </p>
                            <div className="flex flex-col md:flex-row gap-2 w-full">
                                <Button variant="primary" className="w-full" onClick={() => navigate("/reset-password")}>
                                    Request New Link
                                </Button>
                                <Button variant="outlined" className="w-full" onClick={() => navigate("/")}>
                                    Back to Login
                                </Button>
                            </div>
                        </div>
                    ) : isSubmitted ? (
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                                <Check size={40} className="text-green-500" />
                            </div>
                            <h2 className="text-3xl font-semibold text-center text-gray-700 dark:text-[#cccccc] mb-2">Check your email</h2>
                            <p className="text-gray-400 font-light text-md mt-2 text-center mb-8 max-w-[400px]">
                                If an account exists for <span className="font-medium text-gray-600 dark:text-[#eeeeee]">{email}</span>,
                                we've sent a link to reset your password.
                            </p>
                            <div className="flex flex-col w-full space-y-4">
                                <Button variant="primary" className="w-full" onClick={() => navigate("/")}>
                                    Back to Login
                                </Button>
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="text-sm text-gray-500 hover:text-primary transition-colors cursor-pointer"
                                >
                                    Didn't get the email? Try another address
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col items-center mb-8">
                                <h2 className="text-3xl font-semibold text-center text-gray-700 dark:text-[#cccccc]">
                                    {token ? "Set New Password" : "Forgot Password?"}
                                </h2>
                                <p className="text-gray-400 font-light text-md mt-2 text-center">
                                    {token
                                        ? "Enter a strong new password below."
                                        : "Enter your email address and we'll send you a secure link to reset your password."}
                                </p>
                            </div>

                            {!token ? (
                                <>
                                    <form onSubmit={handleRequestLink} className="space-y-4">
                                        <Input
                                            type="text"
                                            placeholder="eg. onanta@seychellés.com"
                                            label="Email Address"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (errors.email) setErrors({});
                                            }}
                                            fullWidth
                                            error={!!errors.email}
                                            helperText={errors.email}
                                        />
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="lg"
                                            loading={isRequesting}
                                            className="w-full mt-6"
                                        >
                                            Send Reset Link
                                        </Button>
                                    </form>
                                    <div className="py-5 flex justify-center">
                                        <Link to="/" className="flex items-center text-sm text-primary hover:text-primary-hover transition-colors">
                                            <ArrowLeft size={16} className="mr-1" /> Back to Login
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <form onSubmit={handleResetPassword} className="space-y-4">
                                    <div>
                                        <Input
                                            type="password"
                                            label="New Password"
                                            placeholder="eg. Password$31"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                if (errors.password) setErrors({});
                                            }}
                                            fullWidth
                                            error={!!errors.password}
                                            helperText={errors.password}
                                        />
                                        <div className="space-y-1.5 mt-2 rounded-lg grid grid-cols-1 md:grid-cols-2">
                                            {checkPasswordStrength(password).requirements.map((req, index) => (
                                                <div key={index} className={`flex items-center text-sm font-light transition-colors duration-200 ${req.valid
                                                    ? "text-green-600"
                                                    : errors.password
                                                        ? "text-red-500"
                                                        : "dark:text-[#666666] text-gray-400"
                                                    }`}>
                                                    {req.valid ? (
                                                        <Check size={14} className="mr-2 text-green-500" />
                                                    ) : errors.password ? (
                                                        <X size={14} className="mr-2 text-red-500" />
                                                    ) : (
                                                        <Check size={14} className="mr-2 text-gray-500" />
                                                    )}
                                                    {req.label}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        loading={isResetting}
                                        className="w-full mt-6"
                                    >
                                        Reset Password
                                    </Button>
                                </form>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
