import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Select, Snackbar } from "./ui";
import { useUpdateRoleMutation } from "../store/api/authApi";
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

const ChooseRole = () => {
  const [option, setOption] = useState("admin");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();
  const userEmail = useSelector((state) => state.auth.userEmail);

  // RTK Query mutation
  const [updateRole, { isLoading }] = useUpdateRoleMutation();

  const handleChange = (event) => {
    setOption(event.target.value);
  };

  const handleSubmit = async () => {
    if (!userEmail) {
      console.warn("No email found, redirecting...");
      navigate("/");
      return;
    }

    try {
      await updateRole({
        email: userEmail,
        userRole: option.toUpperCase(),
      }).unwrap();
      navigate("/home");
    } catch (error) {
      console.error("Error updating role:", error);
      setSnackbarMessage("Failed to update role. Please try again.");
      setOpenSnackbar(true);
    }
  };

  const roleOptions = [
    { value: "admin", label: "ADMIN" },
    { value: "employee", label: "EMPLOYEE" },
  ];

  return (
    <>
      <div className="h-[70vh] flex justify-center items-center">
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
                <h1 className="text-4xl text-[#9966ff] font-semibold">
                  Rhine
                </h1>
              </div>
            </motion.div>

            <h2 className="text-3xl font-bold text-center mb-5 text-[#4d4d4d]">
              Choose Your Role
            </h2>

            <div className="space-y-6">
              <Select
                value={option}
                onChange={handleChange}
                options={roleOptions}
                fullWidth
              />

              <motion.div
                variants={itemVariants}
                className="flex justify-center"
              >
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSubmit}
                  loading={isLoading}
                  className="w-[70%]"
                >
                  Submit
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <Snackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        variant="error"
        position="bottom-left"
      />

      <div className="absolute bottom-0 left-0 w-full flex justify-center">
        <div className="py-2 px-5">
          <h1 className="text-[#4d4d4d]">Made by Onanta Bassey</h1>
        </div>
      </div>
    </>
  );
};

export default ChooseRole;
