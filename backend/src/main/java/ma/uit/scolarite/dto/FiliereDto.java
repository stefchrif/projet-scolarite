package ma.uit.scolarite.dto;

import jakarta.validation.constraints.NotBlank;

public record FiliereDto(
        Long id,
        @NotBlank String nom,
        @NotBlank String niveau
) {}
