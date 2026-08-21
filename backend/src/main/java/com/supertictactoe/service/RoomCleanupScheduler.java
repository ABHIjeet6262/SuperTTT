package com.supertictactoe.service;

import com.supertictactoe.model.entity.Room;
import com.supertictactoe.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RoomCleanupScheduler {

    @Autowired
    private RoomRepository roomRepository;

    /**
     * Scheduled task running every 60 seconds to clean up expired rooms.
     */
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void cleanupExpiredRooms() {
        LocalDateTime now = LocalDateTime.now();
        List<Room> expiredRooms = roomRepository.findByExpiresAtBefore(now);

        for (Room room : expiredRooms) {
            if (!"EXPIRED".equals(room.getStatus()) && !"FINISHED".equals(room.getStatus())) {
                room.setStatus("EXPIRED");
                roomRepository.save(room);
            }
        }
    }
}
