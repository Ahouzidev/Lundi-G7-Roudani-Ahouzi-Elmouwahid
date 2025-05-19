package com.example.backend.repository;

import com.example.backend.entity.Salaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface SalaireRepository extends JpaRepository<Salaire, Long> {
    List<Salaire> findByEmployeId(Long employeId);
    List<Salaire> findByEmployeIdAndDatePaiementBetween(Long employeId, LocalDate dateDebut, LocalDate dateFin);
} 