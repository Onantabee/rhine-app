package com.tskmgmnt.rhine.project.repository;
import com.tskmgmnt.rhine.project.entity.Project;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    @Query("SELECT p, (SELECT COUNT(m) FROM ProjectMember m WHERE m.project = p AND m.status = 'ACTIVE') " +
           "FROM Project p JOIN p.members mem WHERE mem.user.email = :email AND mem.status = 'ACTIVE'")
    List<Object[]> findProjectsWithMemberCountByUserEmail(@Param("email") String email);
}
