package ma.uit.scolarite.service;

import lombok.RequiredArgsConstructor;
import ma.uit.scolarite.dto.ModuleDto;
import ma.uit.scolarite.dto.ModuleRequest;
import ma.uit.scolarite.entity.Enseignant;
import ma.uit.scolarite.entity.Filiere;
import ma.uit.scolarite.entity.Module;
import ma.uit.scolarite.exception.BadRequestException;
import ma.uit.scolarite.exception.ResourceNotFoundException;
import ma.uit.scolarite.repository.ModuleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModuleService {

    private final ModuleRepository moduleRepository;
    private final FiliereService filiereService;
    private final EnseignantService enseignantService;

    public List<ModuleDto> findAll() {
        return moduleRepository.findAll().stream().map(this::toDto).toList();
    }

    public ModuleDto findById(Long id) {
        return toDto(getEntity(id));
    }

    public Module getEntity(Long id) {
        return moduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Module introuvable : " + id));
    }

    public ModuleDto create(ModuleRequest req) {
        if (moduleRepository.existsByCode(req.code())) {
            throw new BadRequestException("Un module avec ce code existe deja");
        }
        Module module = new Module();
        apply(module, req);
        return toDto(moduleRepository.save(module));
    }

    public ModuleDto update(Long id, ModuleRequest req) {
        Module module = getEntity(id);
        apply(module, req);
        return toDto(moduleRepository.save(module));
    }

    public void delete(Long id) {
        moduleRepository.delete(getEntity(id));
    }

    private void apply(Module module, ModuleRequest req) {
        module.setCode(req.code());
        module.setIntitule(req.intitule());
        module.setSemestre(req.semestre());
        if (req.filiereId() != null) {
            Filiere filiere = filiereService.getEntity(req.filiereId());
            module.setFiliere(filiere);
        } else {
            module.setFiliere(null);
        }
        if (req.enseignantId() != null) {
            Enseignant enseignant = enseignantService.getEntity(req.enseignantId());
            module.setEnseignant(enseignant);
        } else {
            module.setEnseignant(null);
        }
    }

    private ModuleDto toDto(Module m) {
        return new ModuleDto(
                m.getId(), m.getCode(), m.getIntitule(), m.getSemestre(),
                m.getFiliere() != null ? m.getFiliere().getId() : null,
                m.getFiliere() != null ? m.getFiliere().getNom() : null,
                m.getEnseignant() != null ? m.getEnseignant().getId() : null,
                m.getEnseignant() != null
                        ? m.getEnseignant().getPrenom() + " " + m.getEnseignant().getNom() : null
        );
    }
}
