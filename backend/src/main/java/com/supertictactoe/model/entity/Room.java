package com.supertictactoe.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_code", nullable = false, unique = true, length = 10)
    private String roomCode;

    @Column(nullable = false, length = 20)
    private String status; // WAITING, PLAYING, FINISHED, EXPIRED

    @Column(name = "creator_id", nullable = false, length = 50)
    private String creatorId;

    @Column(name = "creator_name", nullable = false, length = 50)
    private String creatorName;

    @Column(name = "opponent_id", length = 50)
    private String opponentId;

    @Column(name = "opponent_name", length = 50)
    private String opponentName;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        // Default expiration: 10 minutes from creation
        this.expiresAt = this.createdAt.plusMinutes(10);
    }

    public Room() {}

    public Room(String roomCode, String creatorId, String creatorName) {
        this.roomCode = roomCode;
        this.creatorId = creatorId;
        this.creatorName = creatorName;
        this.status = "WAITING";
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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
