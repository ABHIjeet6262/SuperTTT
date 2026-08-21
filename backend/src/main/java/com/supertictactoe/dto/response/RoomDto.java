package com.supertictactoe.dto.response;

import java.time.LocalDateTime;

public class RoomDto {

    private String roomCode;
    private String status; // WAITING, PLAYING, FINISHED, EXPIRED
    private String creatorId;
    private String creatorName;
    private String opponentId;
    private String opponentName;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;

    public RoomDto() {}

    public RoomDto(String roomCode, String status, String creatorId, String creatorName,
                   String opponentId, String opponentName, LocalDateTime createdAt, LocalDateTime expiresAt) {
        this.roomCode = roomCode;
        this.status = status;
        this.creatorId = creatorId;
        this.creatorName = creatorName;
        this.opponentId = opponentId;
        this.opponentName = opponentName;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
    }

    public String getRoomCode() { return roomCode; }
    public void setRoomCode(String roomCode) { this.roomCode = roomCode; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCreatorId() { return creatorId; }
    public void setCreatorId(String creatorId) { this.creatorId = creatorId; }

    public String getCreatorName() { return creatorName; }
    public void setCreatorName(String creatorName) { this.creatorName = creatorName; }

    public String getOpponentId() { return opponentId; }
    public void setOpponentId(String opponentId) { this.opponentId = opponentId; }

    public String getOpponentName() { return opponentName; }
    public void setOpponentName(String opponentName) { this.opponentName = opponentName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
}
