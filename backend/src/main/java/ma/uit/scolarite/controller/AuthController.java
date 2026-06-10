package ma.uit.scolarite.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.uit.scolarite.dto.AuthResponse;
import ma.uit.scolarite.dto.LoginRequest;
import ma.uit.scolarite.dto.RegisterRequest;
import ma.uit.scolarite.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }
}
