package com.example.backend.controller;

import com.example.backend.entity.Presence;
import com.example.backend.service.PresenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/presences")
@CrossOrigin(origins = "http://localhost:4206")
public class PresenceController {

    @Autowired
    private PresenceService presenceService;

    @GetMapping
    public List<Presence> getAllPresences() {
        return presenceService.getAllPresences();
    }

    @GetMapping("/employe/{employeId}")
    public List<Presence> getPresencesByEmploye(@PathVariable Long employeId) {
        return presenceService.getPresencesByEmploye(employeId);
    }

    @GetMapping("/employe/{employeId}/periode")
    public List<Presence> getPresencesByEmployeAndDateRange(
            @PathVariable Long employeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {
        return presenceService.getPresencesByEmployeAndDateRange(employeId, dateDebut, dateFin);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Presence> getPresenceById(@PathVariable Long id) {
        return presenceService.getPresenceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Presence createPresence(@RequestBody Presence presence) {
        return presenceService.createPresence(presence);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Presence> updatePresence(@PathVariable Long id, @RequestBody Presence presenceDetails) {
        try {
            Presence updatedPresence = presenceService.updatePresence(id, presenceDetails);
            return ResponseEntity.ok(updatedPresence);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePresence(@PathVariable Long id) {
        try {
            presenceService.deletePresence(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
} 