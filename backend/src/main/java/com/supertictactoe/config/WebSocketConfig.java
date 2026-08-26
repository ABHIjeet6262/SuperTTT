package com.supertictactoe.config;

import com.supertictactoe.security.WebSocketAuthInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Autowired
    private WebSocketAuthInterceptor webSocketAuthInterceptor;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Restrict to known origins only — no wildcard
        registry.addEndpoint("/ws/game")
                .setAllowedOriginPatterns(
                        "http://localhost:*",
                        "http://127.0.0.1:*",
                        "https://*.vercel.app",
                        "https://*.railway.app",
                        "https://*.onrender.com"
                )
                .withSockJS();
    }

    /**
     * Register the JWT channel interceptor on the inbound STOMP channel.
     * This fires on every STOMP CONNECT frame and binds the server-verified
     * Principal to the WebSocket session before any @MessageMapping handler runs.
     */
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(webSocketAuthInterceptor);
    }
}
