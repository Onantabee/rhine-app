package com.tskmgmnt.rhine.comment.service;

import com.tskmgmnt.rhine.notification.dto.NotificationDto;
import com.tskmgmnt.rhine.user.entity.User;
import com.tskmgmnt.rhine.user.repository.UserRepository;
import com.tskmgmnt.rhine.comment.dto.CommentUpdateDto;
import com.tskmgmnt.rhine.comment.dto.CommentDto;
import com.tskmgmnt.rhine.comment.entity.Comment;
import com.tskmgmnt.rhine.comment.repository.CommentRepository;
import com.tskmgmnt.rhine.project.repository.ProjectMemberRepository;
import com.tskmgmnt.rhine.task.entity.Task;
import com.tskmgmnt.rhine.task.repository.TaskRepository;

import com.tskmgmnt.rhine.core.exception.ResourceNotFoundException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class CommentService {

    private final SimpMessagingTemplate messagingTemplate;
    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;

    public CommentService(SimpMessagingTemplate messagingTemplate, 
                          CommentRepository commentRepository, 
                          TaskRepository taskRepository, 
                          UserRepository userRepository,
                          ProjectMemberRepository projectMemberRepository) {
        this.messagingTemplate = messagingTemplate;
        this.commentRepository = commentRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.projectMemberRepository = projectMemberRepository;
    }

    public CommentDto mapToDto(Comment comment) {
        CommentDto dto = new CommentDto(
                comment.getId(),
                comment.getContent(),
                comment.getAuthor().getEmail(),
                comment.getRecipient() != null ? comment.getRecipient().getEmail() : null,
                comment.isReadByRecipient(),
                comment.getCreatedAt()
        );
        dto.setTaskId(comment.getTask().getId());
        return dto;
    }

    public List<CommentDto> getCommentsByTask(Long taskId, String requestingUserEmail) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (task.getProject() != null && !projectMemberRepository.existsByUserEmailAndProjectId(requestingUserEmail, task.getProject().getId())) {
            throw new ResourceNotFoundException("Task not found");
        }

        List<Comment> comments = commentRepository.findByTaskId(taskId);
        return comments.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<Comment> getCommentsByRecipient(String recipientEmail) {
        return commentRepository.findByRecipientEmail(recipientEmail);
    }

    public Comment addComment(Long taskId, String authorEmail, String content, String recipientEmail) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (task.getProject() != null && !projectMemberRepository.existsByUserEmailAndProjectId(authorEmail, task.getProject().getId())) {
            throw new ResourceNotFoundException("Task not found");
        }

        User author = userRepository.findByEmail(authorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        User recipient = (recipientEmail != null) ?
                userRepository.findByEmail(recipientEmail).orElse(null) : null;

        Comment comment = new Comment(content, author, task, recipient);

        Comment savedComment = commentRepository.save(comment);

        CommentDto commentDto = mapToDto(savedComment);

        messagingTemplate.convertAndSend("/topic/comments", commentDto);

        Set<String> notifyEmails = new HashSet<>();
        if (recipient != null) {
            notifyEmails.add(recipient.getEmail());
        }
        notifyEmails.add(task.getCreatedBy().getEmail());

        for (String email : notifyEmails) {
            long count = countUnreadCommentsByRecipient(email, taskId);
            messagingTemplate.convertAndSend(
                    "/topic/unread-updates",
                    Map.of("taskId", taskId, "count", count, "recipientEmail", email)
            );
        }

        return savedComment;
    }

    public void markCommentAsRead(Long commentId, String userEmail) {
        Optional<Comment> optionalComment = commentRepository.findById(commentId);
        if (optionalComment.isPresent()) {
            Comment comment = optionalComment.get();
            if (comment.getRecipient() != null &&
                    comment.getRecipient().getEmail().equals(userEmail)) {
                comment.setReadByRecipient(true);
                commentRepository.save(comment);
                messagingTemplate.convertAndSend("/topic/comments-read",
                        new NotificationDto<>("COMMENTS_READ", mapToDto(comment)));
            }
        }
    }

    public void markCommentsAsReadByRecipient(Long taskId, String recipientEmail) {
        List<Comment> recipientComments = commentRepository.findByTaskIdAndRecipientEmailAndIsReadByRecipientFalse(taskId, recipientEmail);
        recipientComments.forEach(comment -> {
            comment.setReadByRecipient(true);
            commentRepository.save(comment);
            messagingTemplate.convertAndSend("/topic/comments-read-by-recipient",
                    new NotificationDto<>("COMMENTS_READ_BY_RECIPIENTS", mapToDto(comment)));
        });
    }

    public long countUnreadCommentsByRecipient(String recipientEmail, Long taskId) {
        return commentRepository.countByTaskIdAndRecipientEmailAndIsReadByRecipientFalse(taskId, recipientEmail);
    }

    public Comment updateCommentById(Long id, CommentUpdateDto commentUpdateDto) {
        Comment existingComment = commentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        existingComment.setContent(commentUpdateDto.getContent());
        Comment updatedComment = commentRepository.save(existingComment);

        messagingTemplate.convertAndSend("/topic/comment-update", mapToDto(updatedComment));
        return commentRepository.save(existingComment);
    }

    public Comment deleteCommentById(Long id) {
        Comment commentToDelete = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        
        Long taskId = commentToDelete.getTask().getId();
        String recipientEmail = commentToDelete.getRecipient() != null ? 
                commentToDelete.getRecipient().getEmail() : null;

        commentRepository.delete(commentToDelete);

        messagingTemplate.convertAndSend("/topic/comment-deletion",
                Map.of("commentId", id, "taskId", taskId));

        if (recipientEmail != null) {
            long newCount = countUnreadCommentsByRecipient(recipientEmail, taskId);
            messagingTemplate.convertAndSend(
                    "/topic/unread-updates",
                    Map.of("taskId", taskId, "count", newCount, "recipientEmail", recipientEmail)
            );
        }

        return commentToDelete;
    }
}
