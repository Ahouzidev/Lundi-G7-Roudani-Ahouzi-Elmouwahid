import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { BesoinService, Besoin } from '../../services/besoin.service';
import { BesoinDialogComponent } from './besoin-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-besoins',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    MatPaginatorModule,
    MatTooltipModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-content>
          <div class="header">
            <div class="header-content">
              <div class="button-container">
                <button mat-raised-button color="primary" (click)="openBesoinDialog()" class="small-button">
                  <mat-icon>add</mat-icon>
                  Nouveau Besoin
                </button>
              </div>
            </div>
          </div>

          <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let besoin">{{besoin.type}}</td>
            </ng-container>

            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>Description</th>
              <td mat-cell *matCellDef="let besoin">{{besoin.description}}</td>
            </ng-container>

            <ng-container matColumnDef="quantite">
              <th mat-header-cell *matHeaderCellDef>Quantité</th>
              <td mat-cell *matCellDef="let besoin">{{besoin.quantite}}</td>
            </ng-container>

            <ng-container matColumnDef="dateBesoin">
              <th mat-header-cell *matHeaderCellDef>Date de besoin</th>
              <td mat-cell *matCellDef="let besoin">{{besoin.dateBesoin | date}}</td>
            </ng-container>

            <ng-container matColumnDef="statut">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let besoin">{{besoin.statut}}</td>
            </ng-container>

            <ng-container matColumnDef="projet">
              <th mat-header-cell *matHeaderCellDef>Projet</th>
              <td mat-cell *matCellDef="let besoin">{{besoin.projet?.nom || '-'}}</td>
            </ng-container>

            <ng-container matColumnDef="fournisseur">
              <th mat-header-cell *matHeaderCellDef>Fournisseur</th>
              <td mat-cell *matCellDef="let besoin">{{besoin.fournisseur?.nom || '-'}}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let besoin">
                <div class="action-buttons">
                  <button mat-icon-button color="primary" (click)="openBesoinDialog(besoin)" matTooltip="Modifier">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteBesoin(besoin)" matTooltip="Supprimer">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
          <mat-paginator [pageSize]="5" [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Select page of besoins"></mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    .header {
      margin-bottom: 20px;
    }
    .header-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .button-container {
      display: flex;
      justify-content: flex-start;
    }
    .header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.87);
    }
    .small-button {
      min-width: auto;
      padding: 0 16px;
      height: 36px;
      line-height: 36px;
    }
    table {
      width: 100%;
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
    mat-card {
      margin-bottom: 20px;
    }
    mat-card-content {
      padding: 20px;
    }
  `]
})
export class BesoinsComponent implements OnInit {
  dataSource = new MatTableDataSource<Besoin>([]);
  displayedColumns = ['type', 'description', 'quantite', 'dateBesoin', 'statut', 'projet', 'fournisseur', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private besoinService: BesoinService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadBesoins();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadBesoins() {
    this.besoinService.getAllBesoins().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des besoins:', error);
        this.snackBar.open('Erreur lors du chargement des besoins', 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  openBesoinDialog(besoin?: Besoin) {
    const dialogRef = this.dialog.open(BesoinDialogComponent, {
      width: '500px',
      data: { besoin }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          // Update existing besoin
          this.besoinService.updateBesoin(result.id, result).subscribe({
            next: () => {
              this.loadBesoins();
              this.snackBar.open('Besoin modifié avec succès', 'Fermer', {
                duration: 3000
              });
            },
            error: (error) => {
              console.error('Erreur lors de la modification du besoin:', error);
              this.snackBar.open('Erreur lors de la modification du besoin', 'Fermer', {
                duration: 3000
              });
            }
          });
        } else {
          // Create new besoin
          this.besoinService.createBesoin(result).subscribe({
            next: () => {
              this.loadBesoins();
              this.snackBar.open('Besoin créé avec succès', 'Fermer', {
                duration: 3000
              });
            },
            error: (error) => {
              console.error('Erreur lors de la création du besoin:', error);
              this.snackBar.open('Erreur lors de la création du besoin', 'Fermer', {
                duration: 3000
              });
            }
          });
        }
      }
    });
  }

  deleteBesoin(besoin: Besoin) {
    if (besoin.id && confirm('Êtes-vous sûr de vouloir supprimer ce besoin ?')) {
      this.besoinService.deleteBesoin(besoin.id).subscribe({
        next: () => {
          this.loadBesoins();
          this.snackBar.open('Besoin supprimé avec succès', 'Fermer', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du besoin:', error);
          this.snackBar.open('Erreur lors de la suppression du besoin', 'Fermer', {
            duration: 3000
          });
        }
      });
    }
  }
} 