package com.datenight.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

/**
 * Protects the admin endpoints (create / list / edit / delete invitations)
 * with a shared secret sent in the X-Admin-Key header.
 * Public invitation endpoints (used by the invitee) stay open.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 10)
public class AdminKeyFilter extends OncePerRequestFilter {

    public static final String HEADER_NAME = "X-Admin-Key";

    private static final String INVITATIONS_PATH = "/api/date-night/invitations";
    private static final String PUBLIC_PATH = INVITATIONS_PATH + "/public/";

    private final byte[] adminKey;

    public AdminKeyFilter(@Value("${app.admin-key}") String adminKey) {
        this.adminKey = adminKey == null ? new byte[0]
                : adminKey.trim().getBytes(StandardCharsets.UTF_8);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        boolean isAdminPath = path.equals(INVITATIONS_PATH)
                || path.startsWith(INVITATIONS_PATH + "/");

        return adminKey.length == 0
                || HttpMethod.OPTIONS.matches(request.getMethod())
                || !isAdminPath
                || path.startsWith(PUBLIC_PATH);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String provided = request.getHeader(HEADER_NAME);
        byte[] providedBytes = provided == null ? new byte[0]
                : provided.trim().getBytes(StandardCharsets.UTF_8);

        if (!MessageDigest.isEqual(adminKey, providedBytes)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"message\":\"Admin key required\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
