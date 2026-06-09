package ma.uit.scolarite.dto;

import ma.uit.scolarite.entity.Role;

public record AuthResponse(
        String token,
        String username,
        String nomComplet,
        Role role
) {}
