package ma.uit.scolarite.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.uit.scolarite.dto.FiliereDto;
import ma.uit.scolarite.service.FiliereService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/filieres")
@RequiredArgsConstructor
public class FiliereController {

    private final FiliereService filiereService;

    @GetMapping
    public List<FiliereDto> findAll() {
        return filiereService.findAll();
    }

    @GetMapping("/{id}")
    public FiliereDto findById(@PathVariable Long id) {
        return filiereService.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public FiliereDto create(@Valid @RequestBody FiliereDto dto) {
        return filiereService.create(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public FiliereDto update(@PathVariable Long id, @Valid @RequestBody FiliereDto dto) {
        return filiereService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        filiereService.delete(id);
    }
}
