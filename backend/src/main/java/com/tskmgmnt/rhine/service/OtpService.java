package com.tskmgmnt.rhine.service;

import com.tskmgmnt.rhine.entity.Otp;
import com.tskmgmnt.rhine.repository.OtpRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class OtpService {

    private static final Logger logger = LoggerFactory.getLogger(OtpService.class);

    private final OtpRepository otpRepository;
    private final JavaMailSender mailSender;

    public OtpService(OtpRepository otpRepository, JavaMailSender mailSender) {
        this.otpRepository = otpRepository;
        this.mailSender = mailSender;
    }

    public void generateOtp(String email) {
        otpRepository.findByEmail(email).ifPresent(otpRepository::delete);

        String otpCode = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(15);

        Otp otp = new Otp(email, otpCode, expiryDate);
        otpRepository.save(otp);

        sendOtpEmail(email, otpCode);
    }

    private void sendOtpEmail(String to, String otpCode) {
        logger.info("PREPARING TO SEND OTP TO {}: {}", to, otpCode);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("onantabasseyvee@gmail.com");
            message.setTo(to);
            message.setSubject("Rhine Verification Code");
            message.setText("Your verification code is: " + otpCode + "\n\nThis code expires in 15 minutes.");
            mailSender.send(message);
            logger.info("OTP email successfully sent to {}", to);
        } catch (Exception e) {
            logger.error("Failed to send OTP email to {}: {}", to, e.getMessage());
        }
    }

    public boolean validateOtp(String email, String otpCode) {
        return otpRepository.findByEmail(email)
                .map(otp -> {
                    if (otp.getExpiryDate().isBefore(LocalDateTime.now())) {
                        otpRepository.delete(otp);
                        return false;
                    }
                    if (otp.getOtpCode().equals(otpCode)) {
                        otpRepository.delete(otp);
                        return true;
                    }
                    return false;
                })
                .orElse(false);
    }
}
