import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { Button, Input, Snackbar } from "./ui";
import {
  useGetUserByEmailQuery,
  useUpdateUserMutation,
  useChangePasswordMutation,
} from "../store/api/usersApi";

export default function Profile({ setEditProfileOpen }) {
  const userEmail = useSelector((state) => state.auth.userEmail);

  const [userDetails, setUserDetails] = useState({
    email: "",
    name: "",
    userRole: "",
  });

  const [passwordDetails, setPasswordDetails] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [activeSection, setActiveSection] = useState("profile");
  const [slideDirection, setSlideDirection] = useState("right");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // RTK Query hooks
  const { data: userData, isLoading: isLoadingUser } = useGetUserByEmailQuery(userEmail, {
    skip: !userEmail,
  });
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  useEffect(() => {
    if (userData) {
      setUserDetails(userData);
    }
  }, [userData]);

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordDetails((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSection = () => {
    setSlideDirection(activeSection === "profile" ? "right" : "left");
    setActiveSection(activeSection === "profile" ? "password" : "profile");
  };

  const capitalizeWords = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleUpdateProfile = async () => {
    const trimmedName = userDetails.name.trim();
    try {
      await updateUser({
        email: userEmail,
        userData: { name: capitalizeWords(trimmedName) },
      }).unwrap();
      showSnackbar("User profile updated.", "success");
    } catch (error) {
      showSnackbar("An error occurred.", "error");
    }
  };

  const handleChangePassword = async () => {
    try {
      if (
        !passwordDetails.oldPassword ||
        !passwordDetails.newPassword ||
        !passwordDetails.confirmPassword
      ) {
        showSnackbar("All password fields are required", "error");
        return;
      }
      if (passwordDetails.newPassword.length < 6) {
        showSnackbar("Password must be at least 6 characters", "error");
        return;
      }
      if (passwordDetails.newPassword !== passwordDetails.confirmPassword) {
        showSnackbar("New passwords don't match", "error");
        return;
      }

      const response = await changePassword({
        email: userEmail,
        currentPassword: passwordDetails.oldPassword,
        newPassword: passwordDetails.newPassword,
      }).unwrap();

      setPasswordDetails({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      showSnackbar(response || "Password changed successfully", "success");
    } catch (error) {
      showSnackbar(error.data?.message || "Failed to change password", "error");
    }
  };

  if (isLoadingUser) {
    return (
      <div className="min-w-[320px] w-[500px] max-w-[500px] mx-auto p-6 bg-[#2A2A2A] rounded-2xl border border-[#333] min-h-[500px] flex items-center justify-center">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-w-[320px] w-[500px] max-w-[500px] mx-auto p-6 bg-[#2A2A2A] rounded-2xl border border-[#333] overflow-hidden relative min-h-[500px]">
      <h2 className="text-2xl font-bold text-gray-200 mb-4">Edit Profile</h2>

      {/* Profile Section */}
      <div
        className="absolute w-[calc(100%-48px)] transition-all duration-300 ease-in-out"
        style={{
          transform:
            activeSection === "profile"
              ? "translateX(0)"
              : slideDirection === "right"
                ? "translateX(-100%)"
                : "translateX(100%)",
          opacity: activeSection === "profile" ? 1 : 0,
          pointerEvents: activeSection === "profile" ? "auto" : "none",
        }}
      >
        <div className="mb-4">
          <h3 className="text-[#C77BBF] text-lg font-medium mb-4">
            Personal Information
          </h3>

          <Input
            label="Full Name"
            name="name"
            fullWidth
            value={userDetails.name}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Password Section */}
      <div
        className="absolute w-[calc(100%-48px)] transition-all duration-300 ease-in-out"
        style={{
          transform:
            activeSection === "password"
              ? "translateX(0%)"
              : slideDirection === "left"
                ? "translateX(100%)"
                : "translateX(-100%)",
          opacity: activeSection === "password" ? 1 : 0,
          pointerEvents: activeSection === "password" ? "auto" : "none",
        }}
      >
        <div className="mb-4">
          <h3 className="text-[#C77BBF] text-lg font-medium mb-4">
            Change Password
          </h3>

          <div className="space-y-4">
            <Input
              label="Current Password"
              name="oldPassword"
              type="password"
              fullWidth
              value={passwordDetails.oldPassword}
              onChange={handlePasswordChange}
            />

            <Input
              label="New Password"
              name="newPassword"
              type="password"
              fullWidth
              value={passwordDetails.newPassword}
              onChange={handlePasswordChange}
            />

            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              fullWidth
              value={passwordDetails.confirmPassword}
              onChange={handlePasswordChange}
            />
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <div className="absolute bottom-20 w-[calc(100%-48px)]">
        <Button
          variant="outlined"
          fullWidth
          onClick={toggleSection}
          className="flex items-center justify-center gap-2"
        >
          {activeSection === "profile" ? "Change Password" : "Back to Profile"}
          {activeSection === "profile" ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-6 w-[calc(100%-48px)] flex justify-end gap-4">
        <Button variant="outlined" className="px-6">
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={
            activeSection === "profile"
              ? handleUpdateProfile
              : handleChangePassword
          }
          loading={isUpdating || isChangingPassword}
          className="px-6"
        >
          {activeSection === "profile" ? "Save Changes" : "Change Password"}
        </Button>
      </div>

      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        variant={snackbarSeverity}
        position="bottom-center"
      />
    </div>
  );
}
