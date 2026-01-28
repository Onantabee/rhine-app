import React from "react";
import { Drawer, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Profile from "../Profile";
import UserAvatar from "./UserAvatar";

/**
 * EditProfileDrawer component - Right drawer for editing user profile
 * @param {boolean} open - Whether drawer is open
 * @param {string} userName - User's full name
 * @param {function} onClose - Handler for closing drawer
 */
const EditProfileDrawer = ({ open, userName, onClose }) => {
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            sx={{
                width: 150,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    backgroundColor: "#1E1E1E",
                    color: "#E0E0E0",
                    borderLeft: "1px solid #333",
                    padding: "20px",
                },
            }}
        >
            <div className="flex justify-between items-center mb-6">
                <Typography variant="h6" sx={{ color: "#E0E0E0" }}>
                    Profile
                </Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon className="text-gray-300" />
                </IconButton>
            </div>

            <div className="relative rounded-full bg-[#1E1E1E] p-5 z-40">
                <div className="absolute -top-5 left-0 flex w-full justify-center items-center">
                    <div className="rounded-full bg-[#1e1e1e] p-4">
                        <UserAvatar userName={userName} size="lg" />
                    </div>
                </div>
            </div>

            <Profile setEditProfileOpen={onClose} />
        </Drawer>
    );
};

export default EditProfileDrawer;
