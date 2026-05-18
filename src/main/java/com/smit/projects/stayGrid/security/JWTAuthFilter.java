package com.smit.projects.stayGrid.security;

import com.smit.projects.stayGrid.entity.User;
import com.smit.projects.stayGrid.service.UserService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

@Configuration
@RequiredArgsConstructor
public class JWTAuthFilter extends OncePerRequestFilter {

    private final JWTService jwtService;
    private final UserService userService;

    @Qualifier("handlerExceptionResolver")
    private final HandlerExceptionResolver handlerExceptionResolver;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        try {

            final String requestTokenHeader =
                    request.getHeader("Authorization");

            if (requestTokenHeader == null
                    || !requestTokenHeader.startsWith("Bearer ")) {

                filterChain.doFilter(request, response);
                return;
            }

            // FIXED
            String token = requestTokenHeader.substring(7).trim();

            Long userId = jwtService.getUserIdFromToken(token);

            if (userId != null
                    && SecurityContextHolder.getContext()
                    .getAuthentication() == null) {

                User user = userService.getUserById(userId);

                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(
                                user,
                                null,
                                user.getAuthorities()
                        );

                authenticationToken.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder.getContext()
                        .setAuthentication(authenticationToken);
            }

            filterChain.doFilter(request, response);

        } catch (JwtException jwtException) {

            handlerExceptionResolver.resolveException(
                    request,
                    response,
                    null,
                    jwtException
            );
        }
    }
}