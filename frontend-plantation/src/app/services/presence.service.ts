import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Employe } from './employe.service'; // Supposant que vous avez une interface Employe

export interface Presence {
  id?: number;
  date: string; // Format YYYY-MM-DD
  present: boolean;
  motifAbsence?: string;
  employe: { id: number } | Employe; // Peut être juste l'ID ou l'objet Employe complet
}

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  private apiUrl = `${environment.apiUrl}/presences`;

  constructor(private http: HttpClient) {}

  getAllPresences(): Observable<Presence[]> {
    return this.http.get<Presence[]>(this.apiUrl);
  }

  getPresenceById(id: number): Observable<Presence> {
    return this.http.get<Presence>(`${this.apiUrl}/${id}`);
  }

  getPresencesByEmploye(employeId: number): Observable<Presence[]> {
    return this.http.get<Presence[]>(`${this.apiUrl}/employe/${employeId}`);
  }

  getPresencesByEmployeAndDateRange(employeId: number, dateDebut: string, dateFin: string): Observable<Presence[]> {
    return this.http.get<Presence[]>(`${this.apiUrl}/employe/${employeId}/periode?dateDebut=${dateDebut}&dateFin=${dateFin}`);
  }

  createPresence(presence: Presence): Observable<Presence> {
    return this.http.post<Presence>(this.apiUrl, presence);
  }

  updatePresence(id: number, presence: Presence): Observable<Presence> {
    return this.http.put<Presence>(`${this.apiUrl}/${id}`, presence);
  }

  deletePresence(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 