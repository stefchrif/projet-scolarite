package ma.uit.scolarite.repository;

import ma.uit.scolarite.entity.Enseignant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnseignantRepository extends JpaRepository<Enseignant, Long> {
    boolean existsByEmail(String email);
}
