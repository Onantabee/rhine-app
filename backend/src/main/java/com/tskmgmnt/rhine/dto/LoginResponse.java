package com.tskmgmnt.rhine.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LoginResponse {
    private String message;
    private String email;
    private String name;
    private boolean hasProjects;
    private Long lastProjectId;
    @JsonProperty("isVerified")
    private boolean isVerified;
    private String token;

    public LoginResponse(String message, String email, String name, boolean hasProjects, Long lastProjectId, boolean isVerified, String token) {
        this.message = message;
        this.email = email;
        this.name = name;
        this.hasProjects = hasProjects;
        this.lastProjectId = lastProjectId;
        this.isVerified = isVerified;
        this.token = token;
    }

    public LoginResponse(String message, String email, String name, boolean hasProjects, boolean isVerified, String token) {
        this(message, email, name, hasProjects, null, isVerified, token);
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public boolean isHasProjects() { return hasProjects; }
    public void setHasProjects(boolean hasProjects) { this.hasProjects = hasProjects; }

    public Long getLastProjectId() { return lastProjectId; }
    public void setLastProjectId(Long lastProjectId) { this.lastProjectId = lastProjectId; }

    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean verified) { isVerified = verified; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}
