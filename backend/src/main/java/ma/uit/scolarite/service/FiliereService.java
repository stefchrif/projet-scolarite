package ma.uit.scolarite.service;

import lombok.RequiredArgsConstructor;
import ma.uit.scolarite.dto.FiliereDto;
import ma.uit.scolarite.entity.Filiere;
import ma.uit.scolarite.exception.ResourceNotFoundException;
import ma.uit.scolarite.repository.FiliereRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FiliereService {

    private final FiliereRepository filiereRepository;

    public List<FiliereDto> findAll() {
        return filiereRepository.findAll().stream().map(this::toDto).toList();
    }

    public FiliereDto findById(Long id) {
        return toDto(getEntity(id));
    }

    public Filiere getEntity(Long id) {
        return filiereRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Filiere introuvable : " + id));
    }

    public FiliereDto create(FiliereDto dto) {
        Filiere filiere = Filiere.builder().nom(dto.nom()).niveau(dto.niveau()).build();
        return toDto(filiereRepository.save(filiere));
    }

    public FiliereDto update(Long id, FiliereDto dto) {
        Filiere filiere = getEntity(id);
        filiere.setNom(dto.nom());
        filiere.setNiveau(dto.niveau());
        return toDto(filiereRepository.save(filiere));
    }

    public void delete(Long id) {
        filiereRepository.delete(getEntity(id));
    }

    private FiliereDto toDto(Filiere f) {
        return new FiliereDto(f.getId(), f.getNom(), f.getNiveau());
    }
}
