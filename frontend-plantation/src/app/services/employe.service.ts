import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Employe {
  id?: number;
  nom: string;
  prenom: string;
  fonction: string;
  dateEmbauche: Date;
  numeroTelephone: string;
  email: string;
  tauxJournalier: number;
  projet?: Projet;
}

export interface Projet {
  id?: number;
  nom: string;
  description?: string;
  dateDebut: Date;
  dateFin?: Date;
  budget?: number;
  statut: string;
  zone?: Zone;
}

export interface Zone {
  id?: number;
  nom: string;
  localisation: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeService {
  private apiUrl = `${environment.apiUrl}/employes`;

  constructor(private http: HttpClient) { }

  getAllEmployes(): Observable<Employe[]> {
    return this.http.get<Employe[]>(this.apiUrl);
  }

  getEmploye(id: number): Observable<Employe> {
    return this.http.get<Employe>(`${this.apiUrl}/${id}`);
  }

  createEmploye(employe: Employe): Observable<Employe> {
    return this.http.post<Employe>(this.apiUrl, employe);
  }

  updateEmploye(id: number, employe: Employe): Observable<Employe> {
    return this.http.put<Employe>(`${this.apiUrl}/${id}`, employe);
  }

  deleteEmploye(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 