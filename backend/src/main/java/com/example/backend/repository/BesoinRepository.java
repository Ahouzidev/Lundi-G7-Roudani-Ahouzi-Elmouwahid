package com.example.backend.repository;

import com.example.backend.entity.Besoin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BesoinRepository extends JpaRepository<Besoin, Long> {
    List<Besoin> findByProjetId(Long projetId);
    List<Besoin> findBySatisfait(boolean satisfait);
    List<Besoin> findByFournisseurId(Long fournisseurId);
} 