package com.tskmgmnt.rhine.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String content;

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    @JsonIgnoreProperties({"tasks", "assignedTasks", "pwd", "authorities", "enabled", "accountNonExpired", "accountNonLocked", "credentialsNonExpired"})
    private User author;

    @ManyToOne
    @JoinColumn(name = "task_id", nullable = false)
    @JsonBackReference
    private Task task;

    @ManyToOne
    @JoinColumn(name = "recipient_id")
    @JsonIgnoreProperties({"tasks", "assignedTasks", "pwd", "authorities", "enabled", "accountNonExpired", "accountNonLocked", "credentialsNonExpired"})
    private User recipient;

    @Column(nullable = false)
    private boolean isReadByRecipient;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public Comment() {
        this.isReadByRecipient = false;
    }

    public Comment(String content, User author, Task task, User recipient) {
        this.content = content;
        this.author = author;
        this.task = task;
        this.recipient = recipient;
        this.createdAt = Instant.now();
    }

    // Getters and Setters
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

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public User getRecipient() {
        return recipient;
    }

    public void setRecipient(User recipient) {
        this.recipient = recipient;
    }

    public boolean isReadByRecipient() {
        return isReadByRecipient;
    }

    public void setReadByRecipient(boolean readByRecipient) {
        isReadByRecipient = readByRecipient;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}

