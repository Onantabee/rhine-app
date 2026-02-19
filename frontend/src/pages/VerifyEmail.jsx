import React from "react";
import { Button, Input } from "../components/ui";
import { useVerifyEmail } from "../hooks/auth/useVerifyEmail";

const VerifyEmail = () => {
    const {
        email,
        otp,
        setOtp,
        fieldErrors,
        isLoading,
        isResending,
        handleVerify,
        handleResend
    } = useVerifyEmail();

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
            </div>
        </div>
    );
};

export default VerifyEmail;
