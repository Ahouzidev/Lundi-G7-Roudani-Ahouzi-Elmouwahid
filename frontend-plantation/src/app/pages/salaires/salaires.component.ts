import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PresenceDialogComponent } from '../presences/presence-dialog/presence-dialog.component';
import { EmployeService, Employe } from '../../services/employe.service';
import { SalaryService, Attendance } from '../../services/salary.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-salaires',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule
  ],
  template: `
    <div class="container">
      <h1>Gestion des Salaires</h1>
      <mat-card>
        <mat-card-content>
          <div class="date-filters">
            <mat-form-field>
              <mat-label>Date de début</mat-label>
              <input matInput [matDatepicker]="startPicker" [(ngModel)]="startDate" (dateChange)="loadWorkingDays()">
              <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
              <mat-datepicker #startPicker></mat-datepicker>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Date de fin</mat-label>
              <input matInput [matDatepicker]="endPicker" [(ngModel)]="endDate" (dateChange)="loadWorkingDays()">
              <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
              <mat-datepicker #endPicker></mat-datepicker>
            </mat-form-field>

            <button mat-raised-button color="primary" (click)="calculateSalaries()">
              Calculer les salaires
            </button>
          </div>

          <table mat-table [dataSource]="employees" class="mat-elevation-z8">
            <ng-container matColumnDef="nom">
              <th mat-header-cell *matHeaderCellDef>Nom</th>
              <td mat-cell *matCellDef="let element">{{element.nom}} {{element.prenom}}</td>
            </ng-container>

            <ng-container matColumnDef="fonction">
              <th mat-header-cell *matHeaderCellDef>Fonction</th>
              <td mat-cell *matCellDef="let element">{{element.fonction}}</td>
            </ng-container>

            <ng-container matColumnDef="tauxJournalier">
              <th mat-header-cell *matHeaderCellDef>Taux Journalier</th>
              <td mat-cell *matCellDef="let element">{{element.tauxJournalier}} DH</td>
            </ng-container>

            <ng-container matColumnDef="joursTravailles">
              <th mat-header-cell *matHeaderCellDef>Jours Travaillés</th>
              <td mat-cell *matCellDef="let element">
                <div class="working-days">
                  <span class="days-number">{{element.joursTravailles || 0}}</span>
                  <span class="days-label">jours</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="salaire">
              <th mat-header-cell *matHeaderCellDef>Salaire</th>
              <td mat-cell *matCellDef="let element">{{element.salaireCalcule || '-'}} DH</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    h1 {
      margin-bottom: 20px;
      color: #333;
    }
    .date-filters {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      align-items: center;
    }
    table {
      width: 100%;
    }
    .mat-mdc-form-field {
      width: 200px;
    }
    .working-days {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .days-number {
      font-size: 1.2em;
      font-weight: bold;
      color: #1976d2;
    }
    .days-label {
      color: #666;
      font-size: 0.9em;
    }
  `]
})
export class SalairesComponent implements OnInit {
  employees: (Employe & { salaireCalcule?: number; joursTravailles?: number })[] = [];
  displayedColumns: string[] = ['nom', 'fonction', 'tauxJournalier', 'joursTravailles', 'salaire'];
  startDate: Date = new Date();
  endDate: Date = new Date();

  constructor(
    private dialog: MatDialog,
    private employeService: EmployeService,
    private salaryService: SalaryService
  ) {
    // Set default date range to current month
    this.startDate = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), 1);
    this.endDate = new Date(this.startDate.getFullYear(), this.startDate.getMonth() + 1, 0);
  }

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeService.getAllEmployes().subscribe(employees => {
      this.employees = employees.map(emp => ({
        ...emp,
        joursTravailles: 0,
        salaireCalcule: 0
      }));
      this.loadWorkingDays();
    });
  }

  loadWorkingDays() {
    const requests = this.employees
      .filter(emp => emp.id)
      .map(emp => {
        return this.salaryService.getAttendanceRecords(emp.id!, this.startDate, this.endDate)
          .pipe(
            map(records => ({
              employeeId: emp.id,
              workingDays: records.filter(record => record.present).length
            }))
          );
      });

    if (requests.length > 0) {
      forkJoin(requests).subscribe(results => {
        results.forEach(result => {
          const index = this.employees.findIndex(e => e.id === result.employeeId);
          if (index !== -1) {
            this.employees[index].joursTravailles = result.workingDays;
          }
        });
      });
    }
  }

  calculateSalaries() {
    this.employees.forEach(employee => {
      const employeeId = employee.id;
      if (employeeId) {
        this.salaryService.calculateSalary(employeeId, this.startDate, this.endDate)
          .subscribe(calculation => {
            const index = this.employees.findIndex(e => e.id === employeeId);
            if (index !== -1) {
              const employee = this.employees[index];
              employee.salaireCalcule = employee.joursTravailles! * employee.tauxJournalier;
            }
          });
      }
    });
  }
} 