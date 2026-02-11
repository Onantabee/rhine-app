package com.tskmgmnt.rhine.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;


public class CommentDto {
    @Schema(description = "Unique identifier of the comment", example = "10")
    private Long id;

    @Schema(description = "Content of the comment", example = "Please review the attached document.")
    private String content;

    @Schema(description = "Email of the author", example = "author@example.com")
    private String authorEmail;

    @Schema(description = "Email of the recipient", example = "recipient@example.com")
    private String recipientEmail;

    @Schema(description = "ID of the associated task", example = "1")
    private Long taskId;

    @Schema(description = "Flag indicating if the comment has been read by the recipient", example = "false")
    private boolean isReadByRecipient;

    @Schema(description = "Timestamp when the comment was created", example = "2023-11-21T10:00:00")
    private LocalDateTime createdAt;


    public CommentDto(Long taskId, boolean isReadByRecipient) {
        this.taskId = taskId;
        this.isReadByRecipient = isReadByRecipient;
    }

    public CommentDto(Long id, String content, String authorEmail, String recipientEmail, boolean isReadByRecipient, LocalDateTime createdAt) {
        this.id = id;
        this.content = content;
        this.authorEmail = authorEmail;
        this.recipientEmail = recipientEmail;
        this.isReadByRecipient = isReadByRecipient;
        this.createdAt = createdAt;
    }

    public CommentDto() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAuthorEmail() {
        return authorEmail;
    }

    public void setAuthorEmail(String authorEmail) {
        this.authorEmail = authorEmail;
    }

    public boolean isReadByRecipient() {
        return isReadByRecipient;
    }

    public void setReadByRecipient(boolean readByRecipient) {
        isReadByRecipient = readByRecipient;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
