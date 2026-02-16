import React, { useState } from "react";
import { Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Input } from "./ui";
import { useSnackbar } from "../context/SnackbarContext";
import { useRegisterMutation, useLoginMutation } from "../store/api/authApi";
import { login as loginAction } from "../store/slices/authSlice";
import { capitalizeWords } from "../utils/stringUtils";
import { checkPasswordStrength } from "../utils/validationUtils";

const Form = ({ isSignup }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const { showSnackbar } = useSnackbar();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [registerUser, { isLoading: isRegistering }] = useRegisterMutation();
  const [loginUser, { isLoading: isLoggingIn }] = useLoginMutation();

  const validateFields = () => {
    const errors = {};

    if (isSignup && name.trim() === "") {
      errors.name = "Name is required";
    }

    if (email.trim() === "") {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Enter a valid email address";
    }

    if (password === "") {
      errors.password = "Password is required";
    } else if (isSignup) {
      if (!checkPasswordStrength(password).isValid) {
        errors.password = "Please meet all password requirements";
      }
    } else if (password.length < 6) {
      // Keep simple check for login to avoid frustrating existing users with old weak passwords
      errors.password = "Password must be at least 6 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const checkPasswordValid = (pwd) => {
    if (!isSignup) return pwd.length >= 6;
    return checkPasswordStrength(pwd).isValid;
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

      // Auto-login on frontend
      dispatch(loginAction({
        ...userData,
        isVerified: false // Explicitly set to false as expected from register response
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
      dispatch(loginAction(userData));
      setEmail("");
      setPassword("");
      // App.jsx will handle redirect based on isVerified
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage = error.data?.message || "Couldn't Connect to Server";
      showSnackbar(errorMessage, "error");
    }
  };

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
                    // Only clear error if it exists AND the new password is fully valid
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
