package com.smit.projects.stayGrid.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class RedisEnvChecker implements CommandLineRunner {

    @Value("${spring.data.redis.host}")
    private String host;

    @Value("${spring.data.redis.port}")
    private int port;

    @Value("${spring.data.redis.username}")
    private String username;

    @Value("${spring.data.redis.ssl.enabled}")
    private boolean ssl;

    @Override
    public void run(String... args) {
        System.out.println("HOST = " + host);
        System.out.println("PORT = " + port);
        System.out.println("USER = " + username);
        System.out.println("SSL = " + ssl);
    }
}
