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
      this.presenceService.getPresencesByEmploye(this.employeId).subscribe({
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

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday of the first week

    const endDate = new Date(lastDayOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // End on Saturday of the last week

    let currentDateIterator = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date

    console.log(`[generateCalendar] Mois de rendu (0-11): ${month}, Année: ${year}`); // Log pour le mois cible

    while (currentDateIterator <= endDate) {
      const week: Week = { days: [] };
      for (let i = 0; i < 7; i++) {
        const dayDate = new Date(currentDateIterator);
        dayDate.setHours(0,0,0,0); // Normalize for comparison

        const isCurrent = dayDate.getMonth() === month;
        console.log(`[generateCalendar] Jour: ${dayDate.toDateString()}, Mois du jour: ${dayDate.getMonth()}, Est mois courant ? ${isCurrent}`); // Log pour chaque jour

        const presenceOnDay = this.presences.find(p => {
          const presenceDate = new Date(p.date);
          presenceDate.setHours(0,0,0,0); // Normalize stored presence date
          return presenceDate.getTime() === dayDate.getTime();
        });

        week.days.push({
          date: dayDate,
          dayOfMonth: dayDate.getDate(),
          isCurrentMonth: isCurrent,
          isPresent: presenceOnDay?.present,
          motifAbsence: presenceOnDay?.motifAbsence,
          isToday: dayDate.getTime() === today.getTime()
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
    console.log('[onDateSelected] Fonction appelée. Date:', date); // Log 1

    if (!this.employeId) {
      console.error('[onDateSelected] ERREUR: employeId est null ou undefined. Dialogue non ouvert.');
      return;
    }
    console.log('[onDateSelected] employeId:', this.employeId); // Log 2

    if (!this.dialog) {
      console.error('[onDateSelected] ERREUR: this.dialog (MatDialog) est undefined. Dialogue non ouvert.');
      return;
    }
    console.log('[onDateSelected] this.dialog est défini:', this.dialog); // Log 3

    const selectedDayDate = new Date(date);
    selectedDayDate.setHours(0, 0, 0, 0); 

    const existingPresence = this.presences.find(p => {
      const presenceDate = new Date(p.date);
      presenceDate.setHours(0, 0, 0, 0); 
      return presenceDate.getTime() === selectedDayDate.getTime();
    });
    console.log('[onDateSelected] existingPresence trouvée:', existingPresence); // Log 4

    console.log('[onDateSelected] Tentative d\'ouverture du dialogue PresenceDialogComponent...'); // Log 5
    const dialogRef = this.dialog.open<PresenceDialogComponent, PresenceDialogData, Presence | undefined>(
      PresenceDialogComponent,
      {
        width: '450px',
        data: {
          employeId: this.employeId,
          date: selectedDayDate,
          presence: existingPresence 
        }
      }
    );
    console.log('[onDateSelected] dialog.open appelé. dialogRef:', dialogRef); // Log 6


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('[onDateSelected] Dialogue fermé AVEC résultat:', result);
        this.loadPresencesForEmploye(); 
      } else {
        console.log('[onDateSelected] Dialogue fermé SANS résultat (Annuler).');
      }
    });
  }
}
