package com.supertictactoe.controller;

import com.supertictactoe.model.entity.Game;
import com.supertictactoe.security.UserPrincipal;
import com.supertictactoe.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/users/profile")
    public ResponseEntity<Map<String, Object>> getUserProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.status(401).build();
        }
        Map<String, Object> profile = userService.getUserProfile(userPrincipal.getUsername());
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/games/history")
    public ResponseEntity<List<Game>> getUserGameHistory(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.status(401).build();
        }
        List<Game> history = userService.getUserGameHistory(userPrincipal.getUsername());
        return ResponseEntity.ok(history);
    }
}
