package com.tskmgmnt.rhine.task.service;
import com.tskmgmnt.rhine.notification.dto.NotificationDto;
import com.tskmgmnt.rhine.user.entity.User;
import com.tskmgmnt.rhine.user.repository.UserRepository;
import com.tskmgmnt.rhine.task.dto.TaskDto;
import com.tskmgmnt.rhine.task.entity.Task;
import com.tskmgmnt.rhine.task.repository.TaskRepository;
import com.tskmgmnt.rhine.project.enums.ProjectRole;
import com.tskmgmnt.rhine.project.repository.ProjectMemberRepository;
import com.tskmgmnt.rhine.project.entity.Project;
import com.tskmgmnt.rhine.project.repository.ProjectRepository;
import com.tskmgmnt.rhine.notification.service.UpdateService;
import com.tskmgmnt.rhine.core.exception.ResourceNotFoundException;
import com.tskmgmnt.rhine.core.exception.BadRequestException;
import com.tskmgmnt.rhine.core.exception.ConflictException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.time.Instant;
import java.util.stream.Collectors;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final UpdateService updateService;

    @Autowired
    public TaskService(TaskRepository taskRepository,
                       UserRepository userRepository,
                       ProjectRepository projectRepository,
                       ProjectMemberRepository projectMemberRepository,
                       SimpMessagingTemplate messagingTemplate,
                       UpdateService updateService) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.messagingTemplate = messagingTemplate;
        this.updateService = updateService;
    }

    public TaskDto createTask(Long projectId, TaskDto taskReq, String requestingUserEmail) {
        projectMemberRepository.findByUserEmailAndProjectId(requestingUserEmail, projectId)
                .filter(m -> m.getProjectRole() == ProjectRole.PROJECT_ADMIN)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        Task task = new Task();
        task.setTitle(taskReq.getTitle());
        task.setDescription(taskReq.getDescription());
        task.setTaskStatus(taskReq.getTaskStatus());
        task.setPriority(taskReq.getPriority());
        task.setDueDate(taskReq.getDueDate());
        task.setProject(project);

        User createdBy = userRepository.findByEmail(taskReq.getCreatedById())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        task.setCreatedBy(createdBy);
        task.setCreatedAt(Instant.now());
        task.setIsNew(true);
        task.setLastAssignedAt(Instant.now());

        if (taskReq.getAssigneeId() != null) {
            if (!projectMemberRepository.existsByUserEmailAndProjectId(taskReq.getAssigneeId(), projectId)) {
                throw new BadRequestException("Assignee must be a member of this project");
            }
            User assignee = userRepository.findByEmail(taskReq.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
            task.setAssignee(assignee);
        }

        Task savedTask = taskRepository.save(task);

        messagingTemplate.convertAndSend("/topic/task-created",
                new NotificationDto<>("TASK_CREATED", mapToTaskResponse(savedTask)));

        if (savedTask.getAssignee() != null && !savedTask.getAssignee().getEmail().equals(requestingUserEmail)) {
            String message = String.format("You were assigned to %s", savedTask.getTitle());
            updateService.createAndSendUpdate(projectId, savedTask.getAssignee().getEmail(), message);
        }

        return mapToTaskResponse(savedTask);
    }

    public List<TaskDto> getTasksByProject(Long projectId, String requestingUserEmail) {
        if (!projectMemberRepository.existsByUserEmailAndProjectId(requestingUserEmail, projectId)) {
            throw new ResourceNotFoundException("Project not found");
        }

        List<Task> tasks = taskRepository.findByProjectId(projectId);
        return tasks.stream()
                .map(this::mapToTaskResponse)
                .collect(Collectors.toList());
    }

    private TaskDto mapToTaskResponse(Task task) {
        TaskDto response = new TaskDto();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setDueDate(task.getDueDate());
        response.setPriority(task.getPriority());
        response.setTaskStatus(task.getTaskStatus());
        response.setCreatedById(task.getCreatedBy().getEmail());
        response.setIsNew(task.getIsNew());
        response.setCreatedAt(task.getCreatedAt());
        response.setLastAssignedAt(task.getLastAssignedAt());
        response.setProjectId(task.getProject() != null ? task.getProject().getId() : null);
        if (task.getAssignee() != null) {
            response.setAssigneeId(task.getAssignee().getEmail());
        }
        return response;
    }

    public TaskDto getTaskById(Long id, String requestingUserEmail) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (task.getProject() != null) {
            // 1. Check if user is at least a member
            var member = projectMemberRepository.findByUserEmailAndProjectId(requestingUserEmail, task.getProject().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

            // 2. If not ADMIN, check if they are Creator or Assignee
            if (member.getProjectRole() != ProjectRole.PROJECT_ADMIN) {
                boolean isCreator = task.getCreatedBy().getEmail().equals(requestingUserEmail);
                boolean isAssignee = task.getAssignee() != null && task.getAssignee().getEmail().equals(requestingUserEmail);
                if (!isCreator && !isAssignee) {
                    throw new ResourceNotFoundException("Task not found");
                }
            }
        } else {
            // Task without project (personal/legacy)
            boolean isCreator = task.getCreatedBy().getEmail().equals(requestingUserEmail);
            boolean isAssignee = task.getAssignee() != null && task.getAssignee().getEmail().equals(requestingUserEmail);
            if (!isCreator && !isAssignee) {
                throw new ResourceNotFoundException("Task not found");
            }
        }

        return mapToTaskResponse(task);
    }

    public TaskDto updateTaskById(Long id, TaskDto taskReq, String modifierEmail) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (existingTask.getProject() != null) {
            projectMemberRepository.findByUserEmailAndProjectId(modifierEmail, existingTask.getProject().getId())
                    .filter(m -> m.getProjectRole() == ProjectRole.PROJECT_ADMIN)
                    .orElseThrow(() -> new ResourceNotFoundException("Not authorized to update tasks in this project"));
        }

        existingTask.setTitle(taskReq.getTitle());
        existingTask.setDescription(taskReq.getDescription());
        existingTask.setTaskStatus(taskReq.getTaskStatus());
        existingTask.setPriority(taskReq.getPriority());
        existingTask.setDueDate(taskReq.getDueDate());
        if (taskReq.getCreatedById() != null) {
            User createdBy = userRepository.findByEmail(taskReq.getCreatedById())
                    .orElseThrow(() -> new ResourceNotFoundException("User not Found!"));
            existingTask.setCreatedBy(createdBy);
        }

        User formerAssignee = existingTask.getAssignee();
        Long projectId = existingTask.getProject() != null ? existingTask.getProject().getId() : null;

        if (taskReq.getAssigneeId() != null) {
            if (projectId != null && !projectMemberRepository.existsByUserEmailAndProjectId(taskReq.getAssigneeId(), projectId)) {
                throw new BadRequestException("Assignee must be a member of this project");
            }

            User assignee = userRepository.findByEmail(taskReq.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not Found!"));

            if (formerAssignee == null || !formerAssignee.getEmail().equals(assignee.getEmail())) {
                existingTask.setAssignee(assignee);
                existingTask.setLastAssignedAt(Instant.now());
                existingTask.setIsNew(true);

                if (!assignee.getEmail().equals(modifierEmail)) {
                     String message = String.format("You were assigned to %s", existingTask.getTitle());
                     updateService.createAndSendUpdate(projectId, assignee.getEmail(), message);
                }

                if (formerAssignee != null && !formerAssignee.getEmail().equals(modifierEmail)) {
                    String unassignedMsg = String.format("You were unassigned from %s", existingTask.getTitle());
                    updateService.createAndSendUpdate(projectId, formerAssignee.getEmail(), unassignedMsg);
                    updateService.sendTaskEvictionNotice(existingTask.getId(), formerAssignee.getEmail());
                }
            }
        } else {
            existingTask.setAssignee(null);
            if (formerAssignee != null && !formerAssignee.getEmail().equals(modifierEmail)) {
                String unassignedMsg = String.format("You were unassigned from %s", existingTask.getTitle());
                updateService.createAndSendUpdate(projectId, formerAssignee.getEmail(), unassignedMsg);
                updateService.sendTaskEvictionNotice(existingTask.getId(), formerAssignee.getEmail());
            }
        }
        Task updatedTask = taskRepository.save(existingTask);
        TaskDto taskResponse = mapToTaskResponse(updatedTask);
        messagingTemplate.convertAndSend("/topic/task-updated",
                new NotificationDto<>("TASK_UPDATED", taskResponse));
        return taskResponse;
    }

    public TaskDto updateStatusById(Long id, TaskDto taskReq, String modifierEmail) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (task.getProject() != null) {
            if (!projectMemberRepository.existsByUserEmailAndProjectId(modifierEmail, task.getProject().getId())) {
                throw new ResourceNotFoundException("Not authorized");
            }
        }

        task.setTaskStatus(taskReq.getTaskStatus());
        Task updatedTask = taskRepository.save(task);

        messagingTemplate.convertAndSend("/topic/task-status-updated",
                new NotificationDto<>("TASK_STATUS_UPDATED", mapToTaskResponse(updatedTask)));

        Long projectId = task.getProject() != null ? task.getProject().getId() : null;
        if (projectId != null) {
            User creator = task.getCreatedBy();
            User assignee = task.getAssignee();
            
            String modifierName = modifierEmail.split("@")[0];
            if (creator != null && creator.getEmail().equals(modifierEmail)) {
                modifierName = creator.getName();
            } else if (assignee != null && assignee.getEmail().equals(modifierEmail)) {
                modifierName = assignee.getName();
            } else {
                modifierName = userRepository.findByEmail(modifierEmail)
                        .map(User::getName)
                        .orElse(modifierName);
            }
            String firstName = modifierName.split(" ")[0];

            String message = String.format("%s set %s status to %s",
                    firstName,
                    task.getTitle(),
                    taskReq.getTaskStatus().name());

            if (assignee != null && assignee.getEmail().equals(modifierEmail) && creator != null) {
                updateService.createAndSendUpdate(projectId, creator.getEmail(), message);
            } 
            else if (creator != null && creator.getEmail().equals(modifierEmail) && assignee != null) {
                updateService.createAndSendUpdate(projectId, assignee.getEmail(), message);
            }
            else {
                 if (creator != null && !creator.getEmail().equals(modifierEmail)) {
                     updateService.createAndSendUpdate(projectId, creator.getEmail(), message);
                 }
                 if (assignee != null && !assignee.getEmail().equals(modifierEmail) && 
                     (creator == null || !assignee.getEmail().equals(creator.getEmail()))) {
                     updateService.createAndSendUpdate(projectId, assignee.getEmail(), message);
                 }
            }
        }

        return mapToTaskResponse(updatedTask);
    }

    public TaskDto updateIsNewState(Long id, TaskDto taskReq, String modifierEmail) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (task.getProject() != null) {
            if (!projectMemberRepository.existsByUserEmailAndProjectId(modifierEmail, task.getProject().getId())) {
                throw new ResourceNotFoundException("Not authorized");
            }
        }

        task.setIsNew(taskReq.getIsNew());
        Task updatedTaskState = taskRepository.save(task);
        
        TaskDto response = new TaskDto();
        response.setId(updatedTaskState.getId());
        response.setIsNew(updatedTaskState.getIsNew());
        
        messagingTemplate.convertAndSend("/topic/task-new-state",
                new NotificationDto<>("TASK_NEW_STATE", response));
        return response;
    }

    public TaskDto getIsNewState(Long id, String requestingUserEmail) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (task.getProject() != null) {
            if (!projectMemberRepository.existsByUserEmailAndProjectId(requestingUserEmail, task.getProject().getId())) {
                throw new ResourceNotFoundException("Task not found");
            }
        }

        TaskDto response = new TaskDto();
        response.setIsNew(task.getIsNew());
        return response;
    }

    public Task deleteTaskById(Long id, String requestingUserEmail) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (task.getProject() != null) {
            projectMemberRepository.findByUserEmailAndProjectId(requestingUserEmail, task.getProject().getId())
                    .filter(m -> m.getProjectRole() == ProjectRole.PROJECT_ADMIN)
                    .orElseThrow(() -> new ResourceNotFoundException("Not authorized to delete tasks"));
        }

        TaskDto response = mapToTaskResponse(task);
        taskRepository.delete(task);
        
        try {
            System.out.println("Task deleted successfully: " + task.getId());
            messagingTemplate.convertAndSend("/topic/task-deleted",
                    new NotificationDto<>("TASK_DELETED", response.getId()));
        } catch (Exception e) {
            System.err.println("Error sending delete notification: " + e.getMessage());
        }
        
        return task;
    }
}