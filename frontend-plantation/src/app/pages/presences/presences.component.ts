import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PresenceService, Presence } from '../../services/presence.service';
import { EmployeService, Employe } from '../../services/employe.service';
import { PresenceDialogComponent } from './presence-dialog/presence-dialog.component';

interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
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
    MatDialogModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Calendrier des Présences</mat-card-title>
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
                      'today': day.isToday
                    }"
                    (click)="day.isCurrentMonth && onDateSelected(day.date)">
                  <span class="day-number">{{ day.dayOfMonth }}</span>
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
    .today {
      font-weight: bold;
      border: 2px solid #007bff;
    }
  `]
})
export class PresencesComponent implements OnInit {
  currentMonth: Date = new Date();
  calendarWeeks: Week[] = [];

  constructor(
    private presenceService: PresenceService,
    private employeService: EmployeService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.generateCalendar();
  }

  generateCalendar(): void {
    this.calendarWeeks = [];
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const endDate = new Date(lastDayOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    let currentDateIterator = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    while (currentDateIterator <= endDate) {
      const week: Week = { days: [] };
      for (let i = 0; i < 7; i++) {
        const dayDate = new Date(currentDateIterator);
        dayDate.setHours(0,0,0,0);

        week.days.push({
          date: dayDate,
          dayOfMonth: dayDate.getDate(),
          isCurrentMonth: dayDate.getMonth() === month,
          isToday: dayDate.getTime() === today.getTime()
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
    const dialogRef = this.dialog.open(PresenceDialogComponent, {
      width: '800px',
      data: { date }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Rafraîchir le calendrier si nécessaire
        this.generateCalendar();
      }
    });
  }
} 