package com.tskmgmnt.rhine.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Objects;

public class UserRegReq {
    @Schema(description = "User's full name", example = "John Doe")
    private final String name;

    @Schema(description = "User's email address", example = "john.doe@example.com")
    private final String email;

    @Schema(description = "User's password", example = "securePassword123!")
    private final String pwd;

    public UserRegReq(String name, String email, String pwd) {
        this.name = name;
        this.email = email;
        this.pwd = pwd;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        UserRegReq that = (UserRegReq) o;
        return Objects.equals(name, that.name) && Objects.equals(email, that.email) && Objects.equals(pwd, that.pwd);
    }

    @Override
    public int hashCode() {
        return Objects.hash(email, pwd);
    }

    @Override
    public String toString() {
        return "UserRegReq{" +
                "name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", pwd='***'" +
                '}';
    }

    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPwd() { return pwd; }
}
