package com.tskmgmnt.rhine.project.dto;
import com.tskmgmnt.rhine.project.entity.Project;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateProjectReq {
    @NotBlank(message = "Project name is required")
    @Size(max = 100, message = "Project name must be less than 100 characters")
    private String name;

    public CreateProjectReq() {}

    public CreateProjectReq(String name) {
        this.name = name;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
