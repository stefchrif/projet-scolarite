package ma.uit.scolarite.controller;

import lombok.RequiredArgsConstructor;
import ma.uit.scolarite.dto.DashboardStats;
import ma.uit.scolarite.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public DashboardStats stats() {
        return dashboardService.getStats();
    }
}
