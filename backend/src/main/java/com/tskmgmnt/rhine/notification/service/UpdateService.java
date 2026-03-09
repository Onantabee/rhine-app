package com.tskmgmnt.rhine.notification.service;

import com.tskmgmnt.rhine.notification.entity.ProjectUpdate;
import com.tskmgmnt.rhine.notification.repository.ProjectUpdateRepository;
import jakarta.transaction.Transactional;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.List;

import java.time.Instant;

@Service
public class UpdateService {

    private final ProjectUpdateRepository projectUpdateRepository;
    private final SimpMessagingTemplate messagingTemplate;

    private final ConcurrentHashMap<String, Instant> recentUpdates = new ConcurrentHashMap<>();
    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(UpdateService.class);

    public UpdateService(ProjectUpdateRepository projectUpdateRepository, SimpMessagingTemplate messagingTemplate) {
        this.projectUpdateRepository = projectUpdateRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public List<ProjectUpdate> getUpdatesForUserInProject(String userEmail, Long projectId) {
        return projectUpdateRepository.findByProjectIdAndUserEmailOrderByCreatedAtDesc(projectId, userEmail);
    }

    @Transactional
    public void markUpdatesAsRead(List<Long> updateIds, String userEmail) {
        if (updateIds != null && !updateIds.isEmpty()) {
            projectUpdateRepository.markAsRead(updateIds, userEmail);
        }
    }

    public void createAndSendUpdate(Long projectId, String recipientEmail, String message) {
        if (recipientEmail == null || message == null) return;
        
        String normalizedEmail = recipientEmail.toLowerCase();
        String cacheKey = String.format("%d|%s|%s", projectId, normalizedEmail, message);
        Instant now = Instant.now();
        Instant cutoff = now.minusSeconds(30);

        Instant lastSent = recentUpdates.get(cacheKey);
        if (lastSent != null && lastSent.isAfter(cutoff)) {
            logger.info("Skipping duplicate update (cached): {} for {}", message, normalizedEmail);
            return;
        }

        synchronized (this) {
            List<ProjectUpdate> recent = projectUpdateRepository.findByProjectIdAndUserEmailOrderByCreatedAtDesc(projectId, normalizedEmail);
            boolean exists = recent.stream()
                .anyMatch(u -> u.getMessage().equals(message) && u.getCreatedAt().isAfter(cutoff));
            
            if (exists) {
                logger.info("Skipping duplicate update (db): {} for {}", message, normalizedEmail);
                recentUpdates.put(cacheKey, now);
                return;
            }

            logger.info("Creating update: {} for {}", message, normalizedEmail);
            ProjectUpdate update = new ProjectUpdate(projectId, normalizedEmail, message);
            ProjectUpdate savedUpdate = projectUpdateRepository.saveAndFlush(update);
            recentUpdates.put(cacheKey, now);

            recentUpdates.entrySet().removeIf(entry -> entry.getValue().isBefore(now.minusSeconds(60)));

            String destination = String.format("/topic/project/%d/updates/%s", projectId, normalizedEmail);
            messagingTemplate.convertAndSend(destination, savedUpdate);
        }
    }

    public void sendProjectBroadcast(Long projectId, Object payload) {
        String destination = String.format("/topic/project/%d/members", projectId);
        messagingTemplate.convertAndSend(destination, payload);
    }

    public void sendEvictionNotice(Long projectId, String userEmail) {
        String destination = String.format("/topic/user/%s/eviction", userEmail);
        messagingTemplate.convertAndSend(destination, projectId);
    }

    public void sendTaskEvictionNotice(Long taskId, String userEmail) {
        String destination = String.format("/topic/user/%s/task-eviction", userEmail);
        messagingTemplate.convertAndSend(destination, taskId);
    }

    @Transactional
    public void deleteUpdatesForUserInProject(String userEmail, Long projectId) {
        projectUpdateRepository.deleteByProjectIdAndUserEmail(projectId, userEmail);
    }
}
