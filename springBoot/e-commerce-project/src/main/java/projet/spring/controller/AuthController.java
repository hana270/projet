package projet.spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import projet.spring.entities.User;
import projet.spring.service.UserService;
import projet.spring.dto.LoginRequest;
import projet.spring.dto.RegisterRequest;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping(value = "/register", 
                consumes = MediaType.APPLICATION_JSON_VALUE, 
                produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        if (userService.existsByUsername(registerRequest.getUsername())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Username already taken");
            return ResponseEntity.badRequest().body(response);
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(registerRequest.getPassword());
        user.setRole("CLIENT");

        User savedUser = userService.saveUser(user);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Registration successful");
        response.put("userId", savedUser.getId().toString());
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/login", 
                consumes = MediaType.APPLICATION_JSON_VALUE, 
                produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> existingUser = userService.findByUsername(loginRequest.getUsername());
        
        if (existingUser.isPresent() && existingUser.get().getPassword().equals(loginRequest.getPassword())) {
            Map<String, String> response = new HashMap<>();
            response.put("role", existingUser.get().getRole());
            response.put("userId", existingUser.get().getId().toString());
            response.put("username", existingUser.get().getUsername());
            return ResponseEntity.ok(response);
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "Invalid username or password");
        return ResponseEntity.badRequest().body(response);
    }
}