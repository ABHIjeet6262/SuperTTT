package com.supertictactoe.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Domain exceptions (RoomException, InvalidMoveException) carry user-safe messages
     * and are surfaced directly. Generic RuntimeExceptions are logged server-side and
     * return a generic message to the client to avoid leaking internals (fixes L / M1).
     */
    @ExceptionHandler(RoomException.class)
    public ResponseEntity<Map<String, String>> handleRoomException(RoomException ex) {
        return errorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidMoveException.class)
    public ResponseEntity<Map<String, String>> handleInvalidMoveException(InvalidMoveException ex) {
        return errorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        // Log the real message internally — never expose it to the client
        log.error("Unhandled exception: {}", ex.getMessage(), ex);
        return errorResponse("An error occurred. Please try again.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage())
        );
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    private ResponseEntity<Map<String, String>> errorResponse(String message, HttpStatus status) {
        Map<String, String> body = new HashMap<>();
        body.put("error", message);
        return new ResponseEntity<>(body, status);
    }
}
