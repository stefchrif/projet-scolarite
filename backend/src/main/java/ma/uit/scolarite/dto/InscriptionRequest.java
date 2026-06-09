package ma.uit.scolarite.dto;

import jakarta.validation.constraints.NotNull;

public record InscriptionRequest(
        @NotNull Long etudiantId,
        @NotNull Long moduleId
) {}
