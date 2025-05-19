package com.example.backend.service;

import com.example.backend.entity.Projet;
import com.example.backend.repository.ProjetRepository;
import com.example.backend.repository.ZoneRepository;
import com.example.backend.repository.EmployeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProjetService {
    
    @Autowired
    private ProjetRepository projetRepository;
    
    @Autowired
    private ZoneRepository zoneRepository;

    @Autowired
    private EmployeRepository employeRepository;

    public List<Projet> getAllProjets() {
        return projetRepository.findAll();
    }

    public List<Projet> getProjetsByZone(Long zoneId) {
        return projetRepository.findByZoneId(zoneId);
    }

    public Optional<Projet> getProjetById(Long id) {
        return projetRepository.findById(id);
    }

    public Projet createProjet(Projet projet) {
        // Vérifier si la zone existe
        zoneRepository.findById(projet.getZone().getId())
                .orElseThrow(() -> new RuntimeException("Zone non trouvée avec l'id: " + projet.getZone().getId()));
        return projetRepository.save(projet);
    }

    public Projet updateProjet(Long id, Projet projetDetails) {
        Projet projet = projetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé avec l'id: " + id));
        
        projet.setNom(projetDetails.getNom());
        projet.setDescription(projetDetails.getDescription());
        projet.setDateDebut(projetDetails.getDateDebut());
        projet.setDateFin(projetDetails.getDateFin());
        projet.setBudget(projetDetails.getBudget());
        projet.setStatut(projetDetails.getStatut());
        
        if (projetDetails.getZone() != null) {
            zoneRepository.findById(projetDetails.getZone().getId())
                    .orElseThrow(() -> new RuntimeException("Zone non trouvée avec l'id: " + projetDetails.getZone().getId()));
            projet.setZone(projetDetails.getZone());
        }
        
        return projetRepository.save(projet);
    }

    public void deleteProjet(Long id) {
        Projet projet = projetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé avec l'id: " + id));
        projetRepository.delete(projet);
    }

    public void addEmployeToProjet(Long projetId, Long employeId) {
        Projet projet = projetRepository.findById(projetId)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé avec l'id: " + projetId));
        
        var employe = employeRepository.findById(employeId)
                .orElseThrow(() -> new RuntimeException("Employé non trouvé avec l'id: " + employeId));
        
        employe.setProjet(projet);
        employeRepository.save(employe);
    }
} 