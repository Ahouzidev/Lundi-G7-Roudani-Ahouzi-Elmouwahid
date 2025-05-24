import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PresenceService, Presence } from '../../services/presence.service';
import { EmployeService, Employe } from '../../services/employe.service';
import { PresenceDialogComponent, PresenceDialogData } from './presence-dialog/presence-dialog.component';

interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isPresent?: boolean;
  motifAbsence?: string | null;
  isToday: boolean;
}

interface Week {
  days: CalendarDay[];
}

@Component({
  selector: 'app-presence-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  template: `
    <div class="container">
      <mat-card *ngIf="employe">
        <mat-card-header>
          <mat-card-title>
            Calendrier des Présences pour {{ employe.nom }} {{ employe.prenom }}
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
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
      <mat-card *ngIf="!employe && !loadingError">
        <mat-card-content>
          <p>Chargement des informations de l'employé...</p>
        </mat-card-content>
      </mat-card>
       <mat-card *ngIf="loadingError">
        <mat-card-content>
          <p>{{ loadingError }}</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 100%;
      box-sizing: border-box;
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
      table-layout: fixed;
    }
    .calendar-table th, .calendar-table td {
      border: 1px solid #e0e0e0;
      padding: 8px;
      text-align: center;
      height: 70px; /* Adjust height as needed */
      vertical-align: top;
      word-wrap: break-word;
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
      border: 2px solid #007bff; /* Blue border for today */
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
export class PresenceCalendarComponent implements OnInit {
  employeId: number | null = null;
  employe: Employe | null = null;
  presences: Presence[] = [];
  loadingError: string | null = null;

  currentMonth: Date = new Date();
  calendarWeeks: Week[] = [];

  constructor(
    private route: ActivatedRoute,
    private presenceService: PresenceService,
    private employeService: EmployeService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.employeId = +idParam;
      this.loadEmployeDetails();
    } else {
      this.loadingError = "ID de l'employé non fourni dans l'URL.";
      console.error(this.loadingError);
    }
  }

  loadEmployeDetails(): void {
    if (this.employeId) {
      this.employeService.getEmployeById(this.employeId).subscribe({
        next: (data: Employe) => {
          this.employe = data;
          this.loadPresencesForEmploye();
        },
        error: (err: any) => {
          this.loadingError = `Erreur lors du chargement des détails de l\'employé: ${err.message}`;
          console.error(this.loadingError, err);
        }
      });
    }
  }

  loadPresencesForEmploye(): void {
    if (this.employeId) {
      // Get the first and last day of the current month
      const year = this.currentMonth.getFullYear();
      const month = this.currentMonth.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      // Format dates as YYYY-MM-DD
      const dateDebut = firstDay.toISOString().split('T')[0];
      const dateFin = lastDay.toISOString().split('T')[0];

      this.presenceService.getPresencesByEmployeAndDateRange(this.employeId, dateDebut, dateFin).subscribe({
        next: (data: Presence[]) => {
          this.presences = data;
          console.log(`Présences chargées pour l'employé ${this.employeId}:`, this.presences);
          this.generateCalendar();
        },
        error: (err: any) => {
          this.loadingError = `Erreur lors du chargement des présences: ${err.message}`;
          console.error(this.loadingError, err);
          this.generateCalendar(); // Still generate calendar, it will be empty
        }
      });
    }
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
        
        const presence = this.presences.find(p => {
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
    // No need to call loadPresencesForEmploye here if all presences are loaded once initially
    // and the calendar is just re-rendered. If presences are loaded per month, then call it.
    this.generateCalendar(); 
  }

  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.generateCalendar();
  }

  onDateSelected(date: Date): void {
    if (!this.employeId) return;

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
        employe: this.employe,
        presence: existingPresence // Pass the existing presence if any
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Reload the presences for the current month
        this.loadPresencesForEmploye();
      }
    });
  }
}
