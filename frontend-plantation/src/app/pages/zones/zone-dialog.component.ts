import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Zone } from '../../services/zone.service';

@Component({
  selector: 'app-zone-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Modifier' : 'Ajouter' }} une zone</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Nom</mat-label>
          <input matInput formControlName="nom" required>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Localisation</mat-label>
          <input matInput formControlName="localisation" required>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
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
export class ZoneDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ZoneDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Zone
  ) {
    this.form = this.fb.group({
      nom: [data?.nom || '', Validators.required],
      localisation: [data?.localisation || '', Validators.required],
      description: [data?.description || '']
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const zone: Zone = {
        ...this.form.value,
        id: this.data?.id
      };
      this.dialogRef.close(zone);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 