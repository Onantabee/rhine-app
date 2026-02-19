import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateAuthUser } from "../../store/slices/authSlice";
import { useSnackbar } from "../../context/SnackbarContext";
import {
    useGetUserByEmailQuery,
    useUpdateUserMutation,
    useChangePasswordMutation,
} from "../../store/api/usersApi";
import { capitalizeWords } from "../../utils/stringUtils";
import { checkPasswordStrength } from "../../utils/validationUtils";

export const useProfile = () => {
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

    useEffect(() => {
        if (userData) {
            setUserDetails(userData);
        }
    }, [userData]);

    const clearFieldError = (field) => {
        setFieldErrors((prev) => {
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

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

    return {
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
    };
};
