package com.tskmgmnt.rhine.dto;

import com.tskmgmnt.rhine.enums.UserRole;
import io.swagger.v3.oas.annotations.media.Schema;


public class UserRes { 
    @Schema(description = "User's email address", example = "user@example.com")
    private String email;

    @Schema(description = "User's full name", example = "John Doe")
    private String name;

    @Schema(description = "User's role", example = "USER")
    private UserRole userRole;



    public UserRes(String email, String name, UserRole userRole) {
        this.email = email;
        this.name = name;
        this.userRole = userRole;
    }


    public UserRes() {

    }

    public String getEmail() { return email; }
    public String getName() { return name; }
    public UserRole getUserRole() { return userRole; }


    public void setEmail(String email) {
        this.email = email;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setUserRole(UserRole userRole) {
        this.userRole = userRole;
    }

}
