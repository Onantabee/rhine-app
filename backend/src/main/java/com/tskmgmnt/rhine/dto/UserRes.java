package com.tskmgmnt.rhine.dto;

import com.tskmgmnt.rhine.enums.UserRole;
import io.swagger.v3.oas.annotations.media.Schema;


public class UserRes {  // Renamed to `UserRes` to indicate response DTO
    @Schema(description = "User's email address", example = "user@example.com")
    private String email;

    @Schema(description = "User's full name", example = "John Doe")
    private String name;

    @Schema(description = "User's role", example = "USER")
    private UserRole userRole;

    @Schema(description = "User's password (usually not returned in response)", example = "********")
    private String pwd;


    public UserRes(String email, String name, UserRole userRole) {
        this.email = email;
        this.name = name;
        this.userRole = userRole;
    }

    public UserRes(String pwd) {
        this.pwd = pwd;
    }

    public UserRes() {

    }

    public String getEmail() { return email; }
    public String getName() { return name; }
    public UserRole getUserRole() { return userRole; }

    public String getPwd() {
        return pwd;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setUserRole(UserRole userRole) {
        this.userRole = userRole;
    }

    public void setPwd(String pwd) {
        this.pwd = pwd;
    }
}
