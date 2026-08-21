package com.supertictactoe.controller;

import com.supertictactoe.dto.request.CreateRoomRequest;
import com.supertictactoe.dto.request.JoinRoomRequest;
import com.supertictactoe.dto.response.RoomDto;
import com.supertictactoe.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @PostMapping
    public ResponseEntity<RoomDto> createRoom(@Valid @RequestBody CreateRoomRequest request) {
        RoomDto roomDto = roomService.createRoom(request);
        return ResponseEntity.ok(roomDto);
    }

    @GetMapping("/{roomCode}")
    public ResponseEntity<RoomDto> getRoom(@PathVariable String roomCode) {
        RoomDto roomDto = roomService.getRoomByCode(roomCode);
        return ResponseEntity.ok(roomDto);
    }

    @PostMapping("/{roomCode}/join")
    public ResponseEntity<RoomDto> joinRoom(@PathVariable String roomCode, @Valid @RequestBody JoinRoomRequest request) {
        RoomDto roomDto = roomService.joinRoom(roomCode, request);
        return ResponseEntity.ok(roomDto);
    }
}
