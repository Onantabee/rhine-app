package com.tskmgmnt.rhine.dto;

public class CreateProjectReq {
    private String name;

    public CreateProjectReq() {}

    public CreateProjectReq(String name) {
        this.name = name;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
