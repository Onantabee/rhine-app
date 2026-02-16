package com.tskmgmnt.rhine.dto;

import com.tskmgmnt.rhine.enums.ProjectRole;

public class InviteMemberReq {
    private String email;
    private ProjectRole projectRole;

    public InviteMemberReq() {
        this.projectRole = ProjectRole.PROJECT_EMPLOYEE; // default
    }

    public InviteMemberReq(String email, ProjectRole projectRole) {
        this.email = email;
        this.projectRole = projectRole;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public ProjectRole getProjectRole() { return projectRole; }
    public void setProjectRole(ProjectRole projectRole) { this.projectRole = projectRole; }
}
