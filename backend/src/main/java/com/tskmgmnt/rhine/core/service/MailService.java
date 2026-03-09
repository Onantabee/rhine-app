package com.tskmgmnt.rhine.core.service;

import com.tskmgmnt.rhine.project.enums.ProjectRole;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class MailService {

    private static final Logger logger = LoggerFactory.getLogger(MailService.class);
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${application.frontend.url}")
    private String frontendUrl;

    @Value("${spring.mail.from}")
    private String mailFrom;

    public MailService(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    @Async
    public void sendOtpEmail(String to, String otpCode) {
        logger.info("PREPARING TO SEND HTML OTP TO {}: {}", to, otpCode);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(mailFrom);
            helper.setTo(to);
            helper.setSubject("Rhine Verification Code");

            Context context = new Context();
            context.setVariable("otpCode", otpCode);

            String htmlContent = templateEngine.process("otp-email", context);

            helper.setText(htmlContent, true);
            mailSender.send(message);
            logger.info("HTML OTP email successfully sent to {}", to);
        } catch (Exception e) {
            logger.error("Failed to send HTML OTP email to {}: {}", to, e.getMessage());
        }
    }

    @Async
    public void sendInviteEmail(String to, String projectName, ProjectRole role, String token) {
        String inviteLink = frontendUrl + "/accept-invite?token=" + token;
        logger.info("Preparing to send HTML invite email to {} with link: {}", to, inviteLink);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(mailFrom);
            helper.setTo(to);
            helper.setSubject("You've been invited to join " + projectName);

            Context context = new Context();
            context.setVariable("projectName", projectName);
            context.setVariable("role", role.name());
            context.setVariable("inviteLink", inviteLink);

            String htmlContent = templateEngine.process("invite-email", context);

            helper.setText(htmlContent, true);
            mailSender.send(message);
            logger.info("HTML Invite email successfully sent to {}", to);
        } catch (Exception e) {
            logger.error("Failed to send HTML Invite email to {}: {}", to, e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetEmail(String to, String token) {
        String resetLink = frontendUrl + "/reset-password?token=" + token;
        logger.info("Preparing to send HTML password reset email to {} with link: {}", to, resetLink);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(mailFrom);
            helper.setTo(to);
            helper.setSubject("Rhine Password Reset Request");

            Context context = new Context();
            context.setVariable("resetLink", resetLink);

            String htmlContent = templateEngine.process("reset-password", context);

            helper.setText(htmlContent, true);
            mailSender.send(message);
            logger.info("HTML Password reset email successfully sent to {}", to);
        } catch (Exception e) {
            logger.error("Failed to send HTML Password Reset email to {}: {}", to, e.getMessage());
        }
    }
}
