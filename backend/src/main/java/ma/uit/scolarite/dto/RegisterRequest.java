package ma.uit.scolarite.dto;

import jakarta.validation.constraints.NotBlank;
import ma.uit.scolarite.entity.Role;

public record RegisterRequest(
        @NotBlank String username,
        @NotBlank String password,
        @NotBlank String nomComplet,
        Role role
) {}
