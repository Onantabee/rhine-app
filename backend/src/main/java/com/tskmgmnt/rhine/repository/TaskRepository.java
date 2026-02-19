package com.tskmgmnt.rhine.repository;

import com.tskmgmnt.rhine.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectId(Long projectId);

    List<Task> findByProjectIdAndAssigneeEmail(Long projectId, String assigneeEmail);

    long countByProjectIdAndAssigneeEmailAndTaskStatusNot(Long projectId, String assigneeEmail, com.tskmgmnt.rhine.enums.TaskStatus status);
}
