package com.example.backend.repository;

import com.example.backend.entity.Vehicule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VehiculeRepository extends JpaRepository<Vehicule, Long> {
    List<Vehicule> findByProjetId(Long projetId);
    List<Vehicule> findByDisponible(boolean disponible);
} 