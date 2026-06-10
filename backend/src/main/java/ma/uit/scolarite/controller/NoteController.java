package ma.uit.scolarite.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.uit.scolarite.dto.NoteDto;
import ma.uit.scolarite.dto.NoteRequest;
import ma.uit.scolarite.service.NoteService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @GetMapping
    public List<NoteDto> findAll(@RequestParam(required = false) Long etudiantId) {
        return etudiantId != null
                ? noteService.findByEtudiant(etudiantId)
                : noteService.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','ENSEIGNANT')")
    @ResponseStatus(HttpStatus.CREATED)
    public NoteDto create(@Valid @RequestBody NoteRequest req) {
        return noteService.create(req);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ENSEIGNANT')")
    public NoteDto update(@PathVariable Long id, @Valid @RequestBody NoteRequest req) {
        return noteService.update(id, req);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ENSEIGNANT')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        noteService.delete(id);
    }
}
