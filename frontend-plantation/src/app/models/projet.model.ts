export interface Projet {
  id: number;
  nom: string;
  description?: string;
  dateDebut: Date;
  dateFin?: Date;
  budget: number;
  statut: string;
  zone: {
    id: number;
    nom: string;
  };
  employes?: any[];
} 