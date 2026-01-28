import React from "react";
import { Drawer, List, ListItem, ListItemButton, IconButton, Typography, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LogOut, PenSquare } from "lucide-react";
import UserAvatar from "./UserAvatar";

/**
 * MobileDrawer component - Mobile navigation drawer
 * @param {boolean} open - Whether drawer is open
 * @param {boolean} isLoggedIn - Whether user is logged in
 * @param {string} userName - User's full name
 * @param {boolean} isAdmin - Whether user is admin
 * @param {function} onClose - Handler for closing drawer
 * @param {function} onLogin - Handler for login click
 * @param {function} onSignup - Handler for signup click
 * @param {function} onEditProfile - Handler for edit profile click
 * @param {function} onLogout - Handler for logout click
 */
const MobileDrawer = ({
    open,
    isLoggedIn,
    userName,
    isAdmin,
    onClose,
    onLogin,
    onSignup,
    onEditProfile,
    onLogout,
}) => {
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            sx={{
                width: 250,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    backgroundColor: "#1E1E1E",
                    color: "#E0E0E0",
                    borderLeft: "1px solid #333",
                    padding: "12px",
                },
            }}
        >
            <div className="flex justify-end pr-2">
                <IconButton onClick={onClose}>
                    <CloseIcon className="text-gray-300" />
                </IconButton>
            </div>
            <List className="min-w-[250px]">
                {!isLoggedIn ? (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton onClick={onLogin}>Login</ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={onSignup}>Signup</ListItemButton>
                        </ListItem>
                    </>
                ) : (
                    <div className="flex flex-col justify-center items-center">
                        <div className="bg-[#333333] w-full flex p-2 flex-col justify-center items-center rounded-lg">
                            <div className="mb-3">
                                <UserAvatar userName={userName} size="md" />
                            </div>
                            <Typography
                                sx={{
                                    fontWeight: "semibold",
                                    fontSize: "25px",
                                    color: "#8c8c8c",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                {userName || "User"}
                            </Typography>
                            {isAdmin && (
                                <Typography
                                    sx={{
                                        fontSize: "12px",
                                        color: "#8c8c8c",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    (Admin)
                                </Typography>
                            )}
                        </div>
                        <Divider
                            sx={{
                                backgroundColor: "#333333",
                                margin: "16px 0",
                                width: "100%",
                                height: "2px",
                            }}
                        />
                        <ListItem
                            disablePadding
                            sx={{
                                display: "flex",
                                width: "100%",
                                gap: "10px",
                                flexDirection: "column",
                            }}
                        >
                            <ListItemButton
                                onClick={onEditProfile}
                                sx={{
                                    backgroundColor: "",
                                    color: "#808080",
                                    border: "2px solid #404040",
                                    width: "100%",
                                    display: "flex",
                                    textTransform: "capitalize",
                                    fontWeight: "semibold",
                                    justifyContent: "start",
                                    borderRadius: "8px",
                                    padding: "10px",
                                    gap: "10px",
                                    transition: "all 0.2s ease-in-out",
                                    "&:hover": {
                                        backgroundColor: "rgba(128, 128, 128, 0.2)",
                                        color: "#a6a6a6",
                                        borderColor: "#a6a6a6",
                                    },
                                }}
                            >
                                <PenSquare size={18} />
                                <span>Edit Profile</span>
                            </ListItemButton>
                            <ListItemButton
                                sx={{
                                    backgroundColor: "#ff3333",
                                    borderRadius: "8px",
                                    width: "100%",
                                    display: "flex",
                                    gap: "10px",
                                    transition: "all 0.3s ease-in-out",
                                    "&:hover": {
                                        backgroundColor: "#ff0000",
                                    },
                                }}
                                onClick={onLogout}
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </ListItemButton>
                        </ListItem>
                    </div>
                )}
            </List>
        </Drawer>
    );
};

export default MobileDrawer;
