import React from "react";
import { Paper, MenuList, MenuItem, Typography, Grow, Popper } from "@mui/material";
import { LogOut, PenSquare } from "lucide-react";

/**
 * ProfileDropdown component - Desktop profile menu dropdown
 * @param {boolean} open - Whether dropdown is open
 * @param {object} anchorEl - Anchor element for positioning
 * @param {string} userName - User's full name
 * @param {boolean} isAdmin - Whether user is admin
 * @param {function} onEditProfile - Handler for edit profile click
 * @param {function} onLogout - Handler for logout click
 */
const ProfileDropdown = ({ open, anchorEl, userName, isAdmin, onEditProfile, onLogout }) => {
    return (
        <Popper
            open={open}
            anchorEl={anchorEl}
            placement="bottom-end"
            transition
            disablePortal
            sx={{ zIndex: 1 }}
        >
            {({ TransitionProps }) => (
                <Grow {...TransitionProps}>
                    <Paper
                        sx={{
                            minWidth: 250,
                            padding: "10px",
                            backgroundColor: "#333333",
                            color: "#E0E0E0",
                            border: "1px solid #444",
                            marginTop: "8px",
                            borderRadius: "15px",
                            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.25)",
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: "semibold",
                                fontSize: "20px",
                                color: "#8c8c8c",
                                display: "flex",
                                justifyContent: "center",
                                ...(!isAdmin && { marginBottom: "10px" }),
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
                                    marginBottom: "10px",
                                }}
                            >
                                (Admin)
                            </Typography>
                        )}
                        <MenuList
                            sx={{
                                padding: 0,
                                display: "flex",
                                flexDirection: "column",
                                gap: "5px",
                            }}
                        >
                            <MenuItem
                                onClick={onEditProfile}
                                sx={{
                                    backgroundColor: "",
                                    color: "#808080",
                                    border: "2px solid #404040",
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
                            </MenuItem>
                            <MenuItem
                                onClick={onLogout}
                                sx={{
                                    backgroundColor: "#ff3333",
                                    display: "flex",
                                    textTransform: "uppercase",
                                    fontWeight: "semibold",
                                    justifyContent: "start",
                                    borderRadius: "8px",
                                    padding: "10px",
                                    gap: "10px",
                                    transition: "all 0.2s ease-in-out",
                                    "&:hover": {
                                        backgroundColor: "#ff0000",
                                    },
                                }}
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </MenuItem>
                        </MenuList>
                    </Paper>
                </Grow>
            )}
        </Popper>
    );
};

export default ProfileDropdown;
