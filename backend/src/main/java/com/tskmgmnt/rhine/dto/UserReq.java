package com.tskmgmnt.rhine.dto;

import com.tskmgmnt.rhine.entity.User;
import com.tskmgmnt.rhine.enums.UserRole;
import io.swagger.v3.oas.annotations.media.Schema;


public class UserReq {
    @Schema(description = "User's email address", example = "user@example.com")
    private String email;

    @Schema(description = "User's full name", example = "Jane Doe")
    private String name;

    @Schema(description = "User's role", example = "ADMIN")
    private UserRole userRole;

    @Schema(description = "Flag indicating if this is a list request", example = "false")
    private boolean isList;


    public UserReq(String email, String name, UserRole userRole) {
        this.email = email;
        this.name = name;
        this.userRole = userRole;
    }

    public UserReq(boolean isList) {
        this.isList = isList;
    }

    public UserReq(){

    }

//    public UserReq(User updatedViewState) {
//    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public UserRole getUserRole() {
        return userRole;
    }

    public void setUserRole(UserRole userRole) {
        this.userRole = userRole;
    }

    public boolean isList() {
        return isList;
    }

    public void setList(boolean list) {
        isList = list;
    }
}
