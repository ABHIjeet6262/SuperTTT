package com.supertictactoe.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * In-memory IP-based rate limiter for auth endpoints.
 *
 * Policy:
 *   - Max 10 requests per IP per 60-second window for /api/auth/login
 *   - Max 5 requests per IP per 60-second window for /api/auth/register
 *
 * Responds with HTTP 429 Too Many Requests when the limit is exceeded.
 * Uses a sliding window counter stored in memory — suitable for a single-instance
 * deployment. For multi-instance deployments, replace with Redis-backed rate limiting.
 */
@Component
public class RateLimitingFilter implements Filter {

    private static final long WINDOW_MS = 60_000L;  // 1 minute
    private static final int MAX_LOGIN_ATTEMPTS = 10;
    private static final int MAX_REGISTER_ATTEMPTS = 5;

    // Key: "IP::endpoint", Value: [requestCount, windowStartTime]
    private final Map<String, long[]> rateLimitMap = new ConcurrentHashMap<>();

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        String path = request.getRequestURI();
        String ip = getClientIp(request);

        if (path.equals("/api/auth/login") || path.equals("/api/auth/register")) {
            int maxRequests = path.equals("/api/auth/login") ? MAX_LOGIN_ATTEMPTS : MAX_REGISTER_ATTEMPTS;
            String key = ip + "::" + path;

            if (isRateLimited(key, maxRequests)) {
                response.setStatus(429);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Too many requests. Please try again later.\"}");
                return;
            }
        }

        chain.doFilter(req, res);
    }

    private boolean isRateLimited(String key, int maxRequests) {
        long now = System.currentTimeMillis();
        long[] window = rateLimitMap.compute(key, (k, existing) -> {
            if (existing == null || now - existing[1] > WINDOW_MS) {
                return new long[]{1, now};
            }
            existing[0]++;
            return existing;
        });

        return window[0] > maxRequests;
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
