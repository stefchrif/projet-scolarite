package ma.uit.scolarite.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.uit.scolarite.dto.InscriptionDto;
import ma.uit.scolarite.dto.InscriptionRequest;
import ma.uit.scolarite.service.InscriptionService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inscriptions")
@RequiredArgsConstructor
public class InscriptionController {

    private final InscriptionService inscriptionService;

    @GetMapping
    public List<InscriptionDto> findAll(@RequestParam(required = false) Long etudiantId) {
        return etudiantId != null
                ? inscriptionService.findByEtudiant(etudiantId)
                : inscriptionService.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public InscriptionDto create(@Valid @RequestBody InscriptionRequest req) {
        return inscriptionService.create(req);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        inscriptionService.delete(id);
    }
}
