import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { PresenceService, Presence } from '../../../services/presence.service';
import { EmployeService, Employe } from '../../../services/employe.service';

export interface PresenceDialogData {
  date: Date;
}

interface EmployeePresence {
  employe: Employe;
  present: boolean;
  motifAbsence?: string;
}

@Component({
  selector: 'app-presence-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatTableModule,
    MatCheckboxModule
  ],
  template: `
    <h2 mat-dialog-title>Gestion des Présences - {{ data.date | date:'dd/MM/yyyy' }}</h2>
    <mat-dialog-content>
      <div class="actions-bar">
        <button mat-raised-button color="primary" (click)="markAllPresent()">
          Marquer tous présents
        </button>
        <button mat-raised-button color="warn" (click)="markAllAbsent()">
          Marquer tous absents
        </button>
      </div>

      <table mat-table [dataSource]="employeePresences" class="mat-elevation-z8">
        <!-- Nom Column -->
        <ng-container matColumnDef="nom">
          <th mat-header-cell *matHeaderCellDef>Nom</th>
          <td mat-cell *matCellDef="let element">{{element.employe.nom}}</td>
        </ng-container>

        <!-- Prénom Column -->
        <ng-container matColumnDef="prenom">
          <th mat-header-cell *matHeaderCellDef>Prénom</th>
          <td mat-cell *matCellDef="let element">{{element.employe.prenom}}</td>
        </ng-container>

        <!-- Présent Column -->
        <ng-container matColumnDef="present">
          <th mat-header-cell *matHeaderCellDef>Présent</th>
          <td mat-cell *matCellDef="let element">
            <mat-radio-group [ngModel]="element.present" (ngModelChange)="onPresenceChange($event, element)">
              <mat-radio-button [value]="true">Oui</mat-radio-button>
              <mat-radio-button [value]="false">Non</mat-radio-button>
            </mat-radio-group>
          </td>
        </ng-container>

        <!-- Motif Absence Column -->
        <ng-container matColumnDef="motifAbsence">
          <th mat-header-cell *matHeaderCellDef>Motif d'absence</th>
          <td mat-cell *matCellDef="let element">
            <mat-form-field *ngIf="!element.present" appearance="fill">
              <input matInput [ngModel]="element.motifAbsence" (ngModelChange)="element.motifAbsence = $event" placeholder="Motif d'absence">
            </mat-form-field>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" (click)="onSave()">
        Enregistrer
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .actions-bar {
      margin-bottom: 20px;
      display: flex;
      gap: 10px;
    }
    table {
      width: 100%;
    }
    .mat-column-present {
      width: 150px;
    }
    .mat-column-motifAbsence {
      width: 250px;
    }
    mat-form-field {
      width: 100%;
    }
  `]
})
export class PresenceDialogComponent implements OnInit {
  employeePresences: EmployeePresence[] = [];
  displayedColumns: string[] = ['nom', 'prenom', 'present', 'motifAbsence'];

  constructor(
    public dialogRef: MatDialogRef<PresenceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PresenceDialogData,
    private presenceService: PresenceService,
    private employeService: EmployeService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeService.getAllEmployes().subscribe({
      next: (employes) => {
        this.employeePresences = employes.map(employe => ({
          employe,
          present: true,
          motifAbsence: ''
        }));
        this.loadExistingPresences();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des employés:', err);
      }
    });
  }

  loadExistingPresences(): void {
    const dateStr = this.formatDate(this.data.date);
    this.presenceService.getAllPresences().subscribe({
      next: (presences) => {
        const presencesForDate = presences.filter(p => p.date === dateStr);
        this.employeePresences.forEach(ep => {
          const existingPresence = presencesForDate.find(p => p.employe.id === ep.employe.id);
          if (existingPresence) {
            ep.present = existingPresence.present;
            ep.motifAbsence = existingPresence.motifAbsence;
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement des présences:', err);
      }
    });
  }

  onPresenceChange(present: boolean, element: EmployeePresence): void {
    element.present = present;
    if (present) {
      element.motifAbsence = '';
    }
  }

  markAllPresent(): void {
    this.employeePresences.forEach(ep => {
      ep.present = true;
      ep.motifAbsence = '';
    });
  }

  markAllAbsent(): void {
    this.employeePresences.forEach(ep => {
      ep.present = false;
      ep.motifAbsence = '';
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const dateStr = this.formatDate(this.data.date);
    const presences: Presence[] = this.employeePresences.map(ep => ({
      date: dateStr,
      present: ep.present,
      motifAbsence: ep.present ? undefined : ep.motifAbsence,
      employe: { id: ep.employe.id! }
    }));

    // Sauvegarder toutes les présences
    const savePromises = presences.map(presence => {
      return this.presenceService.createPresence(presence).toPromise();
    });

    Promise.all(savePromises)
      .then(() => {
        this.dialogRef.close(true);
      })
      .catch(err => {
        console.error('Erreur lors de la sauvegarde des présences:', err);
      });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
} 