import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
import { Employe } from '../../services/employe.service';
import { PresenceService } from '../../services/presence.service';

@Component({
  selector: 'app-presence-dialog',
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
    MatCalendar
  ],
  template: `
    <h2 mat-dialog-title>Marquer la présence</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="employe-info">
          <p><strong>Employé:</strong> {{data.employe.nom}} {{data.employe.prenom}}</p>
        </div>

        <mat-calendar
          [selected]="selectedDate"
          (selectedChange)="onDateSelected($event)"
          [minDate]="minDate"
          [maxDate]="maxDate">
        </mat-calendar>

        <div class="presence-form" *ngIf="selectedDate">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Statut</mat-label>
            <mat-select formControlName="statut">
              <mat-option value="PRESENT">Présent</mat-option>
              <mat-option value="ABSENT">Absent</mat-option>
              <mat-option value="CONGE">Congé</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Heures travaillées</mat-label>
            <input matInput type="number" formControlName="heuresTravaillees" min="0" max="24">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Commentaire</mat-label>
            <textarea matInput formControlName="commentaire" rows="3"></textarea>
          </mat-form-field>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Annuler</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
          Enregistrer
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
    .employe-info {
      margin-bottom: 20px;
      padding: 10px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }
    .presence-form {
      margin-top: 20px;
    }
    mat-calendar {
      width: 100%;
    }
  `]
})
export class PresenceDialogComponent {
  form: FormGroup;
  selectedDate: Date | null = null;
  minDate = new Date(new Date().getFullYear() - 1, 0, 1);
  maxDate = new Date();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PresenceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employe: Employe },
    private presenceService: PresenceService
  ) {
    this.form = this.fb.group({
      statut: ['PRESENT', Validators.required],
      heuresTravaillees: [8, [Validators.required, Validators.min(0), Validators.max(24)]],
      commentaire: ['']
    });
  }

  onDateSelected(date: Date) {
    this.selectedDate = date;
    this.form.patchValue({
      date: date
    });
  }

  onSubmit(): void {
    if (this.form.valid && this.selectedDate) {
      const presence = {
        ...this.form.value,
        date: this.selectedDate,
        employe: { id: this.data.employe.id }
      };
      this.presenceService.createPresence(presence).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Erreur lors de l\'enregistrement de la présence:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 