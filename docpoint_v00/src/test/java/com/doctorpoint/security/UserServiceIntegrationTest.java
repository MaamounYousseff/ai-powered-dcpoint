package com.doctorpoint.security;

import com.doctorpoint.domain.User;
import com.doctorpoint.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataMongoTest
@Import({UserService.class, BCryptPasswordEncoder.class})

class UserServiceIntegrationTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        // Clean database before each test
        userRepository.deleteAll();

        // Create test user with actual encoded password
        User testUser = new User();
        testUser.setUsername("docpoint");
        testUser.setPassword(passwordEncoder.encode("docpoint"));
        testUser.setRoleName("USER");

        // Save directly to database
        userRepository.save(testUser);
    }

    @Test
    void testFindByUsername_FullDatabaseFlow_ShouldReturnActualUser() {
        // When - calling the actual service method that hits the database
        Optional<User> result = userService.findByUsername("docpoint");

        // Then - verify the full flow worked
        assertTrue(result.isPresent(), "User should be found in database");

        User foundUser = result.get();
        assertEquals("docpoint", foundUser.getUsername());
        assertEquals("USER", foundUser.getRoleName());

        // Verify password is properly encoded (not plain text)
        assertNotEquals("docpoint", foundUser.getPassword());
        assertTrue(passwordEncoder.matches("docpoint", foundUser.getPassword()),
                "Password should match when decoded");

        // Verify user has an ID (was actually saved to database)
        assertNotNull(foundUser.getId());
    }

    @Test
    void testLoadUserByUsername_FullDatabaseFlow_ShouldReturnUserDetails() {
        // When - test the Spring Security UserDetailsService method
        var userDetails = userService.loadUserByUsername("docpoint");

        // Then - verify full flow including UserDetails implementation
        assertEquals("docpoint", userDetails.getUsername());
        assertNotNull(userDetails.getPassword());
        assertTrue(userDetails.isEnabled());
        assertTrue(userDetails.isAccountNonExpired());
        assertTrue(userDetails.isAccountNonLocked());
        assertTrue(userDetails.isCredentialsNonExpired());
        assertNotNull(userDetails.getAuthorities());
    }

    @Test
    void testCreateUser_FullDatabaseFlow_ShouldPersistUser() {
        // Given - create new user
        User newUser = new User();
        newUser.setUsername("newdocpoint");
        newUser.setPassword("docpoint");
        newUser.setRoleName("ADMIN");

        // When - create user through service (hits database)
        User createdUser = userService.createUser(newUser);

        // Then - verify user was actually saved to database
        assertNotNull(createdUser.getId());
        assertEquals("newdocpoint", createdUser.getUsername());
        assertEquals("ADMIN", createdUser.getRoleName());

        // Verify password was encoded
        assertNotEquals("docpoint", createdUser.getPassword());
        assertTrue(passwordEncoder.matches("docpoint", createdUser.getPassword()));

        // Verify user can be found in database after creation
        Optional<User> foundUser = userRepository.findByUsername("newdocpoint");
        assertTrue(foundUser.isPresent());
        assertEquals(createdUser.getId(), foundUser.get().getId());
    }

    @Test
    void testUpdatePassword_FullDatabaseFlow_ShouldUpdateInDatabase() {
        // When - update password through service
        User updatedUser = userService.updatePassword("docpoint", "newpassword");

        // Then - verify password was updated in database
        assertEquals("docpoint", updatedUser.getUsername());
        assertTrue(passwordEncoder.matches("newpassword", updatedUser.getPassword()));
        assertFalse(passwordEncoder.matches("docpoint", updatedUser.getPassword()));

        // Verify change persisted in database
        Optional<User> foundUser = userRepository.findByUsername("docpoint");
        assertTrue(foundUser.isPresent());
        assertTrue(passwordEncoder.matches("newpassword", foundUser.get().getPassword()));
    }

    @Test
    void testFindByUsername_NonExistentUser_ShouldReturnEmpty() {
        // When - search for user that doesn't exist
        Optional<User> result = userService.findByUsername("nonexistent");

        // Then - should return empty
        assertFalse(result.isPresent());
    }
}