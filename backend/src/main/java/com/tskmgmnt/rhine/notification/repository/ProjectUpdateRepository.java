package com.tskmgmnt.rhine.notification.repository;

import com.tskmgmnt.rhine.notification.entity.ProjectUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProjectUpdateRepository extends JpaRepository<ProjectUpdate, Long> {

    List<ProjectUpdate> findByProjectIdAndUserEmailOrderByCreatedAtDesc(Long projectId, String userEmail);

    @Modifying
    @Query("UPDATE ProjectUpdate p SET p.isRead = true WHERE p.id IN :updateIds AND p.userEmail = :userEmail")
    void markAsRead(@Param("updateIds") List<Long> updateIds, @Param("userEmail") String userEmail);

    @Modifying
    @Query("DELETE FROM ProjectUpdate p WHERE p.createdAt < :cutoffDate")
    void deleteOlderThan(@Param("cutoffDate") LocalDateTime cutoffDate);
}
