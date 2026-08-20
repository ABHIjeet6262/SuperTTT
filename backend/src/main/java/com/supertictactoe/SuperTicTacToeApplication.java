package com.supertictactoe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SuperTicTacToeApplication {

    public static void main(String[] args) {
        SpringApplication.run(SuperTicTacToeApplication.class, args);
    }
}
