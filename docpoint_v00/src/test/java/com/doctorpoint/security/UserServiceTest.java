package com.doctorpoint.security;

import com.doctorpoint.domain.User;
import com.doctorpoint.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId("1");
        testUser.setUsername("docpoint");
        testUser.setPassword("encodedPassword");
        testUser.setRoleName("USER");
    }

    @Test
    void testFindByUsername_WhenUserExists_ShouldReturnUser() {
        // Given
        String username = "docpoint";
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));

        // When
        Optional<User> result = userService.findByUsername(username);

        // Then
        assertTrue(result.isPresent());
        assertEquals("docpoint", result.get().getUsername());
        assertEquals("encodedPassword", result.get().getPassword());
        verify(userRepository, times(1)).findByUsername(username);
    }

    @Test
    void testFindByUsername_WhenUserDoesNotExist_ShouldReturnEmpty() {
        // Given
        String username = "nonexistentuser";
        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        // When
        Optional<User> result = userService.findByUsername(username);

        // Then
        assertFalse(result.isPresent());
        verify(userRepository, times(1)).findByUsername(username);
    }

    @Test
    void testCreateUser_WithDocpointCredentials_ShouldEncodePasswordAndSaveUser() {
        // Given
        User newUser = new User();
        newUser.setUsername("docpoint");
        newUser.setPassword("docpoint");
        newUser.setRoleName("USER");

        User savedUser = new User();
        savedUser.setId("1");
        savedUser.setUsername("docpoint");
        savedUser.setPassword("encodedDocpointPassword");
        savedUser.setRoleName("USER");

        when(passwordEncoder.encode("docpoint")).thenReturn("encodedDocpointPassword");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // When
        User result = userService.createUser(newUser);

        // Then
        assertEquals("docpoint", result.getUsername());
        assertEquals("encodedDocpointPassword", result.getPassword());
        verify(passwordEncoder, times(1)).encode("docpoint");
        verify(userRepository, times(1)).save(newUser);
    }

    @Test
    void testLoadUserByUsername_WithDocpointUsername_ShouldReturnUserDetails() {
        // Given
        String username = "docpoint";
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));

        // When
        var userDetails = userService.loadUserByUsername(username);

        // Then
        assertEquals("docpoint", userDetails.getUsername());
        assertEquals("encodedPassword", userDetails.getPassword());
        assertTrue(userDetails.isEnabled());
        assertTrue(userDetails.isAccountNonExpired());
        assertTrue(userDetails.isAccountNonLocked());
        assertTrue(userDetails.isCredentialsNonExpired());
        verify(userRepository, times(1)).findByUsername(username);
    }
}