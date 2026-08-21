package com.supertictactoe.service;

import com.supertictactoe.model.entity.Game;
import com.supertictactoe.model.entity.User;
import com.supertictactoe.model.entity.UserStat;
import com.supertictactoe.repository.GameRepository;
import com.supertictactoe.repository.UserRepository;
import com.supertictactoe.repository.UserStatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserStatRepository userStatRepository;

    @Autowired
    private GameRepository gameRepository;

    public Map<String, Object> getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        UserStat stat = userStatRepository.findByUserId(user.getId())
                .orElseGet(() -> new UserStat(user));

        Map<String, Object> profile = new HashMap<>();
        profile.put("username", user.getUsername());
        profile.put("email", user.getEmail());
        profile.put("createdAt", user.getCreatedAt());
        profile.put("gamesPlayed", stat.getGamesPlayed());
        profile.put("wins", stat.getWins());
        profile.put("losses", stat.getLosses());
        profile.put("draws", stat.getDraws());
        profile.put("winRate", stat.getWinRate());

        return profile;
    }

    public List<Game> getUserGameHistory(String username) {
        return gameRepository.findAll().stream()
                .filter(game -> ("user_" + username).equals(game.getPlayerXId()) || ("user_" + username).equals(game.getPlayerOId()))
                .toList();
    }
}
