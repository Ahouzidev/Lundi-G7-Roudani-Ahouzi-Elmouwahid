import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PresenceDialogComponent } from './presence-dialog/presence-dialog.component';

@Component({
  selector: 'app-presence-calendar',
  templateUrl: './presence-calendar.component.html',
  styleUrls: ['./presence-calendar.component.css']
})
export class PresenceCalendarComponent implements OnInit {

  employeId: string;
  employe: any;
  presences: any[] = [];

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.employeId = '1'; // Replace with actual employee ID
    this.employe = { id: '1', name: 'John Doe' }; // Replace with actual employee data
    this.loadPresencesForEmploye();
  }

  loadPresencesForEmploye(): void {
    // Implement the logic to load presences for the employee
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
      width: '400px',
      data: { 
        date: selectedDayDate,
        employe: this.employe,
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