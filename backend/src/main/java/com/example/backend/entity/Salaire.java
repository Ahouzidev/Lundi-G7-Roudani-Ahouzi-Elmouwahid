package com.example.backend.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Date;

@Entity
public class Salaire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @Temporal(TemporalType.DATE)
    private Date datePaiement;

    @Column(nullable = false)
    private Double montant;

    @Column(nullable = false)
    private Integer nombreJoursTravailles;

    @ManyToOne
    @JoinColumn(name = "employe_id", nullable = false)
    @JsonIgnoreProperties("salaires")
    private Employe employe;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getDatePaiement() {
        return datePaiement;
    }

    public void setDatePaiement(Date datePaiement) {
        this.datePaiement = datePaiement;
    }

    public Double getMontant() {
        return montant;
    }

    public void setMontant(Double montant) {
        this.montant = montant;
    }

    public Integer getNombreJoursTravailles() {
        return nombreJoursTravailles;
    }

    public void setNombreJoursTravailles(Integer nombreJoursTravailles) {
        this.nombreJoursTravailles = nombreJoursTravailles;
    }

    public Employe getEmploye() {
        return employe;
    }

    public void setEmploye(Employe employe) {
        this.employe = employe;
    }
} 