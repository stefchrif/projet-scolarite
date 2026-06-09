package ma.uit.scolarite.dto;

public record ModuleDto(
        Long id,
        String code,
        String intitule,
        String semestre,
        Long filiereId,
        String filiereNom,
        Long enseignantId,
        String enseignantNom
) {}
