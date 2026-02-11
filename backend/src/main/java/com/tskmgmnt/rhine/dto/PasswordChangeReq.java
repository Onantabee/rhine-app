package com.tskmgmnt.rhine.dto;


import io.swagger.v3.oas.annotations.media.Schema;




public class PasswordChangeReq {
    @Schema(description = "Current password of the user", example = "oldPassword123!")
    private String currentPassword;

    @Schema(description = "New password for the user", example = "newPassword456!")
    private String newPassword;


    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
