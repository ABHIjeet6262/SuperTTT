package com.supertictactoe.dto.request;

import jakarta.validation.constraints.NotBlank;

public class CreateRoomRequest {

    @NotBlank(message = "Creator ID is required")
    private String creatorId;

    @NotBlank(message = "Creator Name is required")
    private String creatorName;

    public CreateRoomRequest() {}

    public CreateRoomRequest(String creatorId, String creatorName) {
        this.creatorId = creatorId;
        this.creatorName = creatorName;
    }

    public String getCreatorId() { return creatorId; }
    public void setCreatorId(String creatorId) { this.creatorId = creatorId; }

    public String getCreatorName() { return creatorName; }
    public void setCreatorName(String creatorName) { this.creatorName = creatorName; }
}
