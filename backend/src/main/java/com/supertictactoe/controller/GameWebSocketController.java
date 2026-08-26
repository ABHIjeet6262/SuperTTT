package com.supertictactoe.controller;

import com.supertictactoe.dto.response.GameStateDto;
import com.supertictactoe.exception.InvalidMoveException;
import com.supertictactoe.model.entity.Game;
import com.supertictactoe.repository.GameRepository;
import com.supertictactoe.service.GameEngineService;
import com.supertictactoe.websocket.WSEventType;
import com.supertictactoe.websocket.WSMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class GameWebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private GameEngineService gameEngineService;

    private final Map<String, List<List<String>>> activeGameBoards = new ConcurrentHashMap<>();
    private final Map<String, List<String>> activeBoardStatuses = new ConcurrentHashMap<>();
    private final Map<String, String> rematchRequests = new ConcurrentHashMap<>();

    /**
     * Resolve the server-authoritative player ID.
     * If the STOMP session carries a JWT-bound Principal (authenticated or guest
     * with a server-issued token), use that. Otherwise fall back to the client-supplied
     * playerId only for legacy/guest sessions that have not sent a token on CONNECT.
     */
    private String resolvePlayerId(Principal principal, WSMessage message) {
        if (principal != null && principal.getName() != null && !principal.getName().isBlank()) {
            return principal.getName();
        }
        // Fallback: unauthenticated guest — still subject to room participant check
        return message.getPlayerId();
    }

    @MessageMapping("/game/{roomCode}/join")
    public void handleJoin(@DestinationVariable String roomCode,
                           @Payload WSMessage message,
                           Principal principal) {
        Game game = gameRepository.findByRoomCode(roomCode).orElse(null);
        if (game == null) return;

        activeGameBoards.putIfAbsent(roomCode, gameEngineService.createEmptyBoards());
        activeBoardStatuses.putIfAbsent(roomCode, gameEngineService.createInitialBoardStatuses());

        String playerId = resolvePlayerId(principal, message);

        WSMessage broadcast = new WSMessage(WSEventType.PLAYER_JOINED, roomCode, playerId, message.getPlayerName());
        broadcast.setGameState(buildGameStateDto(game, activeGameBoards.get(roomCode), activeBoardStatuses.get(roomCode)));

        messagingTemplate.convertAndSend("/topic/room/" + roomCode, broadcast);
    }

    @MessageMapping("/game/{roomCode}/move")
    @Transactional
    public void handleMove(@DestinationVariable String roomCode,
                           @Payload WSMessage message,
                           Principal principal) {
        Game game = gameRepository.findByRoomCode(roomCode)
                .orElseThrow(() -> new InvalidMoveException("Game not found for room: " + roomCode));

        // Resolve player identity from server-bound session, not client payload
        String senderId = resolvePlayerId(principal, message);

        // Strictly verify sender is a registered participant in this game
        if (!senderId.equals(game.getPlayerXId()) && !senderId.equals(game.getPlayerOId())) {
            throw new InvalidMoveException("You are not a participant in this game.");
        }

        List<List<String>> boards = activeGameBoards.computeIfAbsent(roomCode, k -> gameEngineService.createEmptyBoards());
        List<String> boardStatuses = activeBoardStatuses.computeIfAbsent(roomCode, k -> gameEngineService.createInitialBoardStatuses());

        int boardIndex = message.getBoardIndex();
        int cellIndex = message.getCellIndex();

        // Authoritative server-side move validation (turn, bounds, board status, cell occupancy)
        gameEngineService.validateMove(game, boardIndex, cellIndex, senderId, boards, boardStatuses);

        String symbol = game.getCurrentPlayer();
        boards.get(boardIndex).set(cellIndex, symbol);

        String boardResult = gameEngineService.checkBoardWinner(boards.get(boardIndex));
        boardStatuses.set(boardIndex, boardResult);

        String overallWinner = gameEngineService.checkOverallWinner(boardStatuses);
        if (overallWinner != null) {
            game.setWinner(overallWinner);
            game.setStatus("FINISHED");
        }

        int targetNextBoard = cellIndex;
        if ("IN_PROGRESS".equals(boardStatuses.get(targetNextBoard))) {
            game.setActiveBoard(targetNextBoard);
        } else {
            game.setActiveBoard(-1);
        }

        game.setCurrentPlayer("X".equals(symbol) ? "O" : "X");
        gameRepository.save(game);

        WSEventType eventType = WSEventType.MOVE_MADE;
        if (overallWinner != null) {
            eventType = "DRAW".equals(overallWinner) ? WSEventType.GAME_DRAW : WSEventType.GAME_WON;
        }

        WSMessage broadcast = new WSMessage(eventType, roomCode, senderId, message.getPlayerName());
        broadcast.setBoardIndex(boardIndex);
        broadcast.setCellIndex(cellIndex);
        broadcast.setGameState(buildGameStateDto(game, boards, boardStatuses));

        messagingTemplate.convertAndSend("/topic/room/" + roomCode, broadcast);
    }

    @MessageMapping("/game/{roomCode}/reaction")
    public void handleReaction(@DestinationVariable String roomCode,
                               @Payload WSMessage message,
                               Principal principal) {
        Game game = gameRepository.findByRoomCode(roomCode).orElse(null);
        if (game == null) return;

        String senderId = resolvePlayerId(principal, message);

        // Only actual room players can broadcast reactions
        if (!senderId.equals(game.getPlayerXId()) && !senderId.equals(game.getPlayerOId())) return;

        WSMessage broadcast = new WSMessage(WSEventType.REACTION_SENT, roomCode, senderId, message.getPlayerName());
        broadcast.setReaction(message.getReaction());

        messagingTemplate.convertAndSend("/topic/room/" + roomCode, broadcast);
    }

    @MessageMapping("/game/{roomCode}/rematch")
    @Transactional
    public void handleRematch(@DestinationVariable String roomCode,
                              @Payload WSMessage message,
                              Principal principal) {
        Game game = gameRepository.findByRoomCode(roomCode).orElse(null);
        if (game == null) return;

        String senderId = resolvePlayerId(principal, message);

        // Only actual room players can request or accept a rematch
        if (!senderId.equals(game.getPlayerXId()) && !senderId.equals(game.getPlayerOId())) return;

        String existingRequestPlayer = rematchRequests.get(roomCode);

        if (existingRequestPlayer == null) {
            rematchRequests.put(roomCode, senderId);
            WSMessage broadcast = new WSMessage(WSEventType.REMATCH_REQUESTED, roomCode, senderId, message.getPlayerName());
            messagingTemplate.convertAndSend("/topic/room/" + roomCode, broadcast);
        } else if (!existingRequestPlayer.equals(senderId)) {
            rematchRequests.remove(roomCode);

            String oldXId = game.getPlayerXId();
            String oldXName = game.getPlayerXName();
            game.setPlayerXId(game.getPlayerOId());
            game.setPlayerXName(game.getPlayerOName());
            game.setPlayerOId(oldXId);
            game.setPlayerOName(oldXName);

            game.setCurrentPlayer("X");
            game.setActiveBoard(-1);
            game.setWinner(null);
            game.setStatus("PLAYING");
            gameRepository.save(game);

            activeGameBoards.put(roomCode, gameEngineService.createEmptyBoards());
            activeBoardStatuses.put(roomCode, gameEngineService.createInitialBoardStatuses());

            WSMessage broadcast = new WSMessage(WSEventType.GAME_RESTARTED, roomCode, senderId, message.getPlayerName());
            broadcast.setGameState(buildGameStateDto(game, activeGameBoards.get(roomCode), activeBoardStatuses.get(roomCode)));

            messagingTemplate.convertAndSend("/topic/room/" + roomCode, broadcast);
        }
    }

    private GameStateDto buildGameStateDto(Game game, List<List<String>> boards, List<String> boardStatuses) {
        GameStateDto dto = new GameStateDto();
        dto.setGameId(game.getId());
        dto.setRoomCode(game.getRoomCode());
        dto.setPlayerXId(game.getPlayerXId());
        dto.setPlayerXName(game.getPlayerXName());
        dto.setPlayerOId(game.getPlayerOId());
        dto.setPlayerOName(game.getPlayerOName());
        dto.setCurrentPlayer(game.getCurrentPlayer());
        dto.setActiveBoard(game.getActiveBoard());
        dto.setWinner(game.getWinner());
        dto.setStatus(game.getStatus());
        dto.setBoards(boards);
        dto.setBoardStatuses(boardStatuses);
        return dto;
    }
}
