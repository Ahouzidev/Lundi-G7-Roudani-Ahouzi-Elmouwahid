import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Employe } from '../../services/employe.service';
import { ProjetService } from '../../services/projet.service';
import { Projet } from '../../models/projet.model';

@Component({
  selector: 'app-employe-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.employe ? 'Modifier' : 'Nouvel' }} Employé</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Projet</mat-label>
          <mat-select formControlName="projet">
            <mat-option *ngFor="let projet of projets" [value]="projet">
              {{projet.nom}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nom</mat-label>
          <input matInput formControlName="nom" required>
          <mat-error *ngIf="form.get('nom')?.hasError('required')">Le nom est requis</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Prénom</mat-label>
          <input matInput formControlName="prenom" required>
          <mat-error *ngIf="form.get('prenom')?.hasError('required')">Le prénom est requis</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Fonction</mat-label>
          <input matInput formControlName="fonction" required>
          <mat-error *ngIf="form.get('fonction')?.hasError('required')">La fonction est requise</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Date d'embauche</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="dateEmbauche" required>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error *ngIf="form.get('dateEmbauche')?.hasError('required')">La date d'embauche est requise</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Numéro de téléphone</mat-label>
          <input matInput formControlName="numeroTelephone" required>
          <mat-error *ngIf="form.get('numeroTelephone')?.hasError('required')">Le numéro de téléphone est requis</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" required type="email">
          <mat-error *ngIf="form.get('email')?.hasError('required')">L'email est requis</mat-error>
          <mat-error *ngIf="form.get('email')?.hasError('email')">Format d'email invalide</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Taux journalier</mat-label>
          <input matInput formControlName="tauxJournalier" required type="number">
          <mat-error *ngIf="form.get('tauxJournalier')?.hasError('required')">Le taux journalier est requis</mat-error>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Annuler</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
          {{ data.employe ? 'Modifier' : 'Ajouter' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    mat-dialog-content {
      min-width: 400px;
    }
  `]
})
export class EmployeDialogComponent implements OnInit {
  form: FormGroup;
  projets: Projet[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmployeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employe?: Employe },
    private projetService: ProjetService
  ) {
    this.form = this.fb.group({
      nom: [data.employe?.nom || '', Validators.required],
      prenom: [data.employe?.prenom || '', Validators.required],
      fonction: [data.employe?.fonction || '', Validators.required],
      dateEmbauche: [data.employe?.dateEmbauche || new Date(), Validators.required],
      numeroTelephone: [data.employe?.numeroTelephone || '', Validators.required],
      email: [data.employe?.email || '', [Validators.required, Validators.email]],
      tauxJournalier: [data.employe?.tauxJournalier || 0, Validators.required],
      projet: [data.employe?.projet || null]
    });
  }

  ngOnInit() {
    this.projetService.getAllProjets().subscribe(projets => {
      this.projets = projets;
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const employeData = {
        ...this.form.value,
        id: this.data.employe?.id
      };
      this.dialogRef.close(employeData);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
} 