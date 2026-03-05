package com.tskmgmnt.rhine.notification.scheduler;

import com.tskmgmnt.rhine.notification.repository.ProjectUpdateRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class UpdateCleanupScheduler {

    private static final Logger log = LoggerFactory.getLogger(UpdateCleanupScheduler.class);
    private final ProjectUpdateRepository projectUpdateRepository;

    public UpdateCleanupScheduler(ProjectUpdateRepository projectUpdateRepository) {
        this.projectUpdateRepository = projectUpdateRepository;
    }

    @Scheduled(cron = "0 0 2 * * ?")
    @Transactional
    public void purgeOldProjectUpdates() {
        log.info("Starting scheduled cleanup of old ProjectUpdates...");
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(30);
        try {
            projectUpdateRepository.deleteOlderThan(cutoffDate);
            log.info("Successfully completed cleanup of ProjectUpdates older than: {}", cutoffDate);
        } catch (Exception e) {
            log.error("Failed to purge old ProjectUpdates: ", e.getMessage());
        }
    }
}
