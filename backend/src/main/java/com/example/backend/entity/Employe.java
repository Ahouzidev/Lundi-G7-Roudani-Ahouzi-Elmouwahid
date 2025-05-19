package com.example.backend.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Date;
import java.util.List;

@Entity
public class Employe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false)
    private String fonction;

    @Column(nullable = false)
    @Temporal(TemporalType.DATE)
    private Date dateEmbauche;

    @Column(nullable = false)
    private String numeroTelephone;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private Double tauxJournalier;

    @ManyToOne
    @JoinColumn(name = "projet_id")
    @JsonIgnoreProperties("employes")
    private Projet projet;

    @OneToMany(mappedBy = "employe", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("employe")
    private List<Presence> presences;

    @OneToMany(mappedBy = "employe", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("employe")
    private List<Salaire> salaires;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getFonction() {
        return fonction;
    }

    public void setFonction(String fonction) {
        this.fonction = fonction;
    }

    public Date getDateEmbauche() {
        return dateEmbauche;
    }

    public void setDateEmbauche(Date dateEmbauche) {
        this.dateEmbauche = dateEmbauche;
    }

    public String getNumeroTelephone() {
        return numeroTelephone;
    }

    public void setNumeroTelephone(String numeroTelephone) {
        this.numeroTelephone = numeroTelephone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Double getTauxJournalier() {
        return tauxJournalier;
    }

    public void setTauxJournalier(Double tauxJournalier) {
        this.tauxJournalier = tauxJournalier;
    }

    public Projet getProjet() {
        return projet;
    }

    public void setProjet(Projet projet) {
        this.projet = projet;
    }

    public List<Presence> getPresences() {
        return presences;
    }

    public void setPresences(List<Presence> presences) {
        this.presences = presences;
    }

    public List<Salaire> getSalaires() {
        return salaires;
    }

    public void setSalaires(List<Salaire> salaires) {
        this.salaires = salaires;
    }
} 