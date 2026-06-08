package ma.uit.scolarite.repository;

import ma.uit.scolarite.entity.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EtudiantRepository extends JpaRepository<Etudiant, Long> {
    Optional<Etudiant> findByEmail(String email);
    boolean existsByCne(String cne);
    boolean existsByEmail(String email);
}
