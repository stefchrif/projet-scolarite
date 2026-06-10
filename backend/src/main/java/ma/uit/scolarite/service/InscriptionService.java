package ma.uit.scolarite.service;

import lombok.RequiredArgsConstructor;
import ma.uit.scolarite.dto.InscriptionDto;
import ma.uit.scolarite.dto.InscriptionRequest;
import ma.uit.scolarite.entity.Etudiant;
import ma.uit.scolarite.entity.Inscription;
import ma.uit.scolarite.entity.Module;
import ma.uit.scolarite.exception.BadRequestException;
import ma.uit.scolarite.exception.ResourceNotFoundException;
import ma.uit.scolarite.repository.InscriptionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InscriptionService {

    private final InscriptionRepository inscriptionRepository;
    private final EtudiantService etudiantService;
    private final ModuleService moduleService;

    public List<InscriptionDto> findAll() {
        return inscriptionRepository.findAll().stream().map(this::toDto).toList();
    }

    public List<InscriptionDto> findByEtudiant(Long etudiantId) {
        return inscriptionRepository.findByEtudiantId(etudiantId).stream().map(this::toDto).toList();
    }

    public Inscription getEntity(Long id) {
        return inscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inscription introuvable : " + id));
    }

    public InscriptionDto create(InscriptionRequest req) {
        if (inscriptionRepository.existsByEtudiantIdAndModuleId(req.etudiantId(), req.moduleId())) {
            throw new BadRequestException("Cet etudiant est deja inscrit a ce module");
        }
        Etudiant etudiant = etudiantService.getEntity(req.etudiantId());
        Module module = moduleService.getEntity(req.moduleId());
        Inscription inscription = Inscription.builder()
                .etudiant(etudiant)
                .module(module)
                .dateInscription(LocalDate.now())
                .build();
        return toDto(inscriptionRepository.save(inscription));
    }

    public void delete(Long id) {
        inscriptionRepository.delete(getEntity(id));
    }

    private InscriptionDto toDto(Inscription i) {
        return new InscriptionDto(
                i.getId(),
                i.getEtudiant().getId(),
                i.getEtudiant().getPrenom() + " " + i.getEtudiant().getNom(),
                i.getModule().getId(),
                i.getModule().getIntitule(),
                i.getDateInscription()
        );
    }
}
