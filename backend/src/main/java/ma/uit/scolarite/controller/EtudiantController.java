package ma.uit.scolarite.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.uit.scolarite.dto.EtudiantDto;
import ma.uit.scolarite.dto.EtudiantRequest;
import ma.uit.scolarite.dto.NoteDto;
import ma.uit.scolarite.service.EtudiantService;
import ma.uit.scolarite.service.NoteService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/etudiants")
@RequiredArgsConstructor
public class EtudiantController {

    private final EtudiantService etudiantService;
    private final NoteService noteService;

    @GetMapping
    public List<EtudiantDto> findAll() {
        return etudiantService.findAll();
    }

    @GetMapping("/{id}")
    public EtudiantDto findById(@PathVariable Long id) {
        return etudiantService.findById(id);
    }

    /** Bulletin de l'etudiant : ses notes. */
    @GetMapping("/{id}/notes")
    public List<NoteDto> notes(@PathVariable Long id) {
        return noteService.findByEtudiant(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public EtudiantDto create(@Valid @RequestBody EtudiantRequest req) {
        return etudiantService.create(req);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public EtudiantDto update(@PathVariable Long id, @Valid @RequestBody EtudiantRequest req) {
        return etudiantService.update(id, req);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        etudiantService.delete(id);
    }
}
