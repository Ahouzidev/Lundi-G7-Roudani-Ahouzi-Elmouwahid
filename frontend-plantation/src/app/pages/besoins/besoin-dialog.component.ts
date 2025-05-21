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
import { Besoin } from '../../services/besoin.service';
import { ProjetService } from '../../services/projet.service';
import { FournisseurService } from '../../services/fournisseur.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-besoin-dialog',
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
    <h2 mat-dialog-title>{{data.besoin ? 'Modifier le besoin' : 'Créer un nouveau besoin'}}</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Type</mat-label>
          <mat-select formControlName="type">
            <mat-option value="MATERIEL">Matériel</mat-option>
            <mat-option value="MAIN_DOEUVRE">Main d'œuvre</mat-option>
            <mat-option value="AUTRE">Autre</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Quantité</mat-label>
          <input matInput type="number" formControlName="quantite">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Unité</mat-label>
          <input matInput formControlName="unite">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Date de besoin</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="dateBesoin">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Priorité</mat-label>
          <mat-select formControlName="priorite">
            <mat-option value="HAUTE">Haute</mat-option>
            <mat-option value="MOYENNE">Moyenne</mat-option>
            <mat-option value="BASSE">Basse</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Statut</mat-label>
          <mat-select formControlName="statut">
            <mat-option value="EN_ATTENTE">En attente</mat-option>
            <mat-option value="EN_COURS">En cours</mat-option>
            <mat-option value="TERMINE">Terminé</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Projet</mat-label>
          <mat-select formControlName="projet">
            <mat-option [value]="null">Aucun projet</mat-option>
            <mat-option *ngFor="let projet of projets" [value]="projet">
              {{projet.nom}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Fournisseur</mat-label>
          <mat-select formControlName="fournisseur">
            <mat-option [value]="null">Aucun fournisseur</mat-option>
            <mat-option *ngFor="let fournisseur of fournisseurs" [value]="fournisseur">
              {{fournisseur.nom}}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Annuler</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
          {{data.besoin ? 'Modifier' : 'Créer'}}
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
export class BesoinDialogComponent implements OnInit {
  form: FormGroup;
  projets: any[] = [];
  fournisseurs: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BesoinDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { besoin?: Besoin },
    private projetService: ProjetService,
    private fournisseurService: FournisseurService
  ) {
    this.form = this.fb.group({
      projet: [data?.besoin?.projet || null, Validators.required],
      fournisseur: [data?.besoin?.fournisseur || null],
      type: [data?.besoin?.type || 'MATERIEL', Validators.required],
      description: [data?.besoin?.description || '', Validators.required],
      quantite: [data?.besoin?.quantite || 0, [Validators.required, Validators.min(0)]],
      unite: [data?.besoin?.unite || '', Validators.required],
      dateBesoin: [data?.besoin?.dateBesoin || '', Validators.required],
      priorite: [data?.besoin?.priorite || 'MOYENNE', Validators.required],
      statut: [data?.besoin?.statut || 'EN_ATTENTE', Validators.required]
    });
  }

  ngOnInit() {
    this.projetService.getAllProjets().subscribe({
      next: (projets) => {
        this.projets = projets;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des projets:', error);
      }
    });

    this.fournisseurService.getAllFournisseurs().subscribe({
      next: (fournisseurs) => {
        this.fournisseurs = fournisseurs;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des fournisseurs:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const besoin: Besoin = {
        id: this.data?.besoin?.id,
        type: formValue.type,
        description: formValue.description,
        quantite: formValue.quantite,
        unite: formValue.unite,
        dateBesoin: formValue.dateBesoin,
        priorite: formValue.priorite,
        statut: formValue.statut,
        projet: formValue.projet ? { id: formValue.projet.id } : null,
        fournisseur: formValue.fournisseur ? { id: formValue.fournisseur.id } : null,
        satisfait: false
      };
      this.dialogRef.close(besoin);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 