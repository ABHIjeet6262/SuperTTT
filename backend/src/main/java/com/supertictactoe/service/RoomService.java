package com.supertictactoe.service;

import com.supertictactoe.dto.request.CreateRoomRequest;
import com.supertictactoe.dto.request.JoinRoomRequest;
import com.supertictactoe.dto.response.RoomDto;
import com.supertictactoe.exception.RoomException;
import com.supertictactoe.model.entity.Game;
import com.supertictactoe.model.entity.Room;
import com.supertictactoe.repository.GameRepository;
import com.supertictactoe.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private GameRepository gameRepository;

    private static final String CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final SecureRandom secureRandom = new SecureRandom();

    public String generateUniqueRoomCode() {
        StringBuilder code = new StringBuilder(6);
        do {
            code.setLength(0);
            for (int i = 0; i < 6; i++) {
                code.append(CHARACTERS.charAt(secureRandom.nextInt(CHARACTERS.length())));
            }
        } while (roomRepository.findByRoomCode(code.toString()).isPresent());

        return code.toString();
    }

    @Transactional
    public RoomDto createRoom(CreateRoomRequest request) {
        String roomCode = generateUniqueRoomCode();
        Room room = new Room(roomCode, request.getCreatorId(), request.getCreatorName());
        Room savedRoom = roomRepository.save(room);

        return mapToDto(savedRoom);
    }

    public RoomDto getRoomByCode(String roomCode) {
        Room room = roomRepository.findByRoomCode(roomCode.toUpperCase())
                .orElseThrow(() -> new RoomException("Room not found with code: " + roomCode));

        if (room.getExpiresAt() != null && room.getExpiresAt().isBefore(LocalDateTime.now())) {
            room.setStatus("EXPIRED");
            roomRepository.save(room);
            throw new RoomException("This room has expired.");
        }

        return mapToDto(room);
    }

    @Transactional
    public RoomDto joinRoom(String roomCode, JoinRoomRequest request) {
        Room room = roomRepository.findByRoomCode(roomCode.toUpperCase())
                .orElseThrow(() -> new RoomException("Room not found with code: " + roomCode));

        if ("EXPIRED".equals(room.getStatus()) || (room.getExpiresAt() != null && room.getExpiresAt().isBefore(LocalDateTime.now()))) {
            throw new RoomException("This room has expired.");
        }

        if ("PLAYING".equals(room.getStatus()) || room.getOpponentId() != null) {
            throw new RoomException("Room is full.");
        }

        if (room.getCreatorId().equals(request.getOpponentId())) {
            throw new RoomException("You cannot join your own room as an opponent.");
        }

        room.setOpponentId(request.getOpponentId());
        room.setOpponentName(request.getOpponentName());
        room.setStatus("PLAYING");
        Room updatedRoom = roomRepository.save(room);

        // Initialize Game Entity for 2 players
        if (gameRepository.findByRoomCode(roomCode).isEmpty()) {
            Game game = new Game(
                    roomCode,
                    room.getCreatorId(),
                    room.getCreatorName(),
                    request.getOpponentId(),
                    request.getOpponentName()
            );
            gameRepository.save(game);
        }

        return mapToDto(updatedRoom);
    }

    private RoomDto mapToDto(Room room) {
        return new RoomDto(
                room.getRoomCode(),
                room.getStatus(),
                room.getCreatorId(),
                room.getCreatorName(),
                room.getOpponentId(),
                room.getOpponentName(),
                room.getCreatedAt(),
                room.getExpiresAt()
        );
    }
}
