package com.tskmgmnt.rhine.repository;

import com.tskmgmnt.rhine.entity.ProjectMember;
import com.tskmgmnt.rhine.enums.ProjectRole;
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
