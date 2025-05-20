import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { EmployeService, Employe } from '../../services/employe.service';
import { ProjetService } from '../../services/projet.service';

@Component({
  selector: 'app-ajouter-employe-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Ajouter un employé</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="employeForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Nom</mat-label>
              <input matInput formControlName="nom" required>
              <mat-error *ngIf="employeForm.get('nom')?.hasError('required')">Le nom est requis</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Prénom</mat-label>
              <input matInput formControlName="prenom" required>
              <mat-error *ngIf="employeForm.get('prenom')?.hasError('required')">Le prénom est requis</mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Fonction</mat-label>
              <input matInput formControlName="fonction" required>
              <mat-error *ngIf="employeForm.get('fonction')?.hasError('required')">La fonction est requise</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Date d'embauche</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="dateEmbauche" required>
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="employeForm.get('dateEmbauche')?.hasError('required')">La date d'embauche est requise</mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Numéro de téléphone</mat-label>
              <input matInput formControlName="numeroTelephone">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email">
              <mat-error *ngIf="employeForm.get('email')?.hasError('email')">Format d'email invalide</mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Taux journalier (DH)</mat-label>
              <input matInput formControlName="tauxJournalier" type="number">
            </mat-form-field>
          </div>
        </form>
      </mat-card-content>
      <mat-card-actions align="end">
        <button mat-button (click)="onCancel()">Annuler</button>
        <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!employeForm.valid">
          Ajouter
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    mat-card {
      margin: 20px;
      max-width: 800px;
    }
    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }
    mat-form-field {
      flex: 1;
    }
    mat-card-actions {
      padding: 16px;
    }
  `]
})
export class AjouterEmployeDialogComponent {
  employeForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AjouterEmployeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { projetId: number },
    private employeService: EmployeService,
    private projetService: ProjetService,
    private fb: FormBuilder
  ) {
    this.employeForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      fonction: ['', Validators.required],
      dateEmbauche: ['', Validators.required],
      numeroTelephone: [''],
      email: ['', Validators.email],
      tauxJournalier: [0]
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.employeForm.valid) {
      const employeData = {
        ...this.employeForm.value,
        dateEmbauche: this.employeForm.value.dateEmbauche.toISOString().split('T')[0],
        projet: { id: this.data.projetId }
      };

      this.employeService.createEmploye(employeData).subscribe({
        next: (employe) => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Erreur lors de la création de l\'employé:', error);
        }
      });
    }
  }
} 