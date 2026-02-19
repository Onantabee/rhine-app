import { useState } from "react";
import { Button, Input, LoadingSpinner } from "../ui";
import { Check, X } from "lucide-react";
import { useProfile } from "../../hooks/user/useProfile";

export default function Profile() {
  const {
    userDetails,
    passwordDetails,
    fieldErrors,
    isLoadingUser,
    isUpdating,
    isChangingPassword,
    handleChange,
    handlePasswordChange,
    handleUpdateProfile,
    handleChangePassword,
    checkPasswordStrength
  } = useProfile();

  const [activeTab, setActiveTab] = useState("personal");

  if (isLoadingUser) {
    return (
      <div className="flex items-center h-full w-full justify-center py-20">
        <LoadingSpinner size="lg" />
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
