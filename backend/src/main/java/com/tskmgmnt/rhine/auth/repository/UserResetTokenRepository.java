package com.tskmgmnt.rhine.auth.repository;

import com.tskmgmnt.rhine.auth.entity.UserResetToken;
import com.tskmgmnt.rhine.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserResetTokenRepository extends JpaRepository<UserResetToken, Long> {
    Optional<UserResetToken> findByToken(String token);
    Optional<UserResetToken> findByUser(User user);
    void deleteByUser(User user);
    void deleteByToken(String token);
}
