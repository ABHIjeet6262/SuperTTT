package com.supertictactoe.dto.response;

import java.util.List;

public class GameStateDto {

    private Long gameId;
    private String roomCode;
    private String playerXId;
    private String playerXName;
    private String playerOId;
    private String playerOName;
    private String currentPlayer;
    private int activeBoard;
    private String winner;
    private String status;
    private List<List<String>> boards;
    private List<String> boardStatuses;

    public GameStateDto() {}

    public Long getGameId() { return gameId; }
    public void setGameId(Long gameId) { this.gameId = gameId; }

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

    public List<List<String>> getBoards() { return boards; }
    public void setBoards(List<List<String>> boards) { this.boards = boards; }

    public List<String> getBoardStatuses() { return boardStatuses; }
    public void setBoardStatuses(List<String> boardStatuses) { this.boardStatuses = boardStatuses; }
}
