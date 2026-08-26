package com.supertictactoe.security;

import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory JWT token blacklist for server-side logout revocation (L3 fix).
 *
 * When a user logs out, their token is added here. The JwtAuthenticationFilter
 * checks this store before accepting any token as valid.
 *
 * Tokens are stored until their natural expiry time, then auto-removed to prevent
 * unbounded memory growth.
 *
 * Note: This is an in-process store. In a multi-instance deployment, replace with
 * a shared Redis store so all instances share the same blacklist.
 */
@Component
public class TokenBlacklist {

    // Key: token, Value: expiry timestamp in millis
    private final ConcurrentHashMap<String, Long> blacklisted = new ConcurrentHashMap<>();

    public void revoke(String token, long expiryMs) {
        blacklisted.put(token, expiryMs);
        evictExpired();
    }

    public boolean isRevoked(String token) {
        Long expiry = blacklisted.get(token);
        if (expiry == null) return false;
        if (System.currentTimeMillis() > expiry) {
            blacklisted.remove(token);
            return false;
        }
        return true;
    }

    private void evictExpired() {
        long now = System.currentTimeMillis();
        blacklisted.entrySet().removeIf(e -> e.getValue() < now);
    }
}
