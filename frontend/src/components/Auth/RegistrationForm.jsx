import React from "react";
import { Check, X } from "lucide-react";
import { Button, Input } from "../ui";
import { useAuthForm } from "../../hooks/auth/useAuthForm";
import { checkPasswordStrength } from "../../utils/validationUtils";

const Form = ({ isSignup }) => {
  const {
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
    checkPasswordValid
  } = useAuthForm(isSignup);

  return (
    <>
      <div className="relative flex flex-col justify-center items-center lg:flex-row w-full p-2">
        <div
          style={{
            padding: "20px",
            width: "100%",
            maxWidth: "500px",
          }}
          className="z-30 h-[500px] lg:h-auto"
        >

          <div>
            <h2 className="text-3xl font-semibold text-center mb-5 text-gray-700">
              {isSignup ? "Create an account" : "Welcome back"}
            </h2>
          </div>

          <form onSubmit={isSignup ? handleSignup : handleLogin}>
            <div className="space-y-3">
              {isSignup && (
                <Input
                  type="text"
                  placeholder=" eg. Onanta Seychellés"
                  label="Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearFieldError("name");
                  }}
                  fullWidth
                  error={!!fieldErrors.name}
                  helperText={fieldErrors.name}
                />
              )}

              <div>
                <Input
                  type="email"
                  placeholder=" eg. onanta@seychellés.com"
                  label="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearFieldError("email");
                  }}
                  fullWidth
                  error={!!fieldErrors.email}
                  helperText={fieldErrors.email}
                />
              </div>

              <div>
                <Input
                  type="password"
                  label="Password"
                  placeholder=" eg. Password$31"
                  value={password}
                  onChange={(e) => {
                    const newPassword = e.target.value;
                    setPassword(newPassword);
                    if (fieldErrors.password && checkPasswordValid(newPassword)) {
                      clearFieldError("password");
                    }
                  }}
                  fullWidth
                  error={!!fieldErrors.password}
                  helperText={fieldErrors.password}
                />
                {isSignup && (
                  <div className="space-y-1.5 mt-2 rounded-lg grid grid-cols-2">
                    {checkPasswordStrength(password).requirements.map((req, index) => (
                      <div key={index} className={`flex items-center text-sm font-light transition-colors duration-200 ${req.valid
                        ? "text-green-600"
                        : fieldErrors.password
                          ? "text-red-500"
                          : "text-gray-400"
                        }`}>
                        {req.valid ? (
                          <Check size={14} className="mr-2 text-green-500" />
                        ) : fieldErrors.password ? (
                          <X size={14} className="mr-2 text-red-500" />
                        ) : (
                          <Check size={14} className="mr-2 text-gray-500" />
                        )}
                        {req.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-center pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isRegistering || isLoggingIn}
                  className="w-full "
                >
                  {isSignup ? "Sign Up" : "Log In"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>



      <div className="absolute bottom-0 w-full flex justify-center">
        <div className="py-2 px-5">
          <h1 className="text-gray-400">Made by Onanta Bassey</h1>
        </div>
      </div>
    </>
  );
};

const RegistrationForm = ({ isSignup }) => {
  return (
    <div className="h-[70vh] flex justify-center items-center">
      <Form isSignup={isSignup} />
    </div>
  );
};

export default RegistrationForm;
