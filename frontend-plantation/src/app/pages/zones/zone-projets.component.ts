import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { ProjetService } from '../../services/projet.service';
import { Projet } from '../../models/projet.model';
import { Zone } from '../../models/zone.model';

@Component({
  selector: 'app-zone-projets',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Projets de la zone {{data.zone.nom}}</mat-card-title>
        <button mat-raised-button color="primary" (click)="openProjetDialog()">
          <mat-icon>add</mat-icon>
          Nouveau projet
        </button>
      </mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="projets" class="mat-elevation-z2">
          <ng-container matColumnDef="nom">
            <th mat-header-cell *matHeaderCellDef>Nom</th>
            <td mat-cell *matCellDef="let projet" class="clickable" (click)="viewProjetDetails(projet)">{{projet.nom}}</td>
          </ng-container>

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td mat-cell *matCellDef="let projet">{{projet.description || 'Non spécifiée'}}</td>
          </ng-container>

          <ng-container matColumnDef="dateDebut">
            <th mat-header-cell *matHeaderCellDef>Date de début</th>
            <td mat-cell *matCellDef="let projet">{{projet.dateDebut | date}}</td>
          </ng-container>

          <ng-container matColumnDef="statut">
            <th mat-header-cell *matHeaderCellDef>Statut</th>
            <td mat-cell *matCellDef="let projet" [ngClass]="getStatutClass(projet.statut)">
              {{projet.statut || 'Non défini'}}
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let projet">
              <button mat-raised-button class="green-button" (click)="viewProjetDetails(projet)">Voir détails</button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    mat-card {
      margin: 20px;
    }
    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    table {
      width: 100%;
    }
    .clickable {
      cursor: pointer;
      color: #2196F3;
    }
    .clickable:hover {
      text-decoration: underline;
    }
    .statut-planifie { color: #2196F3; }
    .statut-en-cours { color: #4CAF50; }
    .statut-termine { color: #9C27B0; }
    .statut-suspendu { color: #F44336; }
    .green-button {
      background-color: #4CAF50;
      color: white;
    }
  `]
})
export class ZoneProjetsComponent {
  projets: Projet[] = [];
  displayedColumns: string[] = ['nom', 'description', 'dateDebut', 'statut', 'actions'];

  constructor(
    public dialogRef: MatDialogRef<ZoneProjetsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { zone: Zone },
    private projetService: ProjetService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.loadProjets();
  }

  getStatutClass(statut: string | undefined): string {
    if (!statut) return '';
    return 'statut-' + statut.toLowerCase().replace('_', '-');
  }

  loadProjets() {
    if (this.data.zone.id) {
      this.projetService.getProjetsByZone(this.data.zone.id).subscribe({
        next: (data: Projet[]) => {
          this.projets = data;
        },
        error: (error: any) => {
          console.error('Erreur lors du chargement des projets:', error);
        }
      });
    }
  }

  openProjetDialog() {
    this.dialogRef.close({ action: 'create', zone: this.data.zone });
  }

  viewProjetDetails(projet: Projet) {
    console.log('Tentative de navigation vers le projet:', projet.id);
    this.dialogRef.close({ action: 'details', projet: projet });
    this.router.navigate(['/projets', projet.id]).catch(error => {
      console.error('Erreur de navigation:', error);
    });
  }
}
