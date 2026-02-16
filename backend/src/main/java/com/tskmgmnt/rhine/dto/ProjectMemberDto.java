package com.tskmgmnt.rhine.dto;

import com.tskmgmnt.rhine.enums.ProjectRole;

public class ProjectMemberDto {
    private String email;
    private String name;
    private ProjectRole projectRole;
    private long activeTaskCount;

    public ProjectMemberDto() {}

    public ProjectMemberDto(String email, String name, ProjectRole projectRole, long activeTaskCount) {
        this.email = email;
        this.name = name;
        this.projectRole = projectRole;
        this.activeTaskCount = activeTaskCount;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public ProjectRole getProjectRole() { return projectRole; }
    public void setProjectRole(ProjectRole projectRole) { this.projectRole = projectRole; }

    public long getActiveTaskCount() { return activeTaskCount; }
    public void setActiveTaskCount(long activeTaskCount) { this.activeTaskCount = activeTaskCount; }
}
