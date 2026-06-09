package ma.uit.scolarite.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record EnseignantDto(
        Long id,
        @NotBlank String nom,
        @NotBlank String prenom,
        @NotBlank @Email String email,
        String specialite
) {}
