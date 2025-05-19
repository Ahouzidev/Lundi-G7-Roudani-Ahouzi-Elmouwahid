package com.example.backend.repository;

import com.example.backend.entity.Presence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PresenceRepository extends JpaRepository<Presence, Long> {
    List<Presence> findByEmployeId(Long employeId);
    List<Presence> findByEmployeIdAndDateBetween(Long employeId, LocalDate dateDebut, LocalDate dateFin);
} 