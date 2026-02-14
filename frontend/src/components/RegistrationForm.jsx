import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Input, Snackbar } from "./ui";
import { useRegisterMutation, useLoginMutation } from "../store/api/authApi";
import { login as loginAction } from "../store/slices/authSlice";
import CircleContainer from "./CirlcleContainer";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3,
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.5 + i * 0.1,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const Form = ({ isSignup }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // RTK Query mutations
  const [registerUser, { isLoading: isRegistering }] = useRegisterMutation();
  const [loginUser, { isLoading: isLoggingIn }] = useLoginMutation();

  const validateFields = () => {
    if (email === "" && password === "") {
      setSnackbarMessage("Email and password cannot be empty!");
      return false;
    } else if (email === "") {
      setSnackbarMessage("Email cannot be empty!");
      return false;
    } else if (password === "") {
      setSnackbarMessage("Password cannot be empty!");
      return false;
    }
    return true;
  };

  const capitalizeWords = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateFields()) {
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

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

    if (!validateFields()) {
      setSnackbarMessage("Email and password cannot be empty!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

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
        <CircleContainer />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          style={{
            borderRadius: "16px",
            padding: "20px",
            width: "100%",
            maxWidth: "500px",
          }}
          className="z-30 h-[500px] lg:h-auto bg-[#1a1a1a]/95 border-2 border-[#4d4d4d] outline-8 lg:outline-0 outline-[#4d4d4d]/30 lg:border-0 xl:bg-transparent xl:backdrop-blur-none backdrop-blur-lg"
        >
          <motion.div
            className="flex lg:hidden justify-center items-center mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="flex flex-col justify-center items-center py-5 px-12 rounded-2xl">
              <h1 className="text-4xl text-[#9966ff] font-semibold">Rhine</h1>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} custom={0}>
            <h2 className="text-3xl font-bold text-center mb-5 text-[#4d4d4d]">
              {isSignup ? "Create an account" : "Welcome back"}
            </h2>
          </motion.div>

          <form onSubmit={isSignup ? handleSignup : handleLogin}>
            <div className="space-y-3">
              {isSignup && (
                <Input
                  type="text"
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                />
              )}

              <motion.div variants={itemVariants} custom={isSignup ? 2 : 1}>
                <Input
                  type="email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants} custom={isSignup ? 3 : 2}>
                <Input
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                />
              </motion.div>

              <motion.div
                variants={itemVariants}
                custom={isSignup ? 4 : 3}
                className="flex justify-center pt-2"
              >
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isRegistering || isLoggingIn}
                  className="w-[70%]"
                >
                  {isSignup ? "Sign Up" : "Log In"}
                </Button>
              </motion.div>
            </div>
          </form>
        </motion.div>
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
          <h1 className="text-[#4d4d4d]">Made by Onanta Bassey</h1>
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
