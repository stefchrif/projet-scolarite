package ma.uit.scolarite.service;

import lombok.RequiredArgsConstructor;
import ma.uit.scolarite.dto.NoteDto;
import ma.uit.scolarite.dto.NoteRequest;
import ma.uit.scolarite.entity.Inscription;
import ma.uit.scolarite.entity.Note;
import ma.uit.scolarite.exception.ResourceNotFoundException;
import ma.uit.scolarite.repository.NoteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final InscriptionService inscriptionService;

    public List<NoteDto> findAll() {
        return noteRepository.findAll().stream().map(this::toDto).toList();
    }

    public List<NoteDto> findByEtudiant(Long etudiantId) {
        return noteRepository.findByInscriptionEtudiantId(etudiantId).stream().map(this::toDto).toList();
    }

    public Note getEntity(Long id) {
        return noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note introuvable : " + id));
    }

    public NoteDto create(NoteRequest req) {
        Inscription inscription = inscriptionService.getEntity(req.inscriptionId());
        Note note = Note.builder()
                .inscription(inscription)
                .valeur(req.valeur())
                .type(req.type())
                .build();
        return toDto(noteRepository.save(note));
    }

    public NoteDto update(Long id, NoteRequest req) {
        Note note = getEntity(id);
        note.setValeur(req.valeur());
        note.setType(req.type());
        return toDto(noteRepository.save(note));
    }

    public void delete(Long id) {
        noteRepository.delete(getEntity(id));
    }

    private NoteDto toDto(Note n) {
        Inscription i = n.getInscription();
        return new NoteDto(
                n.getId(),
                i.getId(),
                i.getEtudiant().getId(),
                i.getEtudiant().getPrenom() + " " + i.getEtudiant().getNom(),
                i.getModule().getId(),
                i.getModule().getIntitule(),
                n.getValeur(),
                n.getType()
        );
    }
}
