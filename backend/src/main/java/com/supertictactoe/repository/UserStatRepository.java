package com.supertictactoe.repository;

import com.supertictactoe.model.entity.UserStat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserStatRepository extends JpaRepository<UserStat, Long> {
    Optional<UserStat> findByUserId(Long userId);
}
