package com.doctorpoint.http;

import com.doctorpoint.auth.AuthService;
import com.doctorpoint.auth.LoginRequest;
import com.doctorpoint.auth.ResetPasswordRequest;
import com.doctorpoint.auth.SetPasswordRequest;
import com.doctorpoint.domain.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/doctor")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, String>>> login(@Valid @RequestBody LoginRequest request) {
        // Use default username "doctor" if not provided
        if (request.getUsername() == null || request.getUsername().isEmpty()) {
            request.setUsername("doctor");
        }

        ApiResponse<Map<String, String>> response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/set_password")
    public ResponseEntity<ApiResponse<String>> setPassword(@Valid @RequestBody SetPasswordRequest request) {
        // Use default username "doctor" if not provided
        if (request.getUsername() == null || request.getUsername().isEmpty()) {
            request.setUsername("doctor");
        }

        ApiResponse<String> response = authService.setPassword(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset_password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        // Use default username "doctor" if not provided
        if (request.getUsername() == null || request.getUsername().isEmpty()) {
            request.setUsername("doctor");
        }

        ApiResponse<String> response = authService.resetPassword(request);
        return ResponseEntity.ok(response);
    }
}