package ma.uit.scolarite.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record EtudiantRequest(
        @NotBlank String nom,
        @NotBlank String prenom,
        @NotBlank String cne,
        @NotBlank @Email String email,
        LocalDate dateNaissance,
        Long filiereId
) {}
