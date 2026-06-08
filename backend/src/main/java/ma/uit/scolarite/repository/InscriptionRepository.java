package ma.uit.scolarite.repository;

import ma.uit.scolarite.entity.Inscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InscriptionRepository extends JpaRepository<Inscription, Long> {
    List<Inscription> findByEtudiantId(Long etudiantId);
    List<Inscription> findByModuleId(Long moduleId);
    boolean existsByEtudiantIdAndModuleId(Long etudiantId, Long moduleId);
}
