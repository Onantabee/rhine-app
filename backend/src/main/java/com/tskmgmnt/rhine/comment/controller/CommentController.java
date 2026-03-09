package com.tskmgmnt.rhine.comment.controller;
import com.tskmgmnt.rhine.comment.dto.MarkAsReadDto;
import com.tskmgmnt.rhine.comment.dto.CommentUpdateDto;
import com.tskmgmnt.rhine.comment.dto.CommentDto;
import com.tskmgmnt.rhine.comment.entity.Comment;
import com.tskmgmnt.rhine.comment.service.CommentService;
import com.tskmgmnt.rhine.task.entity.Task;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@Tag(name = "Comments")
@SecurityRequirement(name = "bearerAuth")
public class CommentController {

    private final CommentService commentService;
    private final SimpMessagingTemplate messagingTemplate;

    public CommentController(CommentService commentService, SimpMessagingTemplate messagingTemplate) {
        this.commentService = commentService;
        this.messagingTemplate = messagingTemplate;
    }

    @Operation(
            summary = "Get comments by task ID",
            description = "Retrieves all comments associated with a specific task",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Successfully retrieved comments"),
                    @ApiResponse(responseCode = "404", description = "Task not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")

            }
    )
    @GetMapping("/task/{taskId}")
    public List<CommentDto> getCommentsByTask(@PathVariable Long taskId, Authentication auth) {
        return commentService.getCommentsByTask(taskId, auth.getName());
    }

    @Operation(
            summary = "Get comments by recipient email and project ID",
            description = "Retrieves all comments where the specified user is the recipient within a specific project",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Successfully retrieved comments"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @GetMapping("/recipient/{recipientEmail}/project/{projectId}")
    public List<CommentDto> getCommentsByRecipientAndProject(
            @PathVariable String recipientEmail,
            @PathVariable Long projectId) {
        return commentService.getCommentsByRecipientAndProject(recipientEmail, projectId);
    }

    @Operation(
            summary = "Add a new comment to a task",
            description = "Creates a new comment on the specified task and notifies the recipient",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Successfully created comment"),
                    @ApiResponse(responseCode = "400", description = "Invalid input"),
                    @ApiResponse(responseCode = "404", description = "Task or user not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")

            }
    )
    @PostMapping("/task/{taskId}")
    public Comment addComment(@PathVariable Long taskId, @RequestBody Map<String, String> payload, Authentication auth) {
        return commentService.addComment(
                taskId,
                auth.getName(),
                payload.get("content"),
                payload.get("recipientEmail")
        );
    }

    @Operation(
            summary = "Mark comments as read by recipient",
            description = "Marks all comments for a specific task and recipient as read, and broadcasts the updated unread count via WebSocket",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Successfully marked comments as read"),
                    @ApiResponse(responseCode = "400", description = "Invalid input"),
                    @ApiResponse(responseCode = "404", description = "Task or recipient not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")

            }
    )
    @PostMapping("/mark-as-read-by-recipient/{taskId}")
    public ResponseEntity<Map<String, String>> markCommentsAsReadByRecipients(
            @PathVariable Long taskId,
            @RequestBody Map<String, String> payload
    ) {
        String recipientEmail = payload.get("recipientEmail");
        commentService.markCommentsAsReadByRecipient(taskId, recipientEmail);
        return ResponseEntity.ok(Map.of("message", "Comments marked as read"));
    }

    @Operation(
            summary = "Count unread comments by recipient",
            description = "Returns the count of unread comments for a specific recipient in a task",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Successfully retrieved unread count"),
                    @ApiResponse(responseCode = "404", description = "Task or recipient not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")

            }
    )
    @GetMapping("/count-unread-by-recipient/{taskId}/{recipientEmail}")
    public ResponseEntity<Map<String, Long>> countUnreadCommentsByRecipients(
            @PathVariable Long taskId,
            @PathVariable String recipientEmail
    ) {
        long count = commentService.countUnreadCommentsByRecipient(recipientEmail, taskId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    @Operation(
            summary = "Mark a single comment as read",
            description = "Marks a specific comment as read by a user",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Successfully marked comment as read"),
                    @ApiResponse(responseCode = "400", description = "Invalid input"),
                    @ApiResponse(responseCode = "404", description = "Comment or user not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")

            }
    )
    @PostMapping("/mark-as-read/{commentId}")
    public ResponseEntity<Map<String, String>> markCommentAsRead(
            @PathVariable Long commentId,
            @RequestBody MarkAsReadDto markAsReadDto) {
        commentService.markCommentAsRead(commentId, markAsReadDto.getUserEmail());
        return ResponseEntity.ok(Map.of("message", "Comment marked as read"));
    }

    @Operation(
            summary = "Update a comment by ID",
            description = "Updates the content of an existing comment",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Successfully updated comment"),
                    @ApiResponse(responseCode = "400", description = "Invalid input"),
                    @ApiResponse(responseCode = "404", description = "Comment not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")

            }
    )
    @PutMapping("/{commentId}")
    public Comment updateCommentById(@PathVariable Long commentId, @RequestBody CommentUpdateDto commentUpdateDto, Authentication auth) {
        return commentService.updateCommentById(commentId, commentUpdateDto, auth.getName());
    }

    @Operation(
            summary = "Delete a comment by ID",
            description = "Deletes a specific comment from the system",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Successfully deleted comment"),
                    @ApiResponse(responseCode = "404", description = "Comment not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")

            }
    )
    @DeleteMapping("/{commentId}")
    public Comment deleteCommentById(@PathVariable Long commentId, Authentication auth) {
        return commentService.deleteCommentById(commentId, auth.getName());
    }
}