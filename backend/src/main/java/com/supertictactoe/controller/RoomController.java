package com.supertictactoe.controller;

import com.supertictactoe.dto.request.CreateRoomRequest;
import com.supertictactoe.dto.request.JoinRoomRequest;
import com.supertictactoe.dto.response.RoomDto;
import com.supertictactoe.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @PostMapping
    public ResponseEntity<RoomDto> createRoom(@Valid @RequestBody CreateRoomRequest request) {
        // For authenticated users, override the client-supplied creatorId with the
        // server-verified JWT identity — prevents identity spoofing on room creation.
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            String serverSideId = "user_" + auth.getName();
            request.setCreatorId(serverSideId);
        }
        // Guest users retain their client-supplied guest_<uuid> ID.
        // Guest token validation can be added here when guest sessions are server-issued.

        RoomDto roomDto = roomService.createRoom(request);
        return ResponseEntity.ok(roomDto);
    }

    @GetMapping("/{roomCode}")
    public ResponseEntity<RoomDto> getRoom(@PathVariable String roomCode) {
        RoomDto roomDto = roomService.getRoomByCode(roomCode);
        return ResponseEntity.ok(roomDto);
    }

    @PostMapping("/{roomCode}/join")
    public ResponseEntity<RoomDto> joinRoom(@PathVariable String roomCode,
                                            @Valid @RequestBody JoinRoomRequest request) {
        // For authenticated users, override the client-supplied opponentId with the
        // server-verified JWT identity — prevents impersonation on room join.
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            String serverSideId = "user_" + auth.getName();
            request.setOpponentId(serverSideId);
        }

        RoomDto roomDto = roomService.joinRoom(roomCode, request);
        return ResponseEntity.ok(roomDto);
    }
}
