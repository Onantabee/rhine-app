package com.tskmgmnt.rhine.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonProperty;

public class UserRes {
    @Schema(description = "User's email address", example = "user@example.com")
    private String email;

    @Schema(description = "User's full name", example = "John Doe")
    private String name;

    @Schema(description = "User's verification status", example = "true")
    @JsonProperty("isVerified")
    private boolean isVerified;

    @JsonProperty("lastProjectId")
    private Long lastProjectId;

    public UserRes(String email, String name, boolean isVerified, Long lastProjectId) {
        this.email = email;
        this.name = name;
        this.isVerified = isVerified;
        this.lastProjectId = lastProjectId;
    }

    public UserRes() {}

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean verified) { isVerified = verified; }

    public Long getLastProjectId() { return lastProjectId; }
    public void setLastProjectId(Long lastProjectId) { this.lastProjectId = lastProjectId; }
}
