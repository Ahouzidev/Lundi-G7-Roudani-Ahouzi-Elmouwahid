import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Zone } from '../models/zone.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {
  private apiUrl = `${environment.apiUrl}/zones`;

  constructor(private http: HttpClient) {}

  getAllZones(): Observable<Zone[]> {
    return this.http.get<Zone[]>(this.apiUrl);
  }

  getZoneById(id: number): Observable<Zone> {
    return this.http.get<Zone>(`${this.apiUrl}/${id}`);
  }

  createZone(zone: Zone): Observable<Zone> {
    return this.http.post<Zone>(this.apiUrl, zone);
  }

  updateZone(id: number, zone: Zone): Observable<Zone> {
    return this.http.put<Zone>(`${this.apiUrl}/${id}`, zone);
  }

  deleteZone(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 