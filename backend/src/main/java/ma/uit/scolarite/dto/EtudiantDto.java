package ma.uit.scolarite.dto;

import java.time.LocalDate;

public record EtudiantDto(
        Long id,
        String nom,
        String prenom,
        String cne,
        String email,
        LocalDate dateNaissance,
        Long filiereId,
        String filiereNom
) {}
