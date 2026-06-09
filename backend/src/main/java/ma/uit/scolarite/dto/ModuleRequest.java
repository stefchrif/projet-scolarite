package ma.uit.scolarite.dto;

import jakarta.validation.constraints.NotBlank;

public record ModuleRequest(
        @NotBlank String code,
        @NotBlank String intitule,
        String semestre,
        Long filiereId,
        Long enseignantId
) {}
