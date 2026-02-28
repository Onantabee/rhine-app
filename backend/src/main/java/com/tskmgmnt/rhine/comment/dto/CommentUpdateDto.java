package com.tskmgmnt.rhine.comment.dto;

import io.swagger.v3.oas.annotations.media.Schema;


public class CommentUpdateDto {
    @Schema(description = "Updated content of the comment", example = "Updated comment content.")
    private String content;


    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
