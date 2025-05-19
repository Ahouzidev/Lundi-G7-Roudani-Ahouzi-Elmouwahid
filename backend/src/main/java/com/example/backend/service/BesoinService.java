package com.example.backend.service;

import com.example.backend.entity.Besoin;
import com.example.backend.entity.Projet;
import com.example.backend.entity.Fournisseur;
import com.example.backend.repository.BesoinRepository;
import com.example.backend.repository.ProjetRepository;
import com.example.backend.repository.FournisseurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class BesoinService {
    
    @Autowired
    private BesoinRepository besoinRepository;
    
    @Autowired
    private ProjetRepository projetRepository;
    
    @Autowired
    private FournisseurRepository fournisseurRepository;

    public List<Besoin> getAllBesoins() {
        return besoinRepository.findAll();
    }

    public List<Besoin> getBesoinsByProjet(Long projetId) {
        return besoinRepository.findByProjetId(projetId);
    }

    public List<Besoin> getBesoinsSatisfaits() {
        return besoinRepository.findBySatisfait(true);
    }

    public List<Besoin> getBesoinsByFournisseur(Long fournisseurId) {
        return besoinRepository.findByFournisseurId(fournisseurId);
    }

    public Optional<Besoin> getBesoinById(Long id) {
        return besoinRepository.findById(id);
    }

    @Transactional
    public Besoin createBesoin(Besoin besoin) {
        if (besoin.getProjet() != null) {
            Projet projet = projetRepository.findById(besoin.getProjet().getId())
                    .orElseThrow(() -> new RuntimeException("Projet not found"));
            besoin.setProjet(projet);
        }

        if (besoin.getFournisseur() != null) {
            Fournisseur fournisseur = fournisseurRepository.findById(besoin.getFournisseur().getId())
                    .orElseThrow(() -> new RuntimeException("Fournisseur not found"));
            besoin.setFournisseur(fournisseur);
        }

        return besoinRepository.save(besoin);
    }

    @Transactional
    public Besoin updateBesoin(Long id, Besoin besoinDetails) {
        Besoin besoin = besoinRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Besoin not found"));

        besoin.setType(besoinDetails.getType());
        besoin.setDescription(besoinDetails.getDescription());
        besoin.setQuantite(besoinDetails.getQuantite());
        besoin.setUnite(besoinDetails.getUnite());
        besoin.setDateBesoin(besoinDetails.getDateBesoin());
        besoin.setPriorite(besoinDetails.getPriorite());
        besoin.setStatut(besoinDetails.getStatut());
        besoin.setSatisfait(besoinDetails.getSatisfait());

        if (besoinDetails.getProjet() != null) {
            Projet projet = projetRepository.findById(besoinDetails.getProjet().getId())
                    .orElseThrow(() -> new RuntimeException("Projet not found"));
            besoin.setProjet(projet);
        }

        if (besoinDetails.getFournisseur() != null) {
            Fournisseur fournisseur = fournisseurRepository.findById(besoinDetails.getFournisseur().getId())
                    .orElseThrow(() -> new RuntimeException("Fournisseur not found"));
            besoin.setFournisseur(fournisseur);
        }

        return besoinRepository.save(besoin);
    }

    @Transactional
    public void deleteBesoin(Long id) {
        Besoin besoin = besoinRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Besoin not found"));
        besoinRepository.delete(besoin);
    }
} 