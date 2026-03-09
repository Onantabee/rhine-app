package com.tskmgmnt.rhine.notification.service;

import com.tskmgmnt.rhine.notification.entity.ProjectUpdate;
import com.tskmgmnt.rhine.notification.repository.ProjectUpdateRepository;
import jakarta.transaction.Transactional;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UpdateService {

    private final ProjectUpdateRepository projectUpdateRepository;
    private final SimpMessagingTemplate messagingTemplate;

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

    @Transactional
    public void createAndSendUpdate(Long projectId, String recipientEmail, String message) {
        ProjectUpdate update = new ProjectUpdate(projectId, recipientEmail, message);
        ProjectUpdate savedUpdate = projectUpdateRepository.save(update);

        String destination = String.format("/topic/project/%d/updates/%s", projectId, recipientEmail);
        messagingTemplate.convertAndSend(destination, savedUpdate);
    }

    public void sendProjectBroadcast(Long projectId, Object payload) {
        String destination = String.format("/topic/project/%d/members", projectId);
        messagingTemplate.convertAndSend(destination, payload);
    }

    public void sendEvictionNotice(Long projectId, String userEmail) {
        String destination = String.format("/topic/user/%s/eviction", userEmail);
        messagingTemplate.convertAndSend(destination, projectId);
    }

    @Transactional
    public void deleteUpdatesForUserInProject(String userEmail, Long projectId) {
        projectUpdateRepository.deleteByProjectIdAndUserEmail(projectId, userEmail);
    }
}
