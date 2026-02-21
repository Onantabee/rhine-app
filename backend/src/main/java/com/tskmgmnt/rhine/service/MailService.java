package com.tskmgmnt.rhine.service;

import com.tskmgmnt.rhine.enums.ProjectRole;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private static final Logger logger = LoggerFactory.getLogger(MailService.class);
    private final JavaMailSender mailSender;

    @Value("${application.frontend.url}")
    private String frontendUrl;

    @Value("${spring.mail.from}")
    private String mailFrom;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendOtpEmail(String to, String otpCode) {
        logger.info("PREPARING TO SEND OTP TO {}: {}", to, otpCode);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailFrom);
            message.setTo(to);
            message.setSubject("Rhine Verification Code");
            message.setText("Your verification code is: " + otpCode + "\n\nThis code expires in 15 minutes.");
            mailSender.send(message);
            logger.info("OTP email successfully sent to {}", to);
        } catch (Exception e) {
            logger.error("Failed to send OTP email to {}: {}", to, e.getMessage());
        }
    }

    @Async
    public void sendInviteEmail(String to, String projectName, ProjectRole role, String token) {
        String inviteLink = frontendUrl + "/accept-invite?token=" + token;
        logger.info("Preparing to send invite email to {} with link: {}", to, inviteLink);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailFrom);
            message.setTo(to);
            message.setSubject("You've been invited to join " + projectName);
            message.setText("Hello,\n\nYou have been invited to join the project '" + projectName + "' as a " + role + ".\n\nPlease click the link below to accept the invitation:\n" + inviteLink);
            mailSender.send(message);
            logger.info("Invite email successfully sent to {} with link: {}", to, inviteLink);
        } catch (Exception e) {
            logger.error("Failed to send Invite email to {}: {}", to, e.getMessage());
        }
    }
}
