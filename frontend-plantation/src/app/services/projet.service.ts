import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Projet } from '../models/projet.model';

@Injectable({
  providedIn: 'root'
})
export class ProjetService {
  private apiUrl = `${environment.apiUrl}/projets`;

  constructor(private http: HttpClient) {}

  getAllProjets(): Observable<Projet[]> {
    return this.http.get<Projet[]>(this.apiUrl);
  }

  getProjet(id: number): Observable<Projet> {
    return this.http.get<Projet>(`${this.apiUrl}/${id}`);
  }

  getProjetsByZone(zoneId: number): Observable<Projet[]> {
    return this.http.get<Projet[]>(`${this.apiUrl}/zone/${zoneId}`);
  }

  createProjet(projet: Projet): Observable<Projet> {
    return this.http.post<Projet>(this.apiUrl, projet);
  }

  updateProjet(id: number, projet: Projet): Observable<Projet> {
    return this.http.put<Projet>(`${this.apiUrl}/${id}`, projet);
  }

  deleteProjet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  removeEmployeFromProjet(projetId: number, employeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${projetId}/employes/${employeId}`);
  }

  addEmployeToProjet(projetId: number, employeId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${projetId}/employes/${employeId}`, {});
  }
} 