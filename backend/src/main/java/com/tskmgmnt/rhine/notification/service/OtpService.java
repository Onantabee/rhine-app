package com.tskmgmnt.rhine.notification.service;
import com.tskmgmnt.rhine.notification.repository.OtpRepository;
import com.tskmgmnt.rhine.notification.entity.Otp;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class OtpService {

    private final OtpRepository otpRepository;
    private final MailService mailService;

    public OtpService(OtpRepository otpRepository, MailService mailService) {
        this.otpRepository = otpRepository;
        this.mailService = mailService;
    }

    public void generateOtp(String email) {
        otpRepository.findByEmail(email).ifPresent(otpRepository::delete);

        String otpCode = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(15);

        Otp otp = new Otp(email, otpCode, expiryDate);
        otpRepository.save(otp);

        mailService.sendOtpEmail(email, otpCode);
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
