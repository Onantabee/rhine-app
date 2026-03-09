package com.tskmgmnt.rhine.notification.entity;

import com.tskmgmnt.rhine.core.config.TsidGenerator;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.GenericGenerator;

import java.time.Instant;

@Entity
@Table(name = "project_updates")
public class ProjectUpdate {

    @Id
    @GeneratedValue(generator = "tsid-generator")
    @GenericGenerator(name = "tsid-generator", type = TsidGenerator.class)
    private Long id;

    private Long projectId;
    private String userEmail;
    private String message;
    private boolean isRead = false;
    private Instant createdAt = Instant.now();

    public ProjectUpdate() {}

    public ProjectUpdate(Long projectId, String userEmail, String message) {
        this.projectId = projectId;
        this.userEmail = userEmail;
        this.message = message;
        this.isRead = false;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public boolean getIsRead() { return isRead; }
    public void setIsRead(boolean isRead) { this.isRead = isRead; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
