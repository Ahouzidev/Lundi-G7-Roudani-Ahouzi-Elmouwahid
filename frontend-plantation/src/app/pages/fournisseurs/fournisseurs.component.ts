import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
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
    MatDialogModule,
    MatPaginatorModule,
    MatSnackBarModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
      </mat-card-header>
      <mat-card-content>
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon>
          Ajouter un fournisseur
        </button>

        <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
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
              <div class="action-buttons">
                <button mat-icon-button color="primary" (click)="editFournisseur(fournisseur)" matTooltip="Modifier">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteFournisseur(fournisseur)" matTooltip="Supprimer">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        <mat-paginator [pageSize]="5" [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Select page of fournisseurs"></mat-paginator>
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
      padding: 0;
    }
    .action-buttons {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      padding: 8px 0;
    }
    .action-buttons button {
      width: 36px;
      height: 36px;
      line-height: 36px;
      padding: 0;
    }
    .action-buttons mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      line-height: 20px;
    }
    td.mat-cell {
      text-align: center;
      padding: 0 8px;
    }
    th.mat-header-cell {
      text-align: center;
      padding: 0 8px;
    }
    .mat-column-actions .mat-cell {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
  `]
})
export class FournisseursComponent implements OnInit {
  dataSource = new MatTableDataSource<Fournisseur>([]);
  displayedColumns: string[] = ['nom', 'typeProduit', 'adresse', 'telephone', 'email', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fournisseurService: FournisseurService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadFournisseurs();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadFournisseurs(): void {
    this.fournisseurService.getAllFournisseurs().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des fournisseurs:', error);
      }
    });
  }

  openDialog(fournisseur?: Fournisseur): void {
    const dialogRef = this.dialog.open(FournisseurDialogComponent, {
      width: '500px',
      data: fournisseur
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          // Update existing supplier
          this.fournisseurService.updateFournisseur(result.id, result).subscribe({
            next: () => {
              this.loadFournisseurs();
              this.snackBar.open('Fournisseur modifié avec succès', 'Fermer', {
                duration: 3000
              });
            },
            error: (error) => {
              console.error('Erreur lors de la modification du fournisseur:', error);
              this.snackBar.open('Erreur lors de la modification du fournisseur', 'Fermer', {
                duration: 3000
              });
            }
          });
        } else {
          // Create new supplier
          this.fournisseurService.createFournisseur(result).subscribe({
            next: () => {
              this.loadFournisseurs();
              this.snackBar.open('Fournisseur créé avec succès', 'Fermer', {
                duration: 3000
              });
            },
            error: (error) => {
              console.error('Erreur lors de la création du fournisseur:', error);
              this.snackBar.open('Erreur lors de la création du fournisseur', 'Fermer', {
                duration: 3000
              });
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