import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Fournisseur } from '../../services/fournisseur.service';

@Component({
  selector: 'app-fournisseur-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Modifier' : 'Ajouter' }} un fournisseur</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Nom</mat-label>
          <input matInput formControlName="nom" required>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Type de produit</mat-label>
          <mat-select formControlName="typeProduit" required>
            <mat-option value="MATERIEL">Matériel</mat-option>
            <mat-option value="SERVICE">Service</mat-option>
            <mat-option value="AUTRE">Autre</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Adresse</mat-label>
          <textarea matInput formControlName="adresse" required rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Téléphone</mat-label>
          <input matInput formControlName="telephone" required>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" required type="email">
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Annuler</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
          {{ data ? 'Modifier' : 'Ajouter' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 400px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
  `]
})
export class FournisseurDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FournisseurDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Fournisseur
  ) {
    this.form = this.fb.group({
      nom: [data?.nom || '', Validators.required],
      typeProduit: [data?.typeProduit || 'MATERIEL', Validators.required],
      adresse: [data?.adresse || '', Validators.required],
      telephone: [data?.telephone || '', Validators.required],
      email: [data?.email || '', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const fournisseur: Fournisseur = {
        ...this.form.value,
        id: this.data?.id
      };
      this.dialogRef.close(fournisseur);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 