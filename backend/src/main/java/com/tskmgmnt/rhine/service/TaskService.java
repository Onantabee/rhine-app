package com.tskmgmnt.rhine.service;

import com.tskmgmnt.rhine.dto.NotificationDto;
import com.tskmgmnt.rhine.dto.TaskDto;
import com.tskmgmnt.rhine.entity.Project;
import com.tskmgmnt.rhine.entity.Task;
import com.tskmgmnt.rhine.entity.User;
import com.tskmgmnt.rhine.enums.ProjectRole;
import com.tskmgmnt.rhine.repository.ProjectMemberRepository;
import com.tskmgmnt.rhine.repository.ProjectRepository;
import com.tskmgmnt.rhine.repository.TaskRepository;
import com.tskmgmnt.rhine.repository.UserRepository;
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

    @Autowired
    public TaskService(TaskRepository taskRepository,
                       UserRepository userRepository,
                       ProjectRepository projectRepository,
                       ProjectMemberRepository projectMemberRepository,
                       SimpMessagingTemplate messagingTemplate) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public TaskDto createTask(Long projectId, TaskDto taskReq, String requestingUserEmail) {
        projectMemberRepository.findByUserEmailAndProjectId(requestingUserEmail, projectId)
                .filter(m -> m.getProjectRole() == ProjectRole.PROJECT_ADMIN)
                .orElseThrow(() -> new RuntimeException("Only project admins can create tasks"));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Task task = new Task();
        task.setTitle(taskReq.getTitle());
        task.setDescription(taskReq.getDescription());
        task.setTaskStatus(taskReq.getTaskStatus());
        task.setPriority(taskReq.getPriority());
        task.setDueDate(taskReq.getDueDate());
        task.setProject(project);

        User createdBy = userRepository.findByEmail(taskReq.getCreatedById())
                .orElseThrow(() -> new RuntimeException("User not found"));
        task.setCreatedBy(createdBy);
        task.setCreatedAt(Instant.now());
        task.setIsNew(true);
        task.setLastAssignedAt(Instant.now());

        if (taskReq.getAssigneeId() != null) {
            if (!projectMemberRepository.existsByUserEmailAndProjectId(taskReq.getAssigneeId(), projectId)) {
                throw new RuntimeException("Assignee must be a member of this project");
            }
            User assignee = userRepository.findByEmail(taskReq.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("Assignee not found"));
            task.setAssignee(assignee);
        }

        Task savedTask = taskRepository.save(task);

        messagingTemplate.convertAndSend("/topic/task-created",
                new NotificationDto<>("TASK_CREATED", mapToTaskResponse(savedTask)));

        return mapToTaskResponse(savedTask);
    }

    public List<TaskDto> getTasksByProject(Long projectId, String requestingUserEmail) {
        if (!projectMemberRepository.existsByUserEmailAndProjectId(requestingUserEmail, projectId)) {
            throw new RuntimeException("You are not a member of this project");
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

    public TaskDto getTaskById(Long id) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not Found!"));
        return mapToTaskResponse(task);
    }

    public TaskDto updateTaskById(Long id, TaskDto taskReq) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not Found!"));

        existingTask.setTitle(taskReq.getTitle());
        existingTask.setDescription(taskReq.getDescription());
        existingTask.setTaskStatus(taskReq.getTaskStatus());
        existingTask.setPriority(taskReq.getPriority());
        existingTask.setDueDate(taskReq.getDueDate());
        if (taskReq.getCreatedById() != null) {
            User createdBy = userRepository.findByEmail(taskReq.getCreatedById())
                    .orElseThrow(() -> new RuntimeException("User not Found!"));
            existingTask.setCreatedBy(createdBy);
        }

        if (taskReq.getAssigneeId() != null) {
            Long projectId = existingTask.getProject() != null ? existingTask.getProject().getId() : null;
            if (projectId != null && !projectMemberRepository.existsByUserEmailAndProjectId(taskReq.getAssigneeId(), projectId)) {
                throw new RuntimeException("Assignee must be a member of this project");
            }

            User assignee = userRepository.findByEmail(taskReq.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("Assignee not Found!"));

            if (existingTask.getAssignee() == null || !existingTask.getAssignee().getEmail().equals(assignee.getEmail())) {
                existingTask.setAssignee(assignee);
                existingTask.setLastAssignedAt(Instant.now());
                existingTask.setIsNew(true);
            }
        } else {
            existingTask.setAssignee(null);
        }
        Task updatedTask = taskRepository.save(existingTask);
        TaskDto taskResponse = mapToTaskResponse(updatedTask);
        messagingTemplate.convertAndSend("/topic/task-updated",
                new NotificationDto<>("TASK_UPDATED", taskResponse));
        return taskResponse;
    }

    public TaskDto updateStatusById(Long id, TaskDto taskReq) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not Found!"));

        task.setTaskStatus(taskReq.getTaskStatus());
        Task updatedTask = taskRepository.save(task);

        messagingTemplate.convertAndSend("/topic/task-status-updated",
                new NotificationDto<>("TASK_STATUS_UPDATED", mapToTaskResponse(updatedTask)));

        return mapToTaskResponse(updatedTask);
    }

    public TaskDto updateIsNewState(Long id, TaskDto taskReq) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not Found!"));
        task.setIsNew(taskReq.getIsNew());
        Task updatedTaskState = taskRepository.save(task);
        
        TaskDto response = new TaskDto();
        response.setId(updatedTaskState.getId());
        response.setIsNew(updatedTaskState.getIsNew());
        
        messagingTemplate.convertAndSend("/topic/task-new-state",
                new NotificationDto<>("TASK_NEW_STATE", response));
        return response;
    }

    public TaskDto getIsNewState(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found!"));

        TaskDto response = new TaskDto();
        response.setIsNew(task.getIsNew());
        return response;
    }

    public Task deleteTaskById(Long id) {
        try {
            Optional<Task> taskToDelete = taskRepository.findById(id);
            if (taskToDelete.isPresent()) {
                Task task = taskToDelete.get();
                TaskDto response = mapToTaskResponse(task);
                taskRepository.delete(task);
                System.out.println("Task deleted successfully: " + task.getId());
                messagingTemplate.convertAndSend("/topic/task-deleted",
                        new NotificationDto<>("TASK_DELETED", response.getId()));
                return task;
            } else {
                throw new RuntimeException("Task not found");
            }
        } catch (Exception e) {
            System.err.println("Error deleting task: " + e.getMessage());
            throw e;
        }
    }
}