import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PresenceDialogComponent } from '../presences/presence-dialog/presence-dialog.component';
import { EmployeService, Employe } from '../../services/employe.service';

@Component({
  selector: 'app-salaires',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  template: `
    <div class="container">
      <h1>Gestion des Salaires</h1>
      <mat-card>
        <mat-card-content>
          <p>Liste des salaires à venir...</p>
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
  `]
})
export class SalairesComponent {
  employeId: number | null = null;

  constructor(
    private dialog: MatDialog,
    private employeService: EmployeService
  ) {}

  onDateSelected(date: Date): void {
    if (!this.employeId) return;

    const dialogRef = this.dialog.open(PresenceDialogComponent, {
      width: '400px',
      data: {
        employeId: this.employeId,
        date: date
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Rafraîchir les données si nécessaire
      }
    });
  }
} 