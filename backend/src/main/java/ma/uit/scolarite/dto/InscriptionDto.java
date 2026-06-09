package ma.uit.scolarite.dto;

import java.time.LocalDate;

public record InscriptionDto(
        Long id,
        Long etudiantId,
        String etudiantNom,
        Long moduleId,
        String moduleIntitule,
        LocalDate dateInscription
) {}
