package com.example.backend.service;

import com.example.backend.entity.Fournisseur;
import com.example.backend.repository.FournisseurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class FournisseurService {
    
    @Autowired
    private FournisseurRepository fournisseurRepository;

    public List<Fournisseur> getAllFournisseurs() {
        return fournisseurRepository.findAll();
    }

    public List<Fournisseur> getFournisseursByType(String typeProduit) {
        return fournisseurRepository.findByTypeProduit(typeProduit);
    }

    public Optional<Fournisseur> getFournisseurById(Long id) {
        return fournisseurRepository.findById(id);
    }

    public Fournisseur createFournisseur(Fournisseur fournisseur) {
        return fournisseurRepository.save(fournisseur);
    }

    public Fournisseur updateFournisseur(Long id, Fournisseur fournisseurDetails) {
        Fournisseur fournisseur = fournisseurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé avec l'id: " + id));
        
        fournisseur.setNom(fournisseurDetails.getNom());
        fournisseur.setTypeProduit(fournisseurDetails.getTypeProduit());
        fournisseur.setAdresse(fournisseurDetails.getAdresse());
        fournisseur.setTelephone(fournisseurDetails.getTelephone());
        fournisseur.setEmail(fournisseurDetails.getEmail());
        
        return fournisseurRepository.save(fournisseur);
    }

    public void deleteFournisseur(Long id) {
        Fournisseur fournisseur = fournisseurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé avec l'id: " + id));
        fournisseurRepository.delete(fournisseur);
    }
} 