import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Input, Snackbar } from "./ui";
import { useRegisterMutation, useLoginMutation } from "../store/api/authApi";
import { login as loginAction } from "../store/slices/authSlice";

const Form = ({ isSignup }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // RTK Query mutations
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

  const capitalizeWords = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
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
        pwd: password,
      }).unwrap();

      console.log("Signup successful!", userData);
      dispatch(loginAction(userData));
      setName("");
      setEmail("");
      setPassword("");
      navigate("/choose-role");
    } catch (error) {
      console.error("Signup failed:", error);
      const errorMessage = error.data?.message || "Couldn't Connect to Server";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
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
        password: trimmedPassword,
      }).unwrap();

      console.log("Login successful!", userData);
      dispatch(loginAction(userData));
      setEmail("");
      setPassword("");
      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage = error.data?.message || "Couldn't Connect to Server";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
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
          className="z-30 h-[500px] lg:h-auto bg-white border border-gray-200 lg:border-0"
        >
          <div className="flex lg:hidden justify-center items-center mb-10">
            <div className="flex flex-col justify-center items-center py-5 px-12">
              <h1 className="text-4xl text-[#7733ff] font-semibold">Rhine</h1>
            </div>
          </div>

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
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearFieldError("password");
                  }}
                  fullWidth
                  error={!!fieldErrors.password}
                  helperText={fieldErrors.password}
                />
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

      <Snackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        variant={snackbarSeverity}
        position="bottom-left"
      />

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
