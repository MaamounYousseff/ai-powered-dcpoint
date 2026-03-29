package com.doctorpoint.auth;

import com.doctorpoint.domain.ApiResponse;
import com.doctorpoint.domain.User;
import com.doctorpoint.security.JwtService;
import com.doctorpoint.security.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    public ApiResponse<Map<String, String>> login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtService.createJwt(userDetails);

            return ApiResponse.success(
                    Map.of("token", token, "username", userDetails.getUsername()),
                    "Login successful"
            );

        } catch (BadCredentialsException e) {
            return ApiResponse.error("Invalid username or password");
        } catch (Exception e) {
            return ApiResponse.error("Authentication failed: " + e.getMessage());
        }
    }

    public ApiResponse<String> setPassword(SetPasswordRequest request) {
        try {
            Optional<User> existingUser = userService.findByUsername(request.getUsername());

            if (existingUser.isPresent()) {
                return ApiResponse.error("Password already set for this user");
            }

            User newUser = new User();
            newUser.setUsername(request.getUsername());
            newUser.setPassword(request.getPassword());
            newUser.setRoleName("DOCTOR");

            userService.createUser(newUser);

            return ApiResponse.success("Password set successfully");

        } catch (Exception e) {
            return ApiResponse.error("Failed to set password: " + e.getMessage());
        }
    }

    public ApiResponse<String> resetPassword(ResetPasswordRequest request) {
        try {
            Optional<User> userOpt = userService.findByUsername(request.getUsername());

            if (userOpt.isEmpty()) {
                return ApiResponse.error("User not found");
            }

            User user = userOpt.get();

            if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
                return ApiResponse.error("Invalid old password");
            }

            userService.updatePassword(request.getUsername(), request.getNewPassword());

            return ApiResponse.success("Password reset successfully");

        } catch (Exception e) {
            return ApiResponse.error("Failed to reset password: " + e.getMessage());
        }
    }
}