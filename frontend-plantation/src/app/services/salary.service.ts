import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import { Employe } from './employe.service';
import { environment } from '../../environments/environment';

export interface Attendance {
    id: number;
    date: string;
    present: boolean;
    motifAbsence?: string;
    employe: { id: number };
}

export interface SalaryCalculation {
    employeeId: number;
    employeeName: string;
    daysWorked: number;
    dailyRate: number;
    totalSalary: number;
}

@Injectable({
  providedIn: 'root'
})
export class SalaryService {
  private apiUrl = `${environment.apiUrl}/presences`;

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employe[]> {
    return this.http.get<Employe[]>(`${this.apiUrl}/employees`);
  }

  getAttendanceRecords(employeeId: number, startDate: Date, endDate: Date): Observable<Attendance[]> {
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    return this.http.get<Attendance[]>(`${this.apiUrl}/employe/${employeeId}/periode`, {
      params: {
        dateDebut: formattedStartDate,
        dateFin: formattedEndDate
      }
    });
  }

  calculateSalary(employeeId: number, startDate: Date, endDate: Date): Observable<SalaryCalculation> {
    return this.getAttendanceRecords(employeeId, startDate, endDate).pipe(
      map(records => {
        const daysWorked = records.filter(record => record.present).length;
        return {
          employeeId,
          employeeName: '', // This will be filled by the component
          daysWorked,
          dailyRate: 0, // This will be filled by the component
          totalSalary: 0 // This will be calculated by the component
        };
      })
    );
  }
} 