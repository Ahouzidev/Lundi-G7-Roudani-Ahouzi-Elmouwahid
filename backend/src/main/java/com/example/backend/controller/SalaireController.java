package com.example.backend.controller;

import com.example.backend.entity.Salaire;
import com.example.backend.service.SalaireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/salaires")
@CrossOrigin(origins = "http://localhost:4206")
public class SalaireController {

    @Autowired
    private SalaireService salaireService;

    @GetMapping
    public List<Salaire> getAllSalaires() {
        return salaireService.getAllSalaires();
    }

    @GetMapping("/employe/{employeId}")
    public List<Salaire> getSalairesByEmploye(@PathVariable Long employeId) {
        return salaireService.getSalairesByEmploye(employeId);
    }

    @GetMapping("/employe/{employeId}/periode")
    public List<Salaire> getSalairesByEmployeAndDateRange(
            @PathVariable Long employeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {
        return salaireService.getSalairesByEmployeAndDateRange(employeId, dateDebut, dateFin);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Salaire> getSalaireById(@PathVariable Long id) {
        return salaireService.getSalaireById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Salaire createSalaire(@RequestBody Salaire salaire) {
        return salaireService.createSalaire(salaire);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Salaire> updateSalaire(@PathVariable Long id, @RequestBody Salaire salaireDetails) {
        try {
            Salaire updatedSalaire = salaireService.updateSalaire(id, salaireDetails);
            return ResponseEntity.ok(updatedSalaire);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSalaire(@PathVariable Long id) {
        try {
            salaireService.deleteSalaire(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
} 