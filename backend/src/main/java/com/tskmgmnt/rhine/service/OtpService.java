package com.tskmgmnt.rhine.service;

import com.tskmgmnt.rhine.entity.Otp;
import com.tskmgmnt.rhine.repository.OtpRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class OtpService {

    private final OtpRepository otpRepository;
    private final org.springframework.mail.javamail.JavaMailSender mailSender;

    public OtpService(OtpRepository otpRepository, org.springframework.mail.javamail.JavaMailSender mailSender) {
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
        try {
            org.springframework.mail.SimpleMailMessage message = new org.springframework.mail.SimpleMailMessage();
            message.setFrom("onantabasseyvee@gmail.com");
            message.setTo(to);
            message.setSubject("Rhine Verification Code");
            message.setText("Your verification code is: " + otpCode + "\n\nThis code expires in 15 minutes.");
            mailSender.send(message);
            System.out.println("OTP sent to " + to + " with code: " + otpCode);
        } catch (Exception e) {
            System.err.println("Failed to send OTP email: " + e.getMessage());
            e.printStackTrace();
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
