package ma.uit.scolarite.service;

import lombok.RequiredArgsConstructor;
import ma.uit.scolarite.dto.AuthResponse;
import ma.uit.scolarite.dto.LoginRequest;
import ma.uit.scolarite.dto.RegisterRequest;
import ma.uit.scolarite.entity.Role;
import ma.uit.scolarite.entity.User;
import ma.uit.scolarite.exception.BadRequestException;
import ma.uit.scolarite.repository.UserRepository;
import ma.uit.scolarite.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new BadRequestException("Ce nom d'utilisateur existe deja");
        }
        Role role = request.role() != null ? request.role() : Role.ETUDIANT;
        User user = User.builder()
                .username(request.username())
                .password(passwordEncoder.encode(request.password()))
                .nomComplet(request.nomComplet())
                .role(role)
                .build();
        userRepository.save(user);
        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new BadRequestException("Identifiants invalides"));
        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtService.generateToken(userDetails, user.getRole().name(), user.getNomComplet());
        return new AuthResponse(token, user.getUsername(), user.getNomComplet(), user.getRole());
    }
}
