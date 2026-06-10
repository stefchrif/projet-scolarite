package ma.uit.scolarite.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.uit.scolarite.dto.EnseignantDto;
import ma.uit.scolarite.service.EnseignantService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enseignants")
@RequiredArgsConstructor
public class EnseignantController {

    private final EnseignantService enseignantService;

    @GetMapping
    public List<EnseignantDto> findAll() {
        return enseignantService.findAll();
    }

    @GetMapping("/{id}")
    public EnseignantDto findById(@PathVariable Long id) {
        return enseignantService.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public EnseignantDto create(@Valid @RequestBody EnseignantDto dto) {
        return enseignantService.create(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public EnseignantDto update(@PathVariable Long id, @Valid @RequestBody EnseignantDto dto) {
        return enseignantService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        enseignantService.delete(id);
    }
}
