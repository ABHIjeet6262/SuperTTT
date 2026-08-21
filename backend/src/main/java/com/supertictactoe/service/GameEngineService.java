package com.supertictactoe.service;

import com.supertictactoe.exception.InvalidMoveException;
import com.supertictactoe.model.entity.Game;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class GameEngineService {

    public static final int[][] WINNING_COMBINATIONS = {
        {0, 1, 2}, {3, 4, 5}, {6, 7, 8}, // Rows
        {0, 3, 6}, {1, 4, 7}, {2, 5, 8}, // Columns
        {0, 4, 8}, {2, 4, 6}              // Diagonals
    };

    /**
     * Checks if a 3x3 small board is won or drawn.
     */
    public String checkBoardWinner(List<String> board) {
        for (int[] combo : WINNING_COMBINATIONS) {
            String a = board.get(combo[0]);
            String b = board.get(combo[1]);
            String c = board.get(combo[2]);

            if (!a.isEmpty() && a.equals(b) && a.equals(c)) {
                return a.equals("X") ? "WON_X" : "WON_O";
            }
        }

        // Check if board is full (Draw)
        boolean isFull = board.stream().noneMatch(String::isEmpty);
        if (isFull) {
            return "DRAW";
        }

        return "IN_PROGRESS";
    }

    /**
     * Checks if overall 9x9 game is won or drawn.
     */
    public String checkOverallWinner(List<String> boardStatuses) {
        for (int[] combo : WINNING_COMBINATIONS) {
            String a = boardStatuses.get(combo[0]);
            String b = boardStatuses.get(combo[1]);
            String c = boardStatuses.get(combo[2]);

            if ((a.equals("WON_X") || a.equals("WON_O")) && a.equals(b) && a.equals(c)) {
                return a.equals("WON_X") ? "X" : "O";
            }
        }

        // Check if all small boards are completed
        boolean allFinished = boardStatuses.stream().noneMatch(s -> s.equals("IN_PROGRESS"));
        if (allFinished) {
            return "DRAW";
        }

        return null;
    }

    /**
     * Creates clean 81-cell board grid.
     */
    public List<List<String>> createEmptyBoards() {
        List<List<String>> boards = new ArrayList<>();
        for (int i = 0; i < 9; i++) {
            boards.add(new ArrayList<>(Collections.nCopies(9, "")));
        }
        return boards;
    }

    /**
     * Creates initial board statuses list.
     */
    public List<String> createInitialBoardStatuses() {
        return new ArrayList<>(Collections.nCopies(9, "IN_PROGRESS"));
    }

    /**
     * Authoritative Move Validation and Execution on Server
     */
    public void validateMove(Game game, int boardIndex, int cellIndex, String playerId, 
                             List<List<String>> boards, List<String> boardStatuses) {
        // 1. Validate Game Status
        if (!"PLAYING".equals(game.getStatus())) {
            throw new InvalidMoveException("Game has already ended.");
        }

        // 2. Validate Player Turn
        String expectedPlayerId = "X".equals(game.getCurrentPlayer()) ? game.getPlayerXId() : game.getPlayerOId();
        if (!expectedPlayerId.equals(playerId)) {
            throw new InvalidMoveException("It is not your turn!");
        }

        // 3. Validate Board Index bounds
        if (boardIndex < 0 || boardIndex > 8 || cellIndex < 0 || cellIndex > 8) {
            throw new InvalidMoveException("Board or Cell index out of bounds.");
        }

        // 4. Validate Active Board constraint
        if (game.getActiveBoard() != -1 && game.getActiveBoard() != boardIndex) {
            throw new InvalidMoveException("Must play in Board " + (game.getActiveBoard() + 1));
        }

        // 5. Validate Target Board is in progress
        if (!"IN_PROGRESS".equals(boardStatuses.get(boardIndex))) {
            throw new InvalidMoveException("This small board is already completed.");
        }

        // 6. Validate Target Cell is empty
        if (!boards.get(boardIndex).get(cellIndex).isEmpty()) {
            throw new InvalidMoveException("This cell is already occupied.");
        }
    }
}
