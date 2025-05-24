import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { PresenceService, Presence } from '../../services/presence.service';
import { EmployeService, Employe } from '../../services/employe.service';
import { PresenceDialogComponent } from './presence-dialog/presence-dialog.component';

interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPresent?: boolean;
  motifAbsence?: string | null;
}

interface Week {
  days: CalendarDay[];
}

@Component({
  selector: 'app-presences',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Calendrier des Présences</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="employee-select">
            <mat-form-field>
              <mat-label>Sélectionner un employé</mat-label>
              <mat-select [(ngModel)]="selectedEmploye" (selectionChange)="onEmployeSelected()">
                <mat-option *ngFor="let employe of employes" [value]="employe">
                  {{employe.nom}} {{employe.prenom}}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          <div class="calendar-controls">
            <button mat-icon-button (click)="previousMonth()">
              <mat-icon>chevron_left</mat-icon>
            </button>
            <h2>{{ currentMonth | date:'MMMM yyyy' }}</h2>
            <button mat-icon-button (click)="nextMonth()">
              <mat-icon>chevron_right</mat-icon>
            </button>
          </div>
          <table class="calendar-table">
            <thead>
              <tr>
                <th>Dim</th>
                <th>Lun</th>
                <th>Mar</th>
                <th>Mer</th>
                <th>Jeu</th>
                <th>Ven</th>
                <th>Sam</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let week of calendarWeeks">
                <td *ngFor="let day of week.days"
                    [ngClass]="{
                      'current-month': day.isCurrentMonth,
                      'other-month': !day.isCurrentMonth,
                      'present': day.isPresent === true,
                      'absent': day.isPresent === false && day.isCurrentMonth,
                      'today': day.isToday
                    }"
                    (click)="day.isCurrentMonth && onDateSelected(day.date)">
                  <span class="day-number">{{ day.dayOfMonth }}</span>
                  <div *ngIf="day.isCurrentMonth && day.isPresent === false && day.motifAbsence" class="motif-tooltip">
                    {{ day.motifAbsence }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    .employee-select {
      margin-bottom: 20px;
    }
    .employee-select mat-form-field {
      width: 100%;
      max-width: 400px;
    }
    .calendar-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .calendar-controls h2 {
      margin: 0;
      font-size: 1.5em;
    }
    .calendar-table {
      width: 100%;
      border-collapse: collapse;
    }
    .calendar-table th, .calendar-table td {
      border: 1px solid #e0e0e0;
      padding: 8px;
      text-align: center;
      height: 70px;
      vertical-align: top;
    }
    .calendar-table th {
      background-color: #f5f5f5;
    }
    .day-number {
      font-size: 0.9em;
      display: block;
      margin-bottom: 5px;
    }
    .current-month {
      background-color: #ffffff;
      cursor: pointer;
    }
    .current-month:hover {
      background-color: #f9f9f9;
    }
    .other-month .day-number {
      color: #aaa;
    }
    .present {
      background-color: #c8e6c9; /* Light green */
    }
    .absent {
      background-color: #ffcdd2; /* Light red */
    }
    .today {
      font-weight: bold;
      border: 2px solid #007bff;
    }
    .motif-tooltip {
      font-size: 0.7em;
      color: #757575;
      margin-top: 2px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `]
})
export class PresencesComponent implements OnInit {
  currentMonth: Date = new Date();
  calendarWeeks: Week[] = [];
  employes: Employe[] = [];
  selectedEmploye: Employe | null = null;
  presences: Presence[] = [];

  constructor(
    private presenceService: PresenceService,
    private employeService: EmployeService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadEmployes();
    this.generateCalendar();
  }

  loadEmployes(): void {
    this.employeService.getAllEmployes().subscribe({
      next: (data) => {
        this.employes = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des employés:', error);
      }
    });
  }

  onEmployeSelected(): void {
    if (this.selectedEmploye) {
      // Load presences for the selected employee
      this.loadPresencesForEmploye();
    }
  }

  loadPresencesForEmploye(): void {
    if (this.selectedEmploye?.id) {
      this.presenceService.getPresencesByEmploye(this.selectedEmploye.id).subscribe({
        next: (presences) => {
          this.updateCalendarWithPresences(presences);
        },
        error: (error) => {
          console.error('Erreur lors du chargement des présences:', error);
        }
      });
    }
  }

  updateCalendarWithPresences(presences: Presence[]): void {
    this.presences = presences;
    this.generateCalendar();
  }

  generateCalendar(): void {
    this.calendarWeeks = [];
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();

    const firstDayOfMonth = new Date(Date.UTC(year, month, 1));
    const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0));

    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday of the first week

    const endDate = new Date(lastDayOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // End on Saturday of the last week

    let currentDateIterator = new Date(startDate);
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Normalize today's date to UTC midnight

    while (currentDateIterator <= endDate) {
      const week: Week = { days: [] };
      for (let i = 0; i < 7; i++) {
        const dayDate = new Date(currentDateIterator);
        dayDate.setUTCHours(0, 0, 0, 0); // Normalize for comparison

        const isCurrent = dayDate.getUTCMonth() === month;
        const formattedDayDate = `${dayDate.getUTCFullYear()}-${String(dayDate.getUTCMonth() + 1).padStart(2, '0')}-${String(dayDate.getUTCDate()).padStart(2, '0')}`;
        
        const presence = this.presences?.find(p => {
          const presenceDate = new Date(p.date + 'T00:00:00Z');
          return presenceDate.getTime() === dayDate.getTime();
        });
        
        week.days.push({
          date: dayDate,
          dayOfMonth: dayDate.getUTCDate(),
          isCurrentMonth: isCurrent,
          isToday: dayDate.getTime() === today.getTime(),
          isPresent: presence?.present,
          motifAbsence: !presence?.present ? presence?.motifAbsence : null
        });

        currentDateIterator.setDate(currentDateIterator.getDate() + 1);
      }
      this.calendarWeeks.push(week);
    }
  }

  previousMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.generateCalendar();
  }

  onDateSelected(date: Date): void {
    if (!this.selectedEmploye) {
      return;
    }

    // Créer une nouvelle date en UTC pour éviter les problèmes de fuseau horaire
    const selectedDayDate = new Date(Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ));

    // Trouver la présence existante pour cette date
    const formattedDate = selectedDayDate.toISOString().split('T')[0];
    const existingPresence = this.presences.find(p => p.date === formattedDate);

    const dialogRef = this.dialog.open(PresenceDialogComponent, {
      width: '800px',
      data: { 
        date: selectedDayDate,
        employe: this.selectedEmploye,
        presence: existingPresence // Pass the existing presence if any
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPresencesForEmploye();
      }
    });
  }
} 