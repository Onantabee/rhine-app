package com.tskmgmnt.rhine.dto;

public class LoginResponse {
    private String message;
    private String email;
    private String name;
    private boolean hasProjects;
    private Long lastProjectId;

    public LoginResponse(String message, String email, String name, boolean hasProjects, Long lastProjectId) {
        this.message = message;
        this.email = email;
        this.name = name;
        this.hasProjects = hasProjects;
        this.lastProjectId = lastProjectId;
    }

    public LoginResponse(String message, String email, String name, boolean hasProjects) {
        this(message, email, name, hasProjects, null);
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
}
