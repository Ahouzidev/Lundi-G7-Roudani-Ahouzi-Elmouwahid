package com.example.backend.service;

import com.example.backend.entity.Presence;
import com.example.backend.entity.Employe;
import com.example.backend.repository.PresenceRepository;
import com.example.backend.repository.EmployeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PresenceService {
    
    @Autowired
    private PresenceRepository presenceRepository;
    
    @Autowired
    private EmployeRepository employeRepository;

    public List<Presence> getAllPresences() {
        return presenceRepository.findAll();
    }

    public List<Presence> getPresencesByEmploye(Long employeId) {
        return presenceRepository.findByEmployeId(employeId);
    }

    public List<Presence> getPresencesByEmployeAndDateRange(Long employeId, LocalDate dateDebut, LocalDate dateFin) {
        return presenceRepository.findByEmployeIdAndDateBetween(employeId, dateDebut, dateFin);
    }

    public Optional<Presence> getPresenceById(Long id) {
        return presenceRepository.findById(id);
    }

    @Transactional
    public Presence createPresence(Presence presence) {
        if (presence.getEmploye() != null) {
            Employe employe = employeRepository.findById(presence.getEmploye().getId())
                    .orElseThrow(() -> new RuntimeException("Employe not found"));
            presence.setEmploye(employe);
        }
        
        // Ensure the date is in the correct format
        if (presence.getDate() != null) {
            presence.setDate(presence.getDate());
        }
        
        return presenceRepository.save(presence);
    }

    @Transactional
    public Presence updatePresence(Long id, Presence presenceDetails) {
        Presence presence = presenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Presence not found"));
        
        // Ensure the date is in the correct format
        if (presenceDetails.getDate() != null) {
            presence.setDate(presenceDetails.getDate());
        }
        
        presence.setPresent(presenceDetails.getPresent());
        presence.setMotifAbsence(presenceDetails.getPresent() ? null : presenceDetails.getMotifAbsence());
        
        if (presenceDetails.getEmploye() != null) {
            Employe employe = employeRepository.findById(presenceDetails.getEmploye().getId())
                    .orElseThrow(() -> new RuntimeException("Employe not found"));
            presence.setEmploye(employe);
        }
        
        return presenceRepository.save(presence);
    }

    @Transactional
    public void deletePresence(Long id) {
        Presence presence = presenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Presence not found"));
        presenceRepository.delete(presence);
    }
} 