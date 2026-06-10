package ma.uit.scolarite.service;

import lombok.RequiredArgsConstructor;
import ma.uit.scolarite.dto.EtudiantDto;
import ma.uit.scolarite.dto.EtudiantRequest;
import ma.uit.scolarite.entity.Etudiant;
import ma.uit.scolarite.entity.Filiere;
import ma.uit.scolarite.exception.BadRequestException;
import ma.uit.scolarite.exception.ResourceNotFoundException;
import ma.uit.scolarite.repository.EtudiantRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EtudiantService {

    private final EtudiantRepository etudiantRepository;
    private final FiliereService filiereService;

    public List<EtudiantDto> findAll() {
        return etudiantRepository.findAll().stream().map(this::toDto).toList();
    }

    public EtudiantDto findById(Long id) {
        return toDto(getEntity(id));
    }

    public Etudiant getEntity(Long id) {
        return etudiantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Etudiant introuvable : " + id));
    }

    public EtudiantDto create(EtudiantRequest req) {
        if (etudiantRepository.existsByCne(req.cne())) {
            throw new BadRequestException("Un etudiant avec ce CNE existe deja");
        }
        if (etudiantRepository.existsByEmail(req.email())) {
            throw new BadRequestException("Un etudiant avec cet email existe deja");
        }
        Etudiant etudiant = new Etudiant();
        applyRequest(etudiant, req);
        return toDto(etudiantRepository.save(etudiant));
    }

    public EtudiantDto update(Long id, EtudiantRequest req) {
        Etudiant etudiant = getEntity(id);
        applyRequest(etudiant, req);
        return toDto(etudiantRepository.save(etudiant));
    }

    public void delete(Long id) {
        etudiantRepository.delete(getEntity(id));
    }

    private void applyRequest(Etudiant etudiant, EtudiantRequest req) {
        etudiant.setNom(req.nom());
        etudiant.setPrenom(req.prenom());
        etudiant.setCne(req.cne());
        etudiant.setEmail(req.email());
        etudiant.setDateNaissance(req.dateNaissance());
        if (req.filiereId() != null) {
            Filiere filiere = filiereService.getEntity(req.filiereId());
            etudiant.setFiliere(filiere);
        } else {
            etudiant.setFiliere(null);
        }
    }

    private EtudiantDto toDto(Etudiant e) {
        return new EtudiantDto(
                e.getId(), e.getNom(), e.getPrenom(), e.getCne(), e.getEmail(),
                e.getDateNaissance(),
                e.getFiliere() != null ? e.getFiliere().getId() : null,
                e.getFiliere() != null ? e.getFiliere().getNom() : null
        );
    }
}
