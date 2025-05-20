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
import { ProjetService } from '../../services/projet.service';
import { ZoneService } from '../../services/zone.service';
import { Zone } from '../../models/zone.model';
import { Projet } from '../../models/projet.model';

@Component({
  selector: 'app-projet-dialog',
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
    <h2 mat-dialog-title>{{data.projet ? 'Modifier le Projet' : (data.zone ? 'Nouveau Projet dans ' + data.zone.nom : 'Nouveau Projet')}}</h2>
    <form [formGroup]="projetForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="fill" class="full-width" *ngIf="!data.zone">
          <mat-label>Zone</mat-label>
          <mat-select formControlName="zone" required>
            <mat-option *ngFor="let zone of zones" [value]="zone">
              {{zone.nom}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Nom du projet</mat-label>
          <input matInput formControlName="nom" required>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Date de début</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="dateDebut" required>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Date de fin</mat-label>
          <input matInput [matDatepicker]="pickerFin" formControlName="dateFin">
          <mat-datepicker-toggle matSuffix [for]="pickerFin"></mat-datepicker-toggle>
          <mat-datepicker #pickerFin></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Budget</mat-label>
          <input matInput type="number" formControlName="budget">
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Statut</mat-label>
          <mat-select formControlName="statut" required>
            <mat-option value="PLANIFIE">Planifié</mat-option>
            <mat-option value="EN_COURS">En cours</mat-option>
            <mat-option value="TERMINE">Terminé</mat-option>
            <mat-option value="SUSPENDU">Suspendu</mat-option>
          </mat-select>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Annuler</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="projetForm.invalid">
          {{data.projet ? 'Modifier' : 'Créer'}}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    mat-dialog-content {
      min-width: 400px;
    }
  `]
})
export class ProjetDialogComponent implements OnInit {
  projetForm: FormGroup;
  zones: Zone[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProjetDialogComponent>,
    private projetService: ProjetService,
    private zoneService: ZoneService,
    @Inject(MAT_DIALOG_DATA) public data: { zone?: Zone; projet?: Projet }
  ) {
    this.projetForm = this.fb.group({
      nom: [data.projet?.nom || '', Validators.required],
      description: [data.projet?.description || ''],
      dateDebut: [data.projet?.dateDebut || new Date(), Validators.required],
      dateFin: [data.projet?.dateFin || null],
      budget: [data.projet?.budget || 0],
      statut: [data.projet?.statut || 'PLANIFIE', Validators.required],
      zone: [data.projet?.zone || data.zone]
    });
  }

  ngOnInit() {
    if (!this.data.zone) {
      this.loadZones();
    }
  }

  loadZones() {
    this.zoneService.getAllZones().subscribe({
      next: (zones) => {
        this.zones = zones;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des zones:', error);
      }
    });
  }

  onSubmit() {
    if (this.projetForm.valid) {
      const projet = this.projetForm.value;
      
      if (this.data.projet) {
        // Update existing project
        this.projetService.updateProjet(this.data.projet.id, projet).subscribe({
          next: (result) => {
            this.dialogRef.close(result);
          },
          error: (error) => {
            console.error('Erreur lors de la modification du projet:', error);
          }
        });
      } else {
        // Create new project
        this.projetService.createProjet(projet).subscribe({
          next: (result) => {
            this.dialogRef.close(result);
          },
          error: (error) => {
            console.error('Erreur lors de la création du projet:', error);
          }
        });
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
} 