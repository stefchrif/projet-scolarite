package ma.uit.scolarite.service;

import lombok.RequiredArgsConstructor;
import ma.uit.scolarite.dto.EnseignantDto;
import ma.uit.scolarite.entity.Enseignant;
import ma.uit.scolarite.exception.BadRequestException;
import ma.uit.scolarite.exception.ResourceNotFoundException;
import ma.uit.scolarite.repository.EnseignantRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EnseignantService {

    private final EnseignantRepository enseignantRepository;

    public List<EnseignantDto> findAll() {
        return enseignantRepository.findAll().stream().map(this::toDto).toList();
    }

    public EnseignantDto findById(Long id) {
        return toDto(getEntity(id));
    }

    public Enseignant getEntity(Long id) {
        return enseignantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant introuvable : " + id));
    }

    public EnseignantDto create(EnseignantDto dto) {
        if (enseignantRepository.existsByEmail(dto.email())) {
            throw new BadRequestException("Un enseignant avec cet email existe deja");
        }
        Enseignant enseignant = new Enseignant();
        apply(enseignant, dto);
        return toDto(enseignantRepository.save(enseignant));
    }

    public EnseignantDto update(Long id, EnseignantDto dto) {
        Enseignant enseignant = getEntity(id);
        apply(enseignant, dto);
        return toDto(enseignantRepository.save(enseignant));
    }

    public void delete(Long id) {
        enseignantRepository.delete(getEntity(id));
    }

    private void apply(Enseignant enseignant, EnseignantDto dto) {
        enseignant.setNom(dto.nom());
        enseignant.setPrenom(dto.prenom());
        enseignant.setEmail(dto.email());
        enseignant.setSpecialite(dto.specialite());
    }

    private EnseignantDto toDto(Enseignant e) {
        return new EnseignantDto(e.getId(), e.getNom(), e.getPrenom(), e.getEmail(), e.getSpecialite());
    }
}
