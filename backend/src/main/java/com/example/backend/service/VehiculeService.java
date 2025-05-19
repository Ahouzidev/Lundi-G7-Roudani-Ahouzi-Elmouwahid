package com.example.backend.service;

import com.example.backend.entity.Vehicule;
import com.example.backend.entity.Projet;
import com.example.backend.repository.VehiculeRepository;
import com.example.backend.repository.ProjetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class VehiculeService {
    
    @Autowired
    private VehiculeRepository vehiculeRepository;
    
    @Autowired
    private ProjetRepository projetRepository;

    public List<Vehicule> getAllVehicules() {
        return vehiculeRepository.findAll();
    }

    public List<Vehicule> getVehiculesByProjet(Long projetId) {
        return vehiculeRepository.findByProjetId(projetId);
    }

    public List<Vehicule> getVehiculesDisponibles() {
        return vehiculeRepository.findByDisponible(true);
    }

    public Optional<Vehicule> getVehiculeById(Long id) {
        return vehiculeRepository.findById(id);
    }

    @Transactional
    public Vehicule createVehicule(Vehicule vehicule) {
        if (vehicule.getProjet() != null) {
            Projet projet = projetRepository.findById(vehicule.getProjet().getId())
                    .orElseThrow(() -> new RuntimeException("Projet not found"));
            vehicule.setProjet(projet);
        }
        return vehiculeRepository.save(vehicule);
    }

    @Transactional
    public Vehicule updateVehicule(Long id, Vehicule vehiculeDetails) {
        Vehicule vehicule = vehiculeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicule not found"));
        
        vehicule.setMarque(vehiculeDetails.getMarque());
        vehicule.setModele(vehiculeDetails.getModele());
        vehicule.setImmatriculation(vehiculeDetails.getImmatriculation());
        vehicule.setType(vehiculeDetails.getType());
        vehicule.setDateAcquisition(vehiculeDetails.getDateAcquisition());
        vehicule.setKilometrage(vehiculeDetails.getKilometrage());
        vehicule.setStatut(vehiculeDetails.getStatut());
        vehicule.setEtat(vehiculeDetails.getEtat());
        vehicule.setDisponible(vehiculeDetails.getDisponible());
        
        if (vehiculeDetails.getProjet() != null) {
            Projet projet = projetRepository.findById(vehiculeDetails.getProjet().getId())
                    .orElseThrow(() -> new RuntimeException("Projet not found"));
            vehicule.setProjet(projet);
        }
        
        return vehiculeRepository.save(vehicule);
    }

    @Transactional
    public void deleteVehicule(Long id) {
        Vehicule vehicule = vehiculeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicule not found"));
        vehiculeRepository.delete(vehicule);
    }
} 