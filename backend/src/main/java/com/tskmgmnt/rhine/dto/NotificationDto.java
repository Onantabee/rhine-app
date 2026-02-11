package com.tskmgmnt.rhine.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;


public class NotificationDto<T> {
    @Schema(description = "Type of the event", example = "TASK_ASSIGNED")
    private String eventType;

    @Schema(description = "Payload of the notification")
    private T payload;

    @Schema(description = "Timestamp of the notification", example = "2023-11-21T10:00:00")
    private LocalDateTime timestamp;


    public NotificationDto(String eventType, T payload) {
        this.eventType = eventType;
        this.payload = payload;
        this.timestamp = LocalDateTime.now();
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public T getPayload() {
        return payload;
    }

    public void setPayload(T payload) {
        this.payload = payload;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}