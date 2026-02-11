package com.tskmgmnt.rhine.dto;

import io.swagger.v3.oas.annotations.media.Schema;


public class MarkAsReadDto {
    @Schema(description = "Email of the user marking the item as read", example = "user@example.com")
    private String userEmail;



    public MarkAsReadDto() {
    }

    public MarkAsReadDto(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }
}