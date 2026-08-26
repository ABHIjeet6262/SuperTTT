package com.supertictactoe.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

import java.security.Principal;

/**
 * WebSocket STOMP Channel Interceptor
 *
 * Intercepts every STOMP CONNECT frame and validates the JWT token
 * passed in the Authorization header. If valid, binds the authenticated
 * username as the session Principal — making server-side identity available
 * in all subsequent @MessageMapping handlers via the Principal parameter.
 *
 * Guest users pass a pre-issued guest token (guest_<uuid>) that the server
 * also validates as an opaque session token issued on room creation.
 */
@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor == null) return message;

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if (jwtTokenProvider.validateToken(token)) {
                    String username = jwtTokenProvider.getUsernameFromJWT(token);
                    // Bind authenticated user as the STOMP session Principal
                    accessor.setUser(new StompPrincipal("user_" + username));
                }
            }
        }

        return message;
    }
}
