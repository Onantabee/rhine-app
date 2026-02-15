package com.tskmgmnt.rhine.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public class UserRes {
    @Schema(description = "User's email address", example = "user@example.com")
    private String email;

    @Schema(description = "User's full name", example = "John Doe")
    private String name;

    public UserRes(String email, String name) {
        this.email = email;
        this.name = name;
    }

    public UserRes() {}

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
