package ma.uit.scolarite.dto;

public record DashboardStats(
        long nbEtudiants,
        long nbEnseignants,
        long nbFilieres,
        long nbModules,
        long nbInscriptions,
        long nbNotes
) {}
