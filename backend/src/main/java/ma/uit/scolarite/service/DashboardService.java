package ma.uit.scolarite.service;

import lombok.RequiredArgsConstructor;
import ma.uit.scolarite.dto.DashboardStats;
import ma.uit.scolarite.repository.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final EtudiantRepository etudiantRepository;
    private final EnseignantRepository enseignantRepository;
    private final FiliereRepository filiereRepository;
    private final ModuleRepository moduleRepository;
    private final InscriptionRepository inscriptionRepository;
    private final NoteRepository noteRepository;

    public DashboardStats getStats() {
        return new DashboardStats(
                etudiantRepository.count(),
                enseignantRepository.count(),
                filiereRepository.count(),
                moduleRepository.count(),
                inscriptionRepository.count(),
                noteRepository.count()
        );
    }
}
