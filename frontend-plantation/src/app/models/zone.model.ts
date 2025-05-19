export interface Zone {
  id: number;
  nom: string;
  localisation?: string;
  description?: string;
  superficie?: number;
  typeSol?: string;
  projets?: any[];
} 