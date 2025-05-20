import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ProjetService } from '../../services/projet.service';
import { Projet } from '../../models/projet.model';
import { ProjetDialogComponent } from './projet-dialog.component';

@Component({
  selector: 'app-projets',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Gestion des Projets</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="actions">
            <button mat-raised-button color="primary" (click)="openDialog()">
              <mat-icon>add</mat-icon>
              Nouveau Projet
            </button>
          </div>
          
          <table mat-table [dataSource]="projets" class="mat-elevation-z8">
            <!-- Nom Column -->
            <ng-container matColumnDef="nom">
              <th mat-header-cell *matHeaderCellDef>Nom</th>
              <td mat-cell *matCellDef="let element">{{element.nom}}</td>
            </ng-container>

            <!-- Description Column -->
            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>Description</th>
              <td mat-cell *matCellDef="let element">{{element.description}}</td>
            </ng-container>

            <!-- Date Début Column -->
            <ng-container matColumnDef="dateDebut">
              <th mat-header-cell *matHeaderCellDef>Date de début</th>
              <td mat-cell *matCellDef="let element">{{element.dateDebut | date}}</td>
            </ng-container>

            <!-- Date Fin Column -->
            <ng-container matColumnDef="dateFin">
              <th mat-header-cell *matHeaderCellDef>Date de fin</th>
              <td mat-cell *matCellDef="let element">{{element.dateFin | date}}</td>
            </ng-container>

            <!-- Budget Column -->
            <ng-container matColumnDef="budget">
              <th mat-header-cell *matHeaderCellDef>Budget</th>
              <td mat-cell *matCellDef="let element">{{element.budget | currency:'DH '}}</td>
            </ng-container>

            <!-- Statut Column -->
            <ng-container matColumnDef="statut">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let element">{{element.statut}}</td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let element">
                <button mat-icon-button color="primary" (click)="editProjet(element)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteProjet(element.id)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    .actions {
      margin-bottom: 20px;
    }
    table {
      width: 100%;
    }
    .mat-column-actions {
      width: 120px;
      text-align: center;
    }
  `]
})
export class ProjetsComponent implements OnInit {
  projets: Projet[] = [];
  displayedColumns: string[] = ['nom', 'description', 'dateDebut', 'dateFin', 'budget', 'statut', 'actions'];

  constructor(
    private projetService: ProjetService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadProjets();
  }

  loadProjets(): void {
    this.projetService.getAllProjets().subscribe({
      next: (data) => {
        this.projets = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des projets:', error);
      }
    });
  }

  openDialog(projet?: Projet): void {
    const dialogRef = this.dialog.open(ProjetDialogComponent, {
      width: '500px',
      data: { projet: projet }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProjets();
      }
    });
  }

  editProjet(projet: Projet): void {
    this.openDialog(projet);
  }

  deleteProjet(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      this.projetService.deleteProjet(id).subscribe({
        next: () => {
          this.loadProjets();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }
} 