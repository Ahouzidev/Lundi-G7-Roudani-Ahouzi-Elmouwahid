package com.example.backend.service;

import com.example.backend.entity.Salaire;
import com.example.backend.repository.SalaireRepository;
import com.example.backend.repository.EmployeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class SalaireService {
    
    @Autowired
    private SalaireRepository salaireRepository;
    
    @Autowired
    private EmployeRepository employeRepository;

    public List<Salaire> getAllSalaires() {
        return salaireRepository.findAll();
    }

    public List<Salaire> getSalairesByEmploye(Long employeId) {
        return salaireRepository.findByEmployeId(employeId);
    }

    public List<Salaire> getSalairesByEmployeAndDateRange(Long employeId, LocalDate dateDebut, LocalDate dateFin) {
        return salaireRepository.findByEmployeIdAndDatePaiementBetween(employeId, dateDebut, dateFin);
    }

    public Optional<Salaire> getSalaireById(Long id) {
        return salaireRepository.findById(id);
    }

    public Salaire createSalaire(Salaire salaire) {
        // Vérifier si l'employé existe
        employeRepository.findById(salaire.getEmploye().getId())
                .orElseThrow(() -> new RuntimeException("Employé non trouvé avec l'id: " + salaire.getEmploye().getId()));
        return salaireRepository.save(salaire);
    }

    public Salaire updateSalaire(Long id, Salaire salaireDetails) {
        Salaire salaire = salaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Salaire non trouvé avec l'id: " + id));
        
        salaire.setDatePaiement(salaireDetails.getDatePaiement());
        salaire.setMontant(salaireDetails.getMontant());
        salaire.setNombreJoursTravailles(salaireDetails.getNombreJoursTravailles());
        
        if (salaireDetails.getEmploye() != null) {
            employeRepository.findById(salaireDetails.getEmploye().getId())
                    .orElseThrow(() -> new RuntimeException("Employé non trouvé avec l'id: " + salaireDetails.getEmploye().getId()));
            salaire.setEmploye(salaireDetails.getEmploye());
        }
        
        return salaireRepository.save(salaire);
    }

    public void deleteSalaire(Long id) {
        Salaire salaire = salaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Salaire non trouvé avec l'id: " + id));
        salaireRepository.delete(salaire);
    }
} 