package ma.uit.scolarite.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.uit.scolarite.dto.ModuleDto;
import ma.uit.scolarite.dto.ModuleRequest;
import ma.uit.scolarite.service.ModuleService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modules")
@RequiredArgsConstructor
public class ModuleController {

    private final ModuleService moduleService;

    @GetMapping
    public List<ModuleDto> findAll() {
        return moduleService.findAll();
    }

    @GetMapping("/{id}")
    public ModuleDto findById(@PathVariable Long id) {
        return moduleService.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public ModuleDto create(@Valid @RequestBody ModuleRequest req) {
        return moduleService.create(req);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ModuleDto update(@PathVariable Long id, @Valid @RequestBody ModuleRequest req) {
        return moduleService.update(id, req);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        moduleService.delete(id);
    }
}
