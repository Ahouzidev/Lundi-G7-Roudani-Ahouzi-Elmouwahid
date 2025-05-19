import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Besoin {
  id?: number;
  type: string;
  description: string;
  quantite: number;
  unite: string;
  dateBesoin: Date;
  priorite: 'HAUTE' | 'MOYENNE' | 'BASSE';
  statut: 'EN_ATTENTE' | 'APPROUVE' | 'REJETE' | 'LIVRE';
  satisfait?: boolean;
  projet?: any;
  fournisseur?: any;
}

@Injectable({
  providedIn: 'root'
})
export class BesoinService {
  private apiUrl = `${environment.apiUrl}/besoins`;

  constructor(private http: HttpClient) {}

  getAllBesoins(): Observable<Besoin[]> {
    return this.http.get<Besoin[]>(this.apiUrl);
  }

  getBesoin(id: number): Observable<Besoin> {
    return this.http.get<Besoin>(`${this.apiUrl}/${id}`);
  }

  createBesoin(besoin: Besoin): Observable<Besoin> {
    return this.http.post<Besoin>(this.apiUrl, besoin);
  }

  updateBesoin(id: number, besoin: Besoin): Observable<Besoin> {
    return this.http.put<Besoin>(`${this.apiUrl}/${id}`, besoin);
  }

  deleteBesoin(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 