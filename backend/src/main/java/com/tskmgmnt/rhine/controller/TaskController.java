package com.tskmgmnt.rhine.controller;

import com.tskmgmnt.rhine.dto.TaskDto;
import com.tskmgmnt.rhine.entity.Task;
import com.tskmgmnt.rhine.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/tasks")
@Tag(
        name = "CRUD REST APIs for Task Management",
        description = "CRUD REST APIs - Create Task, Update Task, Get Task, Get All Tasks, Delete Task, Update Task Status"
)
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @Operation(
            summary = "Create a new task within a project",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Task created successfully"),
                    @ApiResponse(responseCode = "403", description = "Not authorized"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PostMapping
    public TaskDto createTask(@PathVariable Long projectId,
                              @RequestBody TaskDto request,
                              Authentication auth) {
        return taskService.createTask(projectId, request, auth.getName());
    }

    @Operation(
            summary = "Get all tasks in a project",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Successfully retrieved tasks"),
                    @ApiResponse(responseCode = "403", description = "Not authorized"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @GetMapping
    public List<TaskDto> getTasks(@PathVariable Long projectId, Authentication auth) {
        return taskService.getTasksByProject(projectId, auth.getName());
    }

    @Operation(summary = "Get task by ID")
    @GetMapping("/{id}")
    public TaskDto getTaskById(@PathVariable Long projectId, @PathVariable Long id) {
        return taskService.getTaskById(id);
    }

    @Operation(summary = "Update task details")
    @PutMapping("/{id}")
    public TaskDto updateTask(@PathVariable Long projectId,
                              @PathVariable Long id,
                              @RequestBody TaskDto taskReq) {
        return taskService.updateTaskById(id, taskReq);
    }

    @Operation(summary = "Update task status")
    @PutMapping("/{id}/status")
    public TaskDto updateTaskStatus(@PathVariable Long projectId,
                                    @PathVariable Long id,
                                    @RequestBody TaskDto taskReq) {
        return taskService.updateStatusById(id, taskReq);
    }

    @Operation(summary = "Update task 'is new' state")
    @PutMapping("/{id}/is-new")
    public TaskDto updateTaskNewState(@PathVariable Long projectId,
                                      @PathVariable Long id,
                                      @RequestBody TaskDto taskReq) {
        return taskService.updateIsNewState(id, taskReq);
    }

    @Operation(summary = "Get task 'is new' state")
    @GetMapping("/{id}/is-new")
    public TaskDto getIsNewState(@PathVariable Long projectId, @PathVariable Long id) {
        return taskService.getIsNewState(id);
    }

    @Operation(summary = "Delete a task")
    @DeleteMapping("/{id}")
    public Task deleteTask(@PathVariable Long projectId, @PathVariable Long id) {
        return taskService.deleteTaskById(id);
    }
}