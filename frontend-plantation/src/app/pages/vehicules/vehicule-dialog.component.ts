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
import { Vehicule } from '../../services/vehicule.service';
import { ProjetService } from '../../services/projet.service';
import { Projet } from '../../models/projet.model';

@Component({
  selector: 'app-vehicule-dialog',
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
    <h2 mat-dialog-title>{{ data ? 'Modifier' : 'Ajouter' }} un véhicule</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Projet</mat-label>
          <mat-select formControlName="projet" required>
            <mat-option *ngFor="let projet of projets" [value]="projet">
              {{projet.nom}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Marque</mat-label>
          <input matInput formControlName="marque" required>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Modèle</mat-label>
          <input matInput formControlName="modele" required>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Immatriculation</mat-label>
          <input matInput formControlName="immatriculation" required>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Type</mat-label>
          <mat-select formControlName="type" required>
            <mat-option value="TRACTEUR">Tracteur</mat-option>
            <mat-option value="CAMION">Camion</mat-option>
            <mat-option value="ENGIN">Engin</mat-option>
            <mat-option value="AUTRE">Autre</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Date d'acquisition</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="dateAcquisition" required>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Kilométrage</mat-label>
          <input matInput type="number" formControlName="kilometrage" required>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Statut</mat-label>
          <mat-select formControlName="statut" required>
            <mat-option value="ACTIF">Actif</mat-option>
            <mat-option value="EN_REPARATION">En réparation</mat-option>
            <mat-option value="HORS_SERVICE">Hors service</mat-option>
          </mat-select>
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
export class VehiculeDialogComponent implements OnInit {
  form: FormGroup;
  projets: Projet[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<VehiculeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Vehicule,
    private projetService: ProjetService
  ) {
    this.form = this.fb.group({
      projet: [data?.projet || null, Validators.required],
      marque: [data?.marque || '', Validators.required],
      modele: [data?.modele || '', Validators.required],
      immatriculation: [data?.immatriculation || '', Validators.required],
      type: [data?.type || 'TRACTEUR', Validators.required],
      dateAcquisition: [data?.dateAcquisition || '', Validators.required],
      kilometrage: [data?.kilometrage || 0, [Validators.required, Validators.min(0)]],
      statut: [data?.statut || 'ACTIF', Validators.required]
    });
  }

  ngOnInit(): void {
    this.projetService.getAllProjets().subscribe({
      next: (projets) => {
        this.projets = projets;
        if (this.data && this.data.projet) {
          const projetPreselectionne = this.projets.find(p => p.id === this.data.projet.id);
          if (projetPreselectionne) {
            this.form.patchValue({ projet: projetPreselectionne });
          }
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des projets:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      let etatValue: string;
      let disponibleValue: boolean;

      switch (formValue.statut) {
        case 'ACTIF':
          etatValue = 'Actif';
          disponibleValue = true;
          break;
        case 'EN_REPARATION':
          etatValue = 'En réparation';
          disponibleValue = false;
          break;
        case 'HORS_SERVICE':
          etatValue = 'Hors service';
          disponibleValue = false;
          break;
        default:
          etatValue = 'Inconnu';
          disponibleValue = false;
      }

      const vehiculeDataToSend: Vehicule = {
        id: this.data?.id,
        marque: formValue.marque,
        modele: formValue.modele,
        immatriculation: formValue.immatriculation,
        type: formValue.type,
        dateAcquisition: formValue.dateAcquisition,
        kilometrage: formValue.kilometrage,
        statut: formValue.statut,
        projet: { id: formValue.projet.id },
        etat: etatValue,
        disponible: disponibleValue
      };
      
      this.dialogRef.close(vehiculeDataToSend);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 