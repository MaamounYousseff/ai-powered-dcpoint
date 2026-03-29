package com.doctorpoint;

import com.doctorpoint.domain.User;
import com.doctorpoint.security.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
class ApplicationTests {


	@Autowired
	private UserService userService;
	@Autowired
	private PasswordEncoder encoder;

	@Test
	void contextLoads() {
		User user = userService.findByUsername("docpoint").get();
		System.out.println(user);

		System.out.println(encoder.encode("docpoint"));
		System.out.println(encoder.matches("docpoint", user.getPassword()));
		return;
	}

}
