package com.example.backend.service;

import com.example.backend.entity.Employe;
import com.example.backend.repository.EmployeRepository;
import com.example.backend.repository.ProjetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EmployeService {
    
    @Autowired
    private EmployeRepository employeRepository;
    
    @Autowired
    private ProjetRepository projetRepository;

    public List<Employe> getAllEmployes() {
        return employeRepository.findAll();
    }

    public List<Employe> getEmployesByProjet(Long projetId) {
        return employeRepository.findByProjetId(projetId);
    }

    public Optional<Employe> getEmployeById(Long id) {
        return employeRepository.findById(id);
    }

    public Employe createEmploye(Employe employe) {
        // Vérifier si le projet existe seulement s'il est fourni
        if (employe.getProjet() != null && employe.getProjet().getId() != null) {
            projetRepository.findById(employe.getProjet().getId())
                    .orElseThrow(() -> new RuntimeException("Projet non trouvé avec l'id: " + employe.getProjet().getId()));
        }
        return employeRepository.save(employe);
    }

    public Employe updateEmploye(Long id, Employe employeDetails) {
        Employe employe = employeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employé non trouvé avec l'id: " + id));
        
        employe.setNom(employeDetails.getNom());
        employe.setPrenom(employeDetails.getPrenom());
        employe.setFonction(employeDetails.getFonction());
        employe.setDateEmbauche(employeDetails.getDateEmbauche());
        employe.setNumeroTelephone(employeDetails.getNumeroTelephone());
        employe.setEmail(employeDetails.getEmail());
        employe.setTauxJournalier(employeDetails.getTauxJournalier());
        
        if (employeDetails.getProjet() != null) {
            projetRepository.findById(employeDetails.getProjet().getId())
                    .orElseThrow(() -> new RuntimeException("Projet non trouvé avec l'id: " + employeDetails.getProjet().getId()));
            employe.setProjet(employeDetails.getProjet());
        } else {
            employe.setProjet(null);
        }
        
        return employeRepository.save(employe);
    }

    public void deleteEmploye(Long id) {
        Employe employe = employeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employé non trouvé avec l'id: " + id));
        employeRepository.delete(employe);
    }
} 