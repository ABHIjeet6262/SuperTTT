package com.supertictactoe.security;

import java.security.Principal;

/**
 * Immutable Principal implementation bound to a WebSocket STOMP session.
 * Carries the player's canonical ID (e.g. "user_alice" or "guest_<uuid>")
 * derived from a validated token — never from the client message payload.
 */
public class StompPrincipal implements Principal {

    private final String name;

    public StompPrincipal(String name) {
        this.name = name;
    }

    @Override
    public String getName() {
        return name;
    }
}
