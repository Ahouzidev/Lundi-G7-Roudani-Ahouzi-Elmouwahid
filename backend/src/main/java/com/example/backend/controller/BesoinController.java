package com.example.backend.controller;

import com.example.backend.entity.Besoin;
import com.example.backend.service.BesoinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/besoins")
@CrossOrigin(origins = "http://localhost:4206")
public class BesoinController {

    @Autowired
    private BesoinService besoinService;

    @GetMapping
    public List<Besoin> getAllBesoins() {
        return besoinService.getAllBesoins();
    }

    @GetMapping("/projet/{projetId}")
    public List<Besoin> getBesoinsByProjet(@PathVariable Long projetId) {
        return besoinService.getBesoinsByProjet(projetId);
    }

    @GetMapping("/fournisseur/{fournisseurId}")
    public List<Besoin> getBesoinsByFournisseur(@PathVariable Long fournisseurId) {
        return besoinService.getBesoinsByFournisseur(fournisseurId);
    }

    @GetMapping("/satisfaits")
    public List<Besoin> getBesoinsSatisfaits() {
        return besoinService.getBesoinsSatisfaits();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Besoin> getBesoinById(@PathVariable Long id) {
        return besoinService.getBesoinById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Besoin createBesoin(@RequestBody Besoin besoin) {
        return besoinService.createBesoin(besoin);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Besoin> updateBesoin(@PathVariable Long id, @RequestBody Besoin besoinDetails) {
        try {
            Besoin updatedBesoin = besoinService.updateBesoin(id, besoinDetails);
            return ResponseEntity.ok(updatedBesoin);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBesoin(@PathVariable Long id) {
        try {
            besoinService.deleteBesoin(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
} 