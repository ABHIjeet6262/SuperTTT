package com.supertictactoe.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "games")
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_code", nullable = false, length = 10)
    private String roomCode;

    @Column(name = "player_x_id", nullable = false, length = 50)
    private String playerXId;

    @Column(name = "player_x_name", nullable = false, length = 50)
    private String playerXName;

    @Column(name = "player_o_id", nullable = false, length = 50)
    private String playerOId;

    @Column(name = "player_o_name", nullable = false, length = 50)
    private String playerOName;

    @Column(name = "current_player", nullable = false, length = 1)
    private String currentPlayer = "X";

    @Column(name = "active_board")
    private int activeBoard = -1;

    @Column(length = 10)
    private String winner;

    @Column(nullable = false, length = 20)
    private String status = "PLAYING";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Game() {}

    public Game(String roomCode, String playerXId, String playerXName, String playerOId, String playerOName) {
        this.roomCode = roomCode;
        this.playerXId = playerXId;
        this.playerXName = playerXName;
        this.playerOId = playerOId;
        this.playerOName = playerOName;
        this.currentPlayer = "X";
        this.activeBoard = -1;
        this.status = "PLAYING";
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRoomCode() { return roomCode; }
    public void setRoomCode(String roomCode) { this.roomCode = roomCode; }

    public String getPlayerXId() { return playerXId; }
    public void setPlayerXId(String playerXId) { this.playerXId = playerXId; }

    public String getPlayerXName() { return playerXName; }
    public void setPlayerXName(String playerXName) { this.playerXName = playerXName; }

    public String getPlayerOId() { return playerOId; }
    public void setPlayerOId(String playerOId) { this.playerOId = playerOId; }

    public String getPlayerOName() { return playerOName; }
    public void setPlayerOName(String playerOName) { this.playerOName = playerOName; }

    public String getCurrentPlayer() { return currentPlayer; }
    public void setCurrentPlayer(String currentPlayer) { this.currentPlayer = currentPlayer; }

    public int getActiveBoard() { return activeBoard; }
    public void setActiveBoard(int activeBoard) { this.activeBoard = activeBoard; }

    public String getWinner() { return winner; }
    public void setWinner(String winner) { this.winner = winner; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
