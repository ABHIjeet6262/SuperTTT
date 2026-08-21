package com.supertictactoe.websocket;

import com.supertictactoe.dto.response.GameStateDto;

import java.time.LocalDateTime;

public class WSMessage {

    private WSEventType type;
    private String roomCode;
    private String playerId;
    private String playerName;
    private int boardIndex;
    private int cellIndex;
    private String reaction;
    private GameStateDto gameState;
    private String message;
    private String timestamp;

    public WSMessage() {
        this.timestamp = LocalDateTime.now().toString();
    }

    public WSMessage(WSEventType type, String roomCode, String playerId, String playerName) {
        this();
        this.type = type;
        this.roomCode = roomCode;
        this.playerId = playerId;
        this.playerName = playerName;
    }

    public WSEventType getType() { return type; }
    public void setType(WSEventType type) { this.type = type; }

    public String getRoomCode() { return roomCode; }
    public void setRoomCode(String roomCode) { this.roomCode = roomCode; }

    public String getPlayerId() { return playerId; }
    public void setPlayerId(String playerId) { this.playerId = playerId; }

    public String getPlayerName() { return playerName; }
    public void setPlayerName(String playerName) { this.playerName = playerName; }

    public int getBoardIndex() { return boardIndex; }
    public void setBoardIndex(int boardIndex) { this.boardIndex = boardIndex; }

    public int getCellIndex() { return cellIndex; }
    public void setCellIndex(int cellIndex) { this.cellIndex = cellIndex; }

    public String getReaction() { return reaction; }
    public void setReaction(String reaction) { this.reaction = reaction; }

    public GameStateDto getGameState() { return gameState; }
    public void setGameState(GameStateDto gameState) { this.gameState = gameState; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}
