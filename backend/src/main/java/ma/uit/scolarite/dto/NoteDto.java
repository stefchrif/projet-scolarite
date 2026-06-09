package ma.uit.scolarite.dto;

public record NoteDto(
        Long id,
        Long inscriptionId,
        Long etudiantId,
        String etudiantNom,
        Long moduleId,
        String moduleIntitule,
        Double valeur,
        String type
) {}
