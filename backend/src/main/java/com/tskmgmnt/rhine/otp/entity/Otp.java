package com.tskmgmnt.rhine.otp.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.tskmgmnt.rhine.core.config.TsidGenerator;
import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "otp")
public class Otp {

    @Id
    @GeneratedValue(generator = "tsid-generator")
    @GenericGenerator(name = "tsid-generator", type = TsidGenerator.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String otpCode;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    public Otp() {}

    public Otp(String email, String otpCode, LocalDateTime expiryDate) {
        this.email = email;
        this.otpCode = otpCode;
        this.expiryDate = expiryDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getOtpCode() { return otpCode; }
    public void setOtpCode(String otpCode) { this.otpCode = otpCode; }
    public LocalDateTime getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDateTime expiryDate) { this.expiryDate = expiryDate; }
}
