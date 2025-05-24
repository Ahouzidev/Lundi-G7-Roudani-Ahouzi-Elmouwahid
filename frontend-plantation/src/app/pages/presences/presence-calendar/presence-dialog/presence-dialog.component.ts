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
import { Employe } from '../../../../services/employe.service';
import { PresenceService, Presence } from '../../../../services/presence.service';

export interface PresenceDialogData {
  employeId?: number;
  employe?: Employe;
  date: Date;
  presence?: Presence;
}

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
    MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>Marquer la présence</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="employe-info">
          <p><strong>Employé:</strong> {{data.employe?.nom}} {{data.employe?.prenom}}</p>
        </div>

        <div class="date-display">
          <p><strong>Date:</strong> {{ form.get('date')?.value | date:'dd/MM/yyyy' }}</p>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Statut</mat-label>
          <mat-select formControlName="present">
            <mat-option [value]="true">Présent</mat-option>
            <mat-option [value]="false">Absent</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width" *ngIf="!form.get('present')?.value">
          <mat-label>Motif d'absence</mat-label>
          <textarea matInput formControlName="motifAbsence" rows="3"></textarea>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Annuler</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || isSubmitting">
          {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer' }}
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
    .employe-info, .date-display {
      margin-bottom: 20px;
      padding: 10px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }
    .employe-info p, .date-display p {
      margin: 0;
      font-size: 1.1em;
    }
  `]
})
export class PresenceDialogComponent {
  form: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PresenceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PresenceDialogData,
    private presenceService: PresenceService
  ) {
    // Créer une nouvelle date en UTC pour éviter les problèmes de fuseau horaire
    const utcDate = new Date(Date.UTC(
      data.date.getFullYear(),
      data.date.getMonth(),
      data.date.getDate()
    ));

    this.form = this.fb.group({
      date: [utcDate, Validators.required],
      present: [data.presence?.present ?? true, Validators.required],
      motifAbsence: [data.presence?.motifAbsence ?? '']
    });
  }

  onSubmit(): void {
    if (this.form.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      // Get the selected date and ensure it's in UTC
      const selectedDate = new Date(this.form.get('date')?.value);
      const utcYear = selectedDate.getUTCFullYear();
      const utcMonth = selectedDate.getUTCMonth();
      const utcDay = selectedDate.getUTCDate();
      
      // Create date string in YYYY-MM-DD format using UTC values
      const formattedDate = `${utcYear}-${String(utcMonth + 1).padStart(2, '0')}-${String(utcDay).padStart(2, '0')}`;

      const employeeId = this.data.employeId || this.data.employe?.id;
      if (!employeeId) {
        console.error('No employee ID provided');
        this.isSubmitting = false;
        return;
      }

      const presence: Presence = {
        id: this.data.presence?.id,
        date: formattedDate,
        present: this.form.get('present')?.value,
        motifAbsence: this.form.get('present')?.value ? null : this.form.get('motifAbsence')?.value,
        employe: { id: employeeId }
      };

      const request$ = this.data.presence?.id
        ? this.presenceService.updatePresence(this.data.presence.id, presence)
        : this.presenceService.createPresence(presence);

      request$.subscribe({
        next: (response: Presence) => {
          this.dialogRef.close(response);
        },
        error: (error: any) => {
          console.error('Erreur lors de l\'enregistrement de la présence:', error);
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 