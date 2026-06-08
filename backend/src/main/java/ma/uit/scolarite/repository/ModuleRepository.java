package ma.uit.scolarite.repository;

import ma.uit.scolarite.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ModuleRepository extends JpaRepository<Module, Long> {
    boolean existsByCode(String code);
    List<Module> findByEnseignantId(Long enseignantId);
}
