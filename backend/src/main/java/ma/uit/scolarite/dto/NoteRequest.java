package ma.uit.scolarite.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record NoteRequest(
        @NotNull Long inscriptionId,
        @NotNull @DecimalMin("0.0") @DecimalMax("20.0") Double valeur,
        @NotBlank String type
) {}
