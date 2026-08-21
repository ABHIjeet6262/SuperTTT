package com.supertictactoe.dto.request;

import jakarta.validation.constraints.NotBlank;

public class JoinRoomRequest {

    @NotBlank(message = "Opponent ID is required")
    private String opponentId;

    @NotBlank(message = "Opponent Name is required")
    private String opponentName;

    public JoinRoomRequest() {}

    public JoinRoomRequest(String opponentId, String opponentName) {
        this.opponentId = opponentId;
        this.opponentName = opponentName;
    }

    public String getOpponentId() { return opponentId; }
    public void setOpponentId(String opponentId) { this.opponentId = opponentId; }

    public String getOpponentName() { return opponentName; }
    public void setOpponentName(String opponentName) { this.opponentName = opponentName; }
}
