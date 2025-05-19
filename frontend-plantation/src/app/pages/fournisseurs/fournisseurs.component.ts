import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FournisseurService, Fournisseur } from '../../services/fournisseur.service';
import { FournisseurDialogComponent } from './fournisseur-dialog.component';

@Component({
  selector: 'app-fournisseurs',
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
    <mat-card>
      <mat-card-header>
        <mat-card-title>Gestion des Fournisseurs</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon>
          Ajouter un fournisseur
        </button>

        <table mat-table [dataSource]="fournisseurs" class="mat-elevation-z8">
          <ng-container matColumnDef="nom">
            <th mat-header-cell *matHeaderCellDef>Nom</th>
            <td mat-cell *matCellDef="let fournisseur">{{fournisseur.nom}}</td>
          </ng-container>

          <ng-container matColumnDef="typeProduit">
            <th mat-header-cell *matHeaderCellDef>Type de produit</th>
            <td mat-cell *matCellDef="let fournisseur">{{fournisseur.typeProduit}}</td>
          </ng-container>

          <ng-container matColumnDef="adresse">
            <th mat-header-cell *matHeaderCellDef>Adresse</th>
            <td mat-cell *matCellDef="let fournisseur">{{fournisseur.adresse}}</td>
          </ng-container>

          <ng-container matColumnDef="telephone">
            <th mat-header-cell *matHeaderCellDef>Téléphone</th>
            <td mat-cell *matCellDef="let fournisseur">{{fournisseur.telephone}}</td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let fournisseur">{{fournisseur.email}}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let fournisseur">
              <button mat-icon-button color="primary" (click)="editFournisseur(fournisseur)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteFournisseur(fournisseur)">
                <mat-icon>delete</mat-icon>
              </button>
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
    table {
      width: 100%;
      margin-top: 20px;
    }
    .mat-column-actions {
      width: 120px;
      text-align: center;
    }
  `]
})
export class FournisseursComponent implements OnInit {
  fournisseurs: Fournisseur[] = [];
  displayedColumns: string[] = ['nom', 'typeProduit', 'adresse', 'telephone', 'email', 'actions'];

  constructor(
    private fournisseurService: FournisseurService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadFournisseurs();
  }

  loadFournisseurs(): void {
    this.fournisseurService.getAllFournisseurs().subscribe({
      next: (data) => {
        this.fournisseurs = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des fournisseurs:', error);
      }
    });
  }

  openDialog(fournisseur?: Fournisseur): void {
    const dialogRef = this.dialog.open(FournisseurDialogComponent, {
      data: fournisseur
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.fournisseurService.updateFournisseur(result.id, result).subscribe({
            next: () => {
              this.loadFournisseurs();
            },
            error: (error) => {
              console.error('Erreur lors de la mise à jour du fournisseur:', error);
            }
          });
        } else {
          this.fournisseurService.createFournisseur(result).subscribe({
            next: () => {
              this.loadFournisseurs();
            },
            error: (error) => {
              console.error('Erreur lors de la création du fournisseur:', error);
            }
          });
        }
      }
    });
  }

  editFournisseur(fournisseur: Fournisseur): void {
    this.openDialog(fournisseur);
  }

  deleteFournisseur(fournisseur: Fournisseur): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
      if (fournisseur.id) {
        this.fournisseurService.deleteFournisseur(fournisseur.id).subscribe({
          next: () => {
            this.loadFournisseurs();
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
          }
        });
      }
    }
  }
} 