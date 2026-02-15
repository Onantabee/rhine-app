import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Select } from "./ui";
import { useSnackbar } from "../context/SnackbarContext";
import { useUpdateRoleMutation } from "../store/api/authApi";

const ChooseRole = () => {
  const [option, setOption] = useState("admin");
  const [fieldErrors, setFieldErrors] = useState({});
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const userEmail = useSelector((state) => state.auth.userEmail);

  const [updateRole, { isLoading }] = useUpdateRoleMutation();

  const handleChange = (event) => {
    setOption(event.target.value);
    setFieldErrors({});
  };

  const handleSubmit = async () => {
    if (!option) {
      setFieldErrors({ role: "Please select a role" });
      return;
    }

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
      showSnackbar("Failed to update role. Please try again.", "error");
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
          <div
            style={{
              padding: "20px",
              width: "100%",
              maxWidth: "500px",
            }}
            className="z-30 h-[500px] lg:h-auto"
          >

            <h2 className="text-3xl font-semibold text-center mb-5 text-gray-700">
              Choose Your Role
            </h2>

            <div className="space-y-6">
              <Select
                value={option}
                onChange={handleChange}
                options={roleOptions}
                placeholder="Select a role"
                fullWidth
                error={!!fieldErrors.role}
                helperText={fieldErrors.role}
              />

              <div className="flex justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSubmit}
                  loading={isLoading}
                  className="w-full"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>



      <div className="absolute bottom-0 left-0 w-full flex justify-center">
        <div className="py-2 px-5">
          <h1 className="text-gray-400">Made by Onanta Bassey</h1>
        </div>
      </div>
    </>
  );
};

export default ChooseRole;
