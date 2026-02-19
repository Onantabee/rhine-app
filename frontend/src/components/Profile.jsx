import { useEffect, useState } from "react";
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
import { checkPasswordStrength } from "../utils/validationUtils";
import { Check, X } from "lucide-react";

export default function Profile() {
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

  const [fieldErrors, setFieldErrors] = useState({});

  const { data: userData, isLoading: isLoadingUser } = useGetUserByEmailQuery(userEmail, {
    skip: !userEmail,
  });
  const [updateUserApi, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const [activeTab, setActiveTab] = useState("personal");

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

    if (name === 'newPassword') {
      if (fieldErrors.newPassword && checkPasswordStrength(value).isValid) {
        clearFieldError(name);
      }
    } else {
      clearFieldError(name);
    }
  };

  const clearFieldError = (field) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
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
        name: capitalizeWords(trimmedName),
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
    } else if (!checkPasswordStrength(passwordDetails.newPassword).isValid) {
      errors.newPassword = "Please meet all password requirements";
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
        currentPassword: btoa(passwordDetails.oldPassword),
        newPassword: btoa(passwordDetails.newPassword),
      }).unwrap();

      setPasswordDetails({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setFieldErrors({});
      showSnackbar(response?.message || "Password changed successfully", "success");
    } catch (error) {
      showSnackbar(error.data?.message || "Failed to change password", "error");
    }
  };

  if (isLoadingUser) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl flex flex-col gap-8 p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl text-gray-600 pb-3 border-b border-gray-200">
            Account Settings
          </h1>

          <div className="flex gap-8 border-b border-gray-200">
            {[
              { id: "personal", label: "Personal Information" },
              { id: "password", label: "Change Password" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-md font-medium transition-colors relative cursor-pointer ${activeTab === tab.id
                  ? "text-[#7733ff] border-b-2 border-[#7733ff]"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
                style={{ marginBottom: "-1px" }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "personal" && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-left-4 duration-300">
            <Input
              label="Full Name"
              name="name"
              fullWidth
              value={userDetails.name}
              onChange={handleChange}
              error={!!fieldErrors.name}
              helperText={fieldErrors.name}
            />
            <Input
              label="Email"
              name="email"
              fullWidth
              value={userDetails.email}
              disabled
              helperText="Email cannot be changed"
            />
            <Button
              variant="primary"
              size="lg"
              onClick={handleUpdateProfile}
              loading={isUpdating}
              className="w-fit"
            >
              Save Changes
            </Button>
          </div>
        )}

        {activeTab === "password" && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
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

            <div>
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

              <div className="space-y-1.5 mt-2 rounded-lg grid grid-cols-2">
                {checkPasswordStrength(passwordDetails.newPassword).requirements.map((req, index) => (
                  <div key={index} className={`flex items-center text-sm font-light transition-colors duration-200 ${req.valid
                    ? "text-green-600"
                    : fieldErrors.newPassword
                      ? "text-red-500"
                      : "text-gray-400"
                    }`}>
                    {req.valid ? (
                      <Check size={14} className="mr-2 text-green-500" />
                    ) : fieldErrors.newPassword ? (
                      <X size={14} className="mr-2 text-red-500" />
                    ) : (
                      <Check size={14} className="mr-2 text-gray-400" />
                    )}
                    {req.label}
                  </div>
                ))}
              </div>
            </div>

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
            <Button
              variant="primary"
              size="lg"
              onClick={handleChangePassword}
              loading={isChangingPassword}
              className="w-fit"
            >
              Update Password
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
