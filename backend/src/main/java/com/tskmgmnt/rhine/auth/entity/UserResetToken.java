package com.tskmgmnt.rhine.auth.entity;

import com.tskmgmnt.rhine.core.config.TsidGenerator;
import com.tskmgmnt.rhine.user.entity.User;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_reset_token")
public class UserResetToken {

    @Id
    @GeneratedValue(generator = "tsid-generator")
    @GenericGenerator(name = "tsid-generator", type = TsidGenerator.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_email")
    private User user;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    public UserResetToken() {
    }

    public UserResetToken(String token, User user, LocalDateTime expiryDate) {
        this.token = token;
        this.user = user;
        this.expiryDate = expiryDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }
}
