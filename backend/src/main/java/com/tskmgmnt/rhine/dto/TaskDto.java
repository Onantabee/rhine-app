package com.tskmgmnt.rhine.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.tskmgmnt.rhine.enums.TaskStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class TaskDto {

    @Schema(description = "Unique identifier of the task", example = "1")
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must be less than 100 characters")
    @Schema(description = "Title of the task", example = "Complete Project Report")
    private String title;

    @Size(max = 255, message = "Description must be less than 255 characters")
    @Schema(description = "Detailed description of the task", example = "Analyze Q1 financial data and draft the summary section.")
    private String description;

    @Schema(description = "Due date of the task", example = "2023-12-31T10:00:00Z")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
    private Instant dueDate;

    @Schema(description = "Priority level of the task", example = "HIGH", allowableValues = {"HIGH", "MEDIUM", "LOW"})
    private String priority;

    @Schema(description = "Current status of the task", example = "IN_PROGRESS")
    private TaskStatus taskStatus;

    @Schema(description = "Flag indicating if the task is new or unseen", example = "true")
    private boolean isNew;

    @Schema(description = "ID of the user who created the task", example = "user-123")
    private String createdById;

    @Schema(description = "ID of the user assigned to the task", example = "user-456")
    private String assigneeId;

    @Schema(description = "Timestamp when the task was created", example = "2023-10-27T10:00:00Z")
    private Instant createdAt;

    @Schema(description = "Timestamp when the task was last assigned", example = "2023-10-28T10:00:00Z")
    private Instant lastAssignedAt;

    @Schema(description = "ID of the project this task belongs to", example = "1")
    private Long projectId;

    public TaskDto(Long id, String title, String description, Instant dueDate, String priority, TaskStatus taskStatus, String createdById, String assigneeId, Instant createdAt, Instant lastAssignedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.taskStatus = taskStatus;
        this.createdById = createdById;
        this.assigneeId = assigneeId;
        this.createdAt = createdAt;
        this.lastAssignedAt = lastAssignedAt;
    }

    public TaskDto(boolean isNew) {
        this.isNew = isNew;
    }

    public TaskDto() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Instant getDueDate() {
        return dueDate;
    }

    public void setDueDate(Instant dueDate) {
        this.dueDate = dueDate;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public TaskStatus getTaskStatus() {
        return taskStatus;
    }

    public void setTaskStatus(TaskStatus taskStatus) {
        this.taskStatus = taskStatus;
    }

    public boolean getIsNew() {
        return isNew;
    }

    public void setIsNew(boolean isNew) {
        this.isNew = isNew;
    }

    public String getCreatedById() {
        return createdById;
    }

    public void setCreatedById(String createdById) {
        this.createdById = createdById;
    }

    public String getAssigneeId() {
        return assigneeId;
    }

    public void setAssigneeId(String assigneeId) {
        this.assigneeId = assigneeId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getLastAssignedAt() {
        return lastAssignedAt;
    }

    public void setLastAssignedAt(Instant lastAssignedAt) {
        this.lastAssignedAt = lastAssignedAt;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
}