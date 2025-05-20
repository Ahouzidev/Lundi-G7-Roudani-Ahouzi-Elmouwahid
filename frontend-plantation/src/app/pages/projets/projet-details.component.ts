import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ProjetService } from '../../services/projet.service';
import { Projet } from '../../models/projet.model';
import { AjouterEmployeDialogComponent } from './ajouter-employe-dialog.component';

@Component({
  selector: 'app-projet-details',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatDialogModule
  ],
  template: `
    <div class="container">
      <button mat-button (click)="goBack()">
        <mat-icon>arrow_back</mat-icon>
        Retour
      </button>

      <div *ngIf="projet" class="projet-details">
        <mat-card>
          <mat-card-header>
            <mat-card-title>{{projet.nom}}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p><strong>Description:</strong> {{projet.description}}</p>
            <p><strong>Date de début:</strong> {{projet.dateDebut | date}}</p>
            <p><strong>Date de fin prévue:</strong> {{projet.dateFin | date}}</p>
            <p><strong>Budget:</strong> {{projet.budget | currency:'DH '}}</p>
            <p><strong>Statut:</strong> {{projet.statut}}</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="employes-card">
          <mat-card-header>
            <mat-card-title>Employés assignés</mat-card-title>
            <button mat-button color="primary" (click)="openAjouterEmployeDialog()">
              <mat-icon>add</mat-icon>
              Ajouter un employé
            </button>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="projet.employes || []" class="mat-elevation-z8">
              <ng-container matColumnDef="nom">
                <th mat-header-cell *matHeaderCellDef>Nom</th>
                <td mat-cell *matCellDef="let employe">{{employe.nom}}</td>
              </ng-container>

              <ng-container matColumnDef="prenom">
                <th mat-header-cell *matHeaderCellDef>Prénom</th>
                <td mat-cell *matCellDef="let employe">{{employe.prenom}}</td>
              </ng-container>

              <ng-container matColumnDef="fonction">
                <th mat-header-cell *matHeaderCellDef>Fonction</th>
                <td mat-cell *matCellDef="let employe">{{employe.fonction}}</td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let employe">
                  <button mat-icon-button color="warn" (click)="removeEmploye(employe)">
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
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    .projet-details {
      margin-top: 20px;
    }
    .employes-card {
      margin-top: 20px;
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
  `]
})
export class ProjetDetailsComponent implements OnInit {
  projet: Projet | null = null;
  displayedColumns = ['nom', 'prenom', 'fonction', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projetService: ProjetService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    console.log('ProjetDetailsComponent initialisé');
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID du projet:', id);
    if (id) {
      this.loadProjet(Number(id));
    }
  }

  loadProjet(id: number) {
    console.log('Chargement du projet avec ID:', id);
    this.projetService.getProjet(id).subscribe({
      next: (data) => {
        console.log('Projet chargé:', data);
        this.projet = data;
      },
      error: (error: Error) => {
        console.error('Erreur lors du chargement du projet:', error);
      }
    });
  }

  goBack() {
    this.router.navigate(['/projets']);
  }

  openAjouterEmployeDialog() {
    const dialogRef = this.dialog.open(AjouterEmployeDialogComponent, {
      width: '600px',
      data: { projetId: this.projet?.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProjet(this.projet!.id);
      }
    });
  }

  removeEmploye(employe: any) {
    if (this.projet && confirm('Êtes-vous sûr de vouloir retirer cet employé du projet ?')) {
      this.projetService.removeEmployeFromProjet(this.projet.id, employe.id).subscribe({
        next: () => {
          this.loadProjet(this.projet!.id);
        },
        error: (error: Error) => {
          console.error('Erreur lors du retrait de l\'employé:', error);
        }
      });
    }
  }
} 