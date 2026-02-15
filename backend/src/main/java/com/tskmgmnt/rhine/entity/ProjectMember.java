package com.tskmgmnt.rhine.entity;

import com.tskmgmnt.rhine.enums.ProjectRole;
import com.tskmgmnt.rhine.enums.ProjectMemberStatus;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "project_member", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "project_id"})
})
public class ProjectMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectRole projectRole;

    @Column(nullable = false, updatable = false)
    private Instant joinedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectMemberStatus status = ProjectMemberStatus.PENDING;

    @Column
    private String token;

    public ProjectMember() {
        this.joinedAt = Instant.now();
    }

    public ProjectMember(User user, Project project, ProjectRole projectRole, ProjectMemberStatus status, String token) {
        this.user = user;
        this.project = project;
        this.projectRole = projectRole;
        this.status = status;
        this.token = token;
        this.joinedAt = Instant.now();
    }

    public ProjectMember(User user, Project project, ProjectRole projectRole) {
        this(user, project, projectRole, ProjectMemberStatus.ACTIVE, null);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public ProjectRole getProjectRole() {
        return projectRole;
    }

    public ProjectMemberStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectMemberStatus status) {
        this.status = status;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setProjectRole(ProjectRole projectRole) {
        this.projectRole = projectRole;
    }

    public Instant getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(Instant joinedAt) {
        this.joinedAt = joinedAt;
    }
}
