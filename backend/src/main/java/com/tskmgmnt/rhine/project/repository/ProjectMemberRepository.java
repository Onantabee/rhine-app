package com.tskmgmnt.rhine.project.repository;
import com.tskmgmnt.rhine.project.enums.ProjectRole;
import com.tskmgmnt.rhine.project.entity.ProjectMember;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

    List<ProjectMember> findByUserEmail(String email);

    List<ProjectMember> findByProjectId(Long projectId);

    Optional<ProjectMember> findByUserEmailAndProjectId(String email, Long projectId);

    Optional<ProjectMember> findByToken(String token);

    boolean existsByUserEmailAndProjectId(String email, Long projectId);
}
