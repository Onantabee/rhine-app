package com.tskmgmnt.rhine.comment.repository;

import com.tskmgmnt.rhine.comment.entity.Comment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT c FROM Comment c WHERE c.task.id = :taskId")
    List<Comment> findByTaskId(@Param("taskId") Long taskId);

    List<Comment> findByRecipientEmail(String recipientEmail);

    @Query("SELECT c FROM Comment c WHERE c.task.id = :taskId AND c.recipient.email = :recipientEmail AND c.isReadByRecipient = false")
    List<Comment> findByTaskIdAndRecipientEmailAndIsReadByRecipientFalse(
            @Param("taskId") Long taskId,
            @Param("recipientEmail") String recipientEmail);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.task.id = :taskId AND c.recipient.email = :recipientEmail AND c.isReadByRecipient = false")
    long countByTaskIdAndRecipientEmailAndIsReadByRecipientFalse(
            @Param("taskId") Long taskId,
            @Param("recipientEmail") String recipientEmail);
}
