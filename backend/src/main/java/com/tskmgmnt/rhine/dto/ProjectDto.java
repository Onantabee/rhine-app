package com.tskmgmnt.rhine.dto;

import java.time.Instant;

public class ProjectDto {
    private Long id;
    private String name;
    private String ownerEmail;
    private String ownerName;
    private int memberCount;
    private Instant createdAt;
    private String currentUserRole; // The role of the requesting user in this project

    public ProjectDto() {}

    public ProjectDto(Long id, String name, String ownerEmail, String ownerName, int memberCount, Instant createdAt, String currentUserRole) {
        this.id = id;
        this.name = name;
        this.ownerEmail = ownerEmail;
        this.ownerName = ownerName;
        this.memberCount = memberCount;
        this.createdAt = createdAt;
        this.currentUserRole = currentUserRole;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getOwnerEmail() { return ownerEmail; }
    public void setOwnerEmail(String ownerEmail) { this.ownerEmail = ownerEmail; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public int getMemberCount() { return memberCount; }
    public void setMemberCount(int memberCount) { this.memberCount = memberCount; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public String getCurrentUserRole() { return currentUserRole; }
    public void setCurrentUserRole(String currentUserRole) { this.currentUserRole = currentUserRole; }
}
