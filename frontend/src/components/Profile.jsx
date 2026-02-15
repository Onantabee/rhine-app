import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { updateAuthUser } from "../store/slices/authSlice";
import { useSnackbar } from "../context/SnackbarContext";
import { Button, Input } from "./ui";
import {
  useGetUserByEmailQuery,
  useUpdateUserMutation,
  useChangePasswordMutation,
} from "../store/api/usersApi";
import { capitalizeWords } from "../utils/stringUtils";

export default function Profile({ setEditProfileOpen }) {
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
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
  const [fieldErrors, setFieldErrors] = useState({});

  const { data: userData, isLoading: isLoadingUser } = useGetUserByEmailQuery(userEmail, {
    skip: !userEmail,
  });
  const [updateUserApi, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  useEffect(() => {
    if (userData) {
      setUserDetails(userData);
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordDetails((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };

  const clearFieldError = (field) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const toggleSection = () => {
    setFieldErrors({});
    setSlideDirection(activeSection === "profile" ? "right" : "left");
    setActiveSection(activeSection === "profile" ? "password" : "profile");
  };


  const handleUpdateProfile = async () => {
    const errors = {};
    if (userDetails.name.trim() === "") {
      errors.name = "Name is required";
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const trimmedName = userDetails.name.trim();
    try {
      await updateUserApi({
        email: userEmail,
        userData: { name: capitalizeWords(trimmedName) },
      }).unwrap();
      dispatch(updateAuthUser({ name: capitalizeWords(trimmedName) }));
      showSnackbar("User profile updated.", "success");
    } catch (error) {
      showSnackbar("An error occurred.", "error");
    }
  };

  const handleChangePassword = async () => {
    const errors = {};

    if (!passwordDetails.oldPassword) {
      errors.oldPassword = "Current password is required";
    }
    if (!passwordDetails.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordDetails.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }
    if (!passwordDetails.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordDetails.newPassword !== passwordDetails.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
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
      setFieldErrors({});
      showSnackbar(response || "Password changed successfully", "success");
    } catch (error) {
      showSnackbar(error.data?.message || "Failed to change password", "error");
    }
  };

  if (isLoadingUser) {
    return (
      <div className="w-full h-full bg-white border border-gray-200 max-h-[520px] flex items-center justify-center">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className={`w-full h-full p-6 bg-white border border-gray-200 overflow-hidden relative max-h-[520px] ${activeSection === "password" ? "h-[540px]" : "h-[400px]"}`}>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Profile</h2>

      <div
        className="absolute w-[calc(100%-48px)]"
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
          <h3 className="text-[#7733ff] text-lg font-medium mb-4">
            Personal Information
          </h3>

          <Input
            label="Full Name"
            name="name"
            fullWidth
            value={userDetails.name}
            onChange={handleChange}
            error={!!fieldErrors.name}
            helperText={fieldErrors.name}
          />
        </div>
      </div>

      <div
        className="absolute w-[calc(100%-48px)]"
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
          <h3 className="text-[#7733ff] text-lg font-medium mb-4">
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
              error={!!fieldErrors.oldPassword}
              helperText={fieldErrors.oldPassword}
            />

            <Input
              label="New Password"
              name="newPassword"
              type="password"
              fullWidth
              value={passwordDetails.newPassword}
              onChange={handlePasswordChange}
              error={!!fieldErrors.newPassword}
              helperText={fieldErrors.newPassword}
            />

            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              fullWidth
              value={passwordDetails.confirmPassword}
              onChange={handlePasswordChange}
              error={!!fieldErrors.confirmPassword}
              helperText={fieldErrors.confirmPassword}
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-20 w-[calc(100%-48px)]">
        <Button
          variant="outlined"
          fullWidth
          onClick={toggleSection}
          className="flex items-center justify-center gap-2"
        >
          {activeSection === "profile" ? "Change Password" : "Back to Profile"}
          {activeSection === "profile" ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

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
    </div>
  );
}
